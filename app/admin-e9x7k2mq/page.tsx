'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Lock, LogOut, Users, CalendarCheck, ShoppingBag, TrendingUp, RefreshCw, Eye, Clock, MapPin, Phone } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Reservation {
  date: string;
  heure: string;
  couverts: string;
  nom: string;
  telephone: string;
  demande: string;
  soumis_le: string;
}

interface Commande {
  numero: string;
  type: string;
  adresse: string;
  articles: string;
  total: string;
  soumis_le: string;
}

interface Stats {
  totalReservations: number;
  totalCommandes: number;
  derniereReservation: string;
  derniereCommande: string;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      onLogin();
    } else {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#FF5A1F] fill-[#FF5A1F]/20" />
            </div>
            <div className="text-left">
              <p className="text-white font-extrabold text-xl">Ember Sushi</p>
              <p className="text-gray-500 text-xs">Espace Administration</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-white/8 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#FF5A1F]" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Connexion Admin</h1>
              <p className="text-gray-500 text-xs">Accès réservé</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••••"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5A1F] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 bg-[#FF5A1F] hover:bg-[#E04A15] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300"
            >
              {loading ? 'Connexion...' : 'Accéder au tableau de bord'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [stats, setStats] = useState<Stats>({ totalReservations: 0, totalCommandes: 0, derniereReservation: '-', derniereCommande: '-' });
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'commandes'>('overview');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resRes, cmdRes] = await Promise.all([
        fetch('/api/admin-data?type=Reservations'),
        fetch('/api/admin-data?type=Commandes'),
      ]);

      if (resRes.ok) {
        const json = await resRes.json();
        const data = (json.data || []) as Reservation[];
        setReservations([...data].reverse());
        setStats(s => ({
          ...s,
          totalReservations: data.length,
          derniereReservation: data[data.length - 1]?.soumis_le || '-',
        }));
      }

      if (cmdRes.ok) {
        const json = await cmdRes.json();
        const data = (json.data || []) as Commande[];
        setCommandes([...data].reverse());
        setStats(s => ({
          ...s,
          totalCommandes: data.length,
          derniereCommande: data[data.length - 1]?.soumis_le || '-',
        }));
      }
    } catch {
      // Feuilles vides ou non encore créées
    }
    setLoading(false);
    setLastRefresh(new Date().toLocaleTimeString('fr-FR'));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* Header */}
      <header className="border-b border-white/8 bg-[#0D0D0D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#FF5A1F] fill-[#FF5A1F]/20" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">Ember Sushi</p>
              <p className="text-gray-600 text-xs">Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-gray-600 hidden sm:block">Mis à jour à {lastRefresh}</span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Tabs */}
        <div className="flex gap-2 bg-[#141414] border border-white/8 rounded-2xl p-1.5 w-fit">
          {([
            { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { key: 'reservations', label: 'Réservations', icon: CalendarCheck },
            { key: 'commandes', label: 'Commandes', icon: ShoppingBag },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === key
                  ? 'bg-[#FF5A1F] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={CalendarCheck}
                label="Réservations totales"
                value={stats.totalReservations}
                sub={`Dernière: ${stats.derniereReservation}`}
                color="bg-[#FF5A1F]/10 text-[#FF5A1F]"
              />
              <StatCard
                icon={ShoppingBag}
                label="Commandes totales"
                value={stats.totalCommandes}
                sub={`Dernière: ${stats.derniereCommande}`}
                color="bg-purple-500/10 text-purple-400"
              />
              <StatCard
                icon={Users}
                label="Total contacts"
                value={stats.totalReservations + stats.totalCommandes}
                color="bg-blue-500/10 text-blue-400"
              />
              <StatCard
                icon={Eye}
                label="Voir GA4"
                value="→ Analytics"
                sub="Clique pour ouvrir"
                color="bg-green-500/10 text-green-400"
              />
            </div>

            {/* Dernières réservations */}
            <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-[#FF5A1F]" />
                  Dernières réservations
                </h2>
                <button onClick={() => setActiveTab('reservations')} className="text-xs text-[#FF5A1F] hover:underline">
                  Voir tout
                </button>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-600">Chargement...</div>
              ) : reservations.length === 0 ? (
                <div className="p-8 text-center text-gray-600">Aucune réservation pour le moment</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {reservations.slice(0, 5).map((r, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#FF5A1F] font-bold text-sm">{r.couverts}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{r.nom}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {r.date} à {r.heure}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {r.telephone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dernières commandes */}
            <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  Dernières commandes
                </h2>
                <button onClick={() => setActiveTab('commandes')} className="text-xs text-[#FF5A1F] hover:underline">
                  Voir tout
                </button>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-600">Chargement...</div>
              ) : commandes.length === 0 ? (
                <div className="p-8 text-center text-gray-600">Aucune commande pour le moment</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {commandes.slice(0, 5).map((c, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{c.numero}</p>
                          <p className="text-gray-500 text-xs">{c.type} · {c.articles}</p>
                        </div>
                      </div>
                      <p className="text-[#FF5A1F] font-bold text-sm">{c.total}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lien GA4 */}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#141414] border border-white/8 hover:border-[#FF5A1F]/30 rounded-2xl p-6 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Google Analytics 4</p>
                    <p className="text-gray-500 text-sm">Visiteurs, sessions, pays, appareils</p>
                  </div>
                </div>
                <span className="text-[#FF5A1F] text-sm group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          </div>
        )}

        {/* Réservations complètes */}
        {activeTab === 'reservations' && (
          <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8">
              <h2 className="font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#FF5A1F]" />
                Toutes les réservations ({reservations.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-600">Chargement...</div>
            ) : reservations.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarCheck className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Aucune réservation pour le moment.</p>
                <p className="text-gray-600 text-sm mt-1">Les réservations apparaîtront ici dès que des clients rempliront le formulaire.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {reservations.map((r, i) => (
                  <div key={i} className="px-6 py-5 hover:bg-white/2 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold">{r.nom}</span>
                          <span className="text-xs bg-[#FF5A1F]/10 text-[#FF5A1F] px-2 py-0.5 rounded-full font-semibold">
                            {r.couverts} pers.
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.date} à {r.heure}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.telephone}</span>
                        </div>
                        {r.demande && (
                          <p className="text-xs text-gray-600 italic mt-1">&ldquo;{r.demande}&rdquo;</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">{r.soumis_le}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Commandes complètes */}
        {activeTab === 'commandes' && (
          <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/8">
              <h2 className="font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                Toutes les commandes ({commandes.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-600">Chargement...</div>
            ) : commandes.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Aucune commande pour le moment.</p>
                <p className="text-gray-600 text-sm mt-1">Les commandes apparaîtront ici dès que des clients passeront commande.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {commandes.map((c, i) => (
                  <div key={i} className="px-6 py-5 hover:bg-white/2 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold">{c.numero}</span>
                          <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-semibold">
                            {c.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{c.articles}</p>
                        {c.adresse && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{c.adresse}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[#FF5A1F] font-extrabold">{c.total}</p>
                        <p className="text-xs text-gray-600 mt-1">{c.soumis_le}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Vérifie si une session est déjà active
    fetch('/api/admin-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: '' }) })
      .then(() => {})
      .catch(() => {});
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <Flame className="w-8 h-8 text-[#FF5A1F] animate-pulse" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />;
}
