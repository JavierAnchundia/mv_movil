import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  @Input() ruta: string;
  @Input() enableIonMenu: string = 'false';
  constructor(
    private menu: MenuController,
  ) { }

  ngOnInit() {
    
  }
  validateIonMenu(){
    // if(this.enableIonMenu == "true"){
    //   this.habilitarIonMenu();
    // }
  }
  habilitarIonMenu(){
    this.menu.enable(true, 'menu_button');
  }
}
