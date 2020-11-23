import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { DifuntoService } from "src/app/services/difunto/difunto.service";

@Component({
  selector: "app-search-results",
  templateUrl: "./search-results.page.html",
  styleUrls: ["./search-results.page.scss"],
})
export class SearchResultsPage implements OnInit {
  lista_resultados: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private _difuntos: DifuntoService
  ) {
    // this.platform.backButton.subscribeWithPriority(20, () => {
    //   this.router.navigate(['search']);
    // });
  }

  ngOnInit() {
    this.cargarDifuntos();
    this._difuntos.updateInfoDifunto$.subscribe((info) => {
      if (info == "recargar") {
        this.cargarDifuntos();
        this._difuntos.recarga_Lista_Difunto("null");
      }
    });
  }

  /**
   * Se encarga de cargar en la ventana los difuntos del resultado de la busqueda que realizo el usaurio
   */
  cargarDifuntos() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.lista_resultados = this.router.getCurrentNavigation().extras.state.listaFallecidos;
      }
    });
  }

  /**
   * Permite cambiar a la pantalla de muro para cargar el perfild del difunto escogido
   * @param difunto objeto con los datos difunto
   */
  cargar_muro(difunto) {
    let navigationExtras: NavigationExtras = { state: { difunto: difunto } };
    this.router.navigate(["muro-difunto"], navigationExtras);
  }
}
