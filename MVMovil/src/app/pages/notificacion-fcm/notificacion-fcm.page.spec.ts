import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotificacionFcmPage } from './notificacion-fcm.page';

describe('NotificacionFcmPage', () => {
  let component: NotificacionFcmPage;
  let fixture: ComponentFixture<NotificacionFcmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionFcmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionFcmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
