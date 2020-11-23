import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TiposepulturaService {
  constructor(private http: HttpClient) {}

  /**
   * Obtienene el listado de tipo de sepultura que tiene un camposanto
   * @param id del camposanto
   */
  getSepultura(id) {
    let url = URL_SERVICIOS.sepultura + id + "/";
    return this.http.get(url);
  }
}
