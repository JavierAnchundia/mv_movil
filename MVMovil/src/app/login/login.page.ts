import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { AlertController, IonRouterOutlet, MenuController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { HomenajesService } from '../services/homenajes/homenajes.service';
import { Storage } from '@ionic/storage';

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';
const USERNAME = 'username';

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
  difunto: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private alertController: AlertController,
    private facebook: Facebook,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private keyboard: Keyboard,
    private loadingController: LoadingController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    private homenaje: HomenajesService,
    private storage: Storage,
  ) {
    // this.menu.enable(false);
    // this.platform.backButton.subscribeWithPriority(-1, () => {
    //   if (!this.routerOutlet.canGoBack()) {
    //     App.exitApp();
    //   }
      
    // this.keyboard.disableScroll(true);
    // });
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto
      }
      else{
        this.difunto = null;
      }
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
          this.menu.enable(true)
          this.dismissAuthLoading('idAuth');
          if(this.difunto != null){
            let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
            this.router.navigate(['muro-difunto'], navigationExtras);
          }
          else{
            this.router.navigate(['/inicio'])
          }
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

  register(){
    if(this.difunto){
      let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
      this.router.navigate(['/register'], navigationExtras);
    }
    else{
      this.router.navigate(['/register'])
    }
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
              this._authService.recarga_Info("recargar");
              // this._authService.getInfoUser()
              this.menu.enable(true)
              this.dismissAuthLoading('idAuth');
              if(this.difunto != null){
                let navigationExtras: NavigationExtras = { state: { difunto: this.difunto} };
                this.router.navigate(['muro-difunto'], navigationExtras);
              }
              else{
                this.router.navigate(['/inicio'])
              }
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
  goRecuperarContrasena(){
    this.router.navigate(['/recuperar-contrasena']);
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
