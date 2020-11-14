import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RegistrationValidator } from './registration_validator';
import { Usuario } from 'src/app/models/usuario.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { Storage } from '@ionic/storage';
import URL_SERVICIOS from 'src/app/config/config';

const { Camera } = Plugins;

const IDUSER = 'id_usuario';
const TOKEN_KEY = 'access_token';
const IMAGE_USER = "image_user";
const USERNAME = 'username';
const PASSWORD = 'password';
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  urlBackend: String = URL_SERVICIOS.url_backend;
  
  usuarioRegistro: Usuario;
  registrationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  idCamposanto: number;
  showSpinner: Boolean = false;
  isFacebook: boolean = false;
  showPassword: boolean = false;
  passwordToggle: String = 'eye';
  showConfiPassword: boolean = false;
  passwordConfiToggle: String = 'eye';
  userDetalle: any = [];
  submitted = false;
  usernameLista: any = [];
  emailLista: any = [];
  lista_usuarios: any = [];
  id: any;
  difunto: any = null;
  defaultImage: boolean = true;
  imagePerfil: String = "assets/AGREGAR_FOTO_PERFIL.png";
  imageUpload: String = "";
  nameFile: String = "";
  numericNumberReg = '[0-9]*';
  
  constructor(
    public formBuilder: FormBuilder,
    private  router:  Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private platform: Platform,
    private loadingController: LoadingController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private homenaje: HomenajesService,
    private storage: Storage,
    ) 
    {
    //   this.platform.backButton.subscribeWithPriority(0, () => {
    //   this.router.navigate(['login']);
    // });
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.formValidator();
    }

  ngOnInit() {
    this.recargarPerfil();
    this.id = environment.camposanto.idCamposanto;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.difunto = this.router.getCurrentNavigation().extras.state.difunto
      }
      else{
        this.difunto = null;
      }
    });
  }

  formValidator() {
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30)])],
      repeatPassword: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(30)])],
    }, { validator: RegistrationValidator.validate.bind(this) })

    this.registrationFormGroup = this.formBuilder.group({
      nombres: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])),
      apellidos: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      genero: new FormControl('', ),
      direccion: new FormControl('', Validators.compose([Validators.minLength(5)])),
      telefono: new FormControl('', Validators.compose([Validators.maxLength(10), Validators.minLength(9), Validators.pattern(this.numericNumberReg)])),
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

  recargarPerfil(){
    this.storage.get(IMAGE_USER).then(
      imagen => {
        if(imagen){
          this.imagePerfil = this.urlBackend+imagen;
        }
      }
    )
    this.storage.get(TOKEN_KEY).then(
      token => {
        if(token){
          this.storage.get(IDUSER).then(
            id => {
              if(id){
                this._authService.getInfoUser(id, token).toPromise().then(
                  (resp)=>{
                    console.log(resp);
                    this.userDetalle = resp;
                    this.registrationFormGroup.controls['nombres'].setValue(resp['first_name']);
                    this.registrationFormGroup.controls['apellidos'].setValue(resp['last_name']);
                    this.registrationFormGroup.controls['username'].setValue(resp['username']);
                    this.registrationFormGroup.controls['email'].setValue(resp['email']);
                    if(resp['direccion'] != null){
                      this.registrationFormGroup.controls['direccion'].setValue(resp['direccion']);
                    }
                    if(resp['telefono'] != null){
                      this.registrationFormGroup.controls['telefono'].setValue(resp['telefono']);
                    }
                    if(resp['is_facebook']){
                      this.isFacebook = true;
                    }
                    this.obtenerUsuarios();
                  }
                )
              }
            }
          )
        }
      }
    )
  }
  async capturarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      saveToGallery: true,
      source: CameraSource.Photos
    }).then(async (resp) => {
      this.imagePerfil = await 'data:image/png;base64,'+ resp.base64String;
      this.imageUpload = this.imagePerfil;
      this.defaultImage = false;
      this.nameFile = this.crearNombreArchivo();
    }); 
  }

  crearNombreArchivo() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".png";
    return newFileName;
  }

  async onSubmitRegisterDetails() {
    this.submitted = true;
    // this.showSpinner = true;
    let datosForm = this.registrationFormGroup.value;
    // let splitEmamil = datosForm['email'].split("@");
    // let username = splitEmamil[0];
    this.usuarioRegistro = {
      first_name: datosForm['nombres'],
      last_name: datosForm['apellidos'],
      email: datosForm['email'],
      username: datosForm['username'],
      password: datosForm['passwordFormGroup'].password,
      telefono: datosForm['telefono'],
      direccion: datosForm['direccion'],
      genero: datosForm['genero'],
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
      message: 'Actualizando datos...'
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
      message: 'Desea continuar con la actualización de los datos?',
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
            // console.log(this.userDetalle)
            this.showRegisterLoading('register_load');
            delete this.userDetalle['image_perfil'];
            if(usuario['genero'] == ''){
              console.log(true)
              delete this.userDetalle['genero'];
            }
            else{
              this.userDetalle['genero'] = usuario['genero']
            }
            if(usuario['direccion'] ==''){
              delete this.userDetalle['direccion'];
            }
            else{
              this.userDetalle['direccion'] = usuario['direccion'];
            }
            if(usuario['telefono'] == ''){
              delete this.userDetalle['telefono'];
            }
            else{
              this.userDetalle['telefono'] = usuario['telefono'];
            }
            if(usuario['password'] == ''){
              delete this.userDetalle['password'];
            }
            else{
              this.userDetalle['password'] = usuario['password'];
            }
            this.userDetalle['is_facebook'] = this.userDetalle['is_facebook'];
            this.userDetalle['is_active'] = true;
            // console.log(this.userDetalle)
            this.userDetalle['first_name'] = usuario['first_name'];
            this.userDetalle['last_name'] = usuario['last_name'];
            this.userDetalle['username'] = usuario['username'];
            this.userDetalle['email'] = usuario['email'];
            // console.log(this.userDetalle)
            this.storage.get(TOKEN_KEY).then(
              token => {
                if(token){
                  this.storage.get(USERNAME).then(
                    username => {
                      if(username){
                        this._authService.putInfoUser(token, username, this.userDetalle).subscribe( 
                          async (resp) => {
                            this.dismissRegisterLoading('register_load');
                              this.storage.set(FIRST_NAME, resp['first_name']).then(
                                (fname)=>{
                                  this.storage.set(LAST_NAME, resp['last_name']).then(
                                    (lname)=>{
                                      this._authService.recarga_Info('recargar');
                                    }
                                  )
                                }
                              );
                              if(!this.defaultImage){
                                await this.uploadImage(resp['id'], resp['image_perfil']);
                              }
                              if(!resp['is_facebook']){
                                this.storage.get(PASSWORD).then(
                                  password => {
                                    if(password){
                                      if(resp['username'] !== username || resp['password'] !== password){
                                        this.storage.set(USERNAME, resp['username']);
                                        this.storage.set(PASSWORD, resp['password']);
                                      }
                                    }
                                  }
                                )
                              }
                              else{
                                this.storage.set(USERNAME, resp['username']);
                              }
                              this.router.navigate(['/inicio']);
                          },
                          (error) =>{
                            console.log(error.status)
                            this.dismissRegisterLoading('register_load');
                            this.registerAlert();
                          }
                          
                        );
                      }
                    }
                  )
                }
              }
            )
            
          }
        }
      ]
    });
    await alert.present();
  }

  uploadImage(id, imgDelete){
    let data = new FormData();
    data.append('img_base64', this.imageUpload as string);
    data.append('nombre_file', this.nameFile as string);
    data.append('is_active', 'true');
    if(imgDelete !== null){
      data.append('delete_img', imgDelete);
    }
    this._authService.uploadImageProfile(id, data).toPromise().then(
      (resp)=>{
        console.log(resp)
        this.storage.set(IMAGE_USER, resp['image_perfil']).then(
          (imag)=>{
            this._authService.recarga_Info('recargar');
          }
        );
      }
    );        
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
      if(this.lista_usuarios[i]['username'] != this.userDetalle['username']){
        this.usernameLista.push(this.lista_usuarios[i]['username']);
      }
      if (this.lista_usuarios[i]['id_camposanto'] == this.id && this.lista_usuarios[i]['id_camposanto'] != this.userDetalle['email']) {
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
