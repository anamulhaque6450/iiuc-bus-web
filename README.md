# IIUC Bus Finder Mobile App

A React Native mobile application for IIUC Bus Schedule management, built with Expo and TypeScript.

## Features

- 📱 **Cross-Platform**: Works on both iOS and Android
- 🔍 **Smart Search**: Advanced filtering and search capabilities
- 👤 **User Authentication**: Secure login/signup with Supabase
- 📊 **Real-time Data**: Live bus schedule information
- 🎨 **Modern UI**: Beautiful, responsive design with NativeWind
- 🔄 **Offline Support**: Works even with poor connectivity

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **NativeWind** for styling (Tailwind CSS for React Native)
- **Supabase** for backend and authentication
- **Expo Router** for navigation

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials.

4. Start the development server:
   ```bash
   npm start
   ```

### Building for Production

#### Android APK (for testing)
```bash
eas build --platform android --profile preview
```

#### Production Builds
```bash
# Android App Bundle (for Play Store)
eas build --platform android --profile production

# iOS (for App Store)
eas build --platform ios --profile production
```

### Deployment

#### Android Play Store
```bash
eas submit --platform android
```

#### iOS App Store
```bash
eas submit --platform ios
```

## Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home screen
│   ├── login.tsx          # Login screen
│   ├── signup.tsx         # Signup screen
│   └── dashboard.tsx      # Dashboard screen
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── data/                  # Static data and types
├── hooks/                 # Custom React hooks
├── assets/                # Images and static assets
└── types/                 # TypeScript type definitions
```

## Key Features

### Authentication
- Email/password signup and login
- University ID support for login
- Secure session management with Supabase

### Bus Schedule Management
- View all available bus schedules
- Filter by time, route, gender, schedule type
- Search functionality with smart suggestions
- Real-time updates

### User Dashboard
- Personalized schedule view
- Quick actions and shortcuts
- Profile management
- Statistics and insights

### Mobile-Optimized UI
- Touch-friendly interface
- Responsive design for all screen sizes
- Native navigation patterns
- Smooth animations and transitions

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both platforms
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact the development team or create an issue in the repository.