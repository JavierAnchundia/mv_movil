import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  submitted = false;
  idCamposanto: any;
  recuperarForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private  router:  Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) {
    this.formValidator();
   }

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
  }

  formValidator() {

    this.recuperarForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
    }
    );
  }

  async onSubmit(){
    this.submitted = true;
    let datosForm = this.recuperarForm.value;
    let email = datosForm['email'];
    let id_camp = this.idCamposanto;
    await this.confirmarRecuperarAlert(email, id_camp);
  }

  async confirmarRecuperarAlert(email, id_camp) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar Envío',
      message: 'Esta seguro que desea continuar?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.showRegisterLoading('id_recuperar');
            this.sendEmailServer(email, id_camp);
          }
        }
      ]
    });
    await alert.present();
  }

  sendEmailServer(email, id_camp){
    this._authService.sendEmail(email, id_camp).toPromise().then(
      (data) => {
        this.dismissRegisterLoading('id_recuperar');
        if(data['status'] == "success"){
          this.mensajeEnviadoAlert(data['status'], 'Se ha enviado un link para cambiar su contraseña');
        }
        if(data['status'] == "SMTPException"){
          this.mensajeEnviadoAlert(data['status'], 'Servicio no disponible');
        }
      },
      (error) => {
        this.dismissRegisterLoading('id_recuperar');
        this.mensajeEnviadoAlert('error', 'Servicio no disponible');
      }
    )
  }
  
  async mensajeEnviadoAlert(status, message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: '<strong>'+ message +'</strong>',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if(status == "success"){
              this.router.navigate(['inicio']);
            }
            else{

            }
          }
        }
      ]
    });
    await alert.present();
  }

  // mostrar loading controller para recuperar contraseña
  async showRegisterLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Enviando correo...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller para recuperar contraseña
  async dismissRegisterLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
  }
}
