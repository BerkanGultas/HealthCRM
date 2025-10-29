import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'healthcrm',
  location: 'europe-central2'
};

export const createPatientRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePatient');
}
createPatientRef.operationName = 'CreatePatient';

export function createPatient(dc) {
  return executeMutation(createPatientRef(dc));
}

export const listProvidersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProviders');
}
listProvidersRef.operationName = 'ListProviders';

export function listProviders(dc) {
  return executeQuery(listProvidersRef(dc));
}

export const updateAppointmentNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAppointmentNotes', inputVars);
}
updateAppointmentNotesRef.operationName = 'UpdateAppointmentNotes';

export function updateAppointmentNotes(dcOrVars, vars) {
  return executeMutation(updateAppointmentNotesRef(dcOrVars, vars));
}

export const listMedicalRecordsForPatientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMedicalRecordsForPatient', inputVars);
}
listMedicalRecordsForPatientRef.operationName = 'ListMedicalRecordsForPatient';

export function listMedicalRecordsForPatient(dcOrVars, vars) {
  return executeQuery(listMedicalRecordsForPatientRef(dcOrVars, vars));
}

