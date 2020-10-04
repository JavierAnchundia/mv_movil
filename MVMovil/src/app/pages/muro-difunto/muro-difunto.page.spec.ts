import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MuroDifuntoPage } from './muro-difunto.page';

describe('MuroDifuntoPage', () => {
  let component: MuroDifuntoPage;
  let fixture: ComponentFixture<MuroDifuntoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuroDifuntoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MuroDifuntoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
