# 📱 Habit Mate
### *Build Better Habits, Track Your Progress, Achieve Your Goals*

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Roadmap](#-roadmap)

---

## 🚀 Try It Now!

### 📲 **Download the Android APK**

**Get started immediately by installing the app on your Android device:**

🤖 **[Download Habit Mate APK](https://expo.dev/accounts/chathuralakshan/projects/HabitMate/builds/92072a25-2744-4c3a-a88b-01f572111559)**

<div align="center">
  
**OR Scan this QR Code:**

![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://expo.dev/accounts/chathuralakshan/projects/HabitMate/builds/92072a25-2744-4c3a-a88b-01f572111559)

</div>

> **Note:** Open the link on your Android device or scan the QR code to install the app directly. Make sure to enable "Install from Unknown Sources" in your device settings if prompted.

---

## 🌟 Overview

**Habit Mate** is a beautifully designed, feature-rich mobile application that empowers users to build positive habits, track their daily progress, and stay motivated on their journey to self-improvement. With an intuitive interface and powerful tracking capabilities, Habit Mate makes personal growth accessible and engaging.

Whether you're trying to exercise more, read daily, or develop any positive routine, Habit Mate provides the tools and insights you need to succeed.

---

## ✨ Features

### 🏠 **Smart Dashboard**
- Real-time progress overview
- Daily habit summary cards
- Quick-access navigation
- Motivational insights

### ➕ **Effortless Habit Creation**
- Intuitive habit setup wizard
- Custom categories & tags
- Flexible scheduling options
- Rich descriptions & goals

### 📋 **Comprehensive Habit Manager**
- View all habits at a glance
- Edit & update seamlessly
- Archive or delete habits
- Search & filter capabilities

### 📊 **Advanced Progress Tracking**
- Visual progress indicators
- Completion rate analytics
- Streak tracking
- Historical data insights

### ✅ **Daily Task Management**
- Check off completed habits
- Task prioritization
- Daily reminders (coming soon)
- Recurring task support

### 👤 **Personalized Profile**
- User statistics & achievements
- Settings & preferences
- Account management
- Theme customization

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | React Native, Expo, TypeScript |
| **Backend** | Firebase, Cloud Firestore |
| **Navigation** | Expo Router |
| **State Management** | React Hooks, Context API |
| **UI/UX** | Custom Components, React Native Paper |
| **Platforms** | iOS, Android, Web |

</div>

---

## 📂 Project Architecture

```
HabitMate/
│
├── 📱 app/                      # Application Screens
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── index.tsx           # Home Dashboard
│   │   ├── habits.tsx          # Habits List
│   │   ├── progress.tsx        # Progress Analytics
│   │   ├── tasks.tsx           # Daily Tasks
│   │   └── profile.tsx         # User Profile
│   │
│   ├── add-habit.tsx           # Add New Habit Screen
│   ├── edit-habit/[id].tsx     # Edit Habit Screen
│   └── _layout.tsx             # Root Layout
│
├── 🔧 services/                 # Backend Services
│   ├── firebase.ts             # Firebase Configuration
│   ├── habitService.ts         # Habit CRUD Operations
│   ├── userService.ts          # User Management
│
├── 🎯 hooks/                    # Custom React Hooks
│   ├── useLoader.ts            # Authentication Logic
│
├── 🖼️ assets/                   # Static Assets
│   ├── images/                 # App Images
│   ├── icons/                  # Custom Icons
│   └── fonts/                  # Custom Fonts
│
├── 📝 types/                    # TypeScript Types
│   └── index.ts                # Type Definitions
│
└── 📄 Configuration Files
    ├── app.json                # Expo Configuration
    ├── package.json            # Dependencies
    ├── tsconfig.json           # TypeScript Config
    └── README.md               # Documentation
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install via `npm install -g expo-cli`
- **Firebase Account** - [Sign up](https://console.firebase.google.com/)

### Step-by-Step Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/chathuralakshan/HabitMate.git
cd HabitMate
```

#### 2️⃣ Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

#### 3️⃣ Firebase Configuration

**Create Firebase Project:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** and follow the setup wizard
3. Enable **Cloud Firestore** from the console
4. Create a web app and copy the configuration

**Configure Firebase in the App:**

Create or update `services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
```

**Firestore Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /habits/{habitId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 4️⃣ Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

#### 5️⃣ Start Development Server

```bash
npx expo start
```

**Run on Different Platforms:**

- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Physical Device:** Scan QR code with Expo Go app
- **Web Browser:** Press `w` in the terminal

---

## 📱 Usage

### Creating Your First Habit

1. **Launch the app** and navigate to the **Add Habit** screen
2. **Enter habit details:**
   - Habit name (e.g., "Morning Workout")
   - Description and goals
   - Select a category (Health, Productivity, etc.)
3. **Set frequency:** Daily, weekly, or custom schedule
4. **Save** and start tracking!

### Tracking Progress

- **Mark habits complete** from the Tasks screen
- **View analytics** on the Progress screen
- **Monitor streaks** and completion rates
- **Celebrate milestones** as you achieve them

### Managing Habits

- **Edit habits** by tapping on them in the Habits screen
- **Archive** habits you want to pause
- **Delete** habits you no longer need
- **Filter** by category or status

---

## 🎨 Customization

### Adding Custom Categories

Edit `constants/Categories.ts`:

```typescript
export const HABIT_CATEGORIES = [
  { id: 1, name: 'Health & Fitness', icon: '💪', color: '#FF6B6B' },
  { id: 2, name: 'Productivity', icon: '📊', color: '#4ECDC4' },
  { id: 3, name: 'Learning', icon: '📚', color: '#45B7D1' },
  // Add your custom categories
];
```

### Theming

Modify `constants/Colors.ts` to customize the color scheme:

```typescript
export const Colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    // ... more colors
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    // ... more colors
  }
};
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## 📦 Building for Production

### Android

```bash
# Build APK
eas build --platform android

# Build AAB (Google Play)
eas build --platform android --profile production
```

### iOS

```bash
# Build for TestFlight
eas build --platform ios

# Build for App Store
eas build --platform ios --profile production
```

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2026)
- [ ] 🔔 Push notifications & smart reminders
- [ ] 🔥 Advanced streak tracking with fire animations
- [ ] 🎯 Habit templates library
- [ ] 📊 Enhanced analytics dashboard

### Version 1.2 (Q3 2026)
- [ ] 🌙 Dark mode with auto-switching
- [ ] 🌍 Multi-language support (10+ languages)
- [ ] ☁️ Cloud backup & sync
- [ ] 🏆 Gamification & achievements system

### Version 2.0 (Q4 2026)
- [ ] 👥 Social features & habit sharing
- [ ] 🤖 AI-powered habit suggestions
- [ ] 📈 Advanced data visualization
- [ ] 💾 Export data (CSV, PDF, JSON)
- [ ] ⌚ Apple Watch & Wear OS support

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Be respectful and constructive

---

## 📄 License

This project is licensed under the **MIT License** for educational and personal use.

```
MIT License

Copyright (c) 2026 Chathura Lakshan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

For commercial use, please contact the author.

---

## 👨‍💻 Author

<div align="center">

### Chathura Lakshan

**Software Engineer | Mobile Developer | Tech Enthusiast**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/chathuralakshan)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chathuralakshan)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://yourportfolio.com)

</div>

---

## 🌟 Support

If you find this project helpful, please consider:

- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 📢 **Sharing** with others

---

## 📚 Resources & Learning

### Documentation
- [Expo Documentation](https://docs.expo.dev/) - Complete Expo guide
- [React Native Docs](https://reactnative.dev/) - React Native fundamentals
- [Firebase Docs](https://firebase.google.com/docs) - Firebase integration
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript reference

### Tutorials
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/) - Official Expo tutorial
- [React Native Course](https://reactnative.dev/docs/getting-started) - Getting started guide
- [Firebase with React Native](https://rnfirebase.io/) - Firebase integration guide

### Community
- [Expo Discord](https://chat.expo.dev) - Get help from the community
- [React Native Community](https://github.com/react-native-community) - Open source resources
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native) - Q&A platform

---

## 🙏 Acknowledgments

Special thanks to:

- **Expo Team** - For the amazing development platform
- **Firebase Team** - For robust backend services
- **React Native Community** - For continuous support and resources
- **Open Source Contributors** - For inspiring this project
- **You** - For checking out this project! 🎉

---

<div align="center">

### 💪 Start Building Better Habits Today!

**Made with ❤️ and ☕ by [Chathura Lakshan](https://github.com/chathuralakshan)**

⭐ **Star this repo** if you find it helpful!

---

*Habit Mate - Your Journey to Self-Improvement Starts Here* 🚀

</div>
