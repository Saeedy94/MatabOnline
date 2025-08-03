import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/doctors/doctorsSlice'
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

const DoctorsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { doctors } = useAppSelector((state) => state.doctors)

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
              <title>{getPageTitle('View doctors')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View doctors')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/doctors/doctors-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>FirstName</p>
                    <p>{doctors?.first_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>LastName</p>
                    <p>{doctors?.last_name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Specialization</p>
                    <p>{doctors?.specialization}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Appointments Doctor</p>
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
                            {doctors.appointments_doctor && Array.isArray(doctors.appointments_doctor) &&
                              doctors.appointments_doctor.map((item: any) => (
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
                        {!doctors?.appointments_doctor?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/doctors/doctors-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

DoctorsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default DoctorsView;
