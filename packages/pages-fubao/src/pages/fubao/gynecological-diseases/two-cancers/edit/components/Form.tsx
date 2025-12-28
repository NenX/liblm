import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { BaseEditPanelForm } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { SLocal_History } from '@lm_fe/service';
import { fubaoRequest as request } from '@lm_fe/utils';
import { Button, Space, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, size } from 'lodash';
import React from 'react';
export default class AdmissionForm extends BaseEditPanelForm {
  handleSaveAndNext = () => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data } = this.props;
    form &&
      form
        .validateFields()
        .then(() => {
          const params = {
            ...form.getFieldsValue(),
            id: get(data, 'id'),
            build: true,
          };
          onFinish && onFinish(params);
          __DEV__ || form.resetFields();
          form.setFieldsValue({
            registerPerson: get(data, 'registerPerson'),
            registerDate: get(data, 'registerDate'),
          });
        })
        .catch((error) => {
          const name = get(error, 'errorFields.0.name.0');
          const errors = get(error, 'errorFields.0.errors.0');
          message.error(errors);
          form.scrollToField(name);
        });
  };

  getRegistrationEvents = () => ({
    onBlur: get(this.getEvents(), 'handleInputBlur'),
  });

  // 地址组件 触发按钮
  getEvents = () => ({
    handleIDNumberChange: (id: string) => {
      if (id === 'residenceAddress') {
        const value = this.form?.getFieldValue('permanentResidenceAddress');
        !value && message.info('请先填写完整的户口地址信息！');
        value && this.form?.setFieldsValue({ residenceAddress: value });
      }
    },

    //查询门诊号是否存在
    handleInputBlur: async (e: any) => {
      const { data } = this.props;
      const id = get(data, 'id');
      const outpatientNo = this.form?.getFieldValue('outpatientNo');
      if (!id && e.target.id == 'outpatientNo' && outpatientNo) {
        const param: Object = {
          page: 0,
          size: 10,
          sort: 'id,desc',
          'deleteFlag.equals': 0,
          'outpatientNo.contains': outpatientNo,
        };
        const res = await request.get('api/two/cancer/screening/getTwoCancerScreeningFile/page', {
          params: param,
        });
        const data = res.data
        if (get(data, 'data.pageData').length > 0) {
          message.error('门诊号已存在！');
        }
      }
    },
  });

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;

    if (
      get(allValues, 'idType') === 1 &&
      size(get(allValues, 'idNO')) === 18 &&
      (get(changedValues, 'idType') || get(changedValues, 'idNO'))
    ) {
      const idNO = get(allValues, 'idNO');
      const personal = mchcUtils.checkIdNo(idNO);
      if (personal.status) {
        form &&
          form.setFieldsValue({
            dob: personal.birth,
            nationality: personal.nationality,
            nativeplace: personal.province,
            age: personal.age,
          });
      } else {
        message.warning(`${get(personal, 'message')}`);
      }
    }

    if (get(allValues, 'womenHealthcareMenstrualHistory.parity')) {
      if (
        get(allValues, 'womenHealthcareMenstrualHistory.parity') >
        get(allValues, 'womenHealthcareMenstrualHistory.conceived')
      ) {
        message.warning('产次＞孕次，请检查孕次、产次输入的内容!');
      }
    }
  };

  handleCancel = async () => {
    SLocal_History.closeAndReplace('/fubao/gynecological-diseases/two-cancers')


    // routerPath && deleteTab(routerPath);
    // fubaoHistoryPush('/gynecological-diseases/two-cancers');
  };

  renderCheckBtn = () => {
    const { history } = this.props as any;
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={this.handleFinish}
        disabled={false}
      >
        {history ? '保存并关闭' : '保存'}
      </Button>
    );
  };

  renderCancelBtn = () => {
    return (
      <Button size="large" icon={<CloseOutlined />} onClick={this.handleCancel}>
        关闭
      </Button>
    );
  };

  renderSaveAndNext = () => {
    return (
      <Button size="large" type="primary" icon={<SaveOutlined />} onClick={this.handleSaveAndNext}>
        保存并新建
      </Button>
    );
  };
  renderBtns = () => {
    const { data, history } = this.props as any;
    return (
      <Space>
        {history && this.renderCancelBtn()}
        {!get(data, 'id') && this.renderSaveAndNext()}
        {this.renderCheckBtn()}
      </Space>
    );
  };
}
