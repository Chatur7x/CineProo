# 🎬 CineBook Pro

**An Integrated Multi-Language Movie Ticketing & Security Platform**

[![Live Demo](https://img.shields.io/badge/Live-GitHub%20Pages-brightgreen?style=for-the-badge)](https://chatur7x.github.io/CineProo/)

## 🚀 Live Demo

**👉 [https://chatur7x.github.io/CineProo/](https://chatur7x.github.io/CineProo/)**

## 📋 Overview

CineBook Pro is a full-stack movie ticket booking application built during the **CareerX Training & Internship Program** at **Vault of Codes**. It integrates four technology tracks into a single unified platform:

| Track | Technologies | Role |
|-------|-------------|------|
| **Web Development** | React, Vue.js, HTML5, CSS3, JavaScript | Frontend SPA with frosted-glass UI |
| **Java** | OOP, Collections, File I/O, Threading | Security engine & card validation |
| **Python** | ABC, Inheritance, Matplotlib | Password audit & CLI console |
| **AI & Prompt Engineering** | Claude, GitHub Copilot | Code generation & debugging |

## ✨ Key Features

- 🎬 **Movie Browser** — Responsive grid with frosted-glass cards and genre badges
- 💺 **3D Curved Seating Map** — Interactive seat selection with stepper sync and 3D flip animations
- 💳 **Vue Card Checkout** — Real-time Luhn validation with Visa/Mastercard/RuPay demo presets
- 🔒 **Java Security Engine** — Luhn algorithm, OOP encapsulation, ArrayList tracking, BufferedWriter logging
- 🐍 **Python Password Auditor** — Abstract base class with polymorphic validation rules and Matplotlib charts
- 🔐 **OTP Verification** — Two-factor authentication with 6-digit code validation
- 🎫 **3D Parallax Ticket** — Mouse-tracking perspective tilt, SVG QR code, and click-to-verify scan
- 🧵 **Thread Synchronization** — Mutex seat locking to prevent double-bookings

## 🏗️ Architecture

The application follows a **multi-tier, hybrid-language architecture**:

```
┌─────────────────────────────────────────┐
│         Frontend Client Layer           │
│  React SPA  ←→  Vue.js Containers       │
│  (Hash Router, Context, 3D Animations)  │
├─────────────────────────────────────────┤
│         Java Security Layer             │
│  Luhn Check │ ArrayList │ BufferedWriter │
│  Thread-0 Mutex Lock │ OOP Encapsulation│
├─────────────────────────────────────────┤
│         Python Audit Layer              │
│  Abstract PasswordCheck │ CLI Console   │
│  Matplotlib Stats │ Regex Patterns      │
├─────────────────────────────────────────┤
│         Data & Storage Layer            │
│  LocalStorage (Bookings/Sessions)       │
│  Disk I/O (cards.dat transaction logs)  │
└─────────────────────────────────────────┘
```

## 📂 Project Structure

```
CineProo/
├── index.html              # Main entry point
├── src/
│   ├── App.js              # React app with hash router
│   ├── components/         # SeatMap, Navbar, BookingSummary
│   ├── pages/              # Home, MovieDetail, Booking, Payment, OTP
│   ├── context/            # BookingContext, PaymentContext
│   └── security/           # Password audit modules
├── styles/style.css        # Frosted-glass UI styling
├── java/                   # Java security source files
├── python/                 # Python audit modules
├── posters/                # Movie poster images
└── captures/               # Screenshots & architecture diagrams
```

## 👤 Author

**Kolluri Chaturvedhi Narsimha**
- Hall Ticket: 24EG109A28
- Department: CSE — Cyber Security
- University: Anurag University, Hyderabad
