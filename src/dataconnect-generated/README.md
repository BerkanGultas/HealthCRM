# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListProviders*](#listproviders)
  - [*ListMedicalRecordsForPatient*](#listmedicalrecordsforpatient)
- [**Mutations**](#mutations)
  - [*CreatePatient*](#createpatient)
  - [*UpdateAppointmentNotes*](#updateappointmentnotes)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListProviders
You can execute the `ListProviders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listProviders(): QueryPromise<ListProvidersData, undefined>;

interface ListProvidersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProvidersData, undefined>;
}
export const listProvidersRef: ListProvidersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listProviders(dc: DataConnect): QueryPromise<ListProvidersData, undefined>;

interface ListProvidersRef {
  ...
  (dc: DataConnect): QueryRef<ListProvidersData, undefined>;
}
export const listProvidersRef: ListProvidersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listProvidersRef:
```typescript
const name = listProvidersRef.operationName;
console.log(name);
```

### Variables
The `ListProviders` query has no variables.
### Return Type
Recall that executing the `ListProviders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListProvidersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListProvidersData {
  providers: ({
    id: UUIDString;
    name: string;
    specialty?: string | null;
    email: string;
    phoneNumber?: string | null;
  } & Provider_Key)[];
}
```
### Using `ListProviders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listProviders } from '@dataconnect/generated';


// Call the `listProviders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listProviders();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listProviders(dataConnect);

console.log(data.providers);

// Or, you can use the `Promise` API.
listProviders().then((response) => {
  const data = response.data;
  console.log(data.providers);
});
```

### Using `ListProviders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listProvidersRef } from '@dataconnect/generated';


// Call the `listProvidersRef()` function to get a reference to the query.
const ref = listProvidersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listProvidersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.providers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.providers);
});
```

## ListMedicalRecordsForPatient
You can execute the `ListMedicalRecordsForPatient` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMedicalRecordsForPatient(vars: ListMedicalRecordsForPatientVariables): QueryPromise<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;

interface ListMedicalRecordsForPatientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMedicalRecordsForPatientVariables): QueryRef<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
}
export const listMedicalRecordsForPatientRef: ListMedicalRecordsForPatientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMedicalRecordsForPatient(dc: DataConnect, vars: ListMedicalRecordsForPatientVariables): QueryPromise<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;

interface ListMedicalRecordsForPatientRef {
  ...
  (dc: DataConnect, vars: ListMedicalRecordsForPatientVariables): QueryRef<ListMedicalRecordsForPatientData, ListMedicalRecordsForPatientVariables>;
}
export const listMedicalRecordsForPatientRef: ListMedicalRecordsForPatientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMedicalRecordsForPatientRef:
```typescript
const name = listMedicalRecordsForPatientRef.operationName;
console.log(name);
```

### Variables
The `ListMedicalRecordsForPatient` query requires an argument of type `ListMedicalRecordsForPatientVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMedicalRecordsForPatientVariables {
  patientId: UUIDString;
}
```
### Return Type
Recall that executing the `ListMedicalRecordsForPatient` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMedicalRecordsForPatientData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMedicalRecordsForPatientData {
  medicalRecords: ({
    id: UUIDString;
    diagnosis: string;
    medications?: string | null;
    recordDate: DateString;
    notes?: string | null;
  } & MedicalRecord_Key)[];
}
```
### Using `ListMedicalRecordsForPatient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMedicalRecordsForPatient, ListMedicalRecordsForPatientVariables } from '@dataconnect/generated';

// The `ListMedicalRecordsForPatient` query requires an argument of type `ListMedicalRecordsForPatientVariables`:
const listMedicalRecordsForPatientVars: ListMedicalRecordsForPatientVariables = {
  patientId: ..., 
};

