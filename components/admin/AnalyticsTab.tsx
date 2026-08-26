'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, TrendingUp, Zap } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface DayCount {
  date: string;
  visites: number;
}

type Period = '7d' | '30d' | '12m';

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 derniers jours',
  '30d': '30 derniers jours',
  '12m': '12 derniers mois',
};

interface AnalyticsData {
  totalVisitsPeriod: number;
  totalVisitsToday: number;
  liveVisitorsLast5Min: number;
  totalCommandes: number;
  totalReservations: number;
  conversionRate: number;
  chartData: DayCount[];
}

function frDate(d: Date) {
  // Utilise la date calendaire locale (et non toISOString/UTC) pour que les
  // clés du graphique correspondent bien aux visites du jour en heure locale.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

export default function AnalyticsTab() {
  const [period, setPeriod] = useState<Period>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (currentPeriod: Period) => {
    try {
      const now = new Date();

      // Borne de début de la période, et granularité d'agrégation (jour ou mois)
      const rangeStart = new Date(now);
      if (currentPeriod === '7d') {
        rangeStart.setDate(now.getDate() - 6);
        rangeStart.setHours(0, 0, 0, 0);
      } else if (currentPeriod === '30d') {
        rangeStart.setDate(now.getDate() - 29);
        rangeStart.setHours(0, 0, 0, 0);
      } else {
        rangeStart.setMonth(now.getMonth() - 11);
        rangeStart.setDate(1);
        rangeStart.setHours(0, 0, 0, 0);
      }

      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const [viewsRes, commandesRes, reservationsRes] = await Promise.all([
        supabase.from('page_views').select('created_at').gte('created_at', rangeStart.toISOString()),
        supabase.from('commandes').select('id', { count: 'exact', head: true }),
        supabase.from('reservations').select('id', { count: 'exact', head: true }),
      ]);

      const views = viewsRes.data || [];

      // Regroupement par jour (7j/30j) ou par mois (12m)
      const bucket = new Map<string, number>();
      if (currentPeriod === '12m') {
        for (let i = 0; i < 12; i++) {
          const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1);
          bucket.set(monthKey(d), 0);
        }
      } else {
        const days = currentPeriod === '7d' ? 7 : 30;
        for (let i = 0; i < days; i++) {
          const d = new Date(rangeStart);
          d.setDate(rangeStart.getDate() + i);
          bucket.set(frDate(d), 0);
        }
      }

      let totalToday = 0;
      let liveCount = 0;
      for (const v of views) {
        const created = new Date(v.created_at);
        const key = currentPeriod === '12m' ? monthKey(created) : frDate(created);
        if (bucket.has(key)) bucket.set(key, (bucket.get(key) || 0) + 1);
        if (created >= todayStart) totalToday++;
        if (created >= fiveMinAgo) liveCount++;
      }

      const chartData: DayCount[] = Array.from(bucket.entries()).map(([key, visites]) => ({
        date: currentPeriod === '12m' ? monthLabel(key) : key.slice(5), // MM-DD ou "janv. 26"
        visites,
      }));

      const totalCommandes = commandesRes.count || 0;
      const totalReservations = reservationsRes.count || 0;
      const totalConversions = totalCommandes + totalReservations;
      const totalVisitsPeriod = views.length;

      setData({
        totalVisitsPeriod,
        totalVisitsToday: totalToday,
        liveVisitorsLast5Min: liveCount,
        totalCommandes,
        totalReservations,
        conversionRate: totalVisitsPeriod > 0
          ? (totalConversions / totalVisitsPeriod) * 100
          : 0,
        chartData,
      });
    } catch (err) {
      console.error('[AnalyticsTab] Erreur:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    async function init() {
      await fetchAnalytics(period);
    }
    init();

    const channel = supabase
      .channel('analytics-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, () => {
        if (!ignore) fetchAnalytics(period);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'commandes' }, () => {
        if (!ignore) fetchAnalytics(period);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, () => {
        if (!ignore) fetchAnalytics(period);
      })
      .subscribe();

    const interval = setInterval(() => {
      if (!ignore) fetchAnalytics(period);
    }, 30000);

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchAnalytics, period]);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-gray-500">Chargement des statistiques…</div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1 flex items-center gap-2">
            {data.liveVisitorsLast5Min}
            {data.liveVisitorsLast5Min > 0 && (
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            )}
          </p>
          <p className="text-sm font-semibold text-gray-400">En ligne (5 min)</p>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1">{data.totalVisitsToday}</p>
          <p className="text-sm font-semibold text-gray-400">Visites aujourd&apos;hui</p>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[#FF5A1F]" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1">{data.conversionRate.toFixed(1)}%</p>
          <p className="text-sm font-semibold text-gray-400">Taux de conversion</p>
          <p className="text-xs text-gray-600 mt-1">sur {PERIOD_LABELS[period]}</p>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1">{data.totalVisitsPeriod}</p>
          <p className="text-sm font-semibold text-gray-400">Visites ({PERIOD_LABELS[period]})</p>
        </div>
      </div>

      {/* Courbe */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-white font-bold">Visites — {PERIOD_LABELS[period]}</h3>
          <div className="inline-flex bg-[#0D0D0D] border border-white/8 rounded-xl p-1 self-start">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  period === p
                    ? 'bg-[#FF5A1F] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '12 mois'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1A1A1A', border: '1px solid #ffffff20', borderRadius: 12 }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="visites" stroke="#FF5A1F" strokeWidth={2.5} dot={{ fill: '#FF5A1F' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        Suivi maison basé sur les visites enregistrées côté site (hors pages admin). Google Analytics reste actif en parallèle pour des rapports plus détaillés.
      </p>
    </div>
  );
}
