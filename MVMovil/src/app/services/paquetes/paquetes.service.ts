import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class PaquetesService {
  constructor(private http: HttpClient) {}

  /**
   * Permite llamar a la api de cargar paquetes que posee el camposanto
   * @param id del camposanto
   */
  getPaquetes(id) {
    let url = URL_SERVICIOS.paquetes_list + id + "/";
    return this.http.get(url);
  }
}
