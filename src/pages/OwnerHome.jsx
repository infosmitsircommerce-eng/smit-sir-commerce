import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  CalendarClock,
  Loader2,
  Megaphone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function istDayRange() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const start = new Date(`${parts}T00:00:00+05:30`);
  const end = new Date(start.getTime() + 86400000);
  return [start.toISOString(), end.toISOString()];
}

function Metric({ value, label, note }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--border)' }}>
      <div className="text-3xl font-black" style={{ color: 'var(--ink)' }}>{value}</div>
      <div className="text-sm font-black mt-1">{label}</div>
      <div className="text-[11px] mt-1 leading-4" style={{ color: 'var(--muted)' }}>{note}</div>
    </div>
  );
}

export default function OwnerHome() {
  const { user, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({ students: 0, leads: 0, followups: 0, content: 0, demosToday: 0 });
  const [funnel, setFunnel] = useState({ home: 0, sample: 0, premium: 0, checkout: 0, paid: 0 });
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const now = new Date().toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
    const [dayStart, dayEnd] = istDayRange();

    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }).lte('next_follow_up', now).not('status', 'in', '(Joined,Lost)'),
      supabase.from('content_items').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('demo_slots').select('id').gte('starts_at', dayStart).lt('starts_at', dayEnd),
      supabase.from('learning_events').select('id', { count: 'exact', head: true }).eq('event_name', 'funnel_home_view').gte('created_at', thirtyDaysAgo),
      supabase.from('learning_events').select('id', { count: 'exact', head: true }).in('event_name', ['premium_accountancy_sample_open', 'financial_ratios_pdf_open']).gte('created_at', thirtyDaysAgo),
      supabase.from('learning_events').select('id', { count: 'exact', head: true }).in('event_name', ['premium_page_view', 'premium_offer_view', 'premium_library_view']).gte('created_at', thirtyDaysAgo),
      supabase.from('learning_events').select('id', { count: 'exact', head: true }).in('event_name', ['premium_checkout_start', 'board_booster_checkout_start', 'manual_premium_payment_open']).gte('created_at', thirtyDaysAgo),
      supabase.from('payment_orders').select('id', { count: 'exact', head: true }).eq('status', 'paid').gte('created_at', thirtyDaysAgo),
    ]).then(async ([students, leads, followups, content, todaySlots, home, sample, premium, checkout, paid]) => {
      let demosToday = 0;
      if (!todaySlots.error && todaySlots.data?.length) {
        const ids = todaySlots.data.map((slot) => slot.id);
        const booked = await supabase.from('demo_bookings').select('id', { count: 'exact', head: true }).in('slot_id', ids).eq('status', 'Booked');
        demosToday = booked.count || 0;
      }

      setStats({
        students: students.count || 0,
        leads: leads.count || 0,
        followups: followups.count || 0,
        content: content.count || 0,
        demosToday,
      });

      setFunnel({
        home: home.count || 0,
        sample: sample.count || 0,
        premium: premium.count || 0,
        checkout: checkout.count || 0,
        paid: paid.count || 0,
      });
      setBusy(false);
    });
  }, [isAdmin]);

  if (loading || (user && isAdmin && busy)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--gold)' }} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title="Owner Hub" description="Restricted owner area." path="/admin" noindex />
        <div className="card-paper p-8 max-w-lg text-center">
          <ShieldCheck className="w-11 h-11 mx-auto" style={{ color: 'var(--gold)' }} />
          <h1 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            {user ? 'Owner access required' : 'Owner login required'}
          </h1>
          <Link to={user ? '/dashboard' : '/login'} className="btn-primary inline-flex mt-6">
            {user ? 'Back to dashboard' : 'Login'}
          </Link>
        </div>
      </div>
    );
  }

  const cards = [
    { to: '/admin/students', icon: Users, title: 'Students & Pro Access', value: stats.students, text: 'Real student accounts, test activity, cloud usage and manual Pro controls.' },
    { to: '/admin/leads', icon: CalendarClock, title: 'Admissions CRM', value: stats.leads, text: `${stats.followups} follow-up${stats.followups === 1 ? '' : 's'} currently due. Manage enquiries from first contact to joined student.` },
    { to: '/admin/demos', icon: CalendarCheck2, title: 'Demo Operations', value: stats.demosToday, text: 'Today’s booked demos, live slot availability, reminders, attendance, rescheduling and post-demo follow-up.' },
    { to: '/admin-studio', icon: BookOpenCheck, title: 'Content Studio', value: stats.content, text: 'Create and publish tests, review platform analytics and manage learning content.' },
    { to: '/admin/growth', icon: Megaphone, title: 'Growth Launch Kit', value: 'GO', text: 'Copy tracked student, parent, teacher and Google Business Profile campaign links for the free Commerce study pack.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Owner Hub" description="Restricted owner administration hub." path="/admin" noindex />

      <section className="page-hero">
        <div className="page-container max-w-5xl">
          <span className="eyebrow">Owner control</span>
          <h1 className="mt-4">Run the platform from <em>one place.</em></h1>
          <p className="mt-4 max-w-2xl" style={{ color: 'var(--muted)' }}>
            Only real account, admissions, demo, content and conversion data appears here. No demo students or fake business statistics.
          </p>
        </div>
      </section>

      <main className="page-container pb-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">
          {cards.map(({ to, icon: Icon, title, value, text }) => (
            <Link key={to} to={to} className="card-paper p-6 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-4xl font-bold mt-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>{value}</div>
              <h2 className="text-xl font-bold mt-2" style={{ color: 'var(--ink)' }}>{title}</h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</p>
              <div className="text-sm font-bold mt-5" style={{ color: 'var(--gold)' }}>Open →</div>
            </Link>
          ))}
        </div>

        <section className="card-paper p-6 sm:p-8 mt-7" aria-labelledby="premium-funnel-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="eyebrow inline-flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Premium funnel</span>
              <h2 id="premium-funnel-heading" className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Last 30 days — actions, not guesses.</h2>
              <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
                These are event counts, not unique people. Use them to locate the step where interest drops.
              </p>
            </div>
            <Link to="/premium" className="btn-secondary">View public Premium page</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            <Metric value={funnel.home} label="Home views" note="Tracked homepage funnel entries" />
            <Metric value={funnel.sample} label="Sample opens" note="Financial Ratios PDF/sample actions" />
            <Metric value={funnel.premium} label="Premium intent" note="Premium offer/library/page views" />
            <Metric value={funnel.checkout} label="Checkout starts" note="Secure + legacy checkout-start actions" />
            <Metric value={funnel.paid} label="Paid orders" note="Verified payment_orders marked paid" />
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <Link to="/" className="btn-secondary">View public site</Link>
        </div>
      </main>
    </div>
  );
}
