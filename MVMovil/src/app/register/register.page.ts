import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RegistrationValidator } from './registration_validator';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment'
import { AuthService } from '../services/auth/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  usuarioRegistro: Usuario;
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  idCamposanto: number;
  showSpinner: Boolean = false;

  showPassword: boolean = false;
  passwordToggle: String = 'eye';
  showConfiPassword: boolean = false;
  passwordConfiToggle: String = 'eye';

  constructor(
    public formBuilder: FormBuilder,
    private  router:  Router,
    private _authService: AuthService,
    private alertController: AlertController
    ) {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.formValidator();
  }

  ngOnInit() {

  }

  formValidator() {
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
      repeatPassword: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
    }, { validator: RegistrationValidator.validate.bind(this) })

    this.registrationFormGroup = new FormGroup({
      nombres: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      apellidos: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      passwordFormGroup: this.passwordFormGroup
    });
  }


  async onSubmitRegisterDetails() {
    this.showSpinner = true;
    let datosForm = this.registrationFormGroup.value;
    let splitEmamil = datosForm['email'].split("@");
    let username = splitEmamil[0];
    this.usuarioRegistro = {
      first_name: datosForm['nombres'],
      last_name: datosForm['apellidos'],
      email: datosForm['email'],
      username: username,
      password: datosForm['passwordFormGroup'].password,
      telefono: '',
      direccion: '',
      genero: '',
      tipo_usuario: 'uf',
      idcamposanto: this.idCamposanto
    }
    await this.confirmarRegistroAlert(this.usuarioRegistro);
  }

  async registerAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta Registro',
      message: 'Ya existe un usuario con la misma credencial.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmarRegistroAlert(usuario) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Desea continuar con el registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.showSpinner = false;
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this._authService.register(usuario).subscribe( 
              (resp) => {
                if(resp.status == 201){
                  let userLogin = {
                    email: usuario['email'],
                    password: usuario['password']
                  }
                  this._authService.login(userLogin).subscribe(
                    ()=>{
                      this.showSpinner = false;
                    }
                  );
                }
              },
              (error) =>{
                console.log(error.status)
                this.registerAlert();
                this.showSpinner = false;
              }
              
            );
          }
        }
      ]
    });
    await alert.present();
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
  toggleConfiPassword(): void {
    this.showConfiPassword = !this.showConfiPassword;
    if(this.passwordConfiToggle == 'eye'){
      this.passwordConfiToggle = 'eye-off';
    }
    else{
      this.passwordConfiToggle = 'eye';
    }
  }
}
