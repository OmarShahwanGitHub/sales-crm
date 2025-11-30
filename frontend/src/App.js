import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClientsList from './pages/ClientsList';
import AddClient from './pages/AddClient';
import ClientDetails from './pages/ClientDetails';
import CallLogs from './pages/CallLogs';
import AgentsList from './pages/AgentsList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/clients" element={<PrivateRoute><ClientsList /></PrivateRoute>} />
            <Route path="/add-client" element={<PrivateRoute><AddClient /></PrivateRoute>} />
            <Route path="/clients/:id" element={<PrivateRoute><ClientDetails /></PrivateRoute>} />
            <Route path="/call-logs" element={<PrivateRoute><CallLogs /></PrivateRoute>} />
            <Route path="/agents" element={<PrivateRoute><AgentsList /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
