import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-sugerencias",
  templateUrl: "./sugerencias.page.html",
  styleUrls: ["./sugerencias.page.scss"],
})
export class SugerenciasPage implements OnInit {
  form_sugerencia: FormGroup;
  idCamposanto: any;

  constructor(
    public formBuilder: FormBuilder,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.idCamposanto = environment.camposanto.idCamposanto;
    this.form_sugerencia = this.formBuilder.group({
      mensaje: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(30),
        ])
      ),
    });
  }

  enviarSugerencia() {
    let message = "Opción de enviar sugerencia no disponible por el momento";
    let title = "";
    this.mostarAlert(message, title);
  }

  /**
   * Muesta un alerta con informacion que se desea mostar al usuario
   * @param title Titulo que se desea mostar
   * @param message Mensaje que se desea mostar
   */
  async mostarAlert(message, title) {
    const alert = await this.alertController.create({
      cssClass: "controlerAlert",
      header: title,
      message: message,
      buttons: [{ text: "OK", cssClass: "colorTextButton" }],
    });
    await alert.present();
  }
}
