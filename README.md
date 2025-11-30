# Sales CRM - Lead Management & Deal Tracking System

A professional, full-stack Customer Relationship Management system built for sales teams to manage leads, track opportunities, and close deals efficiently.

## Project Overview

**Resume Description:**
Full Stack Sales CRM built with JavaScript, Express.js, Node.js, MongoDB, and React. Features JWT authentication, Redux state management, comprehensive lead tracking, sales pipeline management, deal value tracking, and sales performance analytics.

## Features

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

## Tech Stack

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

## Project Structure

```
sales-crm/
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

## API Endpoints

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

## Database Models

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

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (MongoDB Atlas account or local MongoDB instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OmarShahwanGitHub/sales-crm.git
   cd sales-crm
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

**You need TWO terminal windows open:**

#### Terminal 1: Start Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
MongoDB Connected Successfully
Server running on port 5000
```

Backend API will be available at `http://localhost:5000`

#### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view sales-crm-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The app will automatically open in your browser at `http://localhost:3000`

### First-Time Setup

1. **Register as a Sales Rep**
   - Go to `http://localhost:3000/register`
   - Fill in your details (Name, Email, Phone, Password)
   - Click Register
   - You'll be automatically logged in and redirected to the Dashboard

2. **Add Your First Lead**
   - Click "Add Lead" in the navbar or dashboard
   - Fill in contact information (Name, Email, Phone, Job Title)
   - Add company information (Company Name, Industry, Size, Website)
   - Set sales pipeline info (Deal Value, Opportunity Stage, Lead Source)
   - Click "Add Lead"

3. **Log an Interaction**
   - Go to lead details page
   - Click "Add Call Log"
   - Fill in interaction details:
     - Call Type (Outbound, Inbound, Demo, Proposal, etc.)
     - Outcome (Qualified, Proposal Sent, Closed Won, etc.)
     - Duration and Notes
   - The lead's opportunity stage will update automatically based on the outcome

## Technical Architecture

### System Architecture
The application follows a three-tier architecture pattern:
- **Presentation Layer**: React frontend with Redux Toolkit for state management
- **Application Layer**: Express.js RESTful API with JWT authentication
- **Data Layer**: MongoDB database with Mongoose ODM

The backend uses stateless JWT authentication, enabling horizontal scaling and improved performance.

### Database Design
The database schema consists of three interconnected models:
- **User Model**: Represents sales representatives with authentication and profile information
- **Client Model**: Stores lead/contact information with company details and sales pipeline data
- **CallLog Model**: Tracks all interactions between reps and leads

Relationships are managed through Mongoose references, ensuring data integrity and enabling efficient queries. Schema validation is enforced at the database level.

### State Management
The frontend uses Redux Toolkit for centralized state management with dedicated slices:
- Authentication state (user, token, login status)
- Clients/Leads state (CRUD operations, search)
- Call logs state (interaction history)
- Statistics state (dashboard metrics, analytics)

This architecture provides predictable state updates and simplifies debugging.

### Security Implementation
Security measures implemented throughout the application:
- JWT token-based authentication with secure token storage
- Bcrypt password hashing with salt rounds
- Protected API routes using middleware authentication
- Input validation on both client and server sides
- CORS configuration for secure cross-origin requests
- Error handling to prevent information leakage

### Business Logic
The application manages the complete sales lifecycle:
1. **Lead Generation**: Capture and store new leads with company information
2. **Interaction Tracking**: Log all calls and interactions with detailed notes
3. **Pipeline Management**: Track opportunity progression through stages (lead → qualified → proposal → negotiation → closed won/lost)
4. **Analytics**: Real-time performance metrics including conversion rates and revenue tracking
5. **Pipeline Analysis**: Calculate pipeline value and probability-weighted forecasts

### Scalability Considerations
The application is designed with scalability in mind:
- Stateless authentication enables horizontal server scaling
- MongoDB supports sharding for large datasets
- Frontend code splitting for optimized load times
- RESTful API design following industry standards
- Efficient database indexing for fast queries

## Key Statistics Tracked

- Total leads per sales rep
- Conversion rate (closed won / total)
- Revenue generated
- Pipeline value
- Calls per month
- Average call duration
- Leads by opportunity stage distribution
- Team-wide performance metrics

## UI/UX Features

- Professional sales-themed color scheme
- Responsive design for all devices
- Intuitive navigation
- Real-time feedback
- Loading states
- Error handling with user-friendly messages
- Accessible forms with validation

## Future Enhancements

- Real-time notifications (Socket.io)
- Email integration for lead communication
- Document upload (proposals, contracts)
- Advanced reporting with charts
- Call scheduling and reminders
- SMS integration
- Team chat for sales rep collaboration
- Admin panel for user management

## License

MIT License - Free to use for portfolio and learning

## Author

**Omar Shahwan**
- Built as a portfolio project demonstrating full-stack development skills
- Showcases MERN stack, authentication, complex state management, and real-world business logic

---

**This project demonstrates:**
- Full-stack JavaScript development
- RESTful API design
- Database modeling and relationships
- Authentication and authorization
- State management
- Responsive UI design
- Real-world business logic
- Production-ready code structure
