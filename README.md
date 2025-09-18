# Ethiogram 📸

A modern, feature-rich social media application built with React Native and Expo, inspired by Instagram. Ethiogram provides a complete social networking experience with posts, stories, real-time messaging, and more.

## ✨ Features

### Core Functionality
- **User Authentication** - Secure sign-up and login with Clerk
- **Photo & Video Sharing** - Upload and share multimedia content
- **Stories** - Temporary content that disappears after 24 hours
- **Real-time Feed** - Browse posts from users you follow
- **Comments & Reactions** - Engage with posts through likes and comments
- **Bookmarks** - Save posts for later viewing
- **Push Notifications** - Stay updated on interactions and new content
- **User Profiles** - Customizable profiles with follower/following system
- **Download Feature** - Save media content locally
- **Content Reporting** - Report inappropriate content

### Technical Features
- **Cross-platform** - Runs on iOS, Android, and Web
- **Real-time Database** - Powered by Convex for instant updates
- **Optimized Images** - Enhanced image loading and caching
- **File-based Routing** - Clean navigation with Expo Router
- **TypeScript** - Type-safe development experience
- **Modern UI** - Responsive design with native components

## 🛠️ Tech Stack

### Frontend
- **React Native** (0.79.2) - Cross-platform mobile development
- **Expo** (~53.0.9) - Development platform and tooling
- **TypeScript** (~5.8.3) - Type safety and enhanced development
- **Expo Router** (~5.0.6) - File-based navigation system
- **React Navigation** - Tab and stack navigation
- **Expo Image** - Optimized image handling
- **React Native Reanimated** - Smooth animations

### Backend & Services
- **Convex** (^1.24.8) - Real-time backend with database and serverless functions
- **Clerk** (^2.13.0) - Authentication and user management
- **Expo Secure Store** - Secure local data storage

### Key Dependencies
- **Media Handling**: expo-image-picker, expo-media-library, expo-file-system
- **UI/UX**: expo-haptics, expo-blur, @expo/vector-icons
- **Utilities**: date-fns, svix (webhooks), react-native-webview

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mubarek-hassen-buli/Ethiogram.git
   cd Ethiogram
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Configure Convex backend credentials
   - Set up Clerk authentication keys
   - Add any required API keys

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Development Options

After starting the development server, you can:

- **iOS Simulator**: Press `i` or scan QR code with Camera app
- **Android Emulator**: Press `a` or scan QR code with Expo Go
- **Web Browser**: Press `w` to open in browser
- **Physical Device**: Install Expo Go app and scan QR code

### Build Commands

```bash
# Start development server
npm start

# Start for specific platform
npm run android    # Android
npm run ios        # iOS
npm run web        # Web

# Code linting
npm run lint

# Reset project (removes starter code)
npm run reset-project
```

## 📁 Project Structure

```
Ethiogram/
├── app/                    # Main application screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── user/              # User profile screens
│   ├── _layout.tsx        # Root layout component
│   └── index.tsx          # Entry screen
├── components/            # Reusable UI components
│   ├── Comment.tsx        # Comment display component
│   ├── Post.tsx           # Post display component
│   ├── Stories.tsx        # Stories container
│   ├── Story.tsx          # Individual story component
│   └── ...               # Other UI components
├── convex/               # Backend functions and schema
│   ├── auth.config.ts    # Authentication configuration
│   ├── posts.ts          # Post-related database operations
│   ├── stories.ts        # Stories functionality
│   ├── users.ts          # User management
│   ├── comments.ts       # Comment system
│   ├── notifications.ts  # Push notification handling
│   └── schema.ts         # Database schema definitions
├── constants/            # App constants and configurations
├── providers/            # Context providers
├── styles/              # Global styles and themes
└── assets/              # Images, fonts, and static assets
```

## 🔧 Configuration

### Convex Backend Setup
1. Create a Convex account at [convex.dev](https://convex.dev)
2. Initialize Convex in your project:
   ```bash
   npx convex dev
   ```
3. Deploy your functions:
   ```bash
   npx convex deploy
   ```

### Clerk Authentication Setup
1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Get your API keys from the Clerk dashboard
3. Configure authentication providers (email, social login, etc.)

## 📱 Features Overview

### Authentication Flow
- Secure user registration and login
- Social authentication options
- User session management
- Profile creation and editing

### Content Management
- **Posts**: Create posts with images, videos, and captions
- **Stories**: Share temporary content with automatic expiration
- **Comments**: Threaded comment system with real-time updates
- **Reactions**: Like and bookmark posts
- **Media Upload**: Support for multiple image and video formats

### Social Features
- **Follow System**: Follow and unfollow users
- **User Discovery**: Explore new users and content
- **Notifications**: Real-time updates for interactions
- **Direct Messaging**: Private conversations between users

### Advanced Features
- **Content Reporting**: Flag inappropriate content
- **Download Media**: Save posts to device
- **Search**: Find users and content
- **Privacy Controls**: Manage who can see your content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow TypeScript best practices
2. Use consistent naming conventions
3. Write meaningful commit messages
4. Test your changes on multiple platforms
5. Update documentation as needed

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the excellent development platform
- [Convex](https://convex.dev) for the real-time backend infrastructure
- [Clerk](https://clerk.dev) for authentication services
- [React Native](https://reactnative.dev) community for continuous innovation

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React Native and Expo**
