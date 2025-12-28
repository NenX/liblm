import { mchcEvent } from '@lm_fe/env';
import { Form, FormInstance, FormProps, message } from 'antd';
import React, { useEffect } from 'react';
import { MyFormSection } from './FormSection';
import { IFormSectionProps } from './types';
type IBase<T = any> = Omit<FormProps<T>, 'labelCol' | 'onFieldsChange' | 'onValuesChange' | 'wrapperCol'> & IFormSectionProps
export interface IFormSectionFormProps<T = any> extends IBase {
    onFieldsChange?(changedFields: any[], allFields: any[], form: FormInstance): void
    onValuesChange?(changedValues: { [x in keyof T]: any }, values: T, form: FormInstance): void;
    data?: T
}
export function MyFormSectionForm<T extends Object>(props: IFormSectionFormProps<T>) {
    const { onFieldsChange, onValuesChange, data, style = {}, ...others } = props
    const [_form] = Form.useForm<any>()
    const form = props.form ?? _form


    useEffect(() => {

        if (data) {
            if (!form) message.info('MyFormSectionForm has a empty form')

            form.resetFields()
            form.setFieldsValue(data);

        }

        return () => {

        }
    }, [data])

    function renderEditContent() {
        return <MyFormSection form={form} {...others} />;
    };
    return (


        <Form
            {...others}

            onFieldsChange={(a, b) => {
                onFieldsChange?.(a, b, form)
            }}
            onValuesChange={(changedValues, values) => {
                onValuesChange?.(changedValues, values, form)
                mchcEvent.emit('my_form', {
                    form,
                    type: 'onChange',
                    name: Object.keys(changedValues)[0],
                    value: Object.values(changedValues)[0],
                    values,
                    setValue: (name, value) => {
                        debugger
                        const a = { [name]: value } as any
                        form.setFieldsValue(a)
                    },
                })
            }}

            autoComplete="off"
            // {...formItemLayout}
            style={{ padding: '12px 12px 48px 12px', ...style }}
            form={form}

        >
            {renderEditContent()}
        </Form>
    );

};