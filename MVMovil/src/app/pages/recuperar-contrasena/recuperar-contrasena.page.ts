import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "src/app/services/auth/auth.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-recuperar-contrasena",
  templateUrl: "./recuperar-contrasena.page.html",
  styleUrls: ["./recuperar-contrasena.page.scss"],
})
export class RecuperarContrasenaPage implements OnInit {
  submitted = false;
  idCamposanto: any;
  recuperarForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.formValidator();
  }

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
  }

  /**
   * Construye las validaciones necesarias para el formulario de cambiar contraseña
   */
  formValidator() {
    this.recuperarForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
    });
  }

  /**
   * Encapsula la informacion para cambiar la contraseña
   */
  async onSubmit() {
    this.submitted = true;
    let datosForm = this.recuperarForm.value;
    let email = datosForm["email"];
    let id_camp = this.idCamposanto;
    await this.confirmarRecuperarAlert(email, id_camp);
  }

  /**
   * Muestra un alert pidiendo confirmacion para enviar o no el correo al usaurio
   * @param email del correo al que se desea que llegue el link
   * @param id_camp id del camposanto
   */
  async confirmarRecuperarAlert(email, id_camp) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: "Confirmar Envío",
      message: "Esta seguro que desea continuar?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "colorTextButton",
          handler: (blah) => {},
        },
        {
          text: "Sí",
          cssClass: "colorTextButton",
          handler: () => {
            this.showRegisterLoading("id_recuperar");
            this.sendEmailServer(email, id_camp);
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Permite contactar con el servidor para que envie un link que permitira cambiar la contraseña
   * del usaurio
   * @param email del correo al que se desea que llegue el link
   * @param id_camp id del camposanto
   */
  sendEmailServer(email, id_camp) {
    this._authService
      .sendEmail(email, id_camp)
      .toPromise()
      .then(
        (data) => {
          this.dismissRegisterLoading("id_recuperar");
          if (data["status"] == "success") {
            this.mensajeEnviadoAlert(
              data["status"],
              "Se ha enviado un link para cambiar su contraseña"
            );
          }
          if (data["status"] == "SMTPException") {
            this.mensajeEnviadoAlert(data["status"], "Servicio no disponible");
          }
        },
        (error) => {
          this.dismissRegisterLoading("id_recuperar");
          this.mensajeEnviadoAlert("error", "Servicio no disponible");
        }
      );
  }

  /**
   * Muestra un Alert Controller sobre el estado del envio del link para cambiar la contraseña
   * @param status indica si el correo fue enviado o no
   * @param message muestar el mensaje que se desea mostrar
   */
  async mensajeEnviadoAlert(status, message) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      message: "<strong>" + message + "</strong>",
      buttons: [
        {
          text: "Ok",
          cssClass: "colorTextButton",
          handler: () => {
            if (status == "success") {
              this.router.navigate(["inicio"]);
            } else {
            }
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Muestra un Loading Controller mientras se envia los datos al servidor
   * @param idLoading id del loading Controller
   */
  async showRegisterLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: "colorloading",
      message: "Enviando correo...",
    });

    return await loading.present();
  }

  /**
   * Oculta el Loading Controller cuando el servidor a enviado alguna respuesta
   * @param idLoading id del loading Controller
   */
  async dismissRegisterLoading(idLoading) {
    return await this.loadingController.dismiss(null, null, idLoading);
  }
}
