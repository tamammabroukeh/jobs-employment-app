# Jobs & Employment Platform

## CV Summary

Forsa is a comprehensive Jobs & Employment Platform built with Next.js and TypeScript. It provides a complete solution for connecting job seekers with employers, featuring a bilingual interface (English/Arabic with full RTL support) and role-based access control across multiple roles including job seeker, employer, and career coach. Key features include: job search and discovery with advanced filtering, company profiles and job listings, employer job-posting management (create, edit, and archive postings), candidate talent search and profile viewing, job seeker profiles with experience, education, and skills management, AI-powered resume analysis and an AI resume coach chat, document management (resume and cover letter), job applications and offers tracking, meeting scheduling with accept and reschedule flows, real-time in-app notifications, context switching between different roles, and a lot of other features.

---

A full-stack job marketplace web application connecting job seekers, employers, and career coaches. Built with Next.js 16 (App Router) and TypeScript, featuring multi-role access control, bilingual support (English/Arabic with full RTL), and AI-assisted career tools.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript 5
- **UI:** Ant Design 6, Tailwind CSS 4, custom reusable component library with light/dark theming via semantic CSS tokens
- **Auth:** NextAuth (JWT sessions, role-based access control, automatic token refresh)
- **Forms & Validation:** React Hook Form + Zod, type-safe server actions via next-safe-action
- **Internationalization:** next-intl (English/Arabic, RTL layout, cookie-based locale persistence)
- **Notifications:** Sonner toasts and an in-app notification center with unread counts and infinite scroll

## Key Features

- **Multi-role platform** serving job seekers, employers, and coaches with route-level authorization enforced by middleware.
- **Job search & discovery:** browse and filter listings, view detailed job and company profiles, apply with resume and cover letter.
- **Employer tools:** create and manage job postings (multi-section forms), browse candidate talent pools, and manage a company profile.
- **Job seeker profiles:** experience, education, skills, and document management with AI-powered resume analysis.
- **Career coaching & meetings:** AI resume coach chat plus meeting scheduling, acceptance, and rescheduling flows.
- **Applications & offers tracking** for candidates to monitor their pipeline.

## Architecture Highlights

- **Repository pattern API layer** with a shared fetcher featuring retry logic, request timeouts, and typed error handling.
- **Type-safe server actions** with Zod validation and Next.js cache revalidation tags for mutations.
- **Feature-based project structure** with barrel exports, path aliases, and centralized routing constants.
- **Reusable component system** (Button, Dialog, Typography, Flex, Card, Pagination) enforcing consistent UI and accessibility.

## Resume Bullet Points (copy-ready)

- Built a bilingual (EN/AR, RTL) job marketplace with Next.js 16, React 19, and TypeScript, supporting multiple user roles with JWT-based, role-aware authentication.
- Implemented a type-safe API layer using the repository pattern, server actions, and Zod validation, with automatic retries, timeouts, and cache revalidation.
- Developed employer job-posting management, candidate search, AI resume analysis, and a meeting-scheduling system.
- Created a reusable, themeable component library (light/dark mode via semantic CSS tokens) and a full internationalization workflow.
