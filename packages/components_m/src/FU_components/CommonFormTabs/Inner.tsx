import React, { useEffect } from 'react';
// import { FormSectionForm } from '../../BaseModalForm/FormSectionForm';
import { MyFormSectionForm } from '../FormSection/FormSectionForm';
import CommonFormTabs from './CommonFormTabs';
import { IFormTabsProps } from './types';

function _FormTabs<T = any>(props: IFormTabsProps<T>) {
    const { value = [], fds = [], onChange, forms = [], FormSize, disabled } = props


    useEffect(() => {
        console.log('value', value)
        if ([value, forms].every(Array.isArray)) {
            value.forEach((v, idx) => {
                const f = forms[idx]
                f?.setFieldsValue(v)

            })
        }
        return () => {

        }
    }, [value, forms])




    return <div style={{}}  >

        <CommonFormTabs<any>
            renderTabNode={(data, index) => {
                return (
                    <MyFormSectionForm disableAll={disabled} size={FormSize} form={forms[index]} data={data} formDescriptions={fds} onValuesChange={(changedValues, values) => {
                        console.log('www', data, values)
                        // debugger
                        value[index] = { ...data, ...values } as any
                        onChange?.([...value], index, changedValues)
                    }} />
                )
            }}
            {...props}

        />



    </div>
}

export default _FormTabs