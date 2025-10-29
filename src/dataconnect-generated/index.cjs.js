const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'healthcrm',
  location: 'europe-central2'
};
exports.connectorConfig = connectorConfig;

const createPatientRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePatient');
}
createPatientRef.operationName = 'CreatePatient';
exports.createPatientRef = createPatientRef;

exports.createPatient = function createPatient(dc) {
  return executeMutation(createPatientRef(dc));
};

const listProvidersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListProviders');
}
listProvidersRef.operationName = 'ListProviders';
exports.listProvidersRef = listProvidersRef;

exports.listProviders = function listProviders(dc) {
  return executeQuery(listProvidersRef(dc));
};

const updateAppointmentNotesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAppointmentNotes', inputVars);
}
updateAppointmentNotesRef.operationName = 'UpdateAppointmentNotes';
exports.updateAppointmentNotesRef = updateAppointmentNotesRef;

exports.updateAppointmentNotes = function updateAppointmentNotes(dcOrVars, vars) {
  return executeMutation(updateAppointmentNotesRef(dcOrVars, vars));
};

const listMedicalRecordsForPatientRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMedicalRecordsForPatient', inputVars);
}
listMedicalRecordsForPatientRef.operationName = 'ListMedicalRecordsForPatient';
exports.listMedicalRecordsForPatientRef = listMedicalRecordsForPatientRef;

exports.listMedicalRecordsForPatient = function listMedicalRecordsForPatient(dcOrVars, vars) {
  return executeQuery(listMedicalRecordsForPatientRef(dcOrVars, vars));
};
