# Horizon Radar Scratchpad

## Background and Motivation

**User Request**: [Slop Guard — Horizon Radar Controlled Rampage]
- **Priority 1**: Reduce lines of code (net negative LOC)
- **Priority 2**: Improve speed & stability  
- **Priority 3**: Preserve UX/behavior

**Mode**: Started in PLANNER, now switching to EXECUTOR for controlled rampage batch execution.

**New Request**: Implement banner system with 3:1 ratio (1500x500) for all article pages and project cards, update glow article with GlowBanner.png

## Key Challenges and Analysis

### Code Duplication Issues
- Massive duplication between ProductCard.tsx (107 lines) and ProtocolCard.tsx (14 lines)
- Inline SVG icons scattered across multiple components
- Similar button patterns repeated across components
- Unused components and files taking up space

### Performance Bottlenecks
- localStorageDB.ts: 979 lines with heavy mock data initialization
- Header.tsx: 584 lines with complex search logic
- Inline styles causing unnecessary re-renders
- Complex type assertions slowing development

### Type Safety Concerns
- Unsafe window type assertions in multiple components
- Complex type casting that could be simplified
- Some any types in utility functions

### Banner System Requirements
- All banners must maintain 3:1 horizontal ratio (1500x500)
- Update article hero sections to use proper banner dimensions
- Update ProductCard components to use proper banner dimensions
- Move GlowBanner.png from Downloads to public/images folder
- Update glow article to use the new banner

## High-level Task Breakdown

### Phase 1: Quick Wins (Fixes 1-3)
1. **Remove Unused Components** - Delete unused files for immediate LOC reduction
2. **Consolidate Icons** - Create shared icon system to eliminate duplication
3. **Merge Card Components** - Unify ProductCard and ProtocolCard into single component

### Phase 2: Style & Type Cleanup (Fixes 4-5)
4. **Remove Inline Styles** - Replace with CSS tokens and utilities
5. **Simplify Type Assertions** - Clean up unsafe type casting

### Phase 3: Data & Pattern Optimization (Fixes 6-8)
6. **Optimize Mock Data** - Lazy load and reduce mock data size
7. **Consolidate Button Patterns** - Unify button implementations
8. **Clean Up Constants** - Ensure consistent usage of UI constants

### Phase 4: Banner System Implementation (NEW)
9. **Implement Banner System** - Create consistent 3:1 ratio banners across all components
   - Move GlowBanner.png to public/images folder
   - Update article hero sections to use proper banner dimensions
   - Update ProductCard components to use proper banner dimensions
   - Ensure all banners maintain 3:1 ratio (1500x500)

## Project Status Board

### Completed Tasks
- [x] **PLANNER**: Analyzed entire codebase
- [x] **PLANNER**: Created slop-ledger.md with comprehensive analysis
- [x] **PLANNER**: Created rampage-report.md with execution plan
- [x] **PLANNER**: Created scratchpad.md for progress tracking

### Current Task
- [ ] **EXECUTOR**: Implement Banner System with 3:1 ratio

### Pending Tasks
- [ ] **EXECUTOR**: Fix 1 - Remove Unused Components & Files
- [ ] **EXECUTOR**: Fix 2 - Consolidate Duplicate Icons
- [ ] **EXECUTOR**: Fix 3 - Merge Similar Card Components
- [ ] **EXECUTOR**: Fix 4 - Remove Inline Styles in Favor of Tokens
- [ ] **EXECUTOR**: Fix 5 - Simplify Type Assertions
- [ ] **EXECUTOR**: Fix 6 - Optimize Mock Data Loading
- [ ] **EXECUTOR**: Fix 7 - Consolidate Button Patterns
- [ ] **EXECUTOR**: Fix 8 - Clean Up Constants Usage

## Current Status / Progress Tracking

**Status**: Switching to EXECUTOR mode for Banner System implementation
**Current Phase**: Phase 4 - Banner System Implementation
**Next Action**: Execute Banner System implementation
**Target**: Consistent 3:1 ratio banners across all components

## Executor's Feedback or Assistance Requests

**Ready to Execute**: Banner system implementation plan ready.
**No Blockers**: Clear requirements for 3:1 ratio implementation.
**Execution Strategy**: Implement banner system before continuing with slop guard fixes.

## Lessons

- **Code Analysis**: Found significant duplication opportunities (400-500 LOC reduction potential)
- **Planning**: Breaking fixes into small, testable chunks with clear rollback paths
- **Documentation**: Creating comprehensive tracking documents for accountability
- **Banner System**: All banners must maintain 3:1 horizontal ratio (1500x500) for consistency
