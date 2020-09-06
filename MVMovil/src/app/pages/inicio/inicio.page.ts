import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonContent } from '@ionic/angular';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  async cerrar(){
    await this._authService.logout().then();
    this.router.navigate(["/login"]);
  }
}
