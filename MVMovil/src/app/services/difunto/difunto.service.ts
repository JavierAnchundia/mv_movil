import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DifuntoService {
  constructor(private http: HttpClient) {}

  /**
   * Permite obtener los difuntos que pertenecen a un camposanto y que coincida con los parametros
   * @param id del camposanto
   * @param nombre del difunto
   * @param apellido del difunto
   */
  getDifuntos(id, nombre, apellido) {
    let url = URL_SERVICIOS.difuntos + id + "/" + nombre + "/" + apellido + "/";
    return this.http.get(url);
  }

  /**
   * Obtiene la informacion de un difunto a traves de su id
   * @param id del difunto
   */
  getDifuntoByID(id) {
    let url = URL_SERVICIOS.difunto + id + "/";
    return this.http.get(url);
  }

  private _recargarListaDifuntos = new Subject<string>();
  updateInfoDifunto$ = this._recargarListaDifuntos.asObservable();

  /**
   * Permite escuchar cuando se haga una publicacion para que active una funcion que recarge
   * la lista de publicacion en el muro difunto
   * @param message de validacion
   */
  recarga_Lista_Difunto(message: string) {
    this._recargarListaDifuntos.next(message);
  }
}
