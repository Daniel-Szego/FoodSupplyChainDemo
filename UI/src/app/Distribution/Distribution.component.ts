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
import { DistributionService } from './Distribution.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-distribution',
  templateUrl: './Distribution.component.html',
  styleUrls: ['./Distribution.component.css'],
  providers: [DistributionService]
})
export class DistributionComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  stateId = new FormControl('', Validators.required);
  stateName = new FormControl('', Validators.required);
  stateAddress = new FormControl('', Validators.required);
  GHG = new FormControl('', Validators.required);
  stateFrom = new FormControl('', Validators.required);


  constructor(public serviceDistribution: DistributionService, fb: FormBuilder) {
    this.myForm = fb.group({
      stateId: this.stateId,
      stateName: this.stateName,
      stateAddress: this.stateAddress,
      GHG: this.GHG,
      stateFrom: this.stateFrom
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDistribution.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.supplychain.food.model.Distribution',
      'stateId': this.stateId.value,
      'stateName': this.stateName.value,
      'stateAddress': this.stateAddress.value,
      'GHG': this.GHG.value,
      'stateFrom': this.stateFrom.value
    };

    this.myForm.setValue({
      'stateId': null,
      'stateName': null,
      'stateAddress': null,
      'GHG': null,
      'stateFrom': null
    });

    return this.serviceDistribution.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'stateId': null,
        'stateName': null,
        'stateAddress': null,
        'GHG': null,
        'stateFrom': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.supplychain.food.model.Distribution',
      'stateName': this.stateName.value,
      'stateAddress': this.stateAddress.value,
      'GHG': this.GHG.value,
      'stateFrom': this.stateFrom.value
    };

    return this.serviceDistribution.updateParticipant(form.get('stateId').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceDistribution.deleteParticipant(this.currentId)
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

    return this.serviceDistribution.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'stateId': null,
        'stateName': null,
        'stateAddress': null,
        'GHG': null,
        'stateFrom': null
      };

      if (result.stateId) {
        formObject.stateId = result.stateId;
      } else {
        formObject.stateId = null;
      }

      if (result.stateName) {
        formObject.stateName = result.stateName;
      } else {
        formObject.stateName = null;
      }

      if (result.stateAddress) {
        formObject.stateAddress = result.stateAddress;
      } else {
        formObject.stateAddress = null;
      }

      if (result.GHG) {
        formObject.GHG = result.GHG;
      } else {
        formObject.GHG = null;
      }

      if (result.stateFrom) {
        formObject.stateFrom = result.stateFrom;
      } else {
        formObject.stateFrom = null;
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
      'stateId': null,
      'stateName': null,
      'stateAddress': null,
      'GHG': null,
      'stateFrom': null
    });
  }
}
