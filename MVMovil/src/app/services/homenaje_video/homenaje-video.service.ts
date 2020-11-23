import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajeVideoService {
  constructor(private http: HttpClient) {}

  /**
   * Se encarga de guardar la publicacion en el servidor
   * @param video informacion de la publicacion tipo video
   * @param token del usuario
   */
  postVideo(video, token): Observable<FormData> {
    let url = URL_SERVICIOS.hvideo_post;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, video, httpOptions);
  }

  /**
   * Se encarga de eliminar la publicacion en del servidor y la bd
   * @param id del homeneje del tipo video
   */
  deleteVideo(id) {
    let url = URL_SERVICIOS.hvideo_del + id + "/";
    return this.http.delete(url, { observe: "response" });
  }
}
