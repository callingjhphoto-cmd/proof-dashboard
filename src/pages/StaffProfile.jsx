import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ArrowLeft, Clock, PoundSterling, TrendingUp, Users, Star, Zap, ShoppingCart, Award } from 'lucide-react'
import { useRole, ROLES } from '../context/RoleContext'
import { C } from '../App'

// ─── Shared Staff Database ────────────────────────────────────────────────────
export const STAFF_DB = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    shortName: 'Sarah M.',
    role: 'Bar Lead',
    rate: 16.50,
    contractedHrs: 40,
    startDate: '2022-03-14',
    status: 'on-shift',
    shift: '14:00-23:00',
    initials: 'SM',
    color: '#D4A853',
    pos: {
      today: 3420,
      thisWeek: 18650,
      thisMonth: 72400,
      avgTransaction: 34.80,
      transactionsPerHour: 12.4,
      upsellRate: 28,
      avgItemsPerTx: 3.2,
      avgSpeedMins: 1.8,
      customerRating: 4.8,
      last7Days: [
        { day: 'Mon', revenue: 2840 },
        { day: 'Tue', revenue: 2650 },
        { day: 'Wed', revenue: 3100 },
        { day: 'Thu', revenue: 2920 },
        { day: 'Fri', revenue: 3680 },
        { day: 'Sat', revenue: 4120 },
        { day: 'Sun', revenue: 3340 },
      ],
    },
    shifts: [
      { date: '2026-03-18', start: '14:00', end: '23:00', hours: 9, revenue: 3420 },
      { date: '2026-03-17', start: '12:00', end: '21:00', hours: 9, revenue: 3180 },
      { date: '2026-03-16', start: '10:00', end: '19:00', hours: 9, revenue: 4120 },
      { date: '2026-03-15', start: '14:00', end: '23:00', hours: 9, revenue: 3680 },
      { date: '2026-03-14', start: '14:00', end: '23:00', hours: 9, revenue: 2920 },
      { date: '2026-03-13', start: '16:00', end: '23:00', hours: 7, revenue: 3100 },
      { date: '2026-03-12', start: '14:00', end: '23:00', hours: 9, revenue: 2650 },
      { date: '2026-03-11', start: '14:00', end: '23:00', hours: 9, revenue: 2840 },
      { date: '2026-03-09', start: '12:00', end: '22:00', hours: 10, revenue: 3950 },
      { date: '2026-03-08', start: '14:00', end: '23:00', hours: 9, revenue: 3560 },
    ],
    weeklyHours: 38,
  },
  {
    id: 'marcus-taylor',
    name: 'Marcus Taylor',
    shortName: 'Marcus T.',
    role: 'Bartender',
    rate: 13.50,
    contractedHrs: 35,
    startDate: '2023-06-01',
    status: 'on-shift',
    shift: '16:00-23:00',
    initials: 'MT',
    color: '#3B82F6',
    pos: {
      today: 2180,
      thisWeek: 12400,
      thisMonth: 48200,
      avgTransaction: 28.50,
      transactionsPerHour: 10.8,
      upsellRate: 22,
      avgItemsPerTx: 2.8,
      avgSpeedMins: 2.1,
      customerRating: 4.5,
      last7Days: [
        { day: 'Mon', revenue: 1820 },
        { day: 'Tue', revenue: 1640 },
        { day: 'Wed', revenue: 2100 },
        { day: 'Thu', revenue: 1950 },
        { day: 'Fri', revenue: 2680 },
        { day: 'Sat', revenue: 3080 },
        { day: 'Sun', revenue: 2130 },
      ],
    },
    shifts: [
      { date: '2026-03-18', start: '16:00', end: '23:00', hours: 7, revenue: 2180 },
      { date: '2026-03-17', start: '16:00', end: '23:00', hours: 7, revenue: 2050 },
      { date: '2026-03-16', start: '14:00', end: '23:00', hours: 9, revenue: 3080 },
      { date: '2026-03-15', start: '16:00', end: '23:00', hours: 7, revenue: 2680 },
      { date: '2026-03-14', start: '16:00', end: '23:00', hours: 7, revenue: 1950 },
      { date: '2026-03-13', start: '16:00', end: '23:00', hours: 7, revenue: 2100 },
      { date: '2026-03-12', start: '16:00', end: '23:00', hours: 7, revenue: 1640 },
      { date: '2026-03-11', start: '16:00', end: '23:00', hours: 7, revenue: 1820 },
      { date: '2026-03-09', start: '14:00', end: '23:00', hours: 9, revenue: 2940 },
      { date: '2026-03-08', start: '16:00', end: '23:00', hours: 7, revenue: 2310 },
    ],
    weeklyHours: 33,
  },
  {
    id: 'lily-chen',
    name: 'Lily Chen',
    shortName: 'Lily C.',
    role: 'Floor Manager',
    rate: 15.00,
    contractedHrs: 42,
    startDate: '2021-09-20',
    status: 'ending',
    shift: '11:00-20:00',
    initials: 'LC',
    color: '#14B8A6',
    pos: {
      today: 4280,
      thisWeek: 22100,
      thisMonth: 86500,
      avgTransaction: 42.60,
      transactionsPerHour: 11.2,
      upsellRate: 32,
      avgItemsPerTx: 3.6,
      avgSpeedMins: 2.4,
      customerRating: 4.9,
      last7Days: [
        { day: 'Mon', revenue: 3240 },
        { day: 'Tue', revenue: 2980 },
        { day: 'Wed', revenue: 3560 },
        { day: 'Thu', revenue: 3420 },
        { day: 'Fri', revenue: 4180 },
        { day: 'Sat', revenue: 4720 },
        { day: 'Sun', revenue: 3500 },
      ],
    },
    shifts: [
      { date: '2026-03-18', start: '11:00', end: '20:00', hours: 9, revenue: 4280 },
      { date: '2026-03-17', start: '11:00', end: '20:00', hours: 9, revenue: 3960 },
      { date: '2026-03-16', start: '10:00', end: '20:00', hours: 10, revenue: 4720 },
      { date: '2026-03-15', start: '11:00', end: '20:00', hours: 9, revenue: 4180 },
      { date: '2026-03-14', start: '11:00', end: '20:00', hours: 9, revenue: 3420 },
      { date: '2026-03-13', start: '11:00', end: '20:00', hours: 9, revenue: 3560 },
      { date: '2026-03-12', start: '11:00', end: '20:00', hours: 9, revenue: 2980 },
      { date: '2026-03-11', start: '11:00', end: '20:00', hours: 9, revenue: 3240 },
      { date: '2026-03-09', start: '10:00', end: '20:00', hours: 10, revenue: 4480 },
      { date: '2026-03-08', start: '11:00', end: '20:00', hours: 9, revenue: 3880 },
    ],
    weeklyHours: 41,
  },
  {
    id: 'tom-robinson',
    name: 'Tom Robinson',
    shortName: 'Tom R.',
    role: 'Server',
    rate: 12.00,
    contractedHrs: 30,
    startDate: '2024-01-15',
    status: 'upcoming',
    shift: '17:00-23:00',
    initials: 'TR',
    color: '#8B5CF6',
    pos: {
      today: 0,
      thisWeek: 8200,
      thisMonth: 31800,
      avgTransaction: 26.40,
      transactionsPerHour: 9.6,
      upsellRate: 18,
      avgItemsPerTx: 2.4,
      avgSpeedMins: 2.6,
      customerRating: 4.3,
      last7Days: [
        { day: 'Mon', revenue: 1280 },
        { day: 'Tue', revenue: 1100 },
        { day: 'Wed', revenue: 1460 },
        { day: 'Thu', revenue: 1320 },
        { day: 'Fri', revenue: 1840 },
        { day: 'Sat', revenue: 2180 },
        { day: 'Sun', revenue: 1420 },
      ],
    },
    shifts: [
      { date: '2026-03-17', start: '17:00', end: '23:00', hours: 6, revenue: 1580 },
      { date: '2026-03-16', start: '16:00', end: '23:00', hours: 7, revenue: 2180 },
      { date: '2026-03-15', start: '17:00', end: '23:00', hours: 6, revenue: 1840 },
      { date: '2026-03-14', start: '17:00', end: '23:00', hours: 6, revenue: 1320 },
      { date: '2026-03-13', start: '17:00', end: '23:00', hours: 6, revenue: 1460 },
      { date: '2026-03-12', start: '17:00', end: '23:00', hours: 6, revenue: 1100 },
      { date: '2026-03-11', start: '17:00', end: '23:00', hours: 6, revenue: 1280 },
      { date: '2026-03-09', start: '16:00', end: '23:00', hours: 7, revenue: 2040 },
      { date: '2026-03-08', start: '17:00', end: '23:00', hours: 6, revenue: 1680 },
      { date: '2026-03-07', start: '17:00', end: '23:00', hours: 6, revenue: 1420 },
    ],
    weeklyHours: 28,
  },
  {
    id: 'anya-kowalski',
    name: 'Anya Kowalski',
    shortName: 'Anya K.',
    role: 'Server',
    rate: 12.00,
    contractedHrs: 25,
    startDate: '2024-09-02',
    status: 'upcoming',
    shift: '17:00-23:00',
    initials: 'AK',
    color: '#EC4899',
    pos: {
      today: 0,
      thisWeek: 6800,
      thisMonth: 26400,
      avgTransaction: 24.80,
      transactionsPerHour: 9.2,
      upsellRate: 16,
      avgItemsPerTx: 2.2,
      avgSpeedMins: 2.8,
      customerRating: 4.4,
      last7Days: [
        { day: 'Mon', revenue: 960 },
        { day: 'Tue', revenue: 880 },
        { day: 'Wed', revenue: 1120 },
        { day: 'Thu', revenue: 1040 },
        { day: 'Fri', revenue: 1480 },
        { day: 'Sat', revenue: 1760 },
        { day: 'Sun', revenue: 1160 },
      ],
    },
    shifts: [
      { date: '2026-03-17', start: '17:00', end: '23:00', hours: 6, revenue: 1280 },
      { date: '2026-03-16', start: '16:00', end: '23:00', hours: 7, revenue: 1760 },
      { date: '2026-03-15', start: '17:00', end: '23:00', hours: 6, revenue: 1480 },
      { date: '2026-03-14', start: '17:00', end: '23:00', hours: 6, revenue: 1040 },
      { date: '2026-03-13', start: '17:00', end: '23:00', hours: 6, revenue: 1120 },
      { date: '2026-03-12', start: '17:00', end: '23:00', hours: 6, revenue: 880 },
      { date: '2026-03-11', start: '17:00', end: '23:00', hours: 6, revenue: 960 },
      { date: '2026-03-09', start: '16:00', end: '23:00', hours: 7, revenue: 1640 },
      { date: '2026-03-08', start: '17:00', end: '23:00', hours: 6, revenue: 1380 },
      { date: '2026-03-07', start: '17:00', end: '23:00', hours: 6, revenue: 1080 },
    ],
    weeklyHours: 22,
  },
  {
    id: 'ben-hughes',
    name: 'Ben Hughes',
    shortName: 'Ben H.',
    role: 'Bartender',
    rate: 13.50,
    contractedHrs: 32,
    startDate: '2023-11-06',
    status: 'off',
    shift: 'Off today',
    initials: 'BH',
    color: '#F97316',
    pos: {
      today: 0,
      thisWeek: 10800,
      thisMonth: 42600,
      avgTransaction: 30.20,
      transactionsPerHour: 10.4,
      upsellRate: 24,
      avgItemsPerTx: 2.9,
      avgSpeedMins: 2.0,
      customerRating: 4.6,
      last7Days: [
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 1920 },
        { day: 'Wed', revenue: 2240 },
        { day: 'Thu', revenue: 0 },
        { day: 'Fri', revenue: 2860 },
        { day: 'Sat', revenue: 3280 },
        { day: 'Sun', revenue: 0 },
      ],
    },
    shifts: [
      { date: '2026-03-16', start: '14:00', end: '23:00', hours: 9, revenue: 3280 },
      { date: '2026-03-15', start: '14:00', end: '23:00', hours: 9, revenue: 2860 },
      { date: '2026-03-13', start: '16:00', end: '23:00', hours: 7, revenue: 2240 },
      { date: '2026-03-12', start: '16:00', end: '23:00', hours: 7, revenue: 1920 },
      { date: '2026-03-09', start: '14:00', end: '23:00', hours: 9, revenue: 3120 },
      { date: '2026-03-08', start: '14:00', end: '23:00', hours: 9, revenue: 2780 },
      { date: '2026-03-06', start: '16:00', end: '23:00', hours: 7, revenue: 2100 },
      { date: '2026-03-05', start: '16:00', end: '23:00', hours: 7, revenue: 1860 },
      { date: '2026-03-02', start: '14:00', end: '23:00', hours: 9, revenue: 3040 },
      { date: '2026-03-01', start: '14:00', end: '23:00', hours: 9, revenue: 2680 },
    ],
    weeklyHours: 30,
  },
  {
    id: 'priya-patel',
    name: 'Priya Patel',
    shortName: 'Priya P.',
    role: 'Server',
    rate: 12.00,
    contractedHrs: 28,
    startDate: '2024-05-20',
    status: 'off',
    shift: 'Off today',
    initials: 'PP',
    color: '#06B6D4',
    pos: {
      today: 0,
      thisWeek: 7400,
      thisMonth: 28800,
      avgTransaction: 25.60,
      transactionsPerHour: 9.0,
      upsellRate: 20,
      avgItemsPerTx: 2.5,
      avgSpeedMins: 2.5,
      customerRating: 4.6,
      last7Days: [
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 1240 },
        { day: 'Wed', revenue: 0 },
        { day: 'Thu', revenue: 1380 },
        { day: 'Fri', revenue: 1820 },
        { day: 'Sat', revenue: 2060 },
        { day: 'Sun', revenue: 1500 },
      ],
    },
    shifts: [
      { date: '2026-03-16', start: '16:00', end: '23:00', hours: 7, revenue: 2060 },
      { date: '2026-03-15', start: '17:00', end: '23:00', hours: 6, revenue: 1820 },
      { date: '2026-03-14', start: '17:00', end: '23:00', hours: 6, revenue: 1380 },
      { date: '2026-03-12', start: '17:00', end: '23:00', hours: 6, revenue: 1240 },
      { date: '2026-03-09', start: '16:00', end: '23:00', hours: 7, revenue: 1940 },
      { date: '2026-03-08', start: '17:00', end: '23:00', hours: 6, revenue: 1720 },
      { date: '2026-03-07', start: '17:00', end: '23:00', hours: 6, revenue: 1300 },
      { date: '2026-03-05', start: '17:00', end: '23:00', hours: 6, revenue: 1180 },
      { date: '2026-03-02', start: '16:00', end: '23:00', hours: 7, revenue: 1860 },
      { date: '2026-03-01', start: '17:00', end: '23:00', hours: 6, revenue: 1640 },
    ],
    weeklyHours: 26,
  },
  {
    id: 'jake-williams',
    name: 'Jake Williams',
    shortName: 'Jake W.',
    role: 'Kitchen Porter',
    rate: 11.50,
    contractedHrs: 38,
    startDate: '2025-02-10',
    status: 'off',
    shift: 'Off today',
    initials: 'JW',
    color: '#A3E635',
    pos: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      avgTransaction: 0,
      transactionsPerHour: 0,
      upsellRate: 0,
      avgItemsPerTx: 0,
      avgSpeedMins: 0,
      customerRating: 0,
      last7Days: [
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 0 },
        { day: 'Wed', revenue: 0 },
        { day: 'Thu', revenue: 0 },
        { day: 'Fri', revenue: 0 },
        { day: 'Sat', revenue: 0 },
        { day: 'Sun', revenue: 0 },
      ],
    },
    shifts: [
      { date: '2026-03-16', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-15', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-14', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-13', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-12', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-11', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-09', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-08', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-07', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
      { date: '2026-03-06', start: '08:00', end: '16:00', hours: 8, revenue: 0 },
    ],
    weeklyHours: 36,
  },
]

