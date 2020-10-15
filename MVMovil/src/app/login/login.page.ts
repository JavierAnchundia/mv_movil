import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showSpinner: Boolean = false;
  token: String;
  userID: String;
  credentialsForm: FormGroup;
  showPassword: boolean = false;
  passwordToggle: String = 'eye';

  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private alertController: AlertController,
    private facebook: Facebook,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private keyboard: Keyboard,
    private loadingController: LoadingController
  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
      
    this.keyboard.disableScroll(true);
    });
   }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  
  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if(this.passwordToggle == 'eye'){
      this.passwordToggle = 'eye-off';
    }
    else{
      this.passwordToggle = 'eye';
    }
  }
  
  async onSubmit(){
    
    await this.showAuthLoading('idAuth');
    await this._authService.login(this.credentialsForm.value).subscribe(
      (resp) => {
        if(resp){
          this.dismissAuthLoading('idAuth');
          // this.showSpinner = false;
        }
      },
      (error) =>{
          this.dismissAuthLoading('idAuth');
          console.log(error.status)
          this.loginAlert();
          // this.showSpinner = false;
      }
    );
  }

  


  async signIn(): Promise<void> {
    // this.showSpinner = true;
    await this.showAuthLoading('idAuth');
    await this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
        let access_token = {
          "access_token": response.authResponse.accessToken
        }
        this._authService.crearUsuarioFB(access_token).subscribe(
          (resp) => {
            if(resp){
              this.dismissAuthLoading('idAuth');
              // this.showSpinner = false;
            }
          },
          (error) =>{
              console.log(error.status)
              this.dismissAuthLoading('idAuth');
              this.facebbookAlert();
              // this.showSpinner = false;
          }
        );
      // });
    });
  }
  
  // mostrar login controller de authenticando usuario
  async showAuthLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Autenticando credenciales...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller para authenticacion de usuario
  async dismissAuthLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async loginAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Login',
      message: 'Credenciales Incorrectas.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async facebbookAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Facebook',
      message: 'No es posible autenticarse con facebook',
      buttons: ['OK']
    });
    await alert.present();
  }
}
