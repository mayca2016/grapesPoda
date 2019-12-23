import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalirPage } from './salir.page';

describe('SalirPage', () => {
  let component: SalirPage;
  let fixture: ComponentFixture<SalirPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalirPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
