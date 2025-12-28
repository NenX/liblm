import React from 'react';
import { Button, FormInstance, Popconfirm, Space, message } from 'antd';
import { get, debounce } from 'lodash';
import store from 'store';
import { SaveOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BaseEditPanelForm, getGestationalWeekBySureEdd } from '@lm_fe/components_m'
import { request } from '@lm_fe/utils';
import { SMchc_Common } from '@lm_fe/service';
import { mchcModal__ } from '@lm_fe/pages';
export default class ClosingArchivesForm extends BaseEditPanelForm {
  state = {
    recordstate: '',
    printVisible: false,
  };

  handleItemChange = async (changedValues: any, allValues: any) => {

    const form = this.form as unknown as FormInstance;

    console.log('aag handleItemChange', changedValues)
    if (get(changedValues, 'referralOutReferralOrganization')) {
      const referralOutReferralOrganization = get(changedValues, 'referralOutReferralOrganization');


      const organization = await SMchc_Common.getReferralOrganizations({ name: referralOutReferralOrganization })

      const currentOrganization = await SMchc_Common.getCurrReferralOrganization()

      const organizationGrade = get(organization, '0.grade');
      const currentOrganizationGrade = get(currentOrganization, 'grade');
      const direction =
        currentOrganizationGrade === organizationGrade ? 1 : currentOrganizationGrade > organizationGrade ? 2 : 3;

      form?.setFieldsValue({
        referralOutReferralDirection: direction,
        referralOutReferralOrganization: get(organization, 0),
      });
    }

    if (get(changedValues, 'recordstate') === '6') {
      this.setState({
        recordstate: '6',
      });
    } else if (get(changedValues, 'recordstate') != '6') {
      this.setState({
        recordstate: get(changedValues, 'recordstate'),
      });
    }

    if (get(changedValues, 'deliveryDate')) {
      form?.setFieldsValue({
        deliveryGestationalWeek: getGestationalWeekBySureEdd(dayjs(changedValues.deliveryDate).format('YYYY-MM-DD')),
      });
    }
  };
  handlePrint = async () => {
    const { printUrl = '/api/pdf-preview', printResource, printTemplate, data } = this.props;
    const localData = store.get('localData');

    this.setState({
      printModalVisible: true,
    });
    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: printUrl,
          resource: printResource,
          template: get(localData, `referralStyle`, 2),
          version: '',
          note: '',
          id: get(data, `referralOutInfo.id`),
        }
      }
    })
  };

  renderPrintModal = () => {

  };

  showPrint() {
    const { data } = this.props;
    const { printVisible } = this.state;
    return printVisible || (get(data, `referralOutInfo.id`) && get(data, `periodState`) == 5);
  }

  renderPrintBtn = () => {
    const { printId } = this.props;

    return this.showPrint() ? (
      <Button
        type="primary"
        size="large"
        icon={<PrinterOutlined />}
        disabled={!printId}
        onClick={() => {
          this.handlePrint()
        }}
      >
        打印转诊单
      </Button>
    ) : null;
  };

  renderSubmitBtn = () => {
    const { recordstate } = this.state;

    return recordstate === '6' ? (
      <Popconfirm
        placement="topRight"
        title="你确定要结案吗？结案后将无法修改档案的任何信息，请谨慎操作！"
        onConfirm={this.handleFinish}
        okText="确定"
        cancelText="取消"
      >
        <Button size="large" type="primary" icon={<SaveOutlined />}>
          保存
        </Button>
      </Popconfirm>
    ) : (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={debounce(this.handleFinish)}
      >
        保存
      </Button>
    );
  };

  handleFinish = async () => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data } = this.props;
    form &&
      form
        .validateFields()
        .then(() => {
          const params = {
            ...form.getFieldsValue(),
            id: get(data, 'id'),
          };
          onFinish && onFinish(params);
          this.setState({ printVisible: true });
        })
        .catch((error) => {
          message.error(get(error, 'errorFields.0.errors.0'));
          form.scrollToField(get(error, 'errorFields.0.name.0'));
        });
  };

  renderBtns = () => {
    return (
      <div className="base-edit-panel-form_btns">
        <Space>
          {this.renderPrintBtn()}
          {this.renderSubmitBtn()}
        </Space>
      </div>
    );
  };
}
