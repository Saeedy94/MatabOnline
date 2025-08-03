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

import { update, fetch } from '../../stores/medical_records/medical_recordsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditMedical_records = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    patient: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { medical_records } = useAppSelector((state) => state.medical_records)

  const { medical_recordsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: medical_recordsId }))
  }, [medical_recordsId])

  useEffect(() => {
    if (typeof medical_records === 'object') {
      setInitialValues(medical_records)
    }
  }, [medical_records])

  useEffect(() => {
      if (typeof medical_records === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (medical_records)[el])

          setInitialValues(newInitialVal);
      }
  }, [medical_records])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: medical_recordsId, data }))
    await router.push('/medical_records/medical_records-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit medical_records')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit medical_records'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

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

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/medical_records/medical_records-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditMedical_records.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditMedical_records
