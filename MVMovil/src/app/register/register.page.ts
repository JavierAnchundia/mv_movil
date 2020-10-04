import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RegistrationValidator } from './registration_validator';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment'
import { AuthService } from '../services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

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

  submitted = false;
  usernameLista: any = [];
  emailLista: any = [];
  lista_usuarios: any = [];
  id: any;
  constructor(
    public formBuilder: FormBuilder,
    private  router:  Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private platform: Platform,
    private loadingController: LoadingController
    ) 
    {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.router.navigate(['login']);
    });
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.formValidator();
    }

  ngOnInit() {
    this.id = environment.camposanto.idCamposanto;
    this.obtenerUsuarios();
  }

  formValidator() {
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
      repeatPassword: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
    }, { validator: RegistrationValidator.validate.bind(this) })

    this.registrationFormGroup = this.formBuilder.group({
      nombres: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      apellidos: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      passwordFormGroup: this.passwordFormGroup
    },
    {
      validator:[ 
        this.match_username(),
        this.match_email()
      ],
    }
    );
  }


  async onSubmitRegisterDetails() {
    this.submitted = true;
    // this.showSpinner = true;
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

  // mostrar register controller de registrar usuario
  async showRegisterLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Registrando datos...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller para registrar de usuario
  async dismissRegisterLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
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
            this.showRegisterLoading('register_load');
            this._authService.register(usuario).subscribe( 
              (resp) => {
                if(resp.status == 201){
                  let userLogin = {
                    username: usuario['username'],
                    password: usuario['password']
                  }
                  this._authService.login(userLogin).subscribe(
                    ()=>{
                      this.dismissRegisterLoading('register_load');
                    }
                  );
                }
              },
              (error) =>{
                console.log(error.status)
                this.dismissRegisterLoading('register_load');
                this.registerAlert();
                // this.showSpinner = false;
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

  async obtenerUsuarios() {
    await this._authService
      .getUsersAll()
      .toPromise()
      .then((data: any[]) => {
        this.lista_usuarios = data;
      });
    for (let i = 0; i < this.lista_usuarios.length; i++) {
      // console.log(this.lista_usuarios[i]['username'])
      this.usernameLista.push(this.lista_usuarios[i]['username']);
      if (this.lista_usuarios[i]['id_camposanto'] == this.id) {
        this.emailLista.push(this.lista_usuarios[i]['email']);
      }
    }
  }

  match_username() {
    // let username = this.adminForm.value.usuario;
    // username = String(username);
    return (formGroup: FormGroup) =>{
      let list_username = this.usernameLista;
      const usernameControl = formGroup.controls['username'];
      if (usernameControl.errors && ! usernameControl.errors.match_username) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (list_username.includes(usernameControl.value)) {
        usernameControl.setErrors({ usernameMatch: true });
      } else {
        usernameControl.setErrors(null);
      }
    }
  }

  match_email() {
    // let correo_u = this.adminForm.value.correo;
    // correo_u = String(correo_u);
    return (formGroup: FormGroup) =>{
      let list_correo = this.emailLista;
      const correoControl = formGroup.controls['email'];
      if (correoControl.errors && ! correoControl.errors.match_email) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (list_correo.includes(correoControl.value)) {
        correoControl.setErrors({ correoMatch: true });
      } else {
        correoControl.setErrors(null);
      }
    }
  }
}