// ─── Helper: get staff by URL slug ────────────────────────────────────────────
export function getStaffById(id) {
  return STAFF_DB.find(s => s.id === id) || null
}

// ─── Status colours ───────────────────────────────────────────────────────────
const statusColor = { 'on-shift': '#22C55E', ending: '#F97316', upcoming: '#3B82F6', off: '#555' }
const statusLabel = { 'on-shift': 'On Shift', ending: 'Ending Soon', upcoming: 'Starting Soon', off: 'Off Today' }

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ title, children, style }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, ...style }}>
      {title && <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  )
}

// ─── Metric box ───────────────────────────────────────────────────────────────
function Metric({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Icon size={14} color={color || C.textMuted} />
        <span style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || C.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── Format helpers ───────────────────────────────────────────────────────────
function fmtDate(d) {
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function tenure(startDate) {
  const start = new Date(startDate)
  const now = new Date('2026-03-18')
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (months < 12) return `${months} months`
  const y = Math.floor(months / 12)
  const m = months % 12
  return m > 0 ? `${y}y ${m}m` : `${y} year${y > 1 ? 's' : ''}`
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StaffProfile() {
  const { staffId } = useParams()
  const navigate = useNavigate()
  const { role } = useRole()
  const [shiftSort, setShiftSort] = useState('date-desc')

  const person = getStaffById(staffId)

  // Access control: employees can only see their own profile
  // For demo, employee role maps to Marcus Taylor (initials MT in ROLE_META)
  const employeeOwnId = 'marcus-taylor'
  if (role === ROLES.EMPLOYEE && staffId !== employeeOwnId) {
    return (
      <div className="animate-in" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Access Restricted</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>You can only view your own profile.</div>
        <button onClick={() => navigate(`/staff/${employeeOwnId}`)} style={{
          padding: '10px 20px', borderRadius: 8, border: 'none', background: C.blue, color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>View My Profile</button>
      </div>
    )
  }

  if (!person) {
    return (
      <div className="animate-in" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Staff member not found</div>
        <button onClick={() => navigate(-1)} style={{
          padding: '10px 20px', borderRadius: 8, border: 'none', background: C.amber, color: '#000',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Go Back</button>
      </div>
    )
  }

  // Team averages for comparison
  const teamWithPOS = STAFF_DB.filter(s => s.pos.thisWeek > 0)
  const teamAvg = {
    weeklyRevenue: teamWithPOS.reduce((s, p) => s + p.pos.thisWeek, 0) / teamWithPOS.length,
    avgTransaction: teamWithPOS.reduce((s, p) => s + p.pos.avgTransaction, 0) / teamWithPOS.length,
    upsellRate: teamWithPOS.reduce((s, p) => s + p.pos.upsellRate, 0) / teamWithPOS.length,
    transactionsPerHour: teamWithPOS.reduce((s, p) => s + p.pos.transactionsPerHour, 0) / teamWithPOS.length,
    customerRating: teamWithPOS.reduce((s, p) => s + p.pos.customerRating, 0) / teamWithPOS.length,
  }

  // Ranking (by weekly revenue, excluding non-POS staff)
  const ranked = [...teamWithPOS].sort((a, b) => b.pos.thisWeek - a.pos.thisWeek)
  const rank = ranked.findIndex(s => s.id === person.id) + 1

  // Comparison bar data
  const comparisonData = [
    { metric: 'Weekly Rev', person: person.pos.thisWeek, team: Math.round(teamAvg.weeklyRevenue), unit: '\u00a3' },
    { metric: 'Avg Tx', person: person.pos.avgTransaction, team: parseFloat(teamAvg.avgTransaction.toFixed(2)), unit: '\u00a3' },
    { metric: 'Upsell %', person: person.pos.upsellRate, team: parseFloat(teamAvg.upsellRate.toFixed(1)), unit: '%' },
    { metric: 'Tx/Hour', person: person.pos.transactionsPerHour, team: parseFloat(teamAvg.transactionsPerHour.toFixed(1)), unit: '' },
    { metric: 'Rating', person: person.pos.customerRating, team: parseFloat(teamAvg.customerRating.toFixed(1)), unit: '/5' },
  ]

  // Sorted shifts
  const sortedShifts = useMemo(() => {
    const list = [...person.shifts]
    switch (shiftSort) {
      case 'date-asc': return list.sort((a, b) => a.date.localeCompare(b.date))
      case 'hours-desc': return list.sort((a, b) => b.hours - a.hours)
      case 'revenue-desc': return list.sort((a, b) => b.revenue - a.revenue)
      default: return list.sort((a, b) => b.date.localeCompare(a.date))
    }
  }, [person.shifts, shiftSort])

  const isNonPOS = person.pos.thisMonth === 0

  return (
    <div className="animate-in">
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
        color: C.textMuted, fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0,
      }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* ─── Profile Header ────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`,
            fontSize: 22, fontWeight: 800, color: '#000', flexShrink: 0,
          }}>{person.initials}</div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{person.name}</span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                background: `${statusColor[person.status]}18`, color: statusColor[person.status],
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{statusLabel[person.status]}</span>
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>{person.role}</div>
            <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: C.textDim }}>
                Started {new Date(person.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} ({tenure(person.startDate)})
              </span>
              <span style={{ fontSize: 12, color: C.textDim }}>{'\u00a3'}{person.rate.toFixed(2)}/hr</span>
            </div>
          </div>

          {/* Hours summary */}
          <div style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 20px',
            textAlign: 'center', minWidth: 140,
          }}>
            <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Hours This Week</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>{person.weeklyHours}<span style={{ fontSize: 14, color: C.textDim }}>/{person.contractedHrs}</span></div>
            <div style={{ marginTop: 6, height: 4, background: '#1E1E21', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${Math.min((person.weeklyHours / person.contractedHrs) * 100, 100)}%`,
                background: person.weeklyHours / person.contractedHrs > 0.95 ? C.amber : C.green,
              }} />
            </div>
          </div>
        </div>
      </Card>

      {/* ─── POS Performance KPIs ──────────────────────────────────────── */}
      {!isNonPOS ? (
        <>
          <div className="grid-kpi-4" style={{ marginBottom: 16 }}>
            <Metric icon={PoundSterling} label="Revenue Today" value={`\u00a3${person.pos.today.toLocaleString()}`} color={C.green} />
            <Metric icon={PoundSterling} label="Revenue This Week" value={`\u00a3${person.pos.thisWeek.toLocaleString()}`} color={C.amber} />
            <Metric icon={PoundSterling} label="Revenue This Month" value={`\u00a3${person.pos.thisMonth.toLocaleString()}`} color={C.ink} />
            <Metric icon={ShoppingCart} label="Avg Transaction" value={`\u00a3${person.pos.avgTransaction.toFixed(2)}`} sub={`${person.pos.transactionsPerHour} tx/hour`} />
          </div>

          {/* ─── Revenue Trend Chart ─────────────────────────────────────── */}
          <Card title="Revenue Trend (Last 7 Days)" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={person.pos.last7Days}>
                <XAxis dataKey="day" stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `\u00a3${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1A1A1C', border: '1px solid #333', borderRadius: 8, fontSize: 12 }}
                  formatter={v => [`\u00a3${v.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke={person.color} strokeWidth={2.5} dot={{ fill: person.color, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      ) : (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 14, color: C.textMuted }}>This role does not process POS transactions</div>
            <div style={{ fontSize: 12, color: C.textDim, marginTop: 6 }}>Shift history and hours are tracked below</div>
          </div>
        </Card>
      )}

      {/* ─── Shift History ─────────────────────────────────────────────── */}
      <Card title="Shift History (Last 10)" style={{ marginBottom: 16 }}>
        {/* Sort controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { key: 'date-desc', label: 'Newest' },
            { key: 'date-asc', label: 'Oldest' },
            { key: 'hours-desc', label: 'Most Hours' },
            { key: 'revenue-desc', label: 'Top Revenue' },
          ].map(opt => (
            <button key={opt.key} onClick={() => setShiftSort(opt.key)} style={{
              padding: '5px 12px', borderRadius: 6, border: `1px solid ${shiftSort === opt.key ? person.color : C.border}`,
              background: shiftSort === opt.key ? `${person.color}18` : 'transparent',
              color: shiftSort === opt.key ? person.color : C.textMuted,
              fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}>{opt.label}</button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Start', 'End', 'Hours', ...(isNonPOS ? [] : ['Revenue'])].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600,
                    color: C.textDim, borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedShifts.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}10` }}
                  onMouseEnter={e => e.currentTarget.style.background = `${C.border}40`}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', fontSize: 13, color: C.text }}>{fmtDate(s.date)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: C.textMuted }}>{s.start}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: C.textMuted }}>{s.end}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: C.ink, fontWeight: 600 }}>{s.hours}h</td>
                  {!isNonPOS && (
                    <td style={{ padding: '10px 12px', fontSize: 13, color: C.green, fontWeight: 600 }}>{'\u00a3'}{s.revenue.toLocaleString()}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Performance Metrics ───────────────────────────────────────── */}
      {!isNonPOS && (
        <Card title="Performance Metrics" style={{ marginBottom: 16 }}>
          <div className="grid-kpi-4">
            <Metric icon={TrendingUp} label="Upsell Rate" value={`${person.pos.upsellRate}%`} sub="of transactions with add-ons" color={person.pos.upsellRate > teamAvg.upsellRate ? C.green : C.orange} />
            <Metric icon={ShoppingCart} label="Avg Items/Tx" value={person.pos.avgItemsPerTx.toFixed(1)} sub="items per transaction" />
            <Metric icon={Zap} label="Avg Speed" value={`${person.pos.avgSpeedMins.toFixed(1)}m`} sub="per transaction" color={person.pos.avgSpeedMins < 2.2 ? C.green : C.orange} />
            <Metric icon={Star} label="Customer Rating" value={person.pos.customerRating.toFixed(1)} sub="out of 5.0" color={person.pos.customerRating >= 4.5 ? C.green : C.orange} />
          </div>
        </Card>
      )}

      {/* ─── Team Comparison ───────────────────────────────────────────── */}
      {!isNonPOS && (
        <Card title="Team Comparison" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48,
              borderRadius: 12, background: rank <= 3 ? `${C.amber}18` : `${C.border}40`,
              border: `1px solid ${rank <= 3 ? C.amber : C.border}`,
            }}>
              <Award size={20} color={rank <= 3 ? C.amber : C.textMuted} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                Rank #{rank} <span style={{ color: C.textDim, fontWeight: 400 }}>of {teamWithPOS.length} (POS staff)</span>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Based on weekly revenue</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {comparisonData.map((d, i) => {
              const maxVal = Math.max(d.person, d.team)
              const pWidth = maxVal > 0 ? (d.person / maxVal) * 100 : 0
              const tWidth = maxVal > 0 ? (d.team / maxVal) * 100 : 0
              const isAhead = d.person >= d.team
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{d.metric}</span>
                    <span style={{ fontSize: 12, color: isAhead ? C.green : C.orange, fontWeight: 600 }}>
                      {d.unit === '\u00a3' ? `\u00a3${d.person.toLocaleString()}` : `${d.person}${d.unit}`}
                      <span style={{ color: C.textDim, fontWeight: 400 }}> vs {d.unit === '\u00a3' ? `\u00a3${d.team.toLocaleString()}` : `${d.team}${d.unit}`} avg</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ flex: 1, height: 8, background: '#1E1E21', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pWidth}%`, background: person.color, borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ flex: 1, height: 8, background: '#1E1E21', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${tWidth}%`, background: '#555', borderRadius: 4, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: person.color }}>{person.name.split(' ')[0]}</span>
                    <span style={{ fontSize: 10, color: '#555' }}>Team Avg</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
