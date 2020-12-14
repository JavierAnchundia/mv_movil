import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class CamposantoService {

  constructor(
    private http: HttpClient,
  ) { }

  getEmpresa(id){
    let url = URL_SERVICIOS.empresa_get + id + '/';
    return this.http.get(url);
  }

  getCamposantoByID(id) {
    let url = URL_SERVICIOS.camposanto + id + '/';
    return this.http.get(url)
  }
}
