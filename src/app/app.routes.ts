import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  {
    path: 'liked-songs',
    loadComponent: () => import('./app/liked-songs/liked-songs.page').then( m => m.LikedSongsPage)
  },
  {
    path: 'liked-videos',
    loadComponent: () => import('./app/liked-videos/liked-videos.page').then( m => m.LikedVideosPage)
  }
];
