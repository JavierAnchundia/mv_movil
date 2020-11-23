import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajeImagenService {
  constructor(private http: HttpClient) {}

  /**
   * Se encarga de guardar la publicacion en el servidor
   * @param imagen informacion de la publicacion tipo imagen
   * @param token del usuario
   */
  postImagen(imagen, token): Observable<FormData> {
    let url = URL_SERVICIOS.himagen_post;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, imagen, httpOptions);
  }

  /**
   * Se encarga de eliminar la publicacion en del servidor y la bd
   * @param id del homeneje del tipo imagen
   */
  deleteImagen(id) {
    let url = URL_SERVICIOS.himagen_del + id + "/";
    return this.http.delete(url, { observe: "response" });
  }
}
