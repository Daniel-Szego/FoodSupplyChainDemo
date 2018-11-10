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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Cow', component: CowComponent },
  { path: 'Steak', component: SteakComponent },
  { path: 'Production', component: ProductionComponent },
  { path: 'Processing', component: ProcessingComponent },
  { path: 'Distribution', component: DistributionComponent },
  { path: 'Retail', component: RetailComponent },
  { path: 'Restaurant', component: RestaurantComponent },
  { path: 'InitTestData', component: InitTestDataComponent },
  { path: 'ClearData', component: ClearDataComponent },
  { path: 'Process', component: ProcessComponent },
  { path: 'Produce', component: ProduceComponent },
  { path: 'Consume', component: ConsumeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
