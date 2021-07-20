import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemoveAgentPageRoutingModule } from './remove-agent-routing.module';

import { RemoveAgentPage } from './remove-agent.page';
import { MaterialModule } from 'src/app/components/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RemoveAgentPageRoutingModule,
    MaterialModule
  ],
  declarations: [RemoveAgentPage]
})
export class RemoveAgentPageModule {}
