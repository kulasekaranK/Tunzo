import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },

  {
    path: 'tab1/settings',
    loadComponent: () => import('../settings/settings.page').then( m => m.SettingsPage)
  },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'chat',
        loadComponent: () => import('../chat/chat.page').then(m => m.ChatPage)
      },
      {
        path:'add-song',
        loadComponent: () => import('../add-song/add-song.page').then( m => m.AddSongPage)  
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full',
  },
];