// Call the `listMedicalRecordsForPatient()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMedicalRecordsForPatient(listMedicalRecordsForPatientVars);
// Variables can be defined inline as well.
const { data } = await listMedicalRecordsForPatient({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMedicalRecordsForPatient(dataConnect, listMedicalRecordsForPatientVars);

console.log(data.medicalRecords);

// Or, you can use the `Promise` API.
listMedicalRecordsForPatient(listMedicalRecordsForPatientVars).then((response) => {
  const data = response.data;
  console.log(data.medicalRecords);
});
```

### Using `ListMedicalRecordsForPatient`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMedicalRecordsForPatientRef, ListMedicalRecordsForPatientVariables } from '@dataconnect/generated';

// The `ListMedicalRecordsForPatient` query requires an argument of type `ListMedicalRecordsForPatientVariables`:
const listMedicalRecordsForPatientVars: ListMedicalRecordsForPatientVariables = {
  patientId: ..., 
};

// Call the `listMedicalRecordsForPatientRef()` function to get a reference to the query.
const ref = listMedicalRecordsForPatientRef(listMedicalRecordsForPatientVars);
// Variables can be defined inline as well.
const ref = listMedicalRecordsForPatientRef({ patientId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMedicalRecordsForPatientRef(dataConnect, listMedicalRecordsForPatientVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.medicalRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.medicalRecords);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreatePatient
You can execute the `CreatePatient` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPatient(): MutationPromise<CreatePatientData, undefined>;

interface CreatePatientRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreatePatientData, undefined>;
}
export const createPatientRef: CreatePatientRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPatient(dc: DataConnect): MutationPromise<CreatePatientData, undefined>;

interface CreatePatientRef {
  ...
  (dc: DataConnect): MutationRef<CreatePatientData, undefined>;
}
export const createPatientRef: CreatePatientRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPatientRef:
```typescript
const name = createPatientRef.operationName;
console.log(name);
```

### Variables
The `CreatePatient` mutation has no variables.
### Return Type
Recall that executing the `CreatePatient` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePatientData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePatientData {
  patient_insert: Patient_Key;
}
```
### Using `CreatePatient`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPatient } from '@dataconnect/generated';


// Call the `createPatient()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPatient();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPatient(dataConnect);

console.log(data.patient_insert);

// Or, you can use the `Promise` API.
createPatient().then((response) => {
  const data = response.data;
  console.log(data.patient_insert);
});
```

### Using `CreatePatient`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPatientRef } from '@dataconnect/generated';


// Call the `createPatientRef()` function to get a reference to the mutation.
const ref = createPatientRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPatientRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.patient_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.patient_insert);
});
```

## UpdateAppointmentNotes
You can execute the `UpdateAppointmentNotes` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAppointmentNotes(vars: UpdateAppointmentNotesVariables): MutationPromise<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;

interface UpdateAppointmentNotesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentNotesVariables): MutationRef<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
}
export const updateAppointmentNotesRef: UpdateAppointmentNotesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAppointmentNotes(dc: DataConnect, vars: UpdateAppointmentNotesVariables): MutationPromise<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;

interface UpdateAppointmentNotesRef {
  ...
  (dc: DataConnect, vars: UpdateAppointmentNotesVariables): MutationRef<UpdateAppointmentNotesData, UpdateAppointmentNotesVariables>;
}
export const updateAppointmentNotesRef: UpdateAppointmentNotesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAppointmentNotesRef:
```typescript
const name = updateAppointmentNotesRef.operationName;
console.log(name);
```

### Variables
The `UpdateAppointmentNotes` mutation requires an argument of type `UpdateAppointmentNotesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAppointmentNotesVariables {
  id: UUIDString;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateAppointmentNotes` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAppointmentNotesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAppointmentNotesData {
  appointment_update?: Appointment_Key | null;
}
```
### Using `UpdateAppointmentNotes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentNotes, UpdateAppointmentNotesVariables } from '@dataconnect/generated';

// The `UpdateAppointmentNotes` mutation requires an argument of type `UpdateAppointmentNotesVariables`:
const updateAppointmentNotesVars: UpdateAppointmentNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateAppointmentNotes()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAppointmentNotes(updateAppointmentNotesVars);
// Variables can be defined inline as well.
const { data } = await updateAppointmentNotes({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAppointmentNotes(dataConnect, updateAppointmentNotesVars);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
updateAppointmentNotes(updateAppointmentNotesVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

### Using `UpdateAppointmentNotes`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentNotesRef, UpdateAppointmentNotesVariables } from '@dataconnect/generated';

// The `UpdateAppointmentNotes` mutation requires an argument of type `UpdateAppointmentNotesVariables`:
const updateAppointmentNotesVars: UpdateAppointmentNotesVariables = {
  id: ..., 
  notes: ..., // optional
};

// Call the `updateAppointmentNotesRef()` function to get a reference to the mutation.
const ref = updateAppointmentNotesRef(updateAppointmentNotesVars);
// Variables can be defined inline as well.
const ref = updateAppointmentNotesRef({ id: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAppointmentNotesRef(dataConnect, updateAppointmentNotesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

