import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class SugerenciasService {
  constructor(private http: HttpClient) {}

  postSugerencia(sugerencia: FormData, token: string) {
    const url = URL_SERVICIOS.contactoPost;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post<FormData>(url, sugerencia, httpOptions);
  }
}
