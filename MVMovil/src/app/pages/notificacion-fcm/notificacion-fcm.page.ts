import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notificacion-fcm',
  templateUrl: './notificacion-fcm.page.html',
  styleUrls: ['./notificacion-fcm.page.scss'],
})
export class NotificacionFcmPage implements OnInit {

  notificacion: any = [];
  message: String = "";
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
  ) { }

  ngOnInit() {
      
  }
  ionViewDidEnter(){
    this.cargarData();
  }
  async cargarData(){
    await this.route.paramMap.subscribe( async params => {
      let data = await params.get('data');
      this.notificacion = await JSON.parse(data);
      this.message = this.notificacion['message'];
    });
  }
}
