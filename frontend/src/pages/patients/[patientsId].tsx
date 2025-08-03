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

import { update, fetch } from '../../stores/patients/patientsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditPatients = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'first_name': '',

    'last_name': '',

    'national_id': '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { patients } = useAppSelector((state) => state.patients)

  const { patientsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: patientsId }))
  }, [patientsId])

  useEffect(() => {
    if (typeof patients === 'object') {
      setInitialValues(patients)
    }
  }, [patients])

  useEffect(() => {
      if (typeof patients === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (patients)[el])

          setInitialValues(newInitialVal);
      }
  }, [patients])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: patientsId, data }))
    await router.push('/patients/patients-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit patients')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit patients'} main>
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
        label="FirstName"
    >
        <Field
            name="first_name"
            placeholder="FirstName"
        />
    </FormField>

    <FormField
        label="LastName"
    >
        <Field
            name="last_name"
            placeholder="LastName"
        />
    </FormField>

    <FormField
        label="NationalID"
    >
        <Field
            name="national_id"
            placeholder="NationalID"
        />
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/patients/patients-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditPatients.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditPatients
