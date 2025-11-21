# PT. Smart CRM - Frontend

Frontend application for PT. Smart CRM system built with React, TypeScript, and Vite.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:4000/api
```

For production, set:
```
VITE_API_URL=https://jaya-crm-be.vercel.app/api
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Authentication
- User login with email and password
- JWT token-based authentication
- Auto token refresh
- Protected routes
- Role-based access control (Sales and Manager)

### Dashboard
- Real-time statistics overview
- Total leads, deals, customers, and revenue
- Pending approvals (Manager only)
- Recent activity feed
- Deal status breakdown

### Leads Management
- Create, read, update, and delete leads
- Lead status tracking (NEW, CONTACTED, QUALIFIED, CONVERTED, LOST)
- Lead source tracking
- Search and filter functionality
- Pagination support

### Products Management
- Product catalog management
- Create, update, and deactivate products
- HPP and margin calculation
- Automatic selling price calculation
- Role-based access (Manager only for create/update/delete)

### Deal Pipeline
- Kanban-style deal board
- Create deals from qualified leads
- Deal status workflow (DRAFT, WAITING_APPROVAL, APPROVED, REJECTED)
- Submit deal for approval
- Manager approval/rejection with optional notes
- Activate services from approved deals
- Price negotiation tracking

### Active Customers
- View all active customers
- Customer service details
- Search and filter customers
- Pagination support
- Role-based data access

### Reports
- Sales report generation
- Date range filtering (optional, shows all data by default)
- Summary statistics (leads, deals, revenue, conversion rate)
- Top products analysis
- Excel export functionality

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- TanStack Query (React Query)
- Axios
- Zustand
- React Hook Form
- Zod
- Shadcn/ui
- Tailwind CSS
- React Hot Toast

## Project Structure

```
fe/
├── src/
│   ├── api/          # API configuration and endpoints
│   ├── components/    # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── services/     # API service layer
│   ├── store/        # Zustand state management
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
└── package.json      # Dependencies and scripts
```

## Default Credentials

For testing purposes, use the following credentials:

**Manager:**
- Email: manager@ptsmart.com
- Password: manager123

**Sales:**
- Email: sales@ptsmart.com
- Password: sales123

Note: These are default credentials from the seeder. Change them in production.

