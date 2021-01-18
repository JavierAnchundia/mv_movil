import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param id del camposanto
   * Esta funcion permite crear una soliticitud get http con el endpoint del servidor para obtener
   * la lista de notificaciones.
   */
  getNotificaciones(id) {
    const url = URL_SERVICIOS.notificacion_list + id + "/";
    return this.http.get(url);
  }
}
