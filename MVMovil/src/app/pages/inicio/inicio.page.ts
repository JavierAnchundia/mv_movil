import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonContent, ToastController, NavController, AlertController } from '@ionic/angular';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { StorageNotificationService } from 'src/app/services/fcm/storage-notification.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { ChangeDetectorRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import INFO_SESION from 'src/app/config/infoSesion';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  validateBadge: boolean = false;
  numNotificationPush: any = 0;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private platform: Platform,
    private menu: MenuController,
    public toastController: ToastController,
    private navCtrl: NavController,
    private _storageFcm: StorageNotificationService,
    private _fcm: FcmService,
    private cRef: ChangeDetectorRef,
    private alertController: AlertController,
    private storage: Storage,
  ) {
    this.menu.enable(true)
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(5, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
    });
   }

  ngOnInit() {
    this._storageFcm.updateNumNP$.subscribe(
      async (estado) =>{
        if(estado){
          let data = await this._fcm.getNumNotification(); 
          this.actualizarEstado(data.value, true);
        }
        else{
          this.actualizarEstado(0, false);
        }
      }
    );
  }

  actualizarEstado(numero, estado){
    this.numNotificationPush = numero;
    this.validateBadge = estado;
    this.cRef.detectChanges();
  }

  goSearch(){
    this.router.navigate(['/search']);
  }

  goFavoritos(){
    this.storage.get(INFO_SESION.TOKEN_KEY).then(
      (token) => {
        if(token){
          this.router.navigate(['/favoritos']);
        }
        else{
          this.loginMessageAlertMuro('Por favor inicie sesión o registrese para ver sus favoritos');
        }
      }
    );
  }

  goNotification(){
    this._storageFcm.set_NP(false);
    this._fcm.setNumNotification("0");
    this.router.navigate(['/notificacion']);
  }

  async loginMessageAlertMuro(message) {
    const alert = await this.alertController.create({
      cssClass: 'controlerAlert',
      // header: 'Confirm!',
      message: '<strong>'+message+'</strong>',
      buttons: [
        {
          text: 'Login',
          cssClass: 'colorTextButton',
          handler: () => {
            this.router.navigate(['login']);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'colorTextButton',
          handler: () => {
            
          }
        }
      ]
    });

    await alert.present();
  }
}
