# MentorLagbe (Client)

MentorLagbe is a smart tuition and mentorship platform. Students find verified tutors by subject, class level, mode and budget. Tutors post tuition batches and manage applicants. Admins review every listing, manage users and track Stripe revenue.

- **Live site:** https://mentorlagbe-bijoy.vercel.app/
- **Server repository:** https://github.com/Bijoy34-CSE/mentorlagbe-server
- **API:** https://mentorlagbe-api-bijoy.vercel.app/

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@mentorlagbe.com | Admin@1234 |
| Tutor (Pro) | rahim@mentorlagbe.com | Demo@1234 |
| Tutor (Free) | sabbir@mentorlagbe.com | Demo@1234 |
| Student | ayesha@mentorlagbe.com | Demo@1234 |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key Features

- Role based accounts: Student, Tutor and Admin
- Public home page with hero, latest tuitions, pricing, how it works, subjects, statistics and testimonials
- Browse tuitions with server-side search, filters (subject, class level, mode) and pagination
- Tuition details page. Only students can apply, and duplicate applications are blocked
- Tutor dashboard: post tuition with ImgBB banner upload, edit, delete, open/close, manage applicants
- Free tutors can post 2 tuitions. Pro tutors can post unlimited tuitions
- Admin dashboard: platform stats, tuition approval, user role management, Stripe transactions
- Student dashboard: stats, application tracking and cancel for pending applications
- Stripe Checkout for the Pro plan (Tutor $15, Student $10)
- Profile update with ImgBB image upload
- Dark and light theme
- Loading skeletons, custom 404 and error pages, toast notifications
- Fully responsive for mobile, tablet and desktop

## Tech Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, BetterAuth, Framer Motion, Sonner

## NPM Packages

`next`, `react`, `react-dom`, `better-auth`, `framer-motion`, `lucide-react`, `next-themes`, `sonner`, `tailwindcss`, `shadcn`, `class-variance-authority`, `clsx`, `tailwind-merge`

## Run Locally

```bash
npm install
npm run dev
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
```

The server must be running too. See the server repository for its setup.