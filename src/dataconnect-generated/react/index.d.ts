import { CreatePatientData, ListProvidersData, UpdateAppointmentNotesData, UpdateAppointmentNotesVariables, ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreatePatient(options?: useDataConnectMutationOptions<CreatePatientData, FirebaseError, void>): UseDataConnectMutationResult<CreatePatientData, undefined>;
export function useCreatePatient(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePatientData, FirebaseError, void>): UseDataConnectMutationResult<CreatePatientData, undefined>;

export function useListProviders(options?: useDataConnectQueryOptions<ListProvidersData>): UseDataConnectQueryResult<ListProvidersData, undefined>;
export function useListProviders(dc: DataConnect, options?: useDataConnectQueryOptions<ListProvidersData>): UseDataConnectQueryResult<ListProvidersData, undefined>;

export function useUpdateAppointmentNotes(options?: useDataConnectMutationOptions<UpdateAppointmentNotesData, FirebaseError, UpdateAppointmentNotesVariables>): UseDataConnectMutationResult<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
export function useUpdateAppointmentNotes(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAppointmentNotesData, FirebaseError, UpdateAppointmentNotesVariables>): UseDataConnectMutationResult<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;

export function useListMedicalRecordsForPatient(vars: ListMedicalRecordsForPatientVariables, options?: useDataConnectQueryOptions<ListMedicalRecordsForPatientData>): UseDataConnectQueryResult<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
export function useListMedicalRecordsForPatient(dc: DataConnect, vars: ListMedicalRecordsForPatientVariables, options?: useDataConnectQueryOptions<ListMedicalRecordsForPatientData>): UseDataConnectQueryResult<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
