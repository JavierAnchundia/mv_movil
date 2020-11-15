import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  lista_resultados: any = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private platform: Platform,
    private menu: MenuController
    ) 
    {
    // this.platform.backButton.subscribeWithPriority(20, () => {
    //   this.router.navigate(['search']);
    // });
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.lista_resultados = this.router.getCurrentNavigation().extras.state.listaFallecidos
      }
    });
  }


  cargar_muro(difunto){
    let navigationExtras: NavigationExtras = { state: { difunto: difunto} };
    this.router.navigate(['muro-difunto'], navigationExtras);
  }
}
