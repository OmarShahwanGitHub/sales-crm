import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCallLogs, removeCallLog } from '../store/callLogsSlice';
import Loading from '../components/Loading';
import './CallLogs.css';

const CallLogs = () => {
  const dispatch = useDispatch();
  const { callLogs, loading } = useSelector(state => state.callLogs);

  useEffect(() => {
    dispatch(fetchCallLogs());
  }, [dispatch]);

  const handleDeleteCall = async (callId, subject) => {
    if (window.confirm(`Are you sure you want to delete call log: "${subject}"?`)) {
      await dispatch(removeCallLog(callId));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="call-logs-page">
      <h1>Call Logs</h1>
      <div className="call-logs-container">
        {callLogs && callLogs.length > 0 ? (
          callLogs.map(call => (
            <div key={call._id} className="call-card">
              <div className="call-header">
                <div>
                  <h3>{call.client?.firstName} {call.client?.lastName}</h3>
                  <p>{call.subject}</p>
                </div>
                <div className="call-actions">
                  <span className={`outcome-badge ${call.outcome}`}>{call.outcome}</span>
                  <button
                    onClick={() => handleDeleteCall(call._id, call.subject)}
                    className="delete-call-card-btn"
                    title="Delete call log"
                  >
                    ×
                  </button>
                </div>
              </div>
              <p className="call-notes">{call.notes}</p>
              <div className="call-meta">
                <span>{call.callType} · {call.duration} min</span>
                <span>{new Date(call.callDate).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No call logs yet</p>
        )}
      </div>
    </div>
  );
};

export default CallLogs;
