# HR Portal — Backend API

A production-grade, modular HR management backend built with **Node.js**, **Express**, and **MongoDB**. It powers a complete HR Portal platform covering employee lifecycle management, leave & attendance, recruitment, performance appraisals, and internal notifications — deployed as serverless functions for scalability and low operational overhead.

## Overview

This backend serves as the core API layer for an HR management system used to streamline day-to-day HR operations for an organization. It replaces manual, spreadsheet-driven HR workflows with a secure, role-based, automated platform.

## Key Features

- **Employee Management** — onboarding, profiles, documents, and department assignment
- **Leave & Attendance** — leave requests, approvals, balances, sandwich-leave rules, and automated yearly resets
- **Recruitment** — candidate requirements, application tracking, and hiring workflow
- **Performance & Appraisals** — salary appraisal workflows and structured feedback cycles
- **Roles & Permissions** — configurable, role-based access control for admins and employees
- **Notifications** — in-app and popup notifications for time-sensitive HR events
- **Holiday & Event Calendar** — company holiday and event scheduling
- **Automated Scheduling** — cron-based background jobs for recurring HR tasks (e.g. leave resets)
- **File Uploads** — secure document upload and storage (with Cloudinary integration)
- **Email Notifications** — automated transactional emails for HR events
- **LinkedIn Integration** — automated company post publishing

## Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| Runtime           | Node.js                              |
| Framework         | Express.js                           |
| Database          | MongoDB with Mongoose ODM            |
| Authentication    | JWT-based, with bcrypt password hashing |
| File Storage      | Multer + Cloudinary                  |
| Email             | Nodemailer                           |
| Scheduling        | node-cron                            |
| Deployment        | Netlify Functions (serverless)       |

## Architecture

The codebase follows a clean, layered architecture for maintainability and testability:

```
functions/
├── controllers/   # Route definitions and request handling
├── services/      # Business logic and orchestration
├── schemas/       # Mongoose data models
├── utils/         # Shared utilities (email, file uploads, etc.)
└── api.js         # Application entry point
```

This separation of concerns keeps routing, business logic, and data access independent — making the system easy to extend, test, and maintain as requirements grow.

## API Modules

The API exposes RESTful endpoints organized by domain:

- `/api/admin` — Administrative operations
- `/api/user` — Authentication & login
- `/api/employee` — Employee records
- `/api/candidate` — Recruitment & candidates
- `/api/leave` — Leave management
- `/api/department` — Department management
- `/api/feedback` — Feedback cycles
- `/api/salary` — Salary appraisals
- `/api/notification` — Notifications
- `/api/holiday` — Holidays
- `/api/role` — Roles & permissions
- `/api/events` — Company events

## Deployment

The application is deployment-ready for **Netlify Functions**, running as a serverless Express app via `serverless-http`. This provides automatic scaling, zero server management, and cost-efficient hosting suited for HR workloads of any size.

## About

This project was developed by **[The FabCode](https://thefabcode.com)** — a software development team specializing in building reliable, scalable backend systems and full-stack web applications for businesses.

Interested in a similar solution for your organization? [Get in touch](https://thefabcode.com/contact) to discuss your project.
