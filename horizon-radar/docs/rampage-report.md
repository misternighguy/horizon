# Horizon Radar Rampage Report

## Baseline Metrics (Before Changes)

### Git Status
- **Baseline**: `git diff --shortstat` - No changes (clean working tree)
- **Current Branch**: main
- **Last Commit**: Clean state

### Build Status
- **TypeScript**: TBD
- **ESLint**: TBD  
- **Tests**: TBD
- **Build**: TBD

### Current LOC Count
- **Total Files**: TBD
- **Main Components**: 
  - Header.tsx: 584 lines
  - ProductCard.tsx: 107 lines
  - ProtocolCard.tsx: 14 lines
  - localStorageDB.ts: 979 lines
  - NewsletterCardPopOut.tsx: 195 lines
  - Toast.tsx: 100 lines

## Prioritized Batch Plan

### Fix 1: Remove Unused Components & Files
- **Files**: Remove CopyByLevel.tsx, ResearchColumn.tsx, Pill.tsx, Input.tsx, test/ directory
- **Expected LOC Delta**: -50 to -100 lines
- **Behavior Preserved**: None (unused files)
- **Speed Impact**: Reduced bundle size, faster builds
- **Test Notes**: No tests needed (unused code)
- **Rollback**: `git checkout HEAD -- src/components/CopyByLevel.tsx src/components/ResearchColumn.tsx src/components/Pill.tsx src/components/ui/Input.tsx src/test/`

### Fix 2: Consolidate Duplicate Icons
- **Files**: Create shared icons file, update Header.tsx, ActionButtons.tsx, ProductCard.tsx
- **Expected LOC Delta**: -30 to -50 lines
- **Behavior Preserved**: All icon functionality identical
- **Speed Impact**: Reduced component size, better caching
- **Test Notes**: Verify icons still render correctly
- **Rollback**: `git checkout HEAD -- src/components/Header.tsx src/components/landing/ActionButtons.tsx src/components/ProductCard.tsx`

### Fix 3: Merge Similar Card Components
- **Files**: Consolidate ProductCard.tsx and ProtocolCard.tsx into unified component
- **Expected LOC Delta**: -60 to -80 lines
- **Behavior Preserved**: All card functionality, styling, and interactions
- **Speed Impact**: Single component to load, reduced duplication
- **Test Notes**: Verify all card types render correctly
- **Rollback**: `git checkout HEAD -- src/components/ProductCard.tsx src/components/ProtocolCard.tsx`

### Fix 4: Remove Inline Styles in Favor of Tokens
- **Files**: ProductCard.tsx, Header.tsx, NewsletterCardPopOut.tsx
- **Expected LOC Delta**: -20 to -30 lines
- **Behavior Preserved**: All visual styling identical
- **Speed Impact**: Better CSS optimization, reduced JS execution
- **Test Notes**: Verify visual appearance unchanged
- **Rollback**: `git checkout HEAD -- src/components/ProductCard.tsx src/components/Header.tsx src/components/NewsletterCardPopOut.tsx`

### Fix 5: Simplify Type Assertions
- **Files**: Header.tsx, Toast.tsx, DatabaseInitializer.tsx
- **Expected LOC Delta**: -15 to -25 lines
- **Behavior Preserved**: All functionality identical
- **Speed Impact**: Cleaner types, better IntelliSense
- **Test Notes**: Verify type checking still works
- **Rollback**: `git checkout HEAD -- src/components/Header.tsx src/components/Toast.tsx src/components/DatabaseInitializer.tsx`

### Fix 6: Optimize Mock Data Loading
- **Files**: localStorageDB.ts, mock.ts
- **Expected LOC Delta**: -100 to -150 lines
- **Behavior Preserved**: All data available, same API
- **Speed Impact**: Faster initialization, reduced memory usage
- **Test Notes**: Verify all data still accessible
- **Rollback**: `git checkout HEAD -- src/data/localStorageDB.ts src/data/mock.ts`

### Fix 7: Consolidate Button Patterns
- **Files**: Header.tsx, ActionButtons.tsx, ProductCard.tsx
- **Expected LOC Delta**: -25 to -40 lines
- **Behavior Preserved**: All button functionality identical
- **Speed Impact**: Reduced component complexity
- **Test Notes**: Verify all buttons work correctly
- **Rollback**: `git checkout HEAD -- src/components/Header.tsx src/components/landing/ActionButtons.tsx src/components/ProductCard.tsx`

### Fix 8: Clean Up Constants Usage
- **Files**: UI_CONSTANTS.ts, ProductCard.tsx, Header.tsx
- **Expected LOC Delta**: -10 to -20 lines
- **Behavior Preserved**: All functionality identical
- **Speed Impact**: Better constant optimization
- **Test Notes**: Verify constants still work
- **Rollback**: `git checkout HEAD -- src/constants/ui.ts src/components/ProductCard.tsx src/components/Header.tsx`

## Execution Progress

*[To be filled during execution]*

## Final Results

*[To be filled after completion]*

## Self-Evaluation Rubric

*[To be filled after each fix and at end]*
