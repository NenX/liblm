import React from 'react';
import { message, Space } from 'antd';
import { get } from 'lodash';
import {BaseEditPanel,BaseEditPanelIProps} from '@lm_fe/components_m';
import { formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import Form from './components/Form';
import { toApi, fromApi } from '../adapter';
import { fubaoRequest as request } from '@lm_fe/utils'
import { SMchc_FormDescriptions } from '@lm_fe/service';
interface IProps extends BaseEditPanelIProps {
  data?: any;
  baseUrl: '/api/wives' | '/api/husbands';
}
export default class DiseaseHistory extends BaseEditPanel<IProps> {
  static defaultProps = {
    baseUrl: '', request,
    moduleName: 'wife-premarital-care-disease-history',
    title: '病史信息',
    Form,
  };

  async componentDidMount() {
    const { data, moduleName } = this.props;
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    const newData = fromApi(data, formDescriptionsWithoutSection);
    const formKey = get(data, 'id') || Math.random();
    this.setState({
      formDescriptions,
      formDescriptionsWithoutSection,
      formKey,
      data: {
        ...newData,
        maritalHistory: JSON.stringify({
          0: get(newData, 'maritalHistory.graviditycount'),
          1: get(newData, 'maritalHistory.child'),
        }),
      },
    });
  }

  handleSubmit = async (values: any) => {
    const { formDescriptionsWithoutSection } = this.state;
    const { type, title, baseUrl, data: propsData } = this.props;
    const { maritalHistory: maritalHistoryStr } = values;
    const maritalHistoryJson = JSON.parse(maritalHistoryStr);
    const id = get(propsData, 'id');

    const params = toApi(
      {
        ...propsData,
        ...values,
        maritalHistory: {
          graviditycount: get(maritalHistoryJson, '0'),
          child: get(maritalHistoryJson, '1'),
        },
      },
      formDescriptionsWithoutSection,
    );
    if (id) {
      await request.put(baseUrl, params);
      message.success(`修改${title}成功`);
    } else {
      (await request.post(baseUrl, params)).data
      message.success(`新增${title}成功`);
    }
  };

  renderBtns = () => {
    return (
      <Space>
        {this.renderResetBtn()}
        {this.renderSubmitBtn()}
      </Space>
    );
  };
}
