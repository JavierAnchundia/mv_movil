import { Injectable } from "@angular/core";
import URL_SERVICIOS from "src/app/config/config";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SectorService {
  constructor(private http: HttpClient) {}

  /**
   * Obtienen los sectores que tiene un camposanto
   * @param id del camposanto
   */
  getSector(id) {
    let url = URL_SERVICIOS.sector + id + "/";
    return this.http.get(url);
  }
}
