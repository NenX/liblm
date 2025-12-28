import { IGlobalModalProps } from '@lm_fe/components';
import { Form, FormInstance, Modal } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import { useEffect, useState } from 'react';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';
import { mchcDriver, mchcEvent } from '@lm_fe/env';
import { FormSection } from '@lm_fe/components_m';
import { safe_async_call } from '@lm_fe/utils';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { BF_Wrap2 } from 'src/components';
import { ErrorBoundarySmall } from 'src/components/exception/ErrorBoundarySmall';
interface __props<T extends string = any> {
  bf_title?: `${string}-${string}`
  title?: string
  formDescriptions?: { [x in T]: any } | IMchc_FormDescriptions_Field[]
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


export default function MyModalForm<T extends string>({ modal_data, onOk, bodyStyle = {}, width, ...others }: IModalFormProps<T>) {
  const { title = "", bf_title, formDescriptions = [], targetLabelCol = 4, defaultFormItemLayout, onFieldsChange, onValuesChange, onSubmit, getInitialData, disableAll, modalFormSize = 'middle' } = modal_data
  const [_form] = Form.useForm()
  const form = modal_data.form ?? _form
  const [data, setData] = useState<any>({})
  const { Wrap, config } = BF_Wrap2({ default_conf: { title: bf_title!, tableColumns: formDescriptions } })

  useEffect(() => {
    safe_async_call(() => getInitialData?.())
      .then?.(v => {
        setData(v)
        form.setFieldsValue(v);
      })

    return () => {

    }
  }, [])
  useEffect(() => {
    return mchcDriver.on_rm('data', e => {
      if (e.type === 'ReadCard') {
        let res = e.data
        form.setFieldsValue({ idNO: res.idNO, name: res.name })
      }

    })
  }, [])
  function renderEditContent() {
    if (bf_title)
      return <Wrap>
        <FormSection formDescriptions={config?.tableColumns} disableAll={disableAll} defaultFormItemLayout={defaultFormItemLayout} targetLabelCol={targetLabelCol} form={form} />;
      </Wrap>
    return <FormSection formDescriptions={formDescriptions as any[]} disableAll={disableAll} defaultFormItemLayout={defaultFormItemLayout} targetLabelCol={targetLabelCol} form={form} />;
  }
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

            let a = await safe_async_call(onSubmit!, { ...data, ...formData })
            if (!a) return
            onOk?.(e)

          })
          .catch((error) => {
            console.error('modal_form 发生错误', error);

          });
      }}
      {...others}

    >
      <ErrorBoundarySmall>

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
        // style={{ minHeight: 433 }}
        >
          {renderEditContent()}
        </Form>
      </ErrorBoundarySmall>

    </Modal>
  );

};