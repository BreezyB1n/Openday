<div align="center">

# Openday

**The end-to-end application companion for Chinese students applying abroad.**

Browse programs, track deadlines, manage your application pipeline, and keep your profile ready — all in one place.

[Live Demo](#) · [Report Bug](https://github.com/your-org/openday/issues) · [Request Feature](https://github.com/your-org/openday/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)

</div>

---

## What is Openday?

During application season, students juggle dozens of programs across scattered bookmarks and spreadsheets — tracking opening dates, managing materials, and recording progress for each school.

**Openday** brings it all into one place:

- **Discover what to apply to** — Browse 200+ programs from QS Top 200 universities, filtered by country, degree, and field
- **Never miss an opening** — Subscribe to your target preferences and get an email alert within 1 hour of a window opening
- **Manage the whole season** — A four-column kanban tracks every application from "planning" to "result"
- **Keep your profile ready** — Log internships, research papers, GPA, and language scores in a persistent personal profile

---

## Features

### Program Discovery

| Feature | Description |
|---|---|
| **Multi-dimensional filtering** | Filter by country (US/UK/AU/CA/etc.), degree (Bachelor's/Master's/PhD), field, and application status |
| **Full-text search** | Search by school name or program name |
| **Live status badges** | Real-time Open / Closed / Coming Soon indicators |
| **Program detail pages** | Deadline countdown, language requirements, GPA minimum, application fee, official apply link, related programs |

### Application Alerts

| Feature | Description |
|---|---|
| **Email subscription** | Enter email, set degree / field / country preferences, confirm subscription |
| **Under-1-hour delivery** | Triggered immediately when a window opens; AND-matched against all 3 preference dimensions |
| **One-click unsubscribe** | Frictionless opt-out at any time |

### Personal Dashboard (My Page)

| Feature | Description |
|---|---|
| **Application kanban** | Four-column board: Planning → Preparing → Submitted → Result; live stats bar showing total, in-progress, submitted, and offer counts |
| **Academic profile** | Track current degree, school, major, GPA, class rank, IELTS/TOEFL, GRE/GMAT |
| **Internship log** | Add / edit / delete internship records with company, role, dates, description, and skill tags |
| **Research & papers** | Log publications with author order, venue, year, and tags |
| **Subscription management** | Jump directly to update preferences or unsubscribe |

### Admin Panel

| Feature | Description |
|---|---|
| **Program management** | Create, edit, and delete programs with full requirement fields |
| **Subscription management** | View all subscribers and their preference configurations |

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

To access the personal dashboard in dev mode: [http://localhost:3000/my?token=dev](http://localhost:3000/my?token=dev)

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
├── app/
│   ├── page.tsx                  # Home: program list + filters + subscribe CTA
│   ├── programs/[id]/            # Program detail page
│   ├── subscribe/                # Subscription flow (email → preferences → verify)
│   ├── unsubscribe/              # Unsubscribe page
│   ├── my/                       # Personal dashboard (kanban + profile)
│   └── admin/                    # Admin panel (programs + subscriptions)
├── components/
│   ├── FilterBar.tsx             # Filter controls
│   ├── ProgramCard.tsx           # Program card component
│   ├── CountdownTimer.tsx        # Deadline countdown
│   ├── StatusBadge.tsx           # Application status badge
│   └── Pagination.tsx            # Pagination controls
├── lib/
│   ├── mock-data.ts              # Program data (MVP)
│   ├── storage.ts                # localStorage helpers (kanban / profile)
│   └── types.ts                  # Shared TypeScript types
└── public/                       # Static assets
```

---

## Roadmap

**P0 — MVP (current)**

- [x] Program database with filtering, search, and pagination
- [x] Program detail pages (countdown, requirements, related programs)
- [x] Email subscription with preference setup
- [x] Personal dashboard: application kanban (4 columns + stats)
- [x] Personal dashboard: academic profile
- [x] Personal dashboard: internship & paper logs
- [ ] Email notification backend (trigger within 1 hour of opening)
- [ ] Real program data pipeline (200 programs from QS Top 200)

**P1 — Post-MVP**

- [ ] Add-to-kanban from program list
- [ ] Mobile push notifications
- [ ] Deadline calendar view
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
