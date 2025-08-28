# Horizon Radar Scratchpad

## EXECUTOR GUIDELINES - CRITICAL

### AI Slop Prevention Rules
**BEFORE starting any phase, the executor MUST:**
1. **Rethink the proposed steps** - Are they well thought out and won't create AI slop?
2. **Question over-engineering** - Is this the simplest approach that achieves the goal?
3. **Avoid analysis paralysis** - If a task seems too complex, simplify it or skip it
4. **Focus on high-impact changes** - Prioritize LOC reduction over perfect abstractions
5. **Test incrementally** - Make small changes and verify they work before proceeding
6. **Question every abstraction** - Do we really need this new component/utility/pattern?

### Git Permission Rules
**CRITICAL: NEVER commit or push changes without explicit permission**
1. **No automatic commits** - All changes must be manually reviewed
2. **Ask for permission** - Request explicit approval before any git operations
3. **Document changes** - Update scratchpad with what was changed, not what will be changed
4. **Wait for confirmation** - Don't proceed to next phase without user approval

## Current Status

**Status**: EXECUTOR mode - Ready for Operation Go Live
**Current Phase**: Deployment preparation
**Next Action**: Fix build errors and deploy to Vercel

## Operation Go Live

### Phase 1: Fix Build Errors (CRITICAL)
**Plan**: Fix ESLint errors preventing Vercel deployment
- **Target**: Unescaped entities and any types
- **Approach**:
  1. Fix unescaped quotes in profile page (lines 369, 709)
  2. Fix unescaped quotes in admin page (lines 1285, 1294, 1336)
  3. Fix unescaped quotes in about page (line 544)
  4. Fix unescaped quotes in terms page (line 23)
  5. Replace `any` types with proper interfaces
- **Success Criteria**: Build passes without errors
- **Files**: profile/page.tsx, admin/page.tsx, about/page.tsx, terms/page.tsx

### Phase 2: Deploy to Vercel
**Plan**: Deploy website to production
- **Target**: Live website on custom domain
- **Approach**:
  1. Connect GitHub repo to Vercel
  2. Set root directory to "horizon-radar"
  3. Set framework preset to "Next.js"
  4. Deploy without environment variables (not needed)
  5. Add custom domain in Vercel settings
- **Success Criteria**: Website accessible at custom domain
- **Files**: Vercel configuration

### Phase 3: Database Setup (Optional)
**Plan**: Set up production database on droplet
- **Target**: PostgreSQL database for production data
- **Approach**:
  1. Install PostgreSQL on droplet
  2. Create database and user
  3. Update Next.js app to use database
  4. Add environment variables to Vercel
- **Success Criteria**: Production data stored in database
- **Files**: Database schema, environment variables

## Project Status Board

### Completed Tasks
- [x] **PLANNER**: Analyzed previous failures and root causes
- [x] **PLANNER**: Created new step-by-step implementation plan
- [x] **EXECUTOR**: Phase 1 - Remove Unused Components (150 LOC reduction)
- [x] **EXECUTOR**: Phase 2 - Fix Profile Icon Popup (UI working)
- [x] **EXECUTOR**: Phase 3 - Merge Card Components (backend only)

### Current Task
- [ ] **EXECUTOR**: Operation Go Live - Fix Build Errors

### Pending Tasks
- [ ] **EXECUTOR**: Operation Go Live - Deploy to Vercel
- [ ] **EXECUTOR**: Operation Go Live - Database Setup (optional)

## Lessons

- **Code Analysis**: Found significant duplication opportunities (400-500 LOC reduction potential)
- **Planning**: Breaking fixes into small, testable chunks with clear rollback paths
- **Icon Consolidation**: Analysis paralysis - Icons.tsx already well-organized, inline SVGs are mostly unique use cases
- **Banner System**: All banners must maintain 3:1 horizontal ratio (1500x500) for consistency
