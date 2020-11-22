import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import URL_SERVICIOS from 'src/app/config/config';
import { Observable, BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  constructor(
    private http: HttpClient,
  ) { }

  agregarFavorito(favorito, token ):Observable<FormData>{
    let url = URL_SERVICIOS.favoritos;
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+token,
      })
    }
    return this.http.post<FormData>(url,favorito,httpOptions)
  }

  //Con información de difuntos
  obtenerFavoritos(id, token){
    let url = URL_SERVICIOS.favoritos + id +'/';
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token,
      })
    }
    return this.http.get(url, httpOptions);
  }

  //Obtener sólo los IDs de los difuntos
  loadFavoritos(id, token){
    let url = URL_SERVICIOS.favoritos_list + id + '/';
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+token,
      })
    }
    return this.http.get(url, httpOptions);

  }

  removeFavorito(id_usuario, id_difunto, token){
    let url = URL_SERVICIOS.favoritos_del +id_usuario + '/'+ id_difunto   + '/';
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+token,
      }),
    }

    return this.http.delete(url,httpOptions);
  }

  private _recargarListaFavoritos = new Subject<string>();
  updateInfoFav$ = this._recargarListaFavoritos.asObservable();

  recarga_Info_Fav(message: string){
    this._recargarListaFavoritos.next(message);
  }
}
