<div align="center">

# Openday

**Never miss a grad school application window again.**

Openday tracks open-day and application deadlines for overseas universities,
and sends you an email the moment a program you care about opens.

[Live Demo](#) · [Report Bug](https://github.com/your-org/openday/issues) · [Request Feature](https://github.com/your-org/openday/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

</div>

---

## What is Openday?

Applying abroad is stressful enough. Tracking dozens of program deadlines across university websites shouldn't be part of it.

**Openday** lets you subscribe to the programs you're targeting — by degree level, subject area, and country — and delivers a timely email alert the moment an application window opens. No more daily refreshes. No more missed deadlines.

Built for Chinese students pursuing graduate and undergraduate programs at QS Top 200 institutions worldwide.

---

## Features

| Feature | Description |
|---|---|
| **Smart Subscriptions** | Filter by degree (Master's / PhD / Bachelor's), up to 5 subject areas, and up to 3 target countries |
| **Instant Email Alerts** | Notifications delivered within 1 hour of an application opening |
| **Program Database** | 200+ programs from QS Top 200 universities with full requirement details |
| **Program Detail Pages** | Deadline countdown, GPA requirements, language scores, and official application links |
| **Admin Panel** | Manage program data, review subscriptions, and trigger notifications |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Runtime | React 19 |
| Package Manager | pnpm |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/openday.git
cd openday

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Commands

```bash
pnpm dev      # Start development server (with hot reload)
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## Project Structure

```
openday/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel (programs, subscriptions)
│   ├── layout.tsx          # Root layout (Header, Footer, MetaBar)
│   └── globals.css         # Global styles
├── components/             # Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── public/                 # Static assets
└── prd/                    # Product requirement documents
```

---

## Roadmap

**P0 — MVP (current)**

- [x] User registration / login (email + password, 7-day session)
- [x] Preference setup (degree, subject, country)
- [ ] Program database (200 programs, full requirement fields)
- [ ] Application-open email notifications (AND-match on 3 preference dimensions)
- [ ] Program detail pages (countdown timer, requirements, official link)

**P1 — Post-MVP**

- [ ] Saved programs / wishlist
- [ ] Mobile push notifications
- [ ] Application tracker (personal deadline board)
- [ ] Community Q&A per program

---

## Contributing

Contributions, issues, and feature requests are welcome. Check the [issues page](https://github.com/your-org/openday/issues) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with care for students navigating the overseas application process.

</div>
