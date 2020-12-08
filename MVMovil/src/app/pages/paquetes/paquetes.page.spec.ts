import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { PaquetesPage } from "./paquetes.page";

describe("Paquetes1Page", () => {
  let component: PaquetesPage;
  let fixture: ComponentFixture<PaquetesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaquetesPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaquetesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
