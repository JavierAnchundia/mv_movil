import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import URL_SERVICIOS from "src/app/config/config";

@Injectable({
  providedIn: "root",
})
export class HomenajeYoutubeService {
  constructor(private http: HttpClient) {}

  deleteVideoYotube(id) {
    let url = URL_SERVICIOS.hyoutube_del + id + "/";
    return this.http.delete(url, { observe: "response" });
  }
}
