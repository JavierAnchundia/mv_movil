import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajeTextoService {
  constructor(private http: HttpClient) {}

  /**
   * Se encarga de guardar la publicacion en el servidor
   * @param texto informacion de la publicacion tipo texto
   * @param token
   */
  postTexto(texto, token): Observable<FormData> {
    let url = URL_SERVICIOS.hmensaje_post;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, texto, httpOptions);
  }

  /**
   * Se encarga de eliminar la publicacion en del servidor y la bd
   * @param id del homeneje del tipo texto
   */
  deleteTexto(id) {
    let url = URL_SERVICIOS.hmensaje_del + id + "/";
    return this.http.delete(url, { observe: "response" });
  }
}
