import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarFotoPageRoutingModule } from './mostrar-foto-routing.module';

import { MostrarFotoPage } from './mostrar-foto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarFotoPageRoutingModule
  ],
  declarations: [MostrarFotoPage]
})
export class MostrarFotoPageModule {}
