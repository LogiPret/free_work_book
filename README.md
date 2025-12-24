# Mortgage Broker Landing Pages

A multi-tenant Next.js application for mortgage brokers. Each broker gets their own personalized landing page with custom branding.

## Features

- **Dynamic Broker Pages**: Each broker has a unique URL (`/broker/john-smith`)
- **Custom Theming**: Brokers can have their own primary and accent colors
- **Admin Dashboard**: Simple form-based admin to add/edit/delete brokers
- **No Rebuild Required**: Adding a new broker is instant via the admin panel
- **SEO Optimized**: Dynamic metadata for each broker page
- **Responsive Design**: Works on all devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database & API

## Getting Started

### 1. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor and run the contents of `supabase-schema.sql`
4. Go to Project Settings > API and copy your URL and anon key

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_secure_password
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Adding a Broker

1. Go to `/admin`
2. Enter the admin password
3. Click "Add Broker"
4. Fill in the broker details
5. The broker page is instantly available at `/broker/{slug}`

### Broker Page URL Structure

```
https://yoursite.com/broker/john-smith
https://yoursite.com/broker/jane-doe
```

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard & forms
│   │   ├── page.tsx     # Broker list
│   │   ├── new/         # Add broker form
│   │   └── edit/[id]/   # Edit broker form
│   ├── api/
│   │   ├── brokers/     # CRUD API for brokers
│   │   └── auth/        # Simple admin auth
│   ├── broker/[slug]/   # Dynamic broker landing pages
│   └── page.tsx         # Homepage
├── components/
│   └── BrokerLanding.tsx  # Reusable landing page template
└── lib/
    ├── supabase.ts      # Supabase client & types
    └── brokers.ts       # Database operations
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any Node.js hosting (Netlify, Railway, Render, etc.)

## Customization

### Modifying the Landing Page Template

Edit `src/components/BrokerLanding.tsx` to change:

- Layout and sections
- Default services list
- Footer content
- Call-to-action buttons

### Adding Custom Fields

1. Add column to Supabase: `ALTER TABLE brokers ADD COLUMN new_field TEXT;`
2. Update `Broker` type in `src/lib/supabase.ts`
3. Add field to admin forms
4. Use in `BrokerLanding.tsx`
