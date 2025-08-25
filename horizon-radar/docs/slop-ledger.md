# Horizon Radar Slop Ledger

## Dupes & Duplication

### Components/Styles/Icons
- **Inline SVG Icons**: Multiple components have inline SVG definitions that could be consolidated
  - `Header.tsx`: IconSearch, IconMenu, IconClose, IconProfile (lines 580-584)
  - `ActionButtons.tsx`: IconInfo, IconGrid (lines 52-53)
  - `ProductCard.tsx`: Copy icon SVG (lines 58-65)
- **Near-identical Cards**: `ProductCard.tsx` (107 lines) vs `ProtocolCard.tsx` (14 lines) - massive duplication
- **Button Patterns**: Multiple similar button implementations across components

### Unused Files/Exports
- `src/components/CopyByLevel.tsx` - imported but never used
- `src/components/ResearchColumn.tsx` - imported but never used
- `src/components/Pill.tsx` - imported but never used
- `src/components/ui/Input.tsx` - imported but never used
- `src/test/` directory - appears to be test setup but no actual tests
- `src/assets/` directory - empty or unused

### Inline Styles vs Tokens
- `ProductCard.tsx`: Hardcoded dimensions (w-[600px] h-[480px]) instead of using UI_CONSTANTS
- `Header.tsx`: Inline styles for dropdown positioning instead of CSS classes
- `NewsletterCardPopOut.tsx`: Inline styles for image positioning (lines 120-125)

## Type Risks

### Unsafe Patterns
- `Header.tsx`: `(window as { localStorageDB?: typeof import('@/data/localStorageDB').localStorageDB })` - unsafe type assertion
- `Toast.tsx`: `(window as { showToast?: ... })` - unsafe type assertion
- `DatabaseInitializer.tsx`: Similar unsafe window type assertion
- `localStorageDB.ts`: `any` types in some utility functions

### ESLint Issues
- No blanket disables found, but some complex type assertions could be simplified

## Performance Issues

### Unnecessary Client Code
- `layout.tsx`: `DatabaseInitializer` runs on every page load, could be server-side
- `Header.tsx`: Complex search logic runs on every keystroke with debouncing
- `ProductCard.tsx`: Heavy inline styles and complex CSS calculations

### Heavy Components
- `localStorageDB.ts`: 979 lines with massive mock data initialization
- `Header.tsx`: 584 lines with complex search and dropdown logic
- `ProductCard.tsx`: 107 lines with hardcoded dimensions and inline styles

### Bundle Offenders
- Large mock data in `localStorageDB.ts` (could be lazy-loaded)
- Multiple large components loaded synchronously

## A11y Issues

### Missing Labels/Roles
- `ProductCard.tsx`: Missing proper ARIA labels for interactive elements
- `Header.tsx`: Search results could use better screen reader support
- `LevelToggle.tsx`: Good ARIA implementation, no issues found

### Focus Management
- `NewsletterCardPopOut.tsx`: Focus trap could be improved
- `Header.tsx`: Search dropdown focus management

## Test Gaps

### Critical Flows Lacking Tests
- Header search functionality (complex search logic)
- Carousel navigation (keyboard and mouse)
- Modal/dialog interactions (newsletter, toast)
- Level toggle functionality
- Database operations

### Test Coverage
- Only basic test setup exists (`vitest.config.ts`, `test/setup.ts`)
- No actual test files found
- Critical user flows untested

## Code Quality Issues

### Magic Numbers
- `ProductCard.tsx`: Hardcoded dimensions, margins, padding
- `Header.tsx`: Magic numbers in positioning calculations
- Some constants exist in `UI_CONSTANTS` but not consistently used

### Complex Logic
- `Header.tsx`: Search algorithm with multiple relevance calculations
- `localStorageDB.ts`: Complex date serialization and database operations
- `ProductCard.tsx`: Complex conditional styling logic

## Summary of Opportunities
- **Net LOC Reduction Potential**: ~400-500 lines
- **Major Areas**: Component consolidation, mock data optimization, inline style removal
- **Quick Wins**: Remove unused components, consolidate duplicate icons, simplify type assertions
- **Complex Refactors**: Merge similar card components, optimize search logic, lazy-load mock data
