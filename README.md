# Pristine Clean | Professional Service Management Platform

A cutting-edge, full-stack management system designed for cleaning service providers. This platform streamlines the entire business lifecycle, from customer booking to staff assignment and task completion.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Key Features

### For Customers
- **Intuitive Booking Flow**: A seamless 4-step booking process with real-time feedback.
- **Real-time Availability**: Dynamic time-slot selection that prevents double bookings.
- **Order Summary**: Instant tax calculations and transparent pricing.
- **Simulated Payment**: Integrated payment method selection (Credit Card, PayPal, Cash).

### For Administration
- **Centralized Dashboard**: Oversight of all active, pending, and completed bookings.
- **Conflict-Aware Scheduling**: Intelligent staff assignment that prevents scheduling overlaps.
- **Task Management**: Break down bookings into granular tasks for staff.
- **Staff Performance**: Track job completion and performance ratings.
- **Financial Status**: Monitor payment status (Paid/Unpaid) with quick-toggle functionality.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Modern Design System with Dark Mode support)

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL database instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd vast-hubble
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pristine_clean"
   DIRECT_URL="postgresql://user:password@localhost:5432/pristine_clean"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/app/book`: Customer-facing booking application.
- `src/app/admin`: Secure administration dashboard and management tools.
- `src/app/api`: Robust RESTful API endpoints for data operations.
- `src/components`: Reusable UI components (DatePicker, Modal, Navbar, etc.).
- `prisma/`: Database schema and migration configurations.
- `public/`: Static assets and media.

## 🛡️ Best Practices Implemented

- **Atomic Components**: Reusable, modular UI elements.
- **Server/Client Separation**: Optimized Next.js data fetching.
- **Form Validation**: Client and server-side checks for data integrity.
- **Hydration Safety**: Suppressed hydration warnings for browser-extension compatibility.
- **Dynamic Routing**: CleanURL structure for administrative views.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by the Pristine Clean Team.*
