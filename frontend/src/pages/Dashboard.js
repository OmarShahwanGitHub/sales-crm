import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../store/statsSlice';
import Loading from '../components/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading } = useSelector((state) => state.stats);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  if (loading || !dashboardStats) return <Loading />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your Sales CRM overview</p>
        </div>
        <button onClick={handleRefresh} className="refresh-btn">Refresh Stats</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <h3>{dashboardStats.totalClients}</h3>
            <p>Total Leads</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-info">
            <h3>{dashboardStats.callsThisMonth}</h3>
            <p>Calls This Month</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-info">
            <h3>{dashboardStats.closedWonClients}</h3>
            <p>Deals Closed</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-info">
            <h3>${dashboardStats.totalRevenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="client-status-grid">
        <div className="status-box">
          <h4>Leads</h4>
          <p className="status-number">{dashboardStats.leadClients}</p>
        </div>
        <div className="status-box">
          <h4>Qualified</h4>
          <p className="status-number">{dashboardStats.qualifiedClients}</p>
        </div>
        <div className="status-box">
          <h4>Pipeline Value</h4>
          <p className="status-number">${dashboardStats.pipelineValue?.toLocaleString() || 0}</p>
        </div>
        <div className="status-box">
          <h4>Conversion Rate</h4>
          <p className="status-number">{dashboardStats.conversionRate}%</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Calls</h2>
            <Link to="/call-logs">View All</Link>
          </div>
          <div className="recent-calls">
            {dashboardStats.recentCalls && dashboardStats.recentCalls.length > 0 ? (
              dashboardStats.recentCalls.map((call) => (
                <div key={call._id} className="call-item">
                  <div className="call-client">
                    <strong>{call.client?.firstName} {call.client?.lastName}</strong>
                    <span className="call-phone">{call.client?.company || call.client?.phone}</span>
                  </div>
                  <div className="call-details">
                    <span className={`call-outcome ${call.outcome}`}>{call.outcome}</span>
                    <span className="call-date">{new Date(call.callDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent calls</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Clients</h2>
            <Link to="/clients">View All</Link>
          </div>
          <div className="recent-clients">
            {dashboardStats.recentClients && dashboardStats.recentClients.length > 0 ? (
              dashboardStats.recentClients.map((client) => (
                <div key={client._id} className="client-item">
                  <div className="client-info">
                    <strong>{client.firstName} {client.lastName}</strong>
                    <span className="client-medicare">{client.company}</span>
                  </div>
                  <span className={`client-status ${client.opportunityStage}`}>{client.opportunityStage}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent clients</p>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/add-client" className="action-btn">+ Add New Client</Link>
          <Link to="/clients" className="action-btn">View All Clients</Link>
          <Link to="/agents" className="action-btn">View Agents</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
