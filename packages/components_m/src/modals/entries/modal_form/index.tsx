import { IGlobalModalProps } from '@lm_fe/components';
import { Form, FormInstance, Modal } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import { useEffect, useState } from 'react';
import { FormSection } from '../../../BaseModalForm';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';
import { mchcEvent } from '@lm_fe/env';
interface __props<T extends string = any> {
  title?: string
  formDescriptions?: { [x in T]: any } | any[]
  onFieldsChange?(changedFields: FieldData[], allFields: FieldData[], form: FormInstance): void
  onValuesChange?(changedValues: { [x in T]: any }, values: { [x in T]: any }, form: FormInstance): void;
  onSubmit?(v: any): Promise<any>
  getInitialData?(): Promise<any>
  form?: FormInstance
  targetLabelCol?: number
  defaultFormItemLayout?: string
  modalFormSize?: SizeType
  disableAll?: boolean
}
export type IModalFormProps<T extends string = any> = IGlobalModalProps<__props<T>>

function expandFormConfig(formDescriptions: any[]) {
  return formDescriptions
  return formDescriptions.reduce((s, a,) => {
    const { children, ...others } = a
    if (Array.isArray(children)) {
      return [...s, { ...others, inputType: 'title' }, ...children]
    }
    return [...s, a]
  }, [])
}
export default function MyModalForm<T extends string>({ modal_data, onOk, bodyStyle = {}, width, ...others }: IModalFormProps<T>) {
  const { title = "", formDescriptions = [], targetLabelCol, defaultFormItemLayout, onFieldsChange, onValuesChange, onSubmit, getInitialData, disableAll, modalFormSize = 'middle' } = modal_data
  const [_form] = Form.useForm()
  const form = modal_data.form ?? _form
  const [data, setData] = useState<any>()


  useEffect(() => {
    getInitialData?.().then?.(v => {
      setData(v)
      form.setFieldsValue(v);
    })

    return () => {

    }
  }, [])

  function renderEditContent() {
    console.log('fds', formDescriptions)

    return <FormSection disableAll={disableAll} defaultFormItemLayout={defaultFormItemLayout} targetLabelCol={targetLabelCol} form={form} formDescriptions={Array.isArray(formDescriptions) ? expandFormConfig(formDescriptions) : formDescriptions} />;
  };
  return (
    <Modal

      title={data?.id ? `修改${title}` : `添加${title}`}

      centered
      destroyOnClose
      width={width ?? "60vw"}

      bodyStyle={{ padding: '12px 20px', height: '70vh', overflowY: 'scroll', ...bodyStyle }}

      onOk={(e) => {
        form
          .validateFields()
          .then(async () => {
            const formData = form.getFieldsValue();
            onSubmit?.(formData)?.then(() => {
              onOk?.(e)

            })
          })
          .catch((error) => {
            console.error('modal_form 发生错误', error);
          });
      }}
      {...others}

    >

      <Form
        size={modalFormSize}
        onFieldsChange={(a, b) => {
          onFieldsChange?.(a, b, form)
        }}
        onValuesChange={(changedValues, b) => {
          const k = Object.keys(changedValues)[0]
          const v = changedValues[k]
          onValuesChange?.(changedValues, b, form)
          mchcEvent.emit('my_form', {
            type: 'onChange', name: k, value: v, values: b, form, setValue(name, value) {
              form.setFieldsValue({ [name]: value })
            },
          })
        }}

        autoComplete="off"
        form={form}
        style={{ minHeight: 433 }}
      >
        {renderEditContent()}
      </Form>
    </Modal>
  );

};