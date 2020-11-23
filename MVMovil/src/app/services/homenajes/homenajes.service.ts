import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajesService {
  private _cargarMuro = new Subject<string>();
  muroMensaje$ = this._cargarMuro.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    this._cargarMuro.next(message);
  }

  /**
   * Permite guardar el homenaje general realizado a un perfil de difunto
   * @param homenaje informacion del homenaje que puede contener informacion ya sea imagen,
   * texto, audio o video
   * @param token del usuario
   */
  postHomenajeGeneral(homenaje, token): Observable<FormData> {
    let url = URL_SERVICIOS.homenaje_post;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, homenaje, httpOptions);
  }

  /**
   * Permite obtenerel listado de los homenajes realizados en un perfil de difunto
   * @param id del difunto
   */
  getHomenajesDifunto(id: String) {
    let url = URL_SERVICIOS.homenajes + id + "/";
    return this.http.get(url);
  }

  /**
   * Permite actualizar el contador del numero de rosas que tienen un difunto
   * @param id del difunto
   */
  dejarRosa(id: any) {
    let url = URL_SERVICIOS.addRoses + id + "/1/";

    return this.http.patch(url, 1);
  }

  /**
   * Permite crear un registro en la base de datos sobre quien ha dejado una rosa en el perfil de un
   * difunto
   * @param registro contiene informacion del id del usuario y del difunto
   * @param token del ususaurio
   */
  postRegistroRosa(registro, token) {
    let url = URL_SERVICIOS.registroRosa;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post(url, registro, httpOptions);
  }

  /**
   * Obtiene el registro de que usuarios han dejado rosas en el perfil del usuario
   * @param id del difunto
   */
  getLogRosas(id: any) {
    let url = URL_SERVICIOS.logRosas + id + "/";
    return this.http.get(url);
  }
}
