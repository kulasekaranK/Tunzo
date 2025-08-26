import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() { }

  async requestPermission() {
    const perm = await LocalNotifications.requestPermissions();
    return perm.display === 'granted';
  }

  async scheduleBasic() {

    const musicNotifications = [
      { title: "Your daily soundtrack is here!", body: "We've curated a playlist just for you." },
      { title: "New music is waiting for you.", body: "Check out the latest hits and trending tracks." },
      { title: "What's your mood today?", body: "Find the perfect music to match your vibe." },
      { title: "Discover your next favorite song.", body: "Explore new genres and artists you'll love." },
      { title: "Time for a music break?", body: "Take a moment to relax and listen to your favorite tunes." },
      { title: "Don't miss these new releases.", body: "The hottest new albums have just dropped." },
      { title: "Your ears will thank you.", body: "Treat yourself to some amazing music." },
      { title: "Fresh tracks added.", body: "We've updated our playlists with fresh music." },
      { title: "Need a beat?", body: "Open Tunzo and find your beat." },
      { title: "The perfect song is one tap away.", body: "Tap to discover a song that will make your day." },
      { title: "Vibe with our new playlist.", body: "Get lost in our latest curated playlist." },
      { title: "Music for every moment.", body: "From morning commutes to evening chills, we've got you covered." },
      { title: "Let the music play.", body: "Hit play and let the music take over." },
      { title: "Feeling the rhythm?", body: "Feel the beat and let the music move you." },
      { title: "Your personal concert is ready.", body: "Your front-row seat to the best music is here." },
      { title: "Unlock new sounds.", body: "Discover hidden gems and new artists." },
      { title: "Handpicked for you.", body: "A selection of songs chosen with you in mind." },
      { title: "Escape with music.", body: "Leave the world behind with our curated soundscapes." },
      { title: "The ultimate listening experience.", body: "Experience music like never before." },
      { title: "Just press play.", body: "Your next favorite song is waiting." },
      { title: "Sound on!", body: "Turn up the volume and enjoy." },
      { title: "Your day just got better.", body: "A little music can make a big difference." },
      { title: "We've got the beats.", body: "From pop to rock, we have it all." },
      { title: "Ready to rock?", body: "Let's make some noise!" },
      { title: "Tune in now.", body: "Open Tunzo for your daily dose of music." }
    ];

    const notificationTimes = [8, 11, 14, 18, 20, 24]; // 8 AM, 11 AM, 2 PM, 6 PM, 8 PM, 12 AM
    const notifications: LocalNotificationSchema[] = [];

    for (let i = 0; i < notificationTimes.length; i++) {
      const randomNotification = musicNotifications[Math.floor(Math.random() * musicNotifications.length)];
      const notification: LocalNotificationSchema = {
        id: i + 1,
        title: randomNotification.title,
        body: randomNotification.body,
        sound: 'fav.wav',
        schedule: {
          on: {
            hour: notificationTimes[i],
            minute: 0
          },
          repeats: true,
          allowWhileIdle: true
        },
        extra: {
          data: 'goes here',
        },
        iconColor: '#0000FF',
      };
      notifications.push(notification);
    }

    await LocalNotifications.schedule({ notifications });
  }
}