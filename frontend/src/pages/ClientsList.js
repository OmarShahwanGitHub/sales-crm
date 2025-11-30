import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchClients, removeClient } from '../store/clientsSlice';
import Loading from '../components/Loading';
import './ClientsList.css';

const ClientsList = () => {
  const dispatch = useDispatch();
  const { clients, loading } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDeleteClient = async (clientId, clientName) => {
    if (window.confirm(`Are you sure you want to delete ${clientName}? This will also delete all their call logs.`)) {
      await dispatch(removeClient(clientId));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1>Leads & Contacts</h1>
        <Link to="/add-client" className="add-btn">+ Add New Lead</Link>
      </div>

      <div className="clients-table-container">
        {clients && clients.length > 0 ? (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Deal Value</th>
                <th>Stage</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td><strong>{client.firstName} {client.lastName}</strong></td>
                  <td>{client.company || 'N/A'}</td>
                  <td>{client.email || 'N/A'}</td>
                  <td>{client.phone}</td>
                  <td>${client.dealValue?.toLocaleString() || '0'}</td>
                  <td><span className={`status-badge ${client.opportunityStage}`}>{client.opportunityStage}</span></td>
                  <td>{client.lastContactDate ? new Date(client.lastContactDate).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <Link to={`/clients/${client._id}`} className="view-btn">View</Link>
                    <button
                      onClick={() => handleDeleteClient(client._id, `${client.firstName} ${client.lastName}`)}
                      className="delete-client-btn"
                      title="Delete client"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-clients">
            <p>No leads yet. Add your first lead!</p>
            <Link to="/add-client" className="add-btn">+ Add Lead</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsList;
