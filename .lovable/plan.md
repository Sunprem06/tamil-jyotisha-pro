

# Deity Expansion for Tamil Jothidam Pro

## Overview
Add a complete deity and temple system with 9 deities, 20+ temples, Sthala Varalaru (temple histories), universal search, and 3 new UI pages.

## Technical Details

### Step 1 — Database Migration
Create migration with 3 new tables and 1 view:
- **deities** — master deity table (name, tradition, vahana, weapon, mantra, etc.) with `SERIAL` primary key
- **temples** — universal temple table referencing deities, with boolean flags for Arupadai Veedu, Divya Desam, Shakti Peetham, etc.
- **sthala_varalaru** — temple history/legends linked to temples
- **temples_search_view** — combined view joining all three tables for search
- RLS: public SELECT on all three tables (read-only for everyone, no auth required)
- Admin INSERT/UPDATE/DELETE policies for authenticated admins

### Step 2 — Seed Data (via insert tool)
Insert in order:
1. 9 deities (Murugan, Ganesha, Mariamman, Kamakshi, Mahalakshmi, Saraswathi, Ayyanar, Muneeswarar, Karuppasamy)
2. ~24 temples (6 Arupadai Veedu + 4 other Murugan + 7 Amman + 4 Ganesha/Saraswathi + 3 folk deity temples)
3. ~10 Sthala Varalaru entries (6 Murugan + 4 Amman histories)
- Note: `temple_id` references will need to be resolved after temple insertion

### Step 3 — Search Hook
Create `src/hooks/useUniversalTempleSearch.ts`:
- `searchTemples(query)` — searches temples by name, deity, location, blessing, problem with 300ms debounce
- `searchDeities(query)` — searches deities by name and keywords
- Uses `@tanstack/react-query` for caching

### Step 4 — UI Pages

**A. `/deity-search` — UniversalSearchPage.tsx**
- Search bar with Tamil placeholder
- Deity category filter pills (color-coded)
- Results cards: temple name, deity badge, location, auspicious day, expandable Sthala Varalaru, Google Maps link

**B. `/deity/:deityName` — DeityProfilePage.tsx**
- Deity info from deities table (vahana, weapon, consort, mantra, etc.)
- Grid of all temples for this deity
- Each temple card links to detail page

**C. `/temple/:id` — TempleDetailPage.tsx**
- Full temple profile with saffron-themed header
- Special badges (Arupadai Veedu, Shakti Peetham, etc.)
- Practical info (timings, address, fees)
- Sthala Varalaru section (styled prominently)
- Blessing/problem-solved section
- Google Maps direction link
- Nearby temples query (by distance if lat/lng available)

### Step 5 — Header Search Bar
Add persistent search input in the global Header:
- Dropdown with matching temples/deities on type (debounced)
- Navigate to temple or deity page on selection

### Step 6 — Navigation Updates
Add to nav links in Header:
- "தேடல்" (Search) → `/deity-search`
- Add deity search as a featured section on the home page (Index.tsx)

### Step 7 — Route Registration
Add new routes in App.tsx:
- `/deity-search` → UniversalSearchPage
- `/deity/:deityName` → DeityProfilePage
- `/temple/:id` → TempleDetailPage

### Files Created/Modified
- **New migration** (1 file)
- **Seed data** via insert tool (multiple queries)
- `src/hooks/useUniversalTempleSearch.ts` (new)
- `src/pages/UniversalSearchPage.tsx` (new)
- `src/pages/DeityProfilePage.tsx` (new)
- `src/pages/TempleDetailPage.tsx` (new)
- `src/components/layout/Header.tsx` (modified — add search bar + nav links)
- `src/pages/Index.tsx` (modified — add deity search hero)
- `src/App.tsx` (modified — add routes)

### Notes
- Leaflet map integration will be skipped initially (adds complexity); Google Maps links will serve for directions
- The `/temple-map`, `/divya-desam`, `/nayanmars`, `/shiva-temples`, `/aanmeegam` routes from Section 11 will be added as placeholder pages to avoid dead links
- All Tamil text uses proper Unicode throughout

