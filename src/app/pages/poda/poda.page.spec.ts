import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PodaPage } from './poda.page';

describe('PodaPage', () => {
  let component: PodaPage;
  let fixture: ComponentFixture<PodaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PodaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
