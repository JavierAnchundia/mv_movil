import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { SectorService } from 'src/app/services/sector/sector.service';
import { TiposepulturaService } from 'src/app/services/tiposepultura/tiposepultura.service';
import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';
import { DifuntoService } from 'src/app/services/difunto/difunto.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchFG: FormGroup;
  id;
  lista_sector: any;
  lista_sepultura: any;
  sepulturaOption:any;
  sectorOption: string;
  showSpinner: Boolean = false;
  lista_resultados: any = [];
  id_camposanto: number = environment.camposanto.idCamposanto;


  constructor(
    public formBuilder: FormBuilder,
    public router: Router, 
    public _sector: SectorService, 
    public _sepultura: TiposepulturaService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private _difunto: DifuntoService,
    private platform: Platform,
    private loadingController: LoadingController
    ) 
    { 
    this.searchFG = new FormGroup({
      nombres: new FormControl(''),
      apellidos: new FormControl(''),
      tipoSepultura: new FormControl(''),
      sector: new FormControl(''),
      fechaDefuncion: new FormControl(''),
      noLapida: new FormControl('')
    });
    
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['inicio']);
    });
  }
  
  ngOnInit() {
    this.id = environment.camposanto.idCamposanto;
    this.cargarSector();
    this.cargarSepultura();
  }

  async onSubmit(value) {
    // this.showSpinner = true;
    await this.showSearchLoading('id_search');
    this.cargarResultados(value);
  }

  async cargarResultados(value) {
    await this._difunto.getDifuntos(this.id_camposanto, value.nombres, value.apellidos).toPromise()
      .then((resp: any) =>{
        // this.showSpinner = false;
        this.dismissSearchLoading('id_search');
        this.lista_resultados = resp;
        if(this.lista_resultados == 0){
          this.noFoundAlert();
        }
        else{
          let navigationExtras: NavigationExtras = { state: { listaFallecidos: this.lista_resultados} };
          this.router.navigate(['search-results'], navigationExtras);
        }
      },
      (error) =>{
        // this.showSpinner = false;
        this.dismissSearchLoading('id_search');
        this.noFoundAlert();
      }
    )
  }

  
  // mostrar register controller de registrar usuario
  async showSearchLoading(idLoading) {
    const loading = await this.loadingController.create({
      id: idLoading,
      cssClass: 'my-custom-class',
      message: 'Cargando difuntos...'
    });
    
    return await loading.present();
  }

  // ocultar loading controller para registrar de usuario
  async dismissSearchLoading(idLoading){
    return await this.loadingController.dismiss(null, null, idLoading);
  }

  async noFoundAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Resultado Busqueda',
      message: 'No se ha encontrado coicidencias con los parámetros solicitados',
      buttons: ['OK']
    });
    await alert.present();
  }

  cargarSector() {
    this._sector.getSector(this.id)
      .subscribe((resp: any) => {
        this.lista_sector = resp;
      })
  }

  cargarSepultura() {
    this._sepultura.getSepultura(this.id)
      .subscribe((resp: any) => {
        this.lista_sepultura = resp;
      })
  }

  onChangeSepultura(value) {
    this.sepulturaOption = value;
  }

  onChangeSector(value) {
    this.sectorOption = value;
  }

}
