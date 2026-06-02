# Implementation Plan - Full Auth, Verification & Advert Rules

## Summary

This plan covers all discussed features in a single implementation pass:

1. **Supabase Storage** — avatar & NIC uploads (500KB cap per file)
2. **Auth fixes** — session API, middleware JWT check, login/register tabs, skippable onboarding that actually saves to DB
3. **NIC verification gating** — interests & advert posting blocked until admin verifies NIC
4. **Admin review modal** — view full profile, NIC documents, and posted adverts; verify/premium/delete actions
5. **Advert posting rules** — free verified users get 1 advert with a 30-day cooldown; premium users get 5 active adverts; users cannot self-delete (must request admin)
6. **18+ age enforcement** — frontend DOB check + backend schema validation

## User Review Required

> [!IMPORTANT]
> You need to add these to `.env` and `.env.local`:
> ```env
> NEXT_PUBLIC_SUPABASE_URL="https://ymwcnfoluycmanlzsivc.supabase.co"
> NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"
> ```
> Get the anon key from Supabase Dashboard → Project Settings → API.

> [!WARNING]
> **Advert deletion policy change**: Users will no longer be able to delete their own adverts. The delete button on the user-facing `/post` page will be replaced with a "Request Deletion" action (which creates a notification for the admin). Only admins can delete adverts from the admin review modal.

## Proposed Changes

### 1. Database & Config

#### [MODIFY] [prisma/schema.prisma](file:///d:/projects/spandha/prisma/schema.prisma)
- Add `nicFront String?` and `nicBack String?` to the `Profile` model.
- Run `npx prisma db push` after.

#### [MODIFY] [package.json](file:///d:/projects/spandha/package.json)
- Add `@supabase/supabase-js` dependency.

#### [NEW] [src/lib/supabase.ts](file:///d:/projects/spandha/src/lib/supabase.ts)
- Client-side Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

#### [MODIFY] [next.config.js](file:///d:/projects/spandha/next.config.js)
- Add `ymwcnfoluycmanlzsivc.supabase.co` to `images.domains`.

#### [NEW] [src/app/api/auth/session/route.ts](file:///d:/projects/spandha/src/app/api/auth/session/route.ts)
- Decodes JWT `auth-token`, returns `{ isAuthenticated, user }` independent of profile existence.

---

### 2. Backend Routes

#### [MODIFY] [src/middleware.ts](file:///d:/projects/spandha/src/middleware.ts)
- Edge-compatible JWT expiry check. Redirect to `/auth` if token missing or expired.

#### [MODIFY] [src/app/api/auth/verify-otp/route.ts](file:///d:/projects/spandha/src/app/api/auth/verify-otp/route.ts)
- Include `isAdmin` in the response JSON.

#### [MODIFY] [src/app/api/profile/route.ts](file:///d:/projects/spandha/src/app/api/profile/route.ts)
- Accept `avatar`, `nicFront`, `nicBack` as optional strings. Enforce `age >= 18`.
- Send `WelcomeEmail` on profile creation if user has email.

#### [MODIFY] [src/app/api/interests/route.ts](file:///d:/projects/spandha/src/app/api/interests/route.ts)
- **Gate**: Check `user.isVerified === true`, return `403` if not.
- Send `InterestReceivedEmail` if target user has email.

#### [MODIFY] [src/app/api/adverts/route.ts](file:///d:/projects/spandha/src/app/api/adverts/route.ts)
- **Gate**: Check `user.isVerified === true`, return `403` if not.
- **Posting limits**:
  - Query the user's `isPremium` status from the database.
  - **Free users**: Check if they have any advert posted within the last 30 days. If yes, return `403` with message "You can post one advert per month. Your next post will be available on {date}." If no recent advert, allow posting (limit: 1 active).
  - **Premium users**: Allow up to 5 active (non-expired) adverts.
- Change the existing `activeAdvertsCount >= 3` check to the new tier-based logic.

#### [MODIFY] [src/app/api/adverts/[id]/route.ts](file:///d:/projects/spandha/src/app/api/adverts/[id]/route.ts)
- **Remove user-side DELETE**: The `DELETE` handler will now only allow deletion if the caller is an admin (`user.isAdmin === true`). Regular users get `403 Forbidden` with message "Please contact admin to request advert deletion."
- **Add admin DELETE**: Admin can delete any advert by ID.

