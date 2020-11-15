import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import URL_SERVICIOS from 'src/app/config/config';
import {​​​​ AlertController, Platform }​​​​ from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';

const { PushNotifications, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  dataNotificacion: any = [];
  constructor(
    private http: HttpClient,
    public platform: Platform,
    public router: Router,
    private zone: NgZone,
    private alertController: AlertController
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
        this.validarTokenDeviceStorage(token.value);
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
      async (notification: PushNotification) => {
        console.log(notification)
        this.dataNotificacion = await notification.data
        let data = await JSON.stringify(this.dataNotificacion);
        this.presentAlertNotification(data);
        // await this.delay(1500);
        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        console.log(notification)
        this.dataNotificacion = await notification.notification.data
        let data = await JSON.stringify(this.dataNotificacion);
        this.router.navigateByUrl(`/notificacion-fcm/${data}`);
        // alert('Push action performed: '+ body);
      }
    );

  }

  postTokenDevice(token){
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

  async validarTokenDeviceStorage(token) {
    let validatToken = await this.getLocalTokeDevice();
    if(validatToken.value){
      return true
    }
    else{
      this.postTokenDevice(token).subscribe(
        (data)=>{
          this.setLocalTokenDevice(data['token_device'], data['id_token_device']);
        }
      )
    }
  }

  async getLocalTokeDevice(){
    let value = await Storage.get({ key: 'token_fcm' });
    return value
  }
  async setLocalTokenDevice(token, id) {
    await Storage.set({
      key: 'token_fcm',
      value: JSON.stringify({
        id: id,
        token: token
      })
    });
  }

  async presentAlertNotification(data) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Confirm!',
      message: '<strong>Tiene una notificación, desea verla?</strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.router.navigateByUrl(`/notificacion-fcm/${data}`);
          }
        }
      ]
    });

    await alert.present();
  }
}
