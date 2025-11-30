import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAgentsStats } from '../store/statsSlice';
import Loading from '../components/Loading';
import './AgentsList.css';

const AgentsList = () => {
  const dispatch = useDispatch();
  const { agentsStats, loading } = useSelector(state => state.stats);

  useEffect(() => {
    dispatch(fetchAllAgentsStats());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="agents-page">
      <h1>Sales Team</h1>
      <div className="agents-grid">
        {agentsStats && agentsStats.map(agent => (
          <div key={agent._id} className="agent-card">
            <div className="agent-info">
              <h3>{agent.name}</h3>
              <p>{agent.email}</p>
              <p>{agent.phone}</p>
              <p><strong>{agent.department}</strong></p>
            </div>
            <div className="agent-stats">
              <div className="stat">
                <span className="stat-number">{agent.stats.totalClients}</span>
                <span className="stat-label">Leads</span>
              </div>
              <div className="stat">
                <span className="stat-number">{agent.stats.closedWonClients}</span>
                <span className="stat-label">Deals Closed</span>
              </div>
              <div className="stat">
                <span className="stat-number">${agent.stats.totalRevenue?.toLocaleString() || 0}</span>
                <span className="stat-label">Revenue</span>
              </div>
              <div className="stat">
                <span className="stat-number">{agent.stats.conversionRate}%</span>
                <span className="stat-label">Conv. Rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsList;
