import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class NotificacionesService {
  constructor(private http: HttpClient) {}

  getNotificaciones(id) {
    const url = URL_SERVICIOS.notificacion_list + id + "/";
    return this.http.get(url);
  }
}
