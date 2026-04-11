

## Plan: Enable Lovable Cloud & Prepare for Self-Hosting

### What This Involves

**Phase 1 — Enable Lovable Cloud (now)**

1. **Set up Lovable Cloud database** with tables for:
   - `profiles` (user profiles, family members)
   - `birth_charts` (saved horoscope data)
   - `user_roles` (admin/user roles, separate table per security best practices)

2. **Enable authentication** via Lovable Cloud:
   - Email & password signup/login
   - Google sign-in (optional)
   - Protected routes for saving charts and profiles

3. **Create edge functions** for astrology API endpoints:
   - `/generate-chart` — birth chart generation
   - `/panchangam` — daily panchangam
   - `/dasha` — Vimshottari dasha calculation
   - `/matching` — 10 Porutham matching
   - `/dosha` — dosha & yoga detection
   - `/transit` — gocharam analysis

4. **Add auth UI components**:
   - Login/Signup page
   - Profile management (save multiple family members)
   - Save/load birth charts

5. **Wire up frontend** to use edge functions instead of client-side calculations where appropriate, and store results in the database.

**Phase 2 — Self-hosting preparation (for Hostinger VPS KVM2)**

6. **Document the self-hosting setup**: After Cloud features are working, prepare deployment instructions for your Hostinger VPS. This involves building the Vite app (`npm run build`) and serving the `dist/` folder via Nginx or similar. The Supabase backend (database, auth, edge functions) will continue running on Lovable Cloud unless you also self-host Supabase.

### Technical Notes

- All astrology calculation logic already exists in `src/lib/astrology/`. Edge functions will reuse this logic server-side.
- Database migrations will be created for all new tables with proper RLS policies.
- JWT auth is handled natively by Lovable Cloud (Supabase Auth).
- For Hostinger VPS deployment, you'll need Node.js or just serve static files — the React app is fully client-side rendered.

### Files to Create/Modify

- New: Auth pages, profile pages, edge functions, database migrations
- Modified: `App.tsx` (protected routes), Header (auth state), existing pages (save functionality)

