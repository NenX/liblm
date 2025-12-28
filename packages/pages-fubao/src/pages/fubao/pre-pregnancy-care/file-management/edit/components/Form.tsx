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
      if (id === 'womanProgestationCheckArchivesDetailVM_progestationCheckArchivesBasicInformation_residenceAddress') {
        const value = this.form?.getFieldValue([
          'womanProgestationCheckArchivesDetailVM',
          'progestationCheckArchivesBasicInformation',
          'permanentResidenceAddress',
        ]);
        !value && message.info('请先填写完整的户口地址信息！');
        value &&
          this.form?.setFieldsValue({
            womanProgestationCheckArchivesDetailVM: {
              progestationCheckArchivesBasicInformation: { residenceAddress: value },
            },
          });
      }

      //男方
      if (
        id ===
        'manProgestationCheckArchivesDetailVM_progestationCheckArchivesBasicInformation_permanentResidenceAddress'
      ) {
        const value = this.form?.getFieldValue([
          'womanProgestationCheckArchivesDetailVM',
          'progestationCheckArchivesBasicInformation',
          'permanentResidenceAddress',
        ]);
        !value && message.info('请先填写完整的户口地址信息！');
        value &&
          this.form?.setFieldsValue({
            manProgestationCheckArchivesDetailVM: {
              progestationCheckArchivesBasicInformation: { permanentResidenceAddress: value },
            },
          });
      }

      if (id === 'manProgestationCheckArchivesDetailVM_progestationCheckArchivesBasicInformation_residenceAddress') {
        const value = this.form?.getFieldValue([
          'womanProgestationCheckArchivesDetailVM',
          'progestationCheckArchivesBasicInformation',
          'residenceAddress',
        ]);
        !value && message.info('请先填写完整的居住地址信息！');
        value &&
          this.form?.setFieldsValue({
            manProgestationCheckArchivesDetailVM: {
              progestationCheckArchivesBasicInformation: { residenceAddress: value },
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
      get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idType') === 1 &&
      size(get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO')) ===
      18 &&
      (get(changedValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idType') ||
        get(changedValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO'))
    ) {
      const idNO = get(
        allValues,
        'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO',
      );
      const checkData = mchcUtils.checkIdNo(idNO)

      form &&
        form.setFieldsValue({
          womanProgestationCheckArchivesDetailVM: {
            progestationCheckArchivesBasicInformation: {
              dob: checkData.birth,
              nationality: '中国',
              permanentResidence: checkData.province,
            },
          },
          womanAge: checkData.age,
        });
    }

    if (get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesMedicalHistory.parity')) {
      if (
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesMedicalHistory.parity') >
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesMedicalHistory.gravidity')
      ) {
        message.warning('产次＞孕次，请检查孕次、产次输入的内容!');
      }
    }

    if (
      (get(
        changedValues,
        'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight',
      ) &&
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height')) ||
      (get(
        changedValues,
        'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height',
      ) &&
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight'))
    ) {
      const bmi = getBMI(
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight'),
        get(allValues, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height'),
      );
      form &&
        form.setFieldsValue({
          womanProgestationCheckArchivesDetailVM: { progestationCheckArchivesPhysicalExamination: { bmi: bmi } },
        });
    }

    //男方
    if (
      get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idType') === 1 &&
      size(get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO')) ===
      18 &&
      (get(changedValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idType') ||
        get(changedValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO'))
    ) {
      const idNO = get(
        allValues,
        'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.idNO',
      );
      const checkData = mchcUtils.checkIdNo(idNO)
      if (checkData.status) {
        form &&
          form.setFieldsValue({
            manProgestationCheckArchivesDetailVM: {
              progestationCheckArchivesBasicInformation: {
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
      (get(changedValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight') &&
        get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height')) ||
      (get(changedValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height') &&
        get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight'))
    ) {
      const bmi = getBMI(
        get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.weight'),
        get(allValues, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination.height'),
      );
      form &&
        form.setFieldsValue({
          manProgestationCheckArchivesDetailVM: { progestationCheckArchivesPhysicalExamination: { bmi: bmi } },
        });
    }
  };

  handleCancel = async () => {
    const { history, data, routerPath, deleteTab, tabs, keepAliveProviderRef, updateTabs } = this.props as any;
    const form = this.form as unknown as FormInstance;
    if (!get(data, 'id')) form.resetFields();
    // routerPath && deleteTab(routerPath);
    // history && history.push('/pre-pregnancy-care/file-management');

    //删除keepAliveProvider缓存
    // await updateTabs(get(tabs, `tabsMapping./pre-pregnancy-care/file-management`));

    // routerPath && deleteTab && (await deleteTab(routerPath));

    // fubaoHistoryPush('/pre-pregnancy-care/file-management', this.props as any);
    // const { path, search } = get(tabs, `tabsMapping.${routerPath}`);
    // keepAliveProviderRef?.current.removeCache(`${path}.name.${search}`);

    SLocal_History.closeAndPush(resolveFubaoPath(`/pre-pregnancy-care/file-management`))

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
