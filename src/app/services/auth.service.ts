import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential, OAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      this.isLoadingSubject.next(false);
    });
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const result = await FirebaseAuthentication.signInWithGoogle();
      if (result.user && result.credential?.idToken) {
        const credential = GoogleAuthProvider.credential(result.credential.idToken);
        await signInWithCredential(this.auth, credential);
      } else {
        throw new Error('No user data received from Google Sign-In');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async signInWithApple(): Promise<void> {
    try {
      const result = await FirebaseAuthentication.signInWithApple();
      if (result.user && result.credential?.idToken) {
        const credential = new OAuthProvider('apple.com').credential({
          idToken: result.credential.idToken,
          rawNonce: result.credential.nonce,
        });
        await signInWithCredential(this.auth, credential);
      } else {
        throw new Error('No user data received from Apple Sign-In');
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Sign out from Firebase Authentication plugin
      await FirebaseAuthentication.signOut();
      
      // Sign out from Firebase JS SDK
      await signOut(this.auth);
      
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }
}
