import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HomenajesService } from 'src/app/services/homenajes/homenajes.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  ocultarFooter: boolean = false;
  constructor(
    private _authService: AuthService,
    private router: Router,
    private menu: MenuController,
    private homenaje: HomenajesService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.authenticationState.subscribe(
      state => {
        if(state){
          this.ocultarFooter = true;
        }
        else{
          this.ocultarFooter = false;
        }
      }
    )
  }

  login(){
    this.router.navigate(['/login'])
  }
  logoutSesion(){
    this._authService.logout().then(
      (resp) => { 
        this.menu.close()
        this.homenaje.sendMessage('null');
        // this.menu.enable(false);
        this.router.navigate(["/inicio"]);
      }
    );
  }
}
