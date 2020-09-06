import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  lista_resultados;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    ) 
    {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.lista_resultados = this.router.getCurrentNavigation().extras.state.listaFallecidos
      }
    });
   }

  ngOnInit() {

  }
}
