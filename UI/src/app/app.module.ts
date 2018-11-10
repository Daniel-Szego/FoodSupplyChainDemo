/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { CowComponent } from './Cow/Cow.component';
import { SteakComponent } from './Steak/Steak.component';

import { ProductionComponent } from './Production/Production.component';
import { ProcessingComponent } from './Processing/Processing.component';
import { DistributionComponent } from './Distribution/Distribution.component';
import { RetailComponent } from './Retail/Retail.component';
import { RestaurantComponent } from './Restaurant/Restaurant.component';

import { InitTestDataComponent } from './InitTestData/InitTestData.component';
import { ClearDataComponent } from './ClearData/ClearData.component';
import { ProcessComponent } from './Process/Process.component';
import { ProduceComponent } from './Produce/Produce.component';
import { ConsumeComponent } from './Consume/Consume.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CowComponent,
    SteakComponent,
    ProductionComponent,
    ProcessingComponent,
    DistributionComponent,
    RetailComponent,
    RestaurantComponent,
    InitTestDataComponent,
    ClearDataComponent,
    ProcessComponent,
    ProduceComponent,
    ConsumeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
