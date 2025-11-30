import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClient, editClient } from '../store/clientsSlice';
import { fetchCallLogsByClient, addCallLog, removeCallLog } from '../store/callLogsSlice';
import Loading from '../components/Loading';
import './ClientDetails.css';

const ClientDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentClient, loading } = useSelector(state => state.clients);
  const { callLogs } = useSelector(state => state.callLogs);
  const [showAddCall, setShowAddCall] = useState(false);

  // Client data state
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    industry: 'Other',
    companySize: '1-10',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    opportunityStage: 'lead',
    dealValue: 0,
    probability: 0,
    leadSource: 'Other',
    preferredContactMethod: 'Email',
    notes: ''
  });

  // Call data state
  const [callData, setCallData] = useState({
    callType: 'outbound',
    subject: '',
    outcome: 'qualified',
    duration: 0,
    notes: ''
  });

  useEffect(() => {
    dispatch(fetchClient(id));
    dispatch(fetchCallLogsByClient(id));
  }, [dispatch, id]);

  // Populate client data when currentClient is loaded
  useEffect(() => {
    if (currentClient) {
      setClientData({
        firstName: currentClient.firstName || '',
        lastName: currentClient.lastName || '',
        email: currentClient.email || '',
        phone: currentClient.phone || '',
        jobTitle: currentClient.jobTitle || '',
        company: currentClient.company || '',
        industry: currentClient.industry || 'Other',
        companySize: currentClient.companySize || '1-10',
        website: currentClient.website || '',
        address: {
          street: currentClient.address?.street || '',
          city: currentClient.address?.city || '',
          state: currentClient.address?.state || '',
          zipCode: currentClient.address?.zipCode || '',
          country: currentClient.address?.country || 'USA'
        },
        opportunityStage: currentClient.opportunityStage || 'lead',
        dealValue: currentClient.dealValue || 0,
        probability: currentClient.probability || 0,
        leadSource: currentClient.leadSource || 'Other',
        preferredContactMethod: currentClient.preferredContactMethod || 'Email',
        notes: currentClient.notes || ''
      });
    }
  }, [currentClient]);

  const handleAddCall = async (e) => {
    e.preventDefault();

    // Add the call log (backend will update client stage automatically)
    await dispatch(addCallLog({ ...callData, client: id })).unwrap();

    // Refresh call logs and client data
    dispatch(fetchCallLogsByClient(id));
    dispatch(fetchClient(id));

    setShowAddCall(false);
    setCallData({
      callType: 'outbound',
      subject: '',
      outcome: 'qualified',
      duration: 0,
      notes: ''
    });
  };

  const handleDeleteCall = async (callId) => {
    if (window.confirm('Are you sure you want to delete this call log?')) {
      await dispatch(removeCallLog(callId));
    }
  };

  if (loading || !currentClient) return <Loading />;

  return (
    <div className="client-details-page">
      <div className="client-header">
        <div>
          <h1>{currentClient.firstName} {currentClient.lastName}</h1>
          <span className={`status-badge ${currentClient.status}`}>{currentClient.status}</span>
        </div>
        <button onClick={() => setShowAddCall(!showAddCall)} className="add-call-btn">
          Add Call Log
        </button>
      </div>

      <div className="client-info-grid">
        <div className="info-card">
          <h3>Contact Information</h3>
          <p><strong>Phone:</strong> {currentClient.phone}</p>
          <p><strong>Email:</strong> {currentClient.email || 'N/A'}</p>
          <p><strong>Address:</strong> {currentClient.address?.street}, {currentClient.address?.city}, {currentClient.address?.state} {currentClient.address?.zipCode}</p>
        </div>

        <div className="info-card">
          <h3>Company Information</h3>
          <p><strong>Company:</strong> {currentClient.company || 'N/A'}</p>
          <p><strong>Job Title:</strong> {currentClient.jobTitle || 'N/A'}</p>
          <p><strong>Industry:</strong> {currentClient.industry || 'N/A'}</p>
          <p><strong>Company Size:</strong> {currentClient.companySize || 'N/A'}</p>
          {currentClient.website && <p><strong>Website:</strong> <a href={currentClient.website} target="_blank" rel="noopener noreferrer">{currentClient.website}</a></p>}
        </div>

        <div className="info-card">
          <h3>Sales Pipeline</h3>
          <p><strong>Stage:</strong> <span className={`status-badge ${currentClient.opportunityStage}`}>{currentClient.opportunityStage}</span></p>
          <p><strong>Deal Value:</strong> ${currentClient.dealValue?.toLocaleString() || '0'}</p>
          <p><strong>Probability:</strong> {currentClient.probability || 0}%</p>
          <p><strong>Lead Source:</strong> {currentClient.leadSource || 'N/A'}</p>
          {currentClient.expectedCloseDate && <p><strong>Expected Close:</strong> {new Date(currentClient.expectedCloseDate).toLocaleDateString()}</p>}
        </div>
      </div>

      {showAddCall && (
        <div className="add-call-form">
          <h3>Add Call Log & Update Client</h3>
          <form onSubmit={handleAddCall}>

            <div className="form-section">
              <h4>Contact Information</h4>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={clientData.firstName}
                  onChange={(e) => setClientData({...clientData, firstName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={clientData.lastName}
                  onChange={(e) => setClientData({...clientData, lastName: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="email"
                  placeholder="Email"
                  value={clientData.email}
                  onChange={(e) => setClientData({...clientData, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Job Title"
                value={clientData.jobTitle}
                onChange={(e) => setClientData({...clientData, jobTitle: e.target.value})}
              />
            </div>

            <div className="form-section">
              <h4>Company Information</h4>
              <input
                type="text"
                placeholder="Company Name"
                value={clientData.company}
                onChange={(e) => setClientData({...clientData, company: e.target.value})}
                required
              />
              <div className="form-row">
                <select
                  value={clientData.industry}
                  onChange={(e) => setClientData({...clientData, industry: e.target.value})}
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Education">Education</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={clientData.companySize}
                  onChange={(e) => setClientData({...clientData, companySize: e.target.value})}
                >
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
              <input
                type="url"
                placeholder="Website"
                value={clientData.website}
                onChange={(e) => setClientData({...clientData, website: e.target.value})}
              />
            </div>

            <div className="form-section">
              <h4>Sales Pipeline</h4>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Deal Value ($)"
                  value={clientData.dealValue}
                  onChange={(e) => setClientData({...clientData, dealValue: e.target.value})}
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Probability (%)"
                  value={clientData.probability}
                  onChange={(e) => setClientData({...clientData, probability: e.target.value})}
                  min="0"
                  max="100"
                />
              </div>
              <select
                value={clientData.leadSource}
                onChange={(e) => setClientData({...clientData, leadSource: e.target.value})}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Social Media">Social Media</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Partner">Partner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-section">
              <h4>Opportunity Stage</h4>
              <select
                value={clientData.opportunityStage}
                onChange={(e) => setClientData({...clientData, opportunityStage: e.target.value})}
              >
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>

            <div className="form-section">
              <h4>Call Details</h4>
              <input
                type="text"
                placeholder="Call Subject"
                value={callData.subject}
                onChange={(e) => setCallData({...callData, subject: e.target.value})}
                required
              />

              <div className="form-row">
                <select value={callData.callType} onChange={(e) => setCallData({...callData, callType: e.target.value})}>
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="demo">Demo</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closing">Closing</option>
                </select>
                <select value={callData.outcome} onChange={(e) => setCallData({...callData, outcome: e.target.value})}>
                  <option value="qualified">Qualified</option>
                  <option value="proposal-sent">Proposal Sent</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                  <option value="no-answer">No Answer</option>
                  <option value="voicemail">Voicemail</option>
                  <option value="callback-requested">Callback Requested</option>
                  <option value="not-interested">Not Interested</option>
                </select>
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={callData.duration}
                  onChange={(e) => setCallData({...callData, duration: e.target.value})}
                />
              </div>

              <textarea
                placeholder="Call Notes"
                value={callData.notes}
                onChange={(e) => setCallData({...callData, notes: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="submit-btn">Save Call Log</button>
            <button type="button" className="cancel-btn" onClick={() => setShowAddCall(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="call-logs-section">
        <h2>Call History</h2>
        {callLogs && callLogs.length > 0 ? (
          <div className="call-logs-list">
            {callLogs.map(call => (
              <div key={call._id} className="call-log-item">
                <div className="call-log-header">
                  <strong>{call.subject}</strong>
                  <div>
                    <span className={`call-outcome ${call.outcome}`}>{call.outcome}</span>
                    <button onClick={() => handleDeleteCall(call._id)} className="delete-call-btn" title="Delete call log">×</button>
                  </div>
                </div>
                <p>{call.notes}</p>
                {call.dealInfo && call.dealInfo.dealValue && (
                  <div className="new-plan-details">
                    <h5>Deal Closed:</h5>
                    <p><strong>Deal Value:</strong> ${call.dealInfo.dealValue?.toLocaleString()}</p>
                    {call.dealInfo.contractTerm && <p><strong>Contract Term:</strong> {call.dealInfo.contractTerm}</p>}
                    {call.dealInfo.startDate && <p><strong>Start Date:</strong> {new Date(call.dealInfo.startDate).toLocaleDateString()}</p>}
                  </div>
                )}
                <div className="call-log-footer">
                  <span>{call.callType} · {call.duration} min</span>
                  <span>{new Date(call.callDate).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No call logs yet.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
