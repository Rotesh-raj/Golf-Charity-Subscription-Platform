# Golf Charity Subscription Platform - Code File Index

This file lists **all code files** in the project with their **absolute paths**, **purpose/description** (inferred from name/structure), and **key details**. Use this to quickly identify and share the **exact relevant file(s)** with any AI (e.g., for debugging errors). 

**Project Overview**: Full-stack app with:
- **Client**: React + Vite + Tailwind CSS + Supabase/Auth/Subscription contexts.
- **Server**: Node.js/Express + Supabase + Stripe + Cron jobs + Uploads.

Copy-paste the relevant section/file path when asking an AI to solve issues. Last updated: Auto-generated.

## Client Files (Frontend: d:/PROJECT/Golf Charity Subscription Platform/client/)
| File Path | Description | Key Details |
|-----------|-------------|-------------|
| client/index.html | Main HTML entry point | Vite-served, loads React app. |
| client/package.json | Client dependencies | React, Vite, Tailwind, Axios, React Router, etc. Run `npm install` here. |
| client/vite.config.js | Vite build config | Configures React plugin, proxy to server. |
| client/tailwind.config.js | Tailwind CSS config | Custom themes/colors/fonts for golf/charity UI. |
| client/postcss.config.js | PostCSS config | Tailwind autoprefixer. |
| client/src/index.css | Global styles | Tailwind base + custom resets. |
| client/src/main.jsx | App entry (React root) | Renders App with Router + Contexts (Auth/Subscription). |
| client/src/App.jsx | Main App component | Routes setup + Navbar + Loader. |
| client/src/api/api.js | API client utils | Axios instances for server endpoints (auth, subs, etc.). |
| **client/src/components/** | Reusable UI components |
| client/src/components/Navbar.jsx | Top navigation bar | Links to Dashboard, Draws, Scores, etc. Uses AuthContext. |
| client/src/components/ProtectedRoute.jsx | Route guard | Checks auth for user routes. |
| client/src/components/AdminRoute.jsx | Admin-only route guard | Checks admin role. |
| client/src/components/Loader.jsx | Loading spinner | Used during API calls. |
| **client/src/context/** | React Contexts |
| client/src/context/AuthContext.jsx | User auth state | Login/signup/logout + Supabase integration. |
| client/src/context/SubscriptionContext.jsx | Subscription state | Handles sub status, Stripe integration. |
| **client/src/pages/** | Main pages/routes |
| client/src/pages/Landing.jsx | Homepage/landing | Public marketing page for golf charity subs. |
| client/src/pages/Login.jsx | Login form | Auth form + error handling. |
| client/src/pages/Signup.jsx | Signup form | Registration with Supabase. |
| client/src/pages/Dashboard.jsx | User dashboard | Overview of subs, draws, scores. |
| client/src/pages/Subscription.jsx | Subscription page | Stripe checkout for golf charity subs. |
| client/src/pages/Success.jsx | Post-payment success | Confirms sub + redirects. |
| client/src/pages/Draws.jsx | Draws listing | User draws/golf events. |
| client/src/pages/DrawsInfo.jsx | Draw details | Specific draw info. |
| client/src/pages/Scores.jsx | Scores/leaderboard | Golf scores display. |
| client/src/pages/Charities.jsx | Charities list | Info on supported charities. |
| client/src/pages/Winners.jsx | Winners page | Past draw winners. |
| **client/src/pages/admin/** | Admin panels |
| client/src/pages/AdminDashboard.jsx | Admin overview | Stats + quick links. |
| client/src/pages/admin/ManageUsers.jsx | Manage users | List/edit users (roles). |
| client/src/pages/admin/ManageDraws.jsx | Manage draws | CRUD for draws/events. |
| client/src/pages/admin/ManageCharities.jsx | Manage charities | CRUD for charities. |
| client/src/pages/admin/ManageWinners.jsx | Manage winners | CRUD for winners/proofs. |
| client/src/pages/admin/users.jsx | Admin users list | Table view of users. |
| **client/src/pages/user/** | User sub-pages |
| client/src/pages/user/profile.jsx | User profile | Edit profile + sub info. |
| client/src/utils/client.js | Supabase client | Client-side Supabase init. |
| **client/src/utils/superbase/** | (Empty dir or more Supabase utils) | Supabase helpers. |
| client/src/TODO.md | Client TODOs | Pending frontend tasks. |
| client/src/pages/TODO.md | Pages-specific TODOs | Route-specific todos. |

## Server Files (Backend: d:/PROJECT/Golf Charity Subscription Platform/server/)
| File Path | Description | Key Details |
|-----------|-------------|-------------|
| server/package.json | Server dependencies | Express, Supabase, Stripe, Multer (uploads), Nodemailer?, Cron. Run `npm install`. |
| server/index.js | Server entry | Starts Express app on port (e.g., 5000). |
| server/app.js | Main Express app | Middleware + Routes mounting (auth, admin, etc.). |
| **server/config/** | Configs |
| server/config/database.js | Supabase/Postgres config | DB URL, keys for Supabase. |
| server/config/stripe.js | Stripe config | API keys/webhook secrets. |
| **server/middleware/** | Middleware |
| server/middleware/auth.js | Auth middleware | JWT/Supabase token verification. |
| **server/routes/** | API routes |
| server/routes/auth.js | Auth endpoints | /login, /signup, /logout. |
| server/routes/users.js | User CRUD | Profiles, etc. |
| server/routes/subscriptions.js | Subscription endpoints | Stripe create/checkout/webhook. |
| server/routes/draws.js | Draws endpoints | List/create draws. |
| server/routes/scores.js | Scores endpoints | Golf scores CRUD. |
| server/routes/charities.js | Charities endpoints | List charities. |
| server/routes/admin.js | Admin endpoints | Protected admin actions. |
| server/routes/webhook.js | Stripe webhook | Handles payment events. |
| server/routes/winners.js | Winners endpoints | Winners + proof uploads. |
| **server/services/** | Business logic |
| server/services/paymentService.js | Stripe payments | Create sessions, handle webhooks. |
| server/services/drawService.js | Draw logic | Random winners, cron triggers? |
| **server/cron/** | Scheduled jobs |
| server/cron/drawCron.js | Cron for draws | Auto-run draws (e.g., node-cron). |
| **server/supabase/** | DB scripts |
| server/supabase/schema.sql | DB schema | Tables: users, draws, subs, scores, charities, winners. |
| server/supabase/seed.sql | Seed data | Initial data inserts. |
| server/uploads/ | File uploads | Multer dir for winner proofs/images. |
| server/uploads/proofs/ | Proof images | Charity proofs/winner docs. |

## Root Files
| File Path | Description |
|-----------|-------------|
| README.md | Project setup/run instructions. |
| TODO.md | Overall project todos. |

## Quick Debug Guide
- **Frontend errors**: Share client/src/... + browser console + network tab.
- **Backend errors**: Share server/... + server logs (npm run dev).
- **DB/Stripe**: Share configs (mask keys) + schema.sql.
- **Run cmds**:
  - Client: `cd client && npm install && npm run dev`
  - Server: `cd server && npm install && npm run dev`
- Total code files: ~50. Search by name/path above.

**To update**: Re-run AI task or manually add new files.

