import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiBriefcase, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiTrendingUp, 
  FiPlus, 
  FiChevronRight,
  FiFileText
} from 'react-icons/fi';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

import { useAuth } from '../hooks/useAuth';
import { getCases } from '../services/casesService';
import { getHearings } from '../services/diaryService';
import { fetchCasesStart, fetchCasesSuccess, fetchCasesFailure } from '../features/cases/casesSlice';
import { fetchHearingsStart, fetchHearingsSuccess, fetchHearingsFailure } from '../features/diary/diarySlice';

import Card from '../Components/ui/Card';
import Badge from '../Components/ui/Badge';
import Button from '../Components/ui/Button';
import Skeleton, { SkeletonCard } from '../Components/ui/Skeleton';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useAuth();
  
  const { items: cases, isLoading: casesLoading } = useSelector(state => state.cases);
  const { hearings, isLoading: hearingsLoading } = useSelector(state => state.diary);

  useEffect(() => {
    const loadDashboardData = async () => {
      dispatch(fetchCasesStart());
      dispatch(fetchHearingsStart());
      try {
        const casesData = await getCases(token);
        const hearingsData = await getHearings(token);
        dispatch(fetchCasesSuccess(casesData));
        dispatch(fetchHearingsSuccess(hearingsData));
      } catch (err) {
        dispatch(fetchCasesFailure(err.message));
        dispatch(fetchHearingsFailure(err.message));
      }
    };

    loadDashboardData();
  }, [dispatch, token]);

  // Compute stats
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === 'Active').length;
  const pendingCases = cases.filter(c => c.status === 'Pending').length;
  const adjournedCases = cases.filter(c => c.status === 'Adjourned').length;
  const disposedCases = cases.filter(c => c.status === 'Disposed').length;

  const today = new Date().toISOString().split('T')[0];
  const hearingsToday = hearings.filter(h => h.date === today).length;
  const upcomingHearings = hearings.filter(h => h.status === 'Upcoming').length;

  // Chart data
  const statusData = [
    { name: 'Active', value: activeCases, color: 'var(--color-success)' },
    { name: 'Pending', value: pendingCases, color: 'var(--color-blue)' },
    { name: 'Adjourned', value: adjournedCases, color: 'var(--color-warning)' },
    { name: 'Disposed', value: disposedCases, color: 'var(--color-text-muted)' },
  ].filter(item => item.value > 0);

  const monthlyCaseData = [
    { month: 'Jan', Filed: 2, Disposed: 1 },
    { month: 'Feb', Filed: 4, Disposed: 2 },
    { month: 'Mar', Filed: 3, Disposed: 1 },
    { month: 'Apr', Filed: 5, Disposed: 3 },
    { month: 'May', Filed: 1, Disposed: 2 },
    { month: 'Jun', Filed: 6, Disposed: 4 },
  ];

  return (
    <div className="page-container">
      {/* Header Panel */}
      <div className="dashboard-header flex justify-between items-center w-full">
        <div>
          <h1 className="display-font" style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
            Counsel Panel
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
            Welcome back, Advocate <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{user?.username || 'Counsel'}</span>. Here is your practice ledger for today.
          </p>
        </div>
        <div className="dashboard-header__actions flex gap-3">
          <Button 
            variant="secondary" 
            icon={FiCalendar} 
            onClick={() => navigate('/diary')}
          >
            Calendar
          </Button>
          <Button 
            variant="primary" 
            icon={FiPlus} 
            onClick={() => navigate('/cases')}
          >
            New Case
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="dashboard-grid dashboard-grid--stats">
        <Card hover padding="md" className="stats-card">
          <div className="stats-card__top flex justify-between items-center w-full">
            <span className="stats-card__title">Total Cases Managed</span>
            <span className="stats-card__icon stats-card__icon--blue"><FiBriefcase size={20} /></span>
          </div>
          <div className="stats-card__value">
            {casesLoading ? <Skeleton width="80px" height={36} /> : totalCases}
          </div>
          <div className="stats-card__trend flex items-center gap-1">
            <FiTrendingUp className="trend-up" />
            <span>+12% increase this quarter</span>
          </div>
        </Card>

        <Card hover padding="md" className="stats-card">
          <div className="stats-card__top flex justify-between items-center w-full">
            <span className="stats-card__title">Hearings Today</span>
            <span className="stats-card__icon stats-card__icon--gold"><FiCalendar size={20} /></span>
          </div>
          <div className="stats-card__value">
            {hearingsLoading ? <Skeleton width="80px" height={36} /> : hearingsToday}
          </div>
          <div className="stats-card__trend flex items-center gap-1">
            <FiClock />
            <span>{upcomingHearings} upcoming in total</span>
          </div>
        </Card>

        <Card hover padding="md" className="stats-card">
          <div className="stats-card__top flex justify-between items-center w-full">
            <span className="stats-card__title">Active Clients</span>
            <span className="stats-card__icon stats-card__icon--success"><FiUsers size={20} /></span>
          </div>
          <div className="stats-card__value">
            {casesLoading ? <Skeleton width="80px" height={36} /> : '24'}
          </div>
          <div className="stats-card__trend flex items-center gap-1">
            <FiTrendingUp className="trend-up" />
            <span>+3 new clients this month</span>
          </div>
        </Card>

        <Card hover padding="md" className="stats-card">
          <div className="stats-card__top flex justify-between items-center w-full">
            <span className="stats-card__title">Documents Vault</span>
            <span className="stats-card__icon stats-card__icon--warning"><FiFileText size={20} /></span>
          </div>
          <div className="stats-card__value">
            {casesLoading ? <Skeleton width="80px" height={36} /> : '87'}
          </div>
          <div className="stats-card__trend flex items-center gap-1">
            <span>Secured cloud storage</span>
          </div>
        </Card>
      </div>

      {/* Main Charts & Timeline Row */}
      <div className="dashboard-grid dashboard-grid--main">
        {/* Left Side: Today's Hearings timeline */}
        <Card header="Hearing Docket (Today)" className="dashboard-column flex-col">
          <div className="hearing-list">
            {hearingsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : hearings.length > 0 ? (
              hearings
                .filter(h => h.date === today || h.status === 'In Progress')
                .map(h => (
                  <div key={h.id} className="hearing-item flex justify-between items-center">
                    <div className="hearing-item__details">
                      <h4 className="hearing-item__title">{h.caseTitle}</h4>
                      <div className="hearing-item__meta flex items-center gap-2">
                        <span className="hearing-item__time flex items-center gap-1"><FiClock size={12} /> {h.time}</span>
                        <span className="hearing-item__court">• {h.court}</span>
                      </div>
                    </div>
                    <div className="hearing-item__action flex items-center gap-2">
                      <Badge variant={h.status === 'In Progress' ? 'warning' : h.status === 'Done' ? 'success' : 'info'} dot>
                        {h.status}
                      </Badge>
                      <button className="hearing-item__btn" onClick={() => navigate(`/cases/${h.caseId}`)}>
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="empty-state">No hearings listed for today</div>
            )}
          </div>
        </Card>

        {/* Right Side: Recharts Pie & Bar */}
        <Card header="Portfolio Status" className="dashboard-column flex-col items-center justify-center">
          {casesLoading ? (
            <Skeleton width="100%" height={240} />
          ) : statusData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--color-bg-secondary)', 
                      borderColor: 'var(--color-border)',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legends flex flex-col gap-2 w-full">
                {statusData.map((s, idx) => (
                  <div key={idx} className="chart-legend-item flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="legend-dot" style={{ backgroundColor: s.color }} />
                      <span className="legend-label">{s.name} Cases</span>
                    </div>
                    <span className="legend-value">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">No cases data to display</div>
          )}
        </Card>
      </div>

      {/* Quarterly Performance Block */}
      <div className="dashboard-grid dashboard-grid--full">
        <Card header="Case Disposition Metrics" className="w-full">
          <div className="bar-chart-container w-full">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyCaseData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ 
                    background: 'var(--color-bg-secondary)', 
                    borderColor: 'var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Filed" fill="var(--color-blue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Disposed" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
