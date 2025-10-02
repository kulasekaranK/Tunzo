# Tunzo Music Player - Authentication Setup

## Google Authentication Implementation

This project now includes Google authentication using Firebase Auth. The implementation supports both web and Android platforms.

### Features Implemented

1. **Google Sign-In**: Users can sign in using their Google account
2. **Authentication Guard**: Protects routes that require authentication
3. **Profile Tab**: New tab showing user details from Google account
4. **Sign Out**: Users can sign out from the profile page

### Files Added/Modified

#### New Files:
- `src/app/services/auth.service.ts` - Authentication service
- `src/app/guards/auth.guard.ts` - Route guard for protected routes
- `src/app/login/login.page.ts` - Login page component
- `src/app/login/login.page.html` - Login page template
- `src/app/login/login.page.scss` - Login page styles
- `src/app/profile/profile.page.ts` - Profile page component
- `src/app/profile/profile.page.html` - Profile page template
- `src/app/profile/profile.page.scss` - Profile page styles

#### Modified Files:
- `src/main.ts` - Added Firebase Auth provider
- `src/app/app.routes.ts` - Added login route and auth guard
- `src/app/tabs/tabs.routes.ts` - Added profile route
- `src/app/tabs/tabs.page.html` - Added profile tab
- `src/app/app.component.ts` - Added authentication state handling

### Setup Instructions

1. **Firebase Configuration**: The Firebase configuration is already set up in `src/main.ts` with your project credentials.

2. **Dependencies**: The required dependencies are already installed:
   - `@angular/fire` - Firebase integration for Angular
   - `firebase` - Firebase SDK

3. **Android Configuration**: For Android, the current implementation uses web-based Google Sign-In which works in Capacitor apps.

### How It Works

1. **App Launch**: When the app starts, it checks if a user is authenticated
2. **Unauthenticated Users**: Redirected to the login page
3. **Login Process**: Users click "Sign in with Google" button
4. **Authentication**: Firebase handles the Google authentication
5. **Success**: Users are redirected to the main app (tabs)
6. **Profile Access**: Users can view their profile in the new Profile tab
7. **Sign Out**: Users can sign out from the profile page

### Testing

1. **Web Testing**: Run `npm start` and test the authentication flow
2. **Android Testing**: Build and deploy to Android device using Capacitor

### Future Enhancements

For better native Android support, you can:
1. Implement native Google Sign-In using Capacitor plugins
2. Add biometric authentication
3. Add social login options (Facebook, Twitter, etc.)
4. Implement user preferences storage

### Notes

- The authentication state is persisted across app sessions
- Users need to be signed in to access the main app features
- The profile tab shows user information from their Google account
- Sign out clears the authentication state and redirects to login
