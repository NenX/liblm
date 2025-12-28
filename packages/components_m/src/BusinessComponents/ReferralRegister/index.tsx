import React from 'react';
import dayjs from 'dayjs';
import { Row, Col, Button, Input } from 'antd';
import { get, map, isEmpty } from 'lodash';
import DynamicForm from '../../BaseModalForm/DynamicForm';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { formDescriptionsWithoutSectionApi } from '../../utils/adapter';
import DatePickerCus from '../../GeneralComponents/DatePicker';
import CheckboxGroup from '../../ConfigComponents/CheckboxGroup';
import ReferralOrganizationSelect from '../../selects/ReferralOrganizationSelect';
import { SLocal_State, SMchc_FormDescriptions } from '@lm_fe/service';
class ReferralRegister extends DynamicForm {
  state = {
    formDescriptions: {},
  };

  componentDidMount = async () => {
    const { form, value } = this.props;
    const formDescriptions = formDescriptionsWithoutSectionApi(
      await SMchc_FormDescriptions.getModuleParseCache('referral-register-setting'),
    );

    if (!isEmpty(value)) {
      form.setFieldsValue({
        referralInReason: get(value, 'reason'),
        referralInReferralDate: get(value, 'referralDate')
          ? dayjs(get(value, 'referralDate'))
          : get(value, 'referralDate'),
        referralInReferralOrganization: get(value, 'referralOrganization'),
        referralInReferralDept: get(value, 'referralDept'),
        referralInReferralDirection: get(value, 'referralDirection'),
        referralInReferralDoctor: get(value, 'referralDoctor'),
        referralInReferralContactNumber: get(value, 'referralContactNumber'),
        referralInRecorder: get(value, 'recorder'),
      });
    }
    this.setState({
      formDescriptions,
    });
  };

  handleBtnAdd = async () => {
    const { form, } = this.props;
    const basicInfo = SLocal_State.getUserData()
    form.setFieldsValue({
      referralInRecorder: get(basicInfo, 'firstName'),
      referralIn: { showReferralForm: true },
    });
  };

  handleBtnDelete = async () => {
    const { form } = this.props;

    form.setFieldsValue({
      referralIn: null,
      referralInReason: '',
      referralInReferralDate: '',
      referralInReferralOrganization: '',
      referralInReferralDept: '',
      referralInReferralDirection: '',
      referralInReferralDoctor: '',
      referralInReferralContactNumber: '',
      referralInRecorder: '',
    });
  };

  renderItem = (formDescription: any) => {
    const { formDescriptions } = this.state;
    let renderEditItem = this.generateRenderEditItem(formDescriptions);
    const formDescriptionKey = get(formDescription, 'key');

    switch (get(formDescription, 'inputType')) {
      case 'input':
        return renderEditItem(formDescriptionKey, <Input {...get(formDescription, 'inputProps')} />, {
          customFormItemLayout: get(formDescription, 'formItemLayout') || {},
        });
      case 'checkbox_group':
        return renderEditItem(formDescriptionKey, <CheckboxGroup config={formDescription} />, {
          customFormItemLayout: get(formDescription, 'formItemLayout') || {},
        });
      case 'single_date_picker':
        return renderEditItem(formDescriptionKey, <DatePickerCus {...get(formDescription, 'inputProps')} />, {
          customFormItemLayout: get(formDescription, 'formItemLayout') || {},
        });
      case 'text_area':
        return renderEditItem(formDescriptionKey, <Input.TextArea {...get(formDescription, 'inputProps')} />, {
          customFormItemLayout: get(formDescription, 'formItemLayout') || {},
        });
      case 'referral_organization_select':
        return renderEditItem(formDescriptionKey, <ReferralOrganizationSelect />, {
          customFormItemLayout: get(formDescription, 'formItemLayout') || {},
        });
      default:
        return renderEditItem(formDescriptionKey, <Input {...get(formDescription, 'inputProps')} />);
    }
  };

  render() {
    const { formDescriptions } = this.state;
    const { value } = this.props;

    return (
      <>
        <Row>
          {isEmpty(value) ? (
            <Button icon={<PlusOutlined />} onClick={this.handleBtnAdd}>
              添加转入登记
            </Button>
          ) : (
            <Button icon={<CloseOutlined />} onClick={this.handleBtnDelete}>
              删除转入登记
            </Button>
          )}
        </Row>
        {!isEmpty(value) && (
          <Row style={{ marginTop: '4px' }}>
            {map(formDescriptions, (formDescription, index) => {
              return (
                <Col key={index} span={get(formDescription, 'span')} offset={get(formDescription, 'offset')}>
                  {this.renderItem(formDescription)}
                </Col>
              );
            })}
          </Row>
        )}
      </>
    );
  }
}
export default ReferralRegister
