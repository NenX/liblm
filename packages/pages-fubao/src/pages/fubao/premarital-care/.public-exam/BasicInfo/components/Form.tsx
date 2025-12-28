import { ArrowRightOutlined } from '@ant-design/icons';
import { BaseEditPanelForm } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { Button, Space, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, size } from 'lodash';
import React from 'react';
export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default class Form extends BaseEditPanelForm {
  componentDidMount() {
    const { data, formDescriptionsWithoutSection, onRef } = this.props as any;
    onRef && onRef(this);
    this.form = this.formRef.current;
    this.form && this.form.setFieldsValue(data);
    this.renderEditItem = this.generateRenderEditItem(formDescriptionsWithoutSection, {
      formItemLayout,
    });
    // 强制渲染获取 form
    this.forceUpdate();
  }
  // 地址组件 触发按钮
  getEvents = () => ({
    handleIDNumberChange: (id: string) => {
      const { type, filesData } = this.props as any;
      if (type === 'husband') {
        if (id === 'permanentResidenceAddress') {
          const value = get(
            filesData,
            'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.permanentResidenceAddress',
          );
          !value && message.info('女方居住地址信息尚未填写！');
          value && this.form?.setFieldsValue({ permanentResidenceAddress: value });
        }
        if (id === 'residenceAddress') {
          const value = get(
            filesData,
            'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.residenceAddress',
          );
          !value && message.info('女方户口地址信息尚未填写！');
          value && this.form?.setFieldsValue({ residenceAddress: value });
        }
      } else {
        //女方
        if (id === 'residenceAddress') {
          const value = this.form?.getFieldValue('permanentResidenceAddress');
          !value && message.info('请先填写完整的户口地址信息！');
          value && this.form?.setFieldsValue({ residenceAddress: value });
        }
      }
    },
  });

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    //判断是否触发表单修改，触发就要保存
    const { changeFlag } = this.state as any;
    const { subscribeHandleItemChange } = this.props as any;
    if (!changeFlag) {
      subscribeHandleItemChange && subscribeHandleItemChange(true);
      this.setState({
        changeFlag: true,
      });
    }

    const form = this.form as unknown as FormInstance;

    if (get(allValues, 'idType') === 1 && size(get(changedValues, 'idNO')) === 18) {
      const idNO = get(changedValues, 'idNO');
      const checkData = mchcUtils.checkIdNo(idNO)
      if (checkData.status) {
        form &&
          form.setFieldsValue({
            age: checkData.age,
            dob: checkData.birth,
            nationality: '中国',
            permanentResidence: checkData.province,
          });
      }

    }
  };

  handleSave = async () => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data } = this.props as any;
    const params = {
      ...form.getFieldsValue(),
      id: get(data, 'id'),
    };
    onFinish && onFinish(params);
  };

  handleFinish = async () => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data, handleChangeTabs, subscribeHandleItemChange } = this.props as any;
    form &&
      form
        .validateFields()
        .then(() => {
          const params = {
            ...form.getFieldsValue(),
            id: get(data, 'id'),
          };
          onFinish && onFinish(params);
          handleChangeTabs && handleChangeTabs('BasicInfo', 'success');
          //点击保存按钮，就不触发下一页的保存
          subscribeHandleItemChange && subscribeHandleItemChange(false);
        })
        .catch((error) => {
          message.error(get(error, 'errorFields.0.errors.0'));
          form.scrollToField(get(error, 'errorFields.0.name.0'));
          handleChangeTabs && handleChangeTabs('BasicInfo', 'error');
        });
  };

  handleNext = async () => {
    const { handleClickTab } = this.props as any;
    handleClickTab && handleClickTab('MedicalHistory')();
  };

  renderBtns = () => {
    return (
      <>
        <Space>
          {this.renderSubmitBtn()}
          <Button size="large" type="primary" onClick={this.handleNext}>
            <ArrowRightOutlined /> 下一页
          </Button>
        </Space>
      </>
    );
  };
}
