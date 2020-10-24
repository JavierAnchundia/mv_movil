import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) { }

  ngOnInit() {}

  async cerrar(){
    await this._authService.logout().then(
      (resp) => { 
        this.menu.enable(false);
        this.router.navigate(["/login"]);
      }
    );
  }
}
