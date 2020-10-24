import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonContent, ToastController, NavController } from '@ionic/angular';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router,
    private platform: Platform,
    private menu: MenuController,
    public toastController: ToastController,
    private navCtrl: NavController,
  ) {
    this.menu.enable(true)
    this.platform.ready().then(() => {
      
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
    });
   }

  ngOnInit() {
    // this.menu.enable(true, 'menu_button');
  }
  // ionViewDidEnter(){
  //   this.menu.enable(true, 'menu_button');
  // }

  goSearch(){
    // this.navCtrl.navigateRoot('/search', { animated: true, animationDirection: 'forward' });
    this.router.navigate(['/search'])
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
