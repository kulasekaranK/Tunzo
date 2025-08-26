import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tunzo.app.com',
  appName: 'Tunzo',
  webDir: 'www',
   plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
      sound: 'fav.wav'
    },
  },
};


export default config;
