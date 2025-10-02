import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfilePage implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private alertController: AlertController
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  getInitials(): string {
    if (!this.user) return 'U';
    
    if (this.user.displayName) {
      return this.user.displayName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return this.user.email?.charAt(0).toUpperCase() || 'U';
  }

  getUserDisplayName(): string {
    if (!this.user) return 'User';
    
    if (this.user.displayName) {
      return this.user.displayName;
    }
    
    return this.user.email?.split('@')[0] || 'User';
  }

  getAvatarColor(): string {
    if (!this.user) return '#667eea';
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#fa709a', '#fee140', '#a8edea', '#fed6e3'
    ];
    
    const email = this.user.email || '';
    const hash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      mode: 'ios',
      cssClass: 'custom-dark-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign Out',
          handler: async () => {
            try {
              await this.authService.signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
