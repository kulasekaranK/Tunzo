import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { musicalNotes, warning, close, mail, lockClosed, eyeOff, eye, logIn, logoGoogle, logoApple, bug } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoginMode = true;
  showPassword = false;
  errorMessage = '';
  debugInfo = '';
  isLoading = false;
  loadingMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private zone: NgZone
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    addIcons({ musicalNotes, warning, close, mail, lockClosed, eyeOff, eye, logIn, logoGoogle, logoApple, bug });
  }

  ngOnInit() {
    // Check if user is already authenticated
    this.authService.user$.subscribe(user => {
      if (user) {
        this.zone.run(() => {
          this.router.navigate(['/tabs/tab1']);
        });
      }
    });
  }

  async onSubmit() {
    this.clearErrors();
    
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.isLoading = true;
      this.loadingMessage = this.isLoginMode ? 'Signing in...' : 'Creating account...';
      
      try {
        if (this.isLoginMode) {
          await this.authService.signIn(email, password);
        } else {
          await this.authService.signUp(email, password);
        }
        
        this.zone.run(async () => {
          this.isLoading = false;
          await this.showToast(this.isLoginMode ? 'Welcome back!' : 'Account created successfully!', 'success');
        });
      } catch (error: any) {
        this.zone.run(async () => {
          this.isLoading = false;
          await this.handleAuthError(error);
        });
      }
    } else {
      this.errorMessage = 'Please fill in all fields correctly';
      await this.showToast('Please fill in all fields correctly', 'warning');
    }
  }

  async signInWithGoogle() {
    this.clearErrors();
    this.isLoading = true;
    this.loadingMessage = 'Signing in with Google...';
    
    try {
      await this.authService.signInWithGoogle();
      this.zone.run(async () => {
        this.isLoading = false;
        await this.showToast('Welcome!', 'success');
      });
    } catch (error: any) {
      this.zone.run(async () => {
        this.isLoading = false;
        await this.handleAuthError(error);
      });
    }
  }

  async signInWithApple() {
    this.clearErrors();
    this.isLoading = true;
    this.loadingMessage = 'Signing in with Apple...';
    
    try {
      await this.authService.signInWithApple();
      this.zone.run(async () => {
        this.isLoading = false;
        await this.showToast('Welcome!', 'success');
      });
    } catch (error: any) {
      this.zone.run(async () => {
        this.isLoading = false;
        await this.handleAuthError(error);
      });
    }
  }

  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Reset Password',
      message: 'Enter your email address to receive a password reset link.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email address'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Reset Link',
          handler: async (data) => {
            if (data.email) {
              try {
                await this.authService.resetPassword(data.email);
                await this.showToast('Password reset link sent to your email', 'success');
              } catch (error) {
                await this.handleAuthError(error);
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
    this.clearErrors();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async testConnection() {
    this.clearErrors();
    
    try {
      this.debugInfo = 'Testing Firebase connection...';
      
      // Test Firebase Auth
      const auth = this.authService.getCurrentUser();
      this.debugInfo += `\nCurrent user: ${auth ? auth.email : 'Not authenticated'}`;
      
      // Test platform detection
      this.debugInfo += `\nPlatform: ${Capacitor.isNativePlatform() ? 'Native' : 'Web'}`;
      
      // Test Firebase Auth state
      this.debugInfo += `\nFirebase Auth initialized: ${auth !== null ? 'Yes' : 'No'}`;
      
      await this.showToast('Connection test completed - check debug info', 'success');
    } catch (error: any) {
      this.errorMessage = 'Connection test failed';
      this.debugInfo = `Test Error: ${JSON.stringify(error, null, 2)}`;
      await this.showToast('Connection test failed', 'danger');
    }
  }

  private async handleAuthError(error: any) {
    let message = 'An error occurred. Please try again.';
    let debugMessage = `Error Code: ${error.code || 'Unknown'}\nError Message: ${error.message || 'No message'}\nFull Error: ${JSON.stringify(error, null, 2)}`;
    
    // Handle Firebase Auth errors
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists.';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters long.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection.';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid credentials. Please check your email and password.';
        break;
      case 'auth/operation-not-allowed':
        message = 'This sign-in method is not enabled.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please sign in again to complete this action.';
        break;
      // Handle Social Login specific errors
      case 'SOCIAL_LOGIN_ERROR':
        message = 'Social login failed. Please try again.';
        break;
      case 'SOCIAL_LOGIN_CANCELLED':
        message = 'Social login was cancelled.';
        break;
      case 'SOCIAL_LOGIN_NOT_CONFIGURED':
        message = 'Social login is not properly configured. Please contact support.';
        break;
      case 'SOCIAL_LOGIN_NETWORK_ERROR':
        message = 'Network error during social login. Please check your internet connection.';
        break;
      case 'SOCIAL_LOGIN_INVALID_RESPONSE':
        message = 'Invalid response from social login provider. Please try again.';
        break;
      // Handle generic errors
      default:
        if (error.message && error.message.includes('cancelled')) {
          message = 'Login was cancelled.';
        } else if (error.message && error.message.includes('network')) {
          message = 'Network error. Please check your internet connection.';
        } else if (error.message && error.message.includes('configuration')) {
          message = 'Login configuration error. Please contact support.';
        }
        break;
    }

    this.errorMessage = message;
    this.debugInfo = debugMessage;
    
    await this.showToast(message, 'danger');
  }

  clearErrors() {
    this.errorMessage = '';
    this.debugInfo = '';
  }

  clearDebug() {
    this.debugInfo = '';
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}