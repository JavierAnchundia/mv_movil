import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonContent, ToastController, NavController } from '@ionic/angular';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { StorageNotificationService } from 'src/app/services/fcm/storage-notification.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { ChangeDetectorRef } from '@angular/core';

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
    private cRef: ChangeDetectorRef
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

    // this.menu.enable(true, 'menu_button');
  }

  actualizarEstado(numero, estado){
    this.numNotificationPush = numero;
    this.validateBadge = estado;
    this.cRef.detectChanges();
  }

  goSearch(){
    // this.navCtrl.navigateRoot('/search', { animated: true, animationDirection: 'forward' });
    this.router.navigate(['/search']);
  }



  goNotification(){
    this._storageFcm.set_NP(false);
    this._fcm.setNumNotification("0");
    this.router.navigate(['/notificacion']);
  }

  // ionViewWillEnter(){
  //   this.desbloquearIonMenu();
  // }
  // ionViewDidEnter(){
  //   this.desbloquearIonMenu();
  // }
  // desbloquearIonMenu(){
  //   this.menu.enable(true, 'menu_button');
  //   this.presentToast()
  // }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

}
