import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajeAudioService {
  constructor(private http: HttpClient) {}

  /**
   * Se encarga de guardar la publicacion en el servidor
   * @param audio informacion de la publicacion tipo audio
   * @param token del usuario
   */
  postAudio(audio, token): Observable<FormData> {
    let url = URL_SERVICIOS.haudio_post;
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, audio, httpOptions);
  }

  /**
   * Se encarga de eliminar la publicacion en el servidor y de la base de datos
   * @param id del homeneje del tipo audio
   */
  deleteAudio(id) {
    let url = URL_SERVICIOS.haudio_del + id + "/";
    return this.http.delete(url, { observe: "response" });
  }
}
