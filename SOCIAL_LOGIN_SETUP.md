# Social Login Setup Guide for Tunzo

## Overview
This guide will help you complete the setup for Google and Apple Sign-In using the capacitor-social-login plugin.

## Issues Fixed

### 1. Import Statements ✅
- Fixed incorrect import in `login.page.ts` from `@capgo/social-login` to `@capgo/capacitor-social-login`
- Updated auth service to use correct import

### 2. Response Structure Handling ✅
- Fixed Google Sign-In to use `result.result` instead of `result.user`
- Fixed Apple Sign-In to use `result.result` instead of `result.user`
- Updated error handling for better user experience

### 3. Error Handling ✅
- Added comprehensive error handling for social login failures
- Added specific error codes for different failure scenarios
- Improved debug information display

### 4. Configuration Updates ✅
- Updated `capacitor.config.ts` with proper structure
- Added comments for required configuration values

## Required Setup Steps

### 1. Google Sign-In Setup

#### A. Google Cloud Console Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Create credentials for:
   - **Web application** (for web platform)
   - **Android application** (for Android platform)
   - **iOS application** (for iOS platform)

#### B. Update capacitor.config.ts
Replace the placeholder values in `capacitor.config.ts`:

```typescript
SocialLogin: {
  google: {
    // Replace with your actual Google OAuth client ID
    clientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    serverClientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com'
  },
  apple: {
    clientId: 'tunzo.app.com', // Your app bundle identifier
    scopes: ['name', 'email']
  }
}
```

#### C. Android Setup
1. Add your Google Services configuration file:
   - Download `google-services.json` from Firebase Console
   - Place it in `android/app/google-services.json`

2. Update `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

3. Update `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

#### D. iOS Setup
1. Add your Google Services configuration file:
   - Download `GoogleService-Info.plist` from Firebase Console
   - Add it to your iOS project in Xcode

2. Update `ios/App/AppDelegate.swift`:
```swift
import GoogleSignIn

func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    if GIDSignIn.sharedInstance.handle(url) {
        return true
    }
    return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
}
```

### 2. Apple Sign-In Setup

#### A. Apple Developer Console
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new App ID with Sign In with Apple capability
4. Configure Sign In with Apple service

#### B. iOS Configuration
1. Enable Sign In with Apple capability in Xcode
2. Add the capability to your app target
3. Configure the service identifier

### 3. Firebase Configuration

#### A. Enable Authentication Methods
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Google
   - Apple (if available)

#### B. Configure OAuth Redirect URIs
Add these redirect URIs in Google Cloud Console:
- `https://your-project-id.firebaseapp.com/__/auth/handler`
- `http://localhost:3000` (for development)

### 4. Testing

#### A. Test Connection
Use the "Test Connection" button in your login page to verify:
- Firebase Auth is working
- Social login providers are available
- Platform detection is working

#### B. Test Social Login
1. Test Google Sign-In on web and mobile
2. Test Apple Sign-In on iOS
3. Verify error handling for cancelled logins
4. Test network error scenarios

## Common Issues and Solutions

### Issue: "Social login is not properly configured"
**Solution**: Ensure all client IDs are correctly set in `capacitor.config.ts`

### Issue: "Network error during social login"
**Solution**: Check internet connection and verify OAuth redirect URIs

### Issue: "Invalid response from social login provider"
**Solution**: Verify the response structure matches the expected format

### Issue: Apple Sign-In not working on iOS
**Solution**: 
- Ensure Sign In with Apple capability is enabled
- Verify Apple Developer Console configuration
- Check iOS version compatibility (iOS 13+)

## Next Steps

1. **Complete Google Cloud Console setup** with actual client IDs
2. **Configure Firebase Authentication** methods
3. **Test on actual devices** (not just web browser)
4. **Implement Apple Sign-In server-side verification** for production
5. **Add proper error logging** for production debugging

## Production Considerations

1. **Server-side verification**: Implement JWT verification on your backend
2. **Error monitoring**: Add proper error tracking (Sentry, etc.)
3. **User data handling**: Ensure compliance with privacy regulations
4. **Rate limiting**: Implement proper rate limiting for authentication attempts

## Support

If you encounter issues:
1. Check the debug information in the login page
2. Verify all configuration files are properly set
3. Test on different platforms (web, Android, iOS)
4. Check Firebase Console for authentication logs

The login functionality should now work correctly with proper error handling and user feedback!

