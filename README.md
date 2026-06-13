# FlowDesk — Personal Productivity Dashboard

A complete, production-quality productivity web app built with **React + Vite + Tailwind CSS**.

> **Copyright © 2026 Ramya Gopalakrishnan. All Rights Reserved.**

---

## Demo Credentials

```
Email:    demo@productivity.app
Password: demo123
```

---

## Getting Started

```bash
# 1. Enter the project folder
cd productivity-dashboard

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

- React 18 + React Router v6
- Tailwind CSS v3 (dark mode)
- Recharts (analytics charts)
- Lucide React (icons)
- Context API + LocalStorage

---

## Features

- Landing page (Hero / Features / Stats / Testimonials / CTA)
- Auth: Login, Register, Forgot Password, Remember Me, session persistence
- Dashboard Overview with stat cards and quick actions
- Task Management — CRUD, priority, category, due date, search/filter
- Goal Tracking — progress bars, target dates, milestones
- Daily Planner — hour blocks, add/delete/complete activities
- Calendar — monthly view, click dates to see events
- Analytics — bar, line, pie charts (Recharts)
- AI Assistant — mock suggestions, interactive chat UI
- Profile & Settings — edit profile, password UI, dark mode toggle, notifications
- Fully responsive: mobile, tablet, desktop
- Dark / Light mode with persistence

---

## Project Structure

```
src/
├── App.jsx                     # Router + providers
├── context/AppContext.jsx      # Unified auth + data state
├── components/layout/          # Sidebar, DashboardLayout, Footer, LandingNav
├── components/ui/              # Modal, ProtectedRoute
└── pages/
    ├── LandingPage.jsx
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── ForgotPasswordPage.jsx
    └── dashboard/
        ├── OverviewPage.jsx
        ├── TasksPage.jsx
        ├── GoalsPage.jsx
        ├── PlannerPage.jsx
        ├── CalendarPage.jsx
        ├── AnalyticsPage.jsx
        ├── AIAssistantPage.jsx
        └── ProfilePage.jsx
```
