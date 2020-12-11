import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-sugerencias",
  templateUrl: "./sugerencias.page.html",
  styleUrls: ["./sugerencias.page.scss"],
})
export class SugerenciasPage implements OnInit {
  form_sugerencia: FormGroup;
  idCamposanto: any;

  constructor(public formBuilder: FormBuilder) {}

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
}
