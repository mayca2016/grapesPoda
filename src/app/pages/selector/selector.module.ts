import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SelectorPageRoutingModule } from './selector-routing.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectorPage } from './selector.page';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectorPageRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  declarations: [SelectorPage]
})
export class SelectorPageModule {}
