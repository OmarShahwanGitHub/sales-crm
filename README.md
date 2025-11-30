# 💼 Sales CRM - Lead Management & Deal Tracking System

A professional, full-stack Customer Relationship Management system built for sales teams to manage leads, track opportunities, and close deals efficiently.

## 🎯 Project Overview

**Resume Description:**
Full Stack Sales CRM built with JavaScript, Express.js, Node.js, MongoDB, and React. Features JWT authentication, Redux state management, comprehensive lead tracking, sales pipeline management, deal value tracking, and sales performance analytics.

## ✨ Features

### For Sales Representatives
- **Dashboard** with real-time sales metrics
  - Total leads and contacts
  - Deals closed (won)
  - Total revenue generated
  - Pipeline value
  - Conversion rates
  - Monthly call volume
  - Recent activity feed

- **Lead & Contact Management**
  - Add new leads with complete company information
  - Track contact details (Name, Email, Phone, Job Title)
  - Company information (Company Name, Industry, Size, Website)
  - Sales pipeline tracking (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost)
  - Deal value and probability tracking
  - Lead source tracking
  - Search and filter capabilities

- **Call Logging System**
  - Log every interaction with leads/contacts
  - Track call type (Outbound, Inbound, Demo, Proposal, Negotiation, Closing)
  - Track outcomes (Qualified, Proposal Sent, Negotiation, Closed Won/Lost)
  - Add detailed notes
  - Schedule follow-ups
  - View complete interaction history per contact

- **Sales Performance Tracking**
  - View personal sales statistics
  - Revenue tracking
  - Conversion rate calculation
  - Pipeline value analysis
  - Monthly performance metrics

### For Sales Managers
- **Sales Team List** - View all sales reps with their statistics
- **Rep Details** - Deep dive into individual rep performance
- **Team Performance** - Compare reps side-by-side
- **Revenue Analytics** - Track team revenue and pipeline

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server and API
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI Framework
- **Redux Toolkit** - State Management
- **React Router** - Navigation
- **Axios** - HTTP Client
- **CSS3** - Professional sales-themed UI

## 📁 Project Structure

```
medicare-crm/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login/Register logic
│   │   ├── clientController.js   # Client CRUD operations
│   │   ├── callLogController.js  # Call logging logic
│   │   └── statsController.js    # Statistics and analytics
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── User.js               # Agent/User model
│   │   ├── Client.js             # Lead/Contact model
│   │   └── CallLog.js            # Call tracking model
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── clients.js            # Client routes
│   │   ├── callLogs.js           # Call log routes
│   │   └── stats.js              # Statistics routes
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/           # Reusable UI components
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── ClientsList.js
    │   │   ├── ClientDetails.js
    │   │   ├── AddClient.js
    │   │   ├── AgentsList.js
    │   │   └── AgentDetails.js
    │   ├── store/                # Redux store
    │   ├── api/                  # API integration
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register    - Register new agent
POST   /api/auth/login       - Agent login
GET    /api/auth/me          - Get current user (Protected)
```

### Clients (`/api/clients`)
```
GET    /api/clients                - Get all clients for agent
GET    /api/clients/:id            - Get single client
POST   /api/clients                - Create new client
PUT    /api/clients/:id            - Update client
DELETE /api/clients/:id            - Delete client
GET    /api/clients/search/:query  - Search clients
```

### Call Logs (`/api/calllogs`)
```
GET    /api/calllogs                   - Get all call logs for agent
GET    /api/calllogs/:id               - Get single call log
GET    /api/calllogs/client/:clientId  - Get all calls for a client
POST   /api/calllogs                   - Create new call log
PUT    /api/calllogs/:id               - Update call log
DELETE /api/calllogs/:id               - Delete call log
```

### Statistics (`/api/stats`)
```
GET    /api/stats/dashboard      - Get agent dashboard stats
GET    /api/stats/agents         - Get all agents with stats
GET    /api/stats/agents/:id     - Get specific agent stats
```

## 🗄 Database Models

