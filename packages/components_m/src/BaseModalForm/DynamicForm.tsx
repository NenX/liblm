import { ProfileOutlined } from '@ant-design/icons';
import { SLocal_State } from '@lm_fe/service';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { get } from 'lodash';
import React from 'react';
import styles from './index.module.less';
export const horizontalFormItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
export const verticalFormItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
export const nonLabelLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};
export default class DynamicForm<IProps = {}, IState = {}> extends React.PureComponent<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  form: FormInstance | any;

  componentDidMount() {
    setTimeout(() => {
      this.form = this.formRef.current;
    }, 100);
  }

  generateRenderEditItem = (formDescriptions: any, options: any = {}) => {
    const { formItemLayout } = options;
    return (key: string, ReactNode: React.ReactNode, others: object = {}) => {
      const config = get(formDescriptions, key) || {};
      const { label, rules, inputProps } = config;
      let name = key && key.includes('.') ? key.split('.') : key;
      const unit = get(config, 'unit') || get(inputProps, 'unit');
      const labelAlign = get(inputProps, 'labelAlign');
      const colon = get(inputProps, 'colon');

      return (
        <Form.Item
          {...formItemLayout}
          {...get(others, 'customFormItemLayout')}
          style={{ ...get(others, 'styles') }}
          // valuePropName={{ ...get(others, 'valuePropName') }}
          labelAlign={labelAlign}
          colon={colon}
          key={key}
          label={
            label ? (
              <span title={label}>
                {label}
                {unit ? <span className={styles["form-item-label-unit"]}>({unit})</span> : ''}
                {SLocal_State.isDev ? <span className={styles["form-item-label-unit"]}>({config?.id},{config.key})</span> : ''}

              </span>
            ) : (
              SLocal_State.isDev ? <span className={styles["form-item-label-unit"]}>({config?.id},{config.key})</span> : ''

            )
          }
          name={name}
          rules={rules}
        >
          {ReactNode}
        </Form.Item>
      );
    };
  };

  generateRenderQueryItem = (formDescriptions: any, options: any = {}) => {
    const { formItemLayout } = options;
    return (key: string, ReactNode: React.ReactNode, others: object = {}) => {
      const config = get(formDescriptions, key) || {};
      const { label, rules, inputProps } = config;
      return (
        <Form.Item
          {...formItemLayout}
          {...get(others, 'customFormItemLayout')}
          style={{ ...get(others, 'styles') }}
          key={key}
          label={
            label ? (
              <span>
                {label}
                {get(inputProps, 'unit') ? (
                  <span className={styles["form-item-label-unit"]}>({get(inputProps, 'unit')})</span>
                ) : (
                  ''
                )}
              </span>
            ) : (
              ''
            )
          }
          name={key}
          rules={rules}
        >
          {ReactNode}
        </Form.Item>
      );
    };
  };

  //带有报告图标
  generateRenderEditItemWithReport = (formDescriptions: any, options: any = {}) => {
    const { extraEvents } = this.props as any;
    const { formItemLayout } = options;
    return (key: string, ReactNode: React.ReactNode, others: object = {}) => {
      const config = get(formDescriptions, key) || {};
      const { label, rules, inputProps } = config;
      let name = key && key.includes('.') ? key.split('.') : key;
      const labelAlign = get(inputProps, 'labelAlign');
      return (
        <Form.Item
          {...formItemLayout}
          {...get(others, 'customFormItemLayout')}
          labelAlign={labelAlign}
          style={{ ...get(others, 'styles') }}
          key={key}
          label={
            label ? (
              <span>
                {get(inputProps, 'report') ? (
                  <ProfileOutlined
                    style={get(extraEvents, 'reportStyleInit')()}
                    onClick={() => get(extraEvents, 'handleClickReport')(name)}
                  />
                ) : (
                  ''
                )}
                {label}
                {get(inputProps, 'unit') ? (
                  <span className={styles["form-item-label-unit"]}>({get(inputProps, 'unit')})</span>
                ) : (
                  ''
                )}
              </span>
            ) : (
              ''
            )
          }
          name={name}
          rules={rules}
        >
          {ReactNode}
        </Form.Item>
      );
    };
  };

  generateRenderViewItem = () => () => { };

  render() {
    return <></>;
  }
}
