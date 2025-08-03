import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/appointments/appointmentsSlice'
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

const AppointmentsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { appointments } = useAppSelector((state) => state.appointments)

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
              <title>{getPageTitle('View appointments')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View appointments')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/appointments/appointments-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <FormField label='AppointmentDate'>
                    {appointments.appointment_date ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={appointments.appointment_date ?
                        new Date(
                          dayjs(appointments.appointment_date).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No AppointmentDate</p>}
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Patient</p>

                        <p>{appointments?.patient?.first_name ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Doctor</p>

                        <p>{appointments?.doctor?.first_name ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Status</p>
                    <p>{appointments?.status ?? 'No data'}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Prescriptions Appointment</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>TrackingCode</th>

                            </tr>
                            </thead>
                            <tbody>
                            {appointments.prescriptions_appointment && Array.isArray(appointments.prescriptions_appointment) &&
                              appointments.prescriptions_appointment.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/prescriptions/prescriptions-view/?id=${item.id}`)}>

                                    <td data-label="tracking_code">
                                        { item.tracking_code }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!appointments?.prescriptions_appointment?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/appointments/appointments-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

AppointmentsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default AppointmentsView;
