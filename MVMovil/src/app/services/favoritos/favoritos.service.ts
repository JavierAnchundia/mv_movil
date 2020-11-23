import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FavoritosService {
  private _recargarListaFavoritos = new Subject<string>();
  updateInfoFav$ = this._recargarListaFavoritos.asObservable();

  constructor(private http: HttpClient) {}
  /**
   * Permite crear un observable que permita actualizar el ion-badge de la pantalla de
   * incio para las notificaciones nuevas
   * @param message de validacion
   */
  recarga_Info_Fav(message: string) {
    this._recargarListaFavoritos.next(message);
  }

  /**
   * Permite guardar un perfil de difunto como favorito en la base de datos
   * @param favorito contiene el id del usuario y el id del dinfunto
   * @param token del usuario
   */
  agregarFavorito(favorito, token): Observable<FormData> {
    let url = URL_SERVICIOS.favoritos;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, favorito, httpOptions);
  }

  /**
   * Permite obtener los perfiles de difuntos que un usaurio tiene como favoritos
   * @param id del usuario
   * @param token del usuario
   */
  obtenerFavoritos(id, token) {
    let url = URL_SERVICIOS.favoritos + id + "/";
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get(url, httpOptions);
  }

  /**
   * Obtiene los id de todos los favoritos que existen en la base de datos
   * @param id del usaurio
   * @param token del usuario
   */
  loadFavoritos(id, token) {
    let url = URL_SERVICIOS.favoritos_list + id + "/";
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get(url, httpOptions);
  }

  /**
   * Remueve un perfil de la lista de favoritos que tienen un usuario
   * @param id_usuario del usuario que ha iniciado sesion
   * @param id_difunto del difunto
   * @param token del usaurio
   */
  removeFavorito(id_usuario, id_difunto, token) {
    let url = URL_SERVICIOS.favoritos_del + id_usuario + "/" + id_difunto + "/";
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.delete(url, httpOptions);
  }
}
