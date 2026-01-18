import { AbstractControl } from "@angular/forms";

type ValidatorResult = { doesNotContainNumber: true };

//* control.value.toString() ensures that the value is treated as a string (in case control is a number).
//* The regular expression /\d/ looks for any digit (0-9).
//* .test() checks if the string contains at least one digit.

export const mustContainNumber = (control: AbstractControl): ValidatorResult | null => {
    return (
      /\d/.test(control.value.toString())
      ? null 
      : { doesNotContainNumber: true }
    );
};

export const localStorageItemData: string = 'super-admin-auth-form-data';
 
//* WONT WORK IN SSR
export let initialUsernameValue = '';

const savedInformation = window.localStorage.getItem(localStorageItemData);

if (savedInformation) {
  const loadedFormData = JSON.parse(savedInformation);
  initialUsernameValue = loadedFormData.username;
};