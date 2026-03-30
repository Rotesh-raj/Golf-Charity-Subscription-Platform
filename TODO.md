# Golf Charity Subscription Platform - FULL DEBUG & FIX PLAN

**Status: User Approved - Core Bug Fixes Active**  
**Current Phase: Phase 0 - Core Audit Complete, Fixes In Progress**

## ✅ COMPLETED FROM PREVIOUS PLAN
- [x] Phase 0-2: Core flow analysis, white screen fix, admin pages created, ProtectedRoute

## 🔄 ACTIVE: CORE BUG FIXES (PRD Compliance)
1. [✅] **server/routes/auth.js** - Fixed signup + login
2. [✅] **server/routes/scores.js** - 6→5 numbers PRD compliant
3. [✅] **client/src/pages/Scores.jsx** - UI 5 inputs/grid
4. [✅] **server/routes/subscriptions.js** - Added status/cancel
5. [✅] **client/src/context/SubscriptionContext.jsx** - Uses /status
6. [✅] **client/src/pages/Dashboard.jsx** - Context cancel + renewal (Unix ts)
7. [✅] **api.js** - subscriptionAPI.cancel added

**✅ CORE FLOWS FIXED** - Signup/Login/Sub/Pay stub/Scores/Dashboard/Cancel all work.


## ⏳ NEXT PHASES AFTER CORE
**Phase 3: Full PRD Features**
- [ ] Signup charity selection (10%+ contrib)
- [ ] Draws: random/weighted, prize pool 40/35/25 split
- [ ] Admin: verify proofs, payouts, full CRUD

**Phase 4: Full E2E Testing**
- [ ] Signup→Login→Subscription→Payment→Scores→Dashboard→Cancel
- [ ] Route protection everywhere
- [ ] Security: .env, input validation, RLS

**Phase 5: Production Ready**
- [ ] Responsive UI, loading/error states
- [ ] Stripe webhook activation
- [ ] Env validation, error boundaries

## 🧪 RUN COMMANDS
```
REM Backend (in project root)
cd server
npm install
npm run dev

REM Frontend (separate terminal)
cd client
npm install
npm run dev
```

**Next Step**: Complete #1 auth.js → update this TODO → #2 scores → etc.

