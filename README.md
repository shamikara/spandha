# Spandha - Trusted Matrimonial Platform in Sri Lanka

A high-performance, SEO-optimized, secure matrimonial web application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- ✅ **Authentication**: One-field email or phone login with OTP sent to saved SMS/email contacts
- ✅ **User Profiles**: Complete profile management system
- ✅ **Proposal Browsing**: Browse and filter matrimonial proposals
- ✅ **User Dashboard**: Manage profile, interests, adverts, notifications, and payments
- ✅ **Notifications**: In-app notifications with email details and SMS nudges
- ✅ **Skeleton Loading**: Beautiful loading states
- ✅ **Multi-language**: English and Sinhala support
- ✅ **Dark/Light Theme**: Wedding-themed design system
- ✅ **PWA Support**: Installable mobile app experience

### Technical Features
- ✅ **SEO Optimized**: Metadata, Open Graph, sitemap, robots.txt
- ✅ **Performance**: Server Components, dynamic imports, caching
- ✅ **Security**: Input validation, rate limiting, sanitization
- ✅ **Database**: Prisma ORM with PostgreSQL schema
- ✅ **TypeScript**: Full type safety throughout

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom wedding theme
- **Database**: Prisma ORM + PostgreSQL
- **Authentication**: JWT with phone/email registration and shared SMS/email OTP
- **Validation**: Zod schemas
- **Deployment**: Optimized for Vercel

## 🏗 Project Structure

```
spandha/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── proposals/         # Proposal browsing
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Homepage
│   ├── components/            # React components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Stats.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── ContactForm.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useTranslation.ts
│   │   └── useTheme.ts
│   └── lib/                 # Utility libraries
│       ├── translations.ts
│       └── prisma.ts
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   └── robots.txt          # SEO robots file
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Wedding Maroon (#722f37)
- **Accent**: Wedding Gold (#d4af37)
- **Background**: Wedding Cream (#faf6f2)
- **Dark Mode**: Wedding Dark (#2c1810)

### Typography
- **Serif**: Playfair Display (headings)
- **Sans**: Inter (body text)

## 📱 PWA Features

- Installable as mobile app
- Offline support (basic)
- App shortcuts
- Custom splash screen
- Optimized for mobile viewing

## 🔐 Security Features

- Input validation with Zod
- Rate limiting on OTP endpoint
- HTTP-only cookies for sessions
- XSS protection
- SQL injection prevention
- Secure password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spandha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your database URL, secrets, and OTP providers in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/spandha"
   JWT_SECRET="your-jwt-secret"
   RESEND_API_KEY="your-resend-api-key"
   RESEND_FROM_EMAIL="Spandha <noreply@your-domain.com>"
   ```

4. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Performance

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100+

### Optimization Techniques
- Server Components by default
- Dynamic imports for heavy components
- Image optimization with next/image
- API route caching
- Minimal client-side JavaScript

## 🌍 Internationalization

### Supported Languages
- English (en)
- Sinhala (si)

### Translation System
- Simple file-based translations
- React hook for easy usage
- Persistent language preference
- Default: Sinhala

## 📝 API Routes

### Authentication
- `POST /api/auth/send-otp` - Send OTP with `{ identifier }`
- `POST /api/auth/verify-otp` - Verify OTP and login with `{ identifier, otp }`
- `GET /api/dashboard` - User dashboard summary
- `GET /api/notifications` - User notifications and unread count
- `PUT /api/notifications` - Mark one or all notifications as read

### Proposals
- `GET /api/proposals` - Get paginated proposals with filters

### Contact
- `POST /api/contact` - Submit contact form

## 🗄 Database Schema

### Models
- **User**: Authentication and basic info
- **Profile**: Detailed user profile
- **Advert**: Matrimonial advertisements
- **Interest**: User interest expressions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `NEXTAUTH_URL` - Application URL
- `RESEND_API_KEY` - Resend API key for email OTP
- `RESEND_FROM_EMAIL` - Verified Resend sender address

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 SEO Features

- Dynamic metadata for all pages
- Open Graph tags
- Twitter Card support
- XML sitemap
- robots.txt
- Structured data (JSON-LD)
- Clean URLs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and inquiries:
- Email: support@spandha.lk
- Phone: +94 11 234 5678
- Address: 123 Galle Road, Colombo 03, Sri Lanka

---

**Built with ❤️ for Sri Lankan couples**
# spandha
