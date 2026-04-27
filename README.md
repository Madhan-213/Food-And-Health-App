# NutriWise 🌿

**Eat Smarter. Live Better.**

A premium, offline-first smart nutrition assistant built for the Google Hackathon 2025.

## 🎯 Problem Statement

*Design a smart solution that helps individuals make better food choices and build healthier eating habits by leveraging available data, user behavior, or contextual inputs.*

## ✨ Features

### Core
- **Smart Onboarding** – 3-step personalized BMR/calorie goal calculator
- **Dashboard** – Real-time calorie ring (animated), macro progress bars, hydration tracker, live activity feed, and streak display
- **Meal Logger** – 100+ food database with search, custom food entry (manual), quantity stepper, meal score badges, and a food mood tracker
- **Discover** – AI-recommended recipe cards with 3D flip animation, meal plan generator, healthier food swaps, and NutriBot AI chatbot
- **Progress** – 7-day bar/line charts, 30-day heatmap, habit tracker, achievement badges with confetti, data export (JSON), and share streak
- **Profile** – User info, preferences, goals, and full data reset

### New in Phase 2
- 🎨 **Premium glassmorphism UI** with animated gradient backgrounds
- 🔥 **Live activity feed** on the dashboard
- 📊 **30-day calorie heatmap** on Progress
- 🤖 **Meal Plan Generator** powered by smart recipe matching
- 💬 **NutriBot** with typing indicator, typewriter effect, and clear chat
- 🗺️ **Nearby Restaurants** using Google Maps Embed API (geolocation)
- 😊 **Food Mood Tracker** to correlate food with feelings
- 🏅 **Achievement badges** with confetti animation
- 📤 **Export data** to JSON & **share streak** natively
- 🔐 **Firebase Auth** (Google Sign-in) and Firestore cloud sync (optional)
- ♿ **Accessibility** — ARIA roles, skip link, focus traps, keyboard navigation

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| State | React Context API |
| Persistence | localStorage |
| Auth (optional) | Firebase Auth |
| DB (optional) | Cloud Firestore |
| Testing | Vitest + Testing Library |

## 🚀 Getting Started

```bash
# 1. Clone & install
npm install

# 2. Configure environment (optional for Firebase/Maps)
cp .env.example .env
# Populate VITE_FIREBASE_* and VITE_GOOGLE_MAPS_KEY

# 3. Start dev server
npm run dev

# 4. Run tests
npx vitest run
```

## 📁 Project Structure

```
src/
├── contexts/          # React Context: User, MealLog, Habit, Theme
├── data/              # Food DB, Recipe DB, Swap DB, NutriBot rules
├── hooks/             # Custom hooks (useLocalStorage, useStreak, useAchievements, etc.)
├── lib/               # Firebase init, utility functions
├── pages/             # Landing, Onboarding, Dashboard, MealLogger, Discover, Progress, Profile, NearbyRestaurants
├── components/
│   ├── layout/        # AppLayout, Sidebar, TopNav, BottomNav
│   └── shared/        # Button, Card, Modal, CalorieRing, MacroBar, Toast, etc.
├── utils/             # calculateCalories, formatDate, getStreak, matchRecipe, sanitizeInput
└── test/              # Vitest unit tests
```

## 🔐 Firebase Setup (Optional)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Google** provider
3. Create a **Firestore** database in production mode
4. Apply the security rules from `firestore.rules`
5. Add your config values to `.env`

## ♿ Accessibility

- Skip navigation link at the top of the page
- All interactive elements have unique, descriptive `id` and `aria-label` attributes
- Habit toggle buttons use `aria-pressed`
- Chat log uses `role="log"` and `aria-live="polite"`
- Full keyboard navigation support throughout

## 📸 Screenshots


