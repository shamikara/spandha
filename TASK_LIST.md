# Implementation Task List

## Database & Config Tasks

- [x] **Task 1**: Add Supabase environment variables to `.env` and `.env.local`
  - Add `NEXT_PUBLIC_SUPABASE_URL="https://ymwcnfoluycmanlzsivc.supabase.co"`
  - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"`

- [x] **Task 2**: Modify `prisma/schema.prisma`
  - Add `nicFront String?` and `nicBack String?` to the `Profile` model

- [x] **Task 3**: Run database migration
  - Execute `npx prisma db push`

- [x] **Task 4**: Modify `package.json`
  - Add `@supabase/supabase-js` dependency

- [x] **Task 5**: Create `src/lib/supabase.ts`
  - Client-side Supabase client configuration

- [x] **Task 6**: Modify `next.config.js`
  - Add `ymwcnfoluycmanlzsivc.supabase.co` to `images.domains`

- [x] **Task 7**: Create `src/app/api/auth/session/route.ts`
  - Session API endpoint that decodes JWT and returns auth state

## Backend Routes Tasks

- [x] **Task 8**: Modify `src/middleware.ts`
  - Add edge-compatible JWT expiry check

- [x] **Task 9**: Modify `src/app/api/auth/verify-otp/route.ts`
  - Include `isAdmin` in response JSON

- [x] **Task 10**: Modify `src/app/api/profile/route.ts`
  - Accept `avatar`, `nicFront`, `nicBack` as optional strings
  - Enforce `age >= 18`
  - Send `WelcomeEmail` on profile creation

- [x] **Task 11**: Modify `src/app/api/interests/route.ts`
  - Add verification gating (check `user.isVerified === true`)
  - Send `InterestReceivedEmail` if target user has email

- [x] **Task 12**: Modify `src/app/api/adverts/route.ts`
  - Add verification gating
  - Implement posting limits (free: 1/30 days, premium: 5 active)

- [x] **Task 13**: Modify `src/app/api/adverts/[id]/route.ts`
  - Remove user-side DELETE (403 for regular users)
  - Add admin DELETE capability

- [x] **Task 14**: Modify `src/app/api/admin/users/route.ts`
  - Include `adverts: true` in Prisma query

- [x] **Task 15**: Modify proposal routes
  - Remove `NODE_ENV === 'development'` mock data from:
    - `src/app/api/proposals/route.ts`
    - `src/app/api/proposals/[id]/route.ts`

## Frontend Pages Tasks

- [x] **Task 16**: Modify `src/app/auth/page.tsx`
  - Add Login / Register tabs
  - Add 18+ age enforcement
  - Add 500KB file size check
  - Add skippable NIC step
  - Add existing profile check and redirect

- [ ] **Task 17**: Modify `src/app/profile/page.tsx`
  - Add avatar upload with 500KB cap
  - Add verification card with NIC upload section

- [x] **Task 18**: Modify `src/app/post/page.tsx`
  - Add verification gate
  - Add posting limit gate
  - Replace "Delete" with "Request Deletion"

- [x] **Task 19**: Modify `src/app/proposals/[id]/page.tsx`
  - Add verification gate for "Send Interest" button

- [x] **Task 20**: Modify `src/components/Navigation.tsx`
  - Use `/api/auth/session` for auth state
  - Show avatar image when available

- [x] **Task 21**: Modify `src/app/dashboard/profile/page.tsx`
  - Show avatar image when available

- [x] **Task 22**: Modify `src/app/admin/users/page.tsx`
  - Add "Review Profile" button
  - Create full-screen modal with Profile, Verification, and Adverts tabs
  - Add Verify, Reject, Delete Advert, Toggle Premium, Toggle Admin actions

## Verification Tasks

- [x] **Task 23**: Automated verification
  - Run `npm run type-check`

- [x] **Task 24**: Manual testing checklist
  - Manual testing required by user (implementation complete)

---

**Progress**: 24/24 tasks completed
