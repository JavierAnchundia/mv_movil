import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import URL_SERVICIOS from 'src/app/config/config';
import {​​​​ AlertController, Platform }​​​​ from '@ionic/angular';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private http: HttpClient,
    public platform: Platform,
  ) { }

  initFCM(){
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        this.saveTokenDevice(token.value).subscribe(
          (data)=>{
            alert(data+ token.value);
          }
        )
        // alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  saveTokenDevice(token){
    let plataformDevice = "";
    if (this.platform.is('android')){​​​​​​​ 
      plataformDevice = "android";
    }​​​​​​​
    else if(this.platform.is('ios')){​​​​​​​ 
      plataformDevice = "ios";
    }​​​​​​​
    let url = URL_SERVICIOS.post_token_device;
    let data = new FormData();
    data.append('token_device', token);
    data.append('id_user', '1');
    data.append('plataform', plataformDevice);
    return this.http.post(url, data);
  }
}
