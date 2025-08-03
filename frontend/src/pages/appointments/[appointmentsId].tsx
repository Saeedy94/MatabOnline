import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/appointments/appointmentsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditAppointments = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    appointment_date: new Date(),

    patient: null,

    doctor: null,

    status: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { appointments } = useAppSelector((state) => state.appointments)

  const { appointmentsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: appointmentsId }))
  }, [appointmentsId])

  useEffect(() => {
    if (typeof appointments === 'object') {
      setInitialValues(appointments)
    }
  }, [appointments])

  useEffect(() => {
      if (typeof appointments === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (appointments)[el])

          setInitialValues(newInitialVal);
      }
  }, [appointments])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: appointmentsId, data }))
    await router.push('/appointments/appointments-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit appointments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit appointments'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

      <FormField
          label="AppointmentDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.appointment_date ?
                  new Date(
                      dayjs(initialValues.appointment_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'appointment_date': date})}
          />
      </FormField>

    <FormField label='Patient' labelFor='patient'>
        <Field
            name='patient'
            id='patient'
            component={SelectField}
            options={initialValues.patient}
            itemRef={'patients'}

            showField={'first_name'}

        ></Field>
    </FormField>

    <FormField label='Doctor' labelFor='doctor'>
        <Field
            name='doctor'
            id='doctor'
            component={SelectField}
            options={initialValues.doctor}
            itemRef={'doctors'}

            showField={'first_name'}

        ></Field>
    </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="Scheduled">Scheduled</option>

            <option value="Completed">Completed</option>

            <option value="Cancelled">Cancelled</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/appointments/appointments-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditAppointments.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditAppointments
