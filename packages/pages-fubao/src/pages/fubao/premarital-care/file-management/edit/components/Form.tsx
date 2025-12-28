import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { BaseEditPanelForm, fubaoHistoryPush, getBMI, resolveFubaoPath } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { SLocal_History } from '@lm_fe/service';
import { Button, Space, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, size } from 'lodash';
import React from 'react';
export default class AdmissionForm extends BaseEditPanelForm {
  // 地址组件 触发按钮
  getEvents = () => ({
    handleIDNumberChange: (id: string) => {
      //女方
      if (id === 'womanPremaritalCheckArchivesDetailVM_premaritalCheckArchivesBasicInformation_residenceAddress') {
        const value = this.form?.getFieldValue([
          'womanPremaritalCheckArchivesDetailVM',
          'premaritalCheckArchivesBasicInformation',
          'permanentResidenceAddress',
        ]);
        !value && message.info('请先填写完整的户口地址信息！');
        value &&
          this.form?.setFieldsValue({
            womanPremaritalCheckArchivesDetailVM: {
              premaritalCheckArchivesBasicInformation: { residenceAddress: value },
            },
          });
      }

      //男方
      if (
        id === 'manPremaritalCheckArchivesDetailVM_premaritalCheckArchivesBasicInformation_permanentResidenceAddress'
      ) {
        const value = this.form?.getFieldValue([
          'womanPremaritalCheckArchivesDetailVM',
          'premaritalCheckArchivesBasicInformation',
          'permanentResidenceAddress',
        ]);
        !value && message.info('请先填写完整的户口地址信息！');
        value &&
          this.form?.setFieldsValue({
            manPremaritalCheckArchivesDetailVM: {
              premaritalCheckArchivesBasicInformation: { permanentResidenceAddress: value },
            },
          });
      }

      if (id === 'manPremaritalCheckArchivesDetailVM_premaritalCheckArchivesBasicInformation_residenceAddress') {
        const value = this.form?.getFieldValue([
          'womanPremaritalCheckArchivesDetailVM',
          'premaritalCheckArchivesBasicInformation',
          'residenceAddress',
        ]);
        !value && message.info('请先填写完整的居住地址信息！');
        value &&
          this.form?.setFieldsValue({
            manPremaritalCheckArchivesDetailVM: {
              premaritalCheckArchivesBasicInformation: { residenceAddress: value },
            },
          });
      }
    },
  });
  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;

    //女方
    if (
      get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType') === 1 &&
      size(get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO')) ===
      18 &&
      (get(changedValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType') ||
        get(changedValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO'))
    ) {
      const idNO = get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO');
      const checkData = mchcUtils.checkIdNo(idNO)

      if (checkData.status) {
        form &&
          form.setFieldsValue({
            womanPremaritalCheckArchivesDetailVM: {
              premaritalCheckArchivesBasicInformation: {
                dob: checkData.birth,
                nationality: '中国',
                permanentResidence: checkData.province,
              },
            },
            womanAge: checkData.age,
          });
      }

    }

    if (get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.parity')) {
      if (
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.parity') >
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory.gravidity')
      ) {
        message.warning('产次＞孕次，请检查孕次、产次输入的内容!');
      }
    }

    if (
      (get(changedValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight') &&
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height')) ||
      (get(changedValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height') &&
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight'))
    ) {
      const bmi = getBMI(
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight'),
        get(allValues, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height'),
      );
      form &&
        form.setFieldsValue({
          womanPremaritalCheckArchivesDetailVM: { premaritalCheckArchivesPhysicalExamination: { bmi: bmi } },
        });
    }

    //男方
    if (
      get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType') === 1 &&
      size(get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO')) === 18 &&
      (get(changedValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idType') ||
        get(changedValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO'))
    ) {
      const idNO = get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.idNO');
      const checkData = mchcUtils.checkIdNo(idNO)
      if (checkData.status) {
        form &&
          form.setFieldsValue({
            manPremaritalCheckArchivesDetailVM: {
              premaritalCheckArchivesBasicInformation: {
                dob: checkData.birth,
                nationality: '中国',
                permanentResidence: checkData.province,
              },
            },
            manAge: checkData.age,
          });
      }

    }

    if (
      (get(changedValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight') &&
        get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height')) ||
      (get(changedValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height') &&
        get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight'))
    ) {
      const bmi = getBMI(
        get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.weight'),
        get(allValues, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination.height'),
      );
      form &&
        form.setFieldsValue({
          manPremaritalCheckArchivesDetailVM: { premaritalCheckArchivesPhysicalExamination: { bmi: bmi } },
        });
    }
  };

  handleCancel = async () => {
    const { history, data, routerPath, deleteTab, tabs, keepAliveProviderRef, updateTabs } = this.props as any;
    const form = this.form as unknown as FormInstance;
    if (!get(data, 'id')) form.resetFields();
    // routerPath && deleteTab(routerPath);
    // history && history.push('/premarital-care/file-management');

    //删除keepAliveProvider缓存
    // await updateTabs(get(tabs, `tabsMapping./premarital-care/file-management`));
    // routerPath && (await deleteTab(routerPath));
    // fubaoHistoryPush('/premarital-care/file-management', this.props as any);
    // const { path, search } = get(tabs, `tabsMapping.${routerPath}`);
    // keepAliveProviderRef?.current.removeCache(`${path}.name.${search}`);
    SLocal_History.closeAndPush(resolveFubaoPath('/premarital-care/file-management'))
    // SLocal_History.closeCurrentTab()

  };

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
          form.resetFields();
          form.setFieldsValue({
            auditor: get(data, 'auditor'),
            filingDay: get(data, 'filingDay'),
          });
        })
        .catch((error) => {
          const name = get(error, 'errorFields.0.name.0');
          const errors = get(error, 'errorFields.0.errors.0');
          message.error(errors);
          form.scrollToField(name);
        });
  };

  renderCheckBtn = () => {
    const { data } = this.props;
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={this.handleFinish}
        disabled={false}
      >
        {get(data, 'fileStatus') === 2 ? '保存' : '保存并审核'}
        {/* 保存 */}
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
        保存并继续新增档案
      </Button>
    );
  };
  renderBtns = () => {
    const { data } = this.props;
    return (
      <Space>
        {!get(data, 'id') && this.renderSaveAndNext()}
        {this.renderCheckBtn()}
        {this.renderCancelBtn()}
      </Space>
    );
  };
}
