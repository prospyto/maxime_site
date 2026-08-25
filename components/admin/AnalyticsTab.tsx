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

interface AnalyticsData {
  totalVisitsAllTime: number;
  totalVisitsToday: number;
  liveVisitorsLast5Min: number;
  totalCommandes: number;
  totalReservations: number;
  conversionRate: number;
  last7Days: DayCount[];
}

function frDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const [viewsRes, commandesRes, reservationsRes] = await Promise.all([
        supabase.from('page_views').select('created_at').gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('commandes').select('id', { count: 'exact', head: true }),
        supabase.from('reservations').select('id', { count: 'exact', head: true }),
      ]);

      const views = viewsRes.data || [];

      // Regroupement par jour sur les 7 derniers jours
      const byDay = new Map<string, number>();
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        byDay.set(frDate(d), 0);
      }
      let totalToday = 0;
      let liveCount = 0;
      for (const v of views) {
        const created = new Date(v.created_at);
        const key = frDate(created);
        if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1);
        if (created >= todayStart) totalToday++;
        if (created >= fiveMinAgo) liveCount++;
      }

      const last7Days: DayCount[] = Array.from(byDay.entries()).map(([date, visites]) => ({
        date: date.slice(5), // MM-DD
        visites,
      }));

      const totalCommandes = commandesRes.count || 0;
      const totalReservations = reservationsRes.count || 0;
      const totalConversions = totalCommandes + totalReservations;
      const totalVisitsAllTimeApprox = views.length; // sur 7 jours, approximation légère

      setData({
        totalVisitsAllTime: totalVisitsAllTimeApprox,
        totalVisitsToday: totalToday,
        liveVisitorsLast5Min: liveCount,
        totalCommandes,
        totalReservations,
        conversionRate: totalVisitsAllTimeApprox > 0
          ? (totalConversions / totalVisitsAllTimeApprox) * 100
          : 0,
        last7Days,
      });
    } catch (err) {
      console.error('[AnalyticsTab] Erreur:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // Rafraîchit en direct dès qu'une nouvelle visite/commande/réservation arrive
  useEffect(() => {
    const channel = supabase
      .channel('analytics-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'page_views' }, () => fetchAnalytics())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'commandes' }, () => fetchAnalytics())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, () => fetchAnalytics())
      .subscribe();

    // Recalcule aussi le compteur "5 dernières minutes" régulièrement
    const interval = setInterval(fetchAnalytics, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchAnalytics]);

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
          <p className="text-sm font-semibold text-gray-400">Visites aujourd'hui</p>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[#FF5A1F]" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1">{data.conversionRate.toFixed(1)}%</p>
          <p className="text-sm font-semibold text-gray-400">Taux de conversion</p>
          <p className="text-xs text-gray-600 mt-1">sur les 7 derniers jours</p>
        </div>

        <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mb-1">{data.totalVisitsAllTime}</p>
          <p className="text-sm font-semibold text-gray-400">Visites (7 jours)</p>
        </div>
      </div>

      {/* Courbe */}
      <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Visites — 7 derniers jours</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.last7Days}>
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
