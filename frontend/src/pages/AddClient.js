import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addClient } from '../store/clientsSlice';
import './AddClient.css';

const AddClient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    company: '',
    industry: 'Other',
    companySize: '1-10',
    website: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'USA' },
    opportunityStage: 'lead',
    dealValue: 0,
    probability: 0,
    leadSource: 'Other',
    preferredContactMethod: 'Email',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addClient(formData)).unwrap();
      navigate('/clients');
    } catch (error) {
      alert('Failed to add client: ' + error);
    }
  };

  return (
    <div className="add-client-page">
      <div className="form-header">
        <h1>Add New Lead</h1>
        <p>Enter complete lead/contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Job Title</label>
            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. CEO, Marketing Director" />
          </div>
        </div>

        <div className="form-section">
          <h2>Company Information</h2>
          <div className="form-group">
            <label>Company Name *</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Industry</label>
              <select name="industry" value={formData.industry} onChange={handleChange}>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Company Size</label>
              <select name="companySize" value={formData.companySize} onChange={handleChange}>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>
          <div className="form-group">
            <label>Street Address</label>
            <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} maxLength="2" placeholder="IL" />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Sales Pipeline</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Opportunity Stage</label>
              <select name="opportunityStage" value={formData.opportunityStage} onChange={handleChange}>
                <option value="lead">Lead</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deal Value ($)</label>
              <input type="number" name="dealValue" value={formData.dealValue} onChange={handleChange} min="0" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Probability (%)</label>
              <input type="number" name="probability" value={formData.probability} onChange={handleChange} min="0" max="100" />
            </div>
            <div className="form-group">
              <label>Lead Source</label>
              <select name="leadSource" value={formData.leadSource} onChange={handleChange}>
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
          </div>
          <div className="form-group">
            <label>Preferred Contact Method</label>
            <select name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange}>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="In-Person">In-Person</option>
              <option value="Video Call">Video Call</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Additional notes about this lead..."></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/clients')} className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Add Lead</button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
