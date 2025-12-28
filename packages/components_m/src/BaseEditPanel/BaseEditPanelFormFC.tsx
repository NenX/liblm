import {
  PrinterOutlined, RedoOutlined, SaveOutlined, SolutionOutlined
} from '@ant-design/icons';
import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { Button, Form, FormInstance, Space, message } from 'antd';
import classnames from 'classnames';
import { debounce, get, isFunction, map } from 'lodash';
import { useEffect, useState } from 'react';
// import FormSection from '../BaseModalForm/FormSection';
import { IMchc_FormDescriptions, IMchc_FormDescriptions_MIX } from '@lm_fe/service';
import React from 'react';
import { MyFormSection } from 'src/FU_components/FormSection';
import styles from './less/base-edit-panel-form.module.less';
export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const FormSection = MyFormSection
interface IProps {
  data?: any;
  formDescriptions_old?: IMchc_FormDescriptions[];
  formDescriptions?: IMchc_FormDescriptions_MIX;
  onFinish?: (data: any) => Promise<void>;
  loading?: boolean;
  form?: FormInstance
  getEvents?(): any
  onPrint?(): void
  onSync?(): void
  onImport?(): void
  onValuesChange?(changedValues: any, allValues: any): void;
  requiredKeys?: { [x: string]: boolean }
  renderBtns?(form: FormInstance): React.JSX.Element
  renderExtraBtns?(form: FormInstance): React.JSX.Element
}
export default function BaseEditPanelFormFC<T = any>(props: IProps) {

  const { onFinish, onValuesChange, data, formDescriptions, formDescriptions_old, onPrint, onSync, onImport, getEvents } = props;

  const [_form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const form = props.form ?? _form


  useEffect(() => {

    if (data) {
      form.setFieldsValue(data)
    }
  }, [data])



  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = async () => {
    setLoading(true)

    form
      .validateFields()
      .then(async () => {
        const params = {
          ...form.getFieldsValue(),
        };
        await onFinish?.(params);
        message.success('操作成功！')
        setLoading(false)

      })
      .catch((error) => {
        message.warning('请完善表单项!')
        mchcLogger.warn(error)
        setLoading(false)

      })
  };





  const getRegistrationEvents = () => ({});


  const handleFieldsChange = (changedFields: any, allFields: any) => ({});

  const handleItemBlur = () => ({});

  const renderSection = (section: IMchc_FormDescriptions) => {
    return (
      <>
        {/* <Divider key={`${get(section, 'flag')}-divider`} orientation="left">
          {get(section, 'name')}
        </Divider> */}
        <span className={styles["base-edit-panel-form_section_title"]} key={`${get(section, 'flag')}-divider`}>
          {get(section, 'name')}
        </span>
        {(
          <FormSection
            key={`${get(section, 'flag')}-section`}
            data={data}
            requiredKeys={props.requiredKeys}
            formDescriptions={get(section, 'fields')!}
            form={form}
            events={isFunction(getEvents) && getEvents()}
            registrationEvents={isFunction(getRegistrationEvents) && getRegistrationEvents()}
          />
        )}
      </>
    );
  };

  const renderEditContent = () => {
    const oldNode = formDescriptions_old ? map(formDescriptions_old, (section, index) => {
      return (
        <div className={classnames(styles['base-edit-panel-form_section'], { [styles['border']]: !!section.name })} key={index}>
          {renderSection(section)}
        </div>
      );
    }) : null
    const node = formDescriptions ? <FormSection requiredKeys={props.requiredKeys} formDescriptions={formDescriptions} data={data} form={form} /> : null
    return oldNode ?? node
  };

  const renderResetBtn = () => {
    return (
      <Button size="large" htmlType="reset" icon={<RedoOutlined />} onClick={handleReset}>
        重置
      </Button>
    );
  };

  const renderSubmitBtn = () => {
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        loading={loading}
        onClick={debounce(handleFinish)}
      >
        保存
      </Button>
    );
  };

  const renderPrintBtn = () => {

    return (
      <Button
        hidden={!onPrint}
        type="primary"
        size="large"
        icon={<PrinterOutlined />}
        onClick={onPrint}
      >
        打印
      </Button>
    );
  };

  const renderBtns = () => {
    if (props.renderBtns) {
      return props.renderBtns(form)
    }
    return (
      <>
        {props.renderExtraBtns && props.renderExtraBtns(form)}
        {renderResetBtn()}
        {
          onSync ? <Button
            hidden={!onSync}
            type="primary"
            size="large"
            icon={<PrinterOutlined />}
            onClick={onSync}
          >
            同步
          </Button> : null
        }

        {renderSubmitBtn()}
        {renderPrintBtn()}

      </>
    );
  };

  const renderBtnTip = () => { };

  const renderFreeButton = () => {
    return <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 99, width: '100%' }}></div>;
  };



  // 导入按钮
  const renderImportBtn = () => {
    return (
      <Button
        hidden={!onImport}
        type="primary"
        htmlType="button"
        icon={<SolutionOutlined />}
        onClick={onImport}
      >
        导入信息
      </Button>
    );
  };



  const renderModal = () => {
    return <></>;
  };

  return (
    <Form
      autoComplete="off"
      form={form}
      onBlur={handleItemBlur}
      onValuesChange={(changedValues, values) => {
        onValuesChange?.(changedValues, values)
        mchcEvent.emit('my_form', {
          type: 'onChange',
          name: Object.keys(changedValues)[0],
          value: Object.values(changedValues)[0],
          values,
          setValue: (name, value) => {
            form.setFieldsValue({ [name]: value })
          },
        })
      }}
      onFieldsChange={handleFieldsChange}
      {...formItemLayout}
      style={{ padding: 6, paddingBottom: 64, height: '100%', overflowY: 'scroll', overflowX: 'hidden' }}
    >
      {renderImportBtn()}
      {renderEditContent()}
      <div className={styles["right-bottom-btns"]}>
        <Space size="middle">

          {renderBtns()}

        </Space>
      </div>
      {renderFreeButton()}
      {renderModal()}
    </Form>
  );
}
