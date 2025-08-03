import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import appointmentsSlice from "./appointments/appointmentsSlice";
import doctorsSlice from "./doctors/doctorsSlice";
import medical_recordsSlice from "./medical_records/medical_recordsSlice";
import patientsSlice from "./patients/patientsSlice";
import prescriptionsSlice from "./prescriptions/prescriptionsSlice";
import rolesSlice from "./roles/rolesSlice";
import permissionsSlice from "./permissions/permissionsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
appointments: appointmentsSlice,
doctors: doctorsSlice,
medical_records: medical_recordsSlice,
patients: patientsSlice,
prescriptions: prescriptionsSlice,
roles: rolesSlice,
permissions: permissionsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