### User (Agent) Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (agent/admin),
  phone: String,
  department: String,
  hireDate: Date,
  isActive: Boolean
}
```

### Client (Lead/Contact) Model
```javascript
{
  agent: ObjectId (ref: User),

  // Contact Info
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  jobTitle: String,

  // Company Info
  company: String (required),
  industry: String (Technology/Healthcare/Finance/etc.),
  companySize: String (1-10/11-50/51-200/etc.),
  website: String,
  address: {
    street, city, state, zipCode, country
  },

  // Sales Pipeline
  opportunityStage: String (lead/qualified/proposal/negotiation/closed-won/closed-lost),
  dealValue: Number,
  probability: Number (0-100),
  expectedCloseDate: Date,
  closedDate: Date,

  // Additional
  leadSource: String (Website/Referral/Cold Call/etc.),
  preferredContactMethod: String (Email/Phone/In-Person/Video Call),
  notes: String,
  lastContactDate: Date,
  nextFollowUpDate: Date
}
```

### CallLog Model
```javascript
{
  agent: ObjectId (ref: User),
  client: ObjectId (ref: Client),
  callType: String (outbound/inbound/follow-up/demo/proposal/negotiation/closing),
  subject: String,
  outcome: String (qualified/proposal-sent/negotiation/closed-won/closed-lost/no-answer/voicemail/not-interested),
  duration: Number (minutes),
  status: String (open/in-progress/closed),
  notes: String,
  
  // Deal Info (when closed)
  dealInfo: {
    dealValue: Number,
    contractTerm: String,
    startDate: Date,
    renewalDate: Date
  },
  
  followUpRequired: Boolean,
  followUpDate: Date,
  callDate: Date,
  closedDate: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (already configured)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd C:\Users\omars\OneDrive\Desktop\medicare-crm
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # .env is already configured
   npm start
   ```
   Backend runs on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Install additional dependencies
   npm install @reduxjs/toolkit react-redux react-router-dom axios
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### First-Time Setup

1. **Register as an agent**
   - Go to `http://localhost:3000/register`
   - Fill in your details
   - Login

2. **Add your first lead**
   - Click "Add Lead"
   - Fill in contact and company information
   - Set deal value and opportunity stage
   - Save

3. **Log an interaction**
   - Go to lead details
   - Click "Add Call Log"
   - Fill in interaction details (call type, outcome, notes)
   - The lead's stage will update automatically based on outcome

## 💼 Interview Talking Points

### Architecture
"I built a three-tier architecture with Express.js backend, MongoDB database, and React frontend. The backend uses JWT for stateless authentication, allowing horizontal scaling."

### Database Design
"I designed three main models with relationships: Users (agents), Clients, and CallLogs. Each client belongs to an agent, and call logs reference both. I used Mongoose for schema validation and relationship management."

### State Management
"I implemented Redux Toolkit for centralized state management, with separate slices for authentication, clients, call logs, and statistics. This makes the state predictable and easy to debug."

### Security
"Security was paramount given we're handling PII like SSNs and Medicare numbers. I implemented:
- JWT token-based authentication
- Bcrypt password hashing with salt rounds
- Protected API routes with middleware
- Input validation on both client and server
- CORS configuration"

### Features
"The application handles the complete lifecycle of a Medicare client:
1. Lead generation and intake
2. Call tracking and notes
3. Status progression (lead → contacted → interested → enrolled)
4. Performance analytics and conversion tracking
5. Agent productivity metrics"

### Scalability
"The application is designed to scale:
- Stateless JWT authentication allows horizontal scaling
- MongoDB can be sharded for larger datasets
- Frontend is optimized for performance with code splitting
- API follows RESTful principles"

## 📊 Key Statistics Tracked

- Total clients per agent
- Conversion rate (enrolled / total)
- Calls per month
- Average call duration
- Clients by status distribution
- Team-wide performance metrics

## 🎨 UI/UX Features

- Professional healthcare color scheme (blues and greens)
- Responsive design for all devices
- Intuitive navigation
- Real-time feedback
- Loading states
- Error handling with user-friendly messages
- Accessible forms with validation

## 🔮 Future Enhancements

- Real-time notifications (Socket.io)
- Email integration for client communication
- Document upload (plan comparisons, applications)
- Advanced reporting with charts
- Call scheduling and reminders
- SMS integration
- Team chat for agent collaboration
- Admin panel for user management

## 📝 License

MIT License - Free to use for portfolio and learning

## 👨‍💻 Author

**Omar Shahwan**
- Built as a portfolio project demonstrating full-stack development skills
- Showcases MERN stack, authentication, complex state management, and real-world business logic

---

**This project demonstrates:**
✅ Full-stack JavaScript development
✅ RESTful API design
✅ Database modeling and relationships
✅ Authentication and authorization
✅ State management
✅ Responsive UI design
✅ Real-world business logic
✅ Production-ready code structure
