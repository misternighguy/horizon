# Horizon Radar Scratchpad

## Background and Motivation

**User Request**: [Slop Guard — Horizon Radar Controlled Rampage]
- **Priority 1**: Reduce lines of code (net negative LOC)
- **Priority 2**: Improve speed & stability  
- **Priority 3**: Preserve UX/behavior

**Mode**: Started in PLANNER, now switching to EXECUTOR for controlled rampage batch execution.

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

## Project Status Board

### Completed Tasks
- [x] **PLANNER**: Analyzed entire codebase
- [x] **PLANNER**: Created slop-ledger.md with comprehensive analysis
- [x] **PLANNER**: Created rampage-report.md with execution plan
- [x] **PLANNER**: Created scratchpad.md for progress tracking

### Current Task
- [ ] **EXECUTOR**: Begin Fix 1 - Remove Unused Components & Files

### Pending Tasks
- [ ] **EXECUTOR**: Fix 2 - Consolidate Duplicate Icons
- [ ] **EXECUTOR**: Fix 3 - Merge Similar Card Components
- [ ] **EXECUTOR**: Fix 4 - Remove Inline Styles in Favor of Tokens
- [ ] **EXECUTOR**: Fix 5 - Simplify Type Assertions
- [ ] **EXECUTOR**: Fix 6 - Optimize Mock Data Loading
- [ ] **EXECUTOR**: Fix 7 - Consolidate Button Patterns
- [ ] **EXECUTOR**: Fix 8 - Clean Up Constants Usage

## Current Status / Progress Tracking

**Status**: Switching from PLANNER to EXECUTOR mode
**Current Phase**: Phase 1 - Quick Wins
**Next Action**: Execute Fix 1 - Remove Unused Components & Files
**Target LOC Reduction**: -50 to -100 lines for Fix 1

## Executor's Feedback or Assistance Requests

**Ready to Execute**: All planning complete, switching to execution mode.
**No Blockers**: Clear plan with rollback steps for each fix.
**Execution Strategy**: Sequential fixes with full testing between each step.

## Lessons

- **Code Analysis**: Found significant duplication opportunities (400-500 LOC reduction potential)
- **Planning**: Breaking fixes into small, testable chunks with clear rollback paths
- **Documentation**: Creating comprehensive tracking documents for accountability
