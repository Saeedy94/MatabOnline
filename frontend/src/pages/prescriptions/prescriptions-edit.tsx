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

import { update, fetch } from '../../stores/prescriptions/prescriptionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditPrescriptionsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    appointment: null,

    'tracking_code': '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { prescriptions } = useAppSelector((state) => state.prescriptions)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof prescriptions === 'object') {
      setInitialValues(prescriptions)
    }
  }, [prescriptions])

  useEffect(() => {
      if (typeof prescriptions === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (prescriptions)[el])
          setInitialValues(newInitialVal);
      }
  }, [prescriptions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/prescriptions/prescriptions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit prescriptions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit prescriptions'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

  <FormField label='Appointment' labelFor='appointment'>
        <Field
            name='appointment'
            id='appointment'
            component={SelectField}
            options={initialValues.appointment}
            itemRef={'appointments'}

            showField={'appointment_date'}

        ></Field>
    </FormField>

    <FormField
        label="TrackingCode"
    >
        <Field
            name="tracking_code"
            placeholder="TrackingCode"
        />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/prescriptions/prescriptions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditPrescriptionsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditPrescriptionsPage
