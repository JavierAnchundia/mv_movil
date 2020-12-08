import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class PaquetesService {
  constructor(private http: HttpClient) {}

  getPaquetes(id_camposanto) {
    let url = URL_SERVICIOS.paquetes_list + id_camposanto + "/";
    return this.http.get(url);
  }
}
