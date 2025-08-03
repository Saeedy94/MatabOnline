import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/patients/patientsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const PatientsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { patients } = useAppSelector((state) => state.patients)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View patients')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View patients')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/patients/patients-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>FirstName</p>
                    <p>{patients?.first_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>LastName</p>
                    <p>{patients?.last_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>NationalID</p>
                    <p>{patients?.national_id}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Appointments Patient</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>AppointmentDate</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {patients.appointments_patient && Array.isArray(patients.appointments_patient) &&
                              patients.appointments_patient.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/appointments/appointments-view/?id=${item.id}`)}>

                                    <td data-label="appointment_date">
                                        { dataFormatter.dateTimeFormatter(item.appointment_date) }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!patients?.appointments_patient?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Medical_records Patient</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                            </tr>
                            </thead>
                            <tbody>
                            {patients.medical_records_patient && Array.isArray(patients.medical_records_patient) &&
                              patients.medical_records_patient.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/medical_records/medical_records-view/?id=${item.id}`)}>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!patients?.medical_records_patient?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/patients/patients-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

PatientsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default PatientsView;
