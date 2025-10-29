import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Appointment_Key {
  id: UUIDString;
  __typename?: 'Appointment_Key';
}

export interface CreatePatientData {
  patient_insert: Patient_Key;
}

export interface Interaction_Key {
  id: UUIDString;
  __typename?: 'Interaction_Key';
}

export interface ListMedicalRecordsForPatientData {
  medicalRecords: ({
    id: UUIDString;
    diagnosis: string;
    medications?: string | null;
    recordDate: DateString;
    notes?: string | null;
  } & MedicalRecord_Key)[];
}

export interface ListMedicalRecordsForPatientVariables {
  patientId: UUIDString;
}

export interface ListProvidersData {
  providers: ({
    id: UUIDString;
    name: string;
    specialty?: string | null;
    email: string;
    phoneNumber?: string | null;
  } & Provider_Key)[];
}

export interface MedicalRecord_Key {
  id: UUIDString;
  __typename?: 'MedicalRecord_Key';
}

export interface Patient_Key {
  id: UUIDString;
  __typename?: 'Patient_Key';
}

export interface Provider_Key {
  id: UUIDString;
  __typename?: 'Provider_Key';
}

export interface UpdateAppointmentNotesData {
  appointment_update?: Appointment_Key | null;
}

export interface UpdateAppointmentNotesVariables {
  id: UUIDString;
  notes?: string | null;
}

interface CreatePatientRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreatePatientData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreatePatientData, undefined>;
  operationName: string;
}
export const createPatientRef: CreatePatientRef;

export function createPatient(): MutationPromise<CreatePatientData, undefined>;
export function createPatient(dc: DataConnect): MutationPromise<CreatePatientData, undefined>;

interface ListProvidersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProvidersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProvidersData, undefined>;
  operationName: string;
}
export const listProvidersRef: ListProvidersRef;

export function listProviders(): QueryPromise<ListProvidersData, undefined>;
export function listProviders(dc: DataConnect): QueryPromise<ListProvidersData, undefined>;

interface UpdateAppointmentNotesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentNotesVariables): MutationRef<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAppointmentNotesVariables): MutationRef<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
  operationName: string;
}
export const updateAppointmentNotesRef: UpdateAppointmentNotesRef;

export function updateAppointmentNotes(vars: UpdateAppointmentNotesVariables): MutationPromise<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
export function updateAppointmentNotes(dc: DataConnect, vars: UpdateAppointmentNotesVariables): MutationPromise<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;

interface ListMedicalRecordsForPatientRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMedicalRecordsForPatientVariables): QueryRef<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMedicalRecordsForPatientVariables): QueryRef<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
  operationName: string;
}
export const listMedicalRecordsForPatientRef: ListMedicalRecordsForPatientRef;

export function listMedicalRecordsForPatient(vars: ListMedicalRecordsForPatientVariables): QueryPromise<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
export function listMedicalRecordsForPatient(dc: DataConnect, vars: ListMedicalRecordsForPatientVariables): QueryPromise<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;

