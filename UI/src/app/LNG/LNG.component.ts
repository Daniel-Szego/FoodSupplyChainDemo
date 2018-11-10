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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LNGService } from './LNG.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-lng',
  templateUrl: './LNG.component.html',
  styleUrls: ['./LNG.component.css'],
  providers: [LNGService]
})
export class LNGComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  amount = new FormControl('', Validators.required);
  assetId = new FormControl('', Validators.required);
  assetStatus = new FormControl('', Validators.required);
  aggregatedGHG = new FormControl('', Validators.required);
  atState = new FormControl('', Validators.required);

  constructor(public serviceLNG: LNGService, fb: FormBuilder) {
    this.myForm = fb.group({
      amount: this.amount,
      assetId: this.assetId,
      assetStatus: this.assetStatus,
      aggregatedGHG: this.aggregatedGHG,
      atState: this.atState
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceLNG.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.LNG.model.LNG',
      'amount': this.amount.value,
      'assetId': this.assetId.value,
      'assetStatus': this.assetStatus.value,
      'aggregatedGHG': this.aggregatedGHG.value,
      'atState': this.atState.value
    };

    this.myForm.setValue({
      'amount': null,
      'assetId': null,
      'assetStatus': null,
      'aggregatedGHG': null,
      'atState': null
    });

    return this.serviceLNG.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'amount': null,
        'assetId': null,
        'assetStatus': null,
        'aggregatedGHG': null,
        'atState': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.supplychain.LNG.model.LNG',
      'amount': this.amount.value,
      'assetStatus': this.assetStatus.value,
      'aggregatedGHG': this.aggregatedGHG.value,
      'atState': this.atState.value
    };

    return this.serviceLNG.updateAsset(form.get('assetId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceLNG.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceLNG.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'amount': null,
        'assetId': null,
        'assetStatus': null,
        'aggregatedGHG': null,
        'atState': null
      };

      if (result.amount) {
        formObject.amount = result.amount;
      } else {
        formObject.amount = null;
      }

      if (result.assetId) {
        formObject.assetId = result.assetId;
      } else {
        formObject.assetId = null;
      }

      if (result.assetStatus) {
        formObject.assetStatus = result.assetStatus;
      } else {
        formObject.assetStatus = null;
      }

      if (result.aggregatedGHG) {
        formObject.aggregatedGHG = result.aggregatedGHG;
      } else {
        formObject.aggregatedGHG = null;
      }

      if (result.atState) {
        formObject.atState = result.atState;
      } else {
        formObject.atState = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'amount': null,
      'assetId': null,
      'assetStatus': null,
      'aggregatedGHG': null,
      'atState': null
      });
  }

}
