import { Component, OnInit } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-loader',
  templateUrl: './auth-loader.component.html',
  styleUrls: ['./auth-loader.component.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner],
})
export class AuthLoaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
