# ProjectForge - IT Project Management Platform

A comprehensive IT project management web application designed for portfolio-level control, operational tracking (including materials and POs), and intelligent reminders/alerts.

## Features

### 1. Users, Roles & Security
- **User Management**: Create/edit users, manage status (active/locked), departments, and vendor/customer flags
- **Role-Based Access Control**: Support for Admin, PM, PMO, Finance, Procurement, Site Engineer, Vendor, and Customer roles
- **Permission Matrix**: Granular permissions per role for projects, financials, materials, reports, and admin settings
- **Audit Trail**: Complete login history, activity tracking, and change audit logs
- **SSO Ready**: Prepared for Azure AD/Google integration

### 2. Portfolio & Project Dashboard
- **Portfolio Home**: View all projects with RAG status, % complete, SPI/CPI metrics, budget vs actual, and key risks
- **Advanced Filtering**: Filter by region, customer, PM, project type, and stage
- **Project Dashboard**: High-level timeline with phases and milestones
- **KPI Widgets**: Cards for upcoming milestones, delayed tasks, POs at risk, and more
- **Drill-Down Navigation**: From portfolio to project to work package to task

### 3. Project Structure & Task Management
- **WBS Setup**: Define phases, deliverables, milestones with baseline dates and budgets
- **Task Management**: Task lists with status, assignee, dependencies, effort, and tags
- **Kanban Board**: Visual workflow with Backlog, In Progress, Blocked, and Done columns
- **Risk Register**: Track probability, impact, mitigation, and contingency plans
- **Issue Log**: SLA tracking, escalation paths, and resolution tracking
- **Change Requests**: Scope impact assessment with approval workflows

### 4. Milestones, Deliverables & Reminders
- **Milestone Tracking**: Contractual, internal, and payment milestones with acceptance criteria
- **Deliverable Management**: Track submissions, reviews, and acceptance status
- **Notification Engine**: Automatic reminders for:
  - Upcoming and overdue milestones
  - Deliverables due to customers
  - POs nearing delivery dates
  - Invoices approaching due date
- **Configurable Rules**: Custom reminder rules with escalation paths
- **Calendar View**: Visual calendar of all key dates
- **Integration Ready**: Prepared for Outlook/Google Calendar and Teams/Slack

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Login
The application includes demo authentication. Use any email to log in (password: any).

Default demo user:
- Email: admin@projectforge.io
- Password: demo123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Modal, DataTable, etc.)
│   └── notifications/  # Notification components
├── layouts/            # Page layouts
├── pages/              # Page components organized by feature
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Portfolio & Project dashboards
│   ├── users/         # User management
│   ├── projects/      # Project setup, tasks, kanban
│   ├── risks/         # Risks, issues, change requests
│   ├── milestones/    # Milestones, deliverables, calendar
│   ├── notifications/ # Notifications & reminder rules
│   └── settings/      # Application settings
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Screens

| Screen | Description |
|--------|-------------|
| Portfolio Dashboard | Overview of all projects with KPIs and quick filters |
| Project Dashboard | Detailed project view with timeline, budget, and team |
| User Management | Create and manage users with role assignments |
| Roles & Permissions | Configure role-based access control |
| Audit Log | View system activity and changes |
| Tasks | List view with filtering and task details |
| Kanban Board | Visual task management with drag-and-drop |
| Risk Register | Track and mitigate project risks |
| Issue Log | Manage issues with SLA tracking |
| Change Requests | Handle scope changes with approvals |
| Milestones | Track project milestones and payments |
| Deliverables | Manage project deliverables |
| Calendar | Visual calendar of key dates |
| Reminder Rules | Configure automatic notifications |
| Settings | User preferences and integrations |

## Author

Created by Khaled Fawzy

## License

MIT License