#### [MODIFY] [src/app/api/admin/users/route.ts](file:///d:/projects/spandha/src/app/api/admin/users/route.ts)
- Include `adverts: true` in the Prisma query so the admin review modal can display a user's posted adverts.

#### [MODIFY] [src/app/api/proposals/route.ts](file:///d:/projects/spandha/src/app/api/proposals/route.ts) & [src/app/api/proposals/[id]/route.ts](file:///d:/projects/spandha/src/app/api/proposals/[id]/route.ts)
- Remove the `NODE_ENV === 'development'` mock data blocks so dev queries live DB.

---

### 3. Frontend Pages

#### [MODIFY] [src/app/auth/page.tsx](file:///d:/projects/spandha/src/app/auth/page.tsx)
- **Login / Register tabs** on the phone/email form.
- **18+ age enforcement**: Calculate age from DOB, block if under 18.
- **500KB file size check** before Supabase upload.
- **Skippable NIC step**: "Skip for now" button sends profile with `nicFront: null, nicBack: null`.
- **Existing profile check**: If `user.profile` exists after OTP, redirect straight to `/admin` or `/dashboard`.

#### [MODIFY] [src/app/profile/page.tsx](file:///d:/projects/spandha/src/app/profile/page.tsx)
- Avatar upload with 500KB cap.
- **Verification card**: If not verified, show NIC upload section with front/back file pickers, 500KB validation, and "Pending Review" status after submission.

#### [MODIFY] [src/app/post/page.tsx](file:///d:/projects/spandha/src/app/post/page.tsx)
- **Verification gate**: If unverified, show alert banner instead of the form.
- **Posting limit gate**: Fetch current advert count and last post date. If free user hit the limit, show "Next post available on {date}" message. If premium user, show "{count}/5 adverts used" indicator.
- **Replace "Delete" with "Request Deletion"**: Change the delete button to send a notification to admin instead of calling `DELETE` directly. Show a confirmation toast "Deletion request sent to admin."

#### [MODIFY] [src/app/proposals/[id]/page.tsx](file:///d:/projects/spandha/src/app/proposals/[id]/page.tsx)
- **Verification gate**: If unverified, disable "Send Interest" and show verification prompt.

#### [MODIFY] [src/components/Navigation.tsx](file:///d:/projects/spandha/src/components/Navigation.tsx)
- Use `/api/auth/session` for auth state (fixes logout visibility for users without profiles).
- Show avatar image when available.

#### [MODIFY] [src/app/dashboard/profile/page.tsx](file:///d:/projects/spandha/src/app/dashboard/profile/page.tsx)
- Show avatar image when available.

#### [MODIFY] [src/app/admin/users/page.tsx](file:///d:/projects/spandha/src/app/admin/users/page.tsx)
- **"Review Profile" button** on each user row → opens a full-screen modal with:
  - **Profile tab**: All profile fields (name, age, gender, location, job, education, height, religion, caste, mother tongue, habits, description, avatar).
  - **Verification tab**: NIC front & back images displayed side by side. "Verify" and "Reject" action buttons.
  - **Adverts tab**: Table of all adverts posted by the user, with a "Delete Advert" button on each row (admin-only deletion).
  - **Actions bar**: "Toggle Premium", "Toggle Admin" buttons.

---

## Verification Plan

### Automated
- `npm run type-check` after all changes.

### Manual Testing Checklist
1. Register with DOB under 18 → blocked with age warning.
2. Register with DOB over 18 → skip NIC → profile created, redirects to dashboard.
3. Try "Send Interest" → blocked, shows verification prompt.
4. Try "Post New Advert" → blocked, shows verification prompt.
5. Upload NIC (test with 600KB file → rejected; 200KB file → accepted).
6. Admin login → `/admin/users` → click "Review Profile" → see profile, NIC images, adverts.
7. Admin clicks "Verify" → user is now verified.
8. Verified free user posts 1 advert → success.
9. Verified free user tries to post another → blocked with "next post available on {date}".
10. Verified free user tries to delete advert → sees "Request Deletion" instead, notification sent to admin.
11. Admin deletes the advert from the review modal.
12. Admin grants Premium → user can now post up to 5 adverts.
