import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonContent } from '@ionic/angular';
import { star } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
    });
   }

  ngOnInit() {
  }
  async cerrar(){
    await this._authService.logout().then(
      (resp) => { 
        this.router.navigate(["/login"]);
      }
    );
  }
}
