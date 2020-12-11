import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SobreNosotrosPage } from './sobre-nosotros.page';

describe('SobreNosotrosPage', () => {
  let component: SobreNosotrosPage;
  let fixture: ComponentFixture<SobreNosotrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobreNosotrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SobreNosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
