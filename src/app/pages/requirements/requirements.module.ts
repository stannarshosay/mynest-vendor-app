import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequirementsPageRoutingModule } from './requirements-routing.module';

import { RequirementsPage } from './requirements.page';
import { MaterialModule } from 'src/app/components/material.module';
import { SharedModule } from 'src/app/components/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequirementsPageRoutingModule,
    MaterialModule,
    SharedModule,
    NgxPaginationModule
  ],
  declarations: [RequirementsPage]
})
export class RequirementsPageModule {}
