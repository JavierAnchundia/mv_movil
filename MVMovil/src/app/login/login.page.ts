import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';


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
    private facebook: Facebook
  ) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
    this.showSpinner = true;
    await this._authService.login(this.credentialsForm.value).subscribe(
      (resp) => {
        if(resp){
          this.showSpinner = false;
        }
      },
      (error) =>{
          console.log(error.status)
          this.loginAlert();
          this.showSpinner = false;
      }
    );
  }

  async signIn(): Promise<void> {
    this.showSpinner = true;
    await this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,last_name', []).then(profile => {
         let dataUser = {
          'grant_type': 'convert_token',
          'client_id': environment.client_id,
          'backend': 'facebook',
          'token': response.authResponse.accessToken,
          'first_name': profile.first_name,
          'email': profile.email,
          'id_camposanto': environment.camposanto.idCamposanto
        }
        this._authService.crearUsuarioFB(dataUser).subscribe(
          (resp) => {
            if(resp){
              this.showSpinner = false;
            }
          },
          (error) =>{
              console.log(error.status)
              this.facebbookAlert();
              this.showSpinner = false;
          }
        );
      });
    });
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
