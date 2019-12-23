import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HpodaPage } from './hpoda.page';

describe('HpodaPage', () => {
  let component: HpodaPage;
  let fixture: ComponentFixture<HpodaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpodaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HpodaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
