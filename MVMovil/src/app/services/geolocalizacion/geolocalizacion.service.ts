import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Difunto } from "../../models/difunto.model";

@Injectable({
  providedIn: "root",
})
export class GeolocalizacionService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene lista de puntos del poligono de donde esta el camposanto
   * @param id del camposanto
   */
  getListGeolocalizacion(id): Observable<any[]> {
    let url = URL_SERVICIOS.geolocalizacion_camp + String(id) + "/";
    return this.http.get<any[]>(url);
  }

  /**
   * Obtiene la informacion de geolocalizacion de un difunto
   * @param id del difunto
   */
  getDifuntoGeolocalizacion(id): Observable<Difunto> {
    let url = URL_SERVICIOS.difunto + id + "/";
    return this.http.get<Difunto>(url);
  }
}
