import React from 'react';
import { message } from 'antd';
import { get } from 'lodash';
import { BaseEditPanelForm as Form } from '@lm_fe/components_m';
import { toApi, fromApi } from './adapter';
import {BaseEditPanel,BaseEditPanelIProps} from '@lm_fe/components_m';
import { formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { fubaoRequest as request } from '@lm_fe/utils';
import { SMchc_FormDescriptions } from '@lm_fe/service'
interface IProps extends BaseEditPanelIProps {
  data?: any;
  type: 'wife' | 'husband';
}
export default class GynecologicalExam extends BaseEditPanel<IProps> {
  static defaultProps = {
    baseUrl: '/api/premarital-visits', request,
    moduleName: 'gynecological-patients-gynecological-exam',
    title: '妇科检查',
    // toApi,
    // fromApi,
    Form,
  };

  async componentDidMount() {
    const { data, moduleName } = this.props;
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName!);
    
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    const formKey = get(data, 'id') || Math.random();
    this.setState({
      formDescriptions,
      formDescriptionsWithoutSection,
      formKey,
      data: fromApi(get(data, 'premaritalVisit.gynecologicalExam'), formDescriptionsWithoutSection),
    });
  }

  handleSubmit = async (values: any) => {
    const { data: personData } = this.props;
    const { data, formDescriptionsWithoutSection } = this.state;
    const { type, title, baseUrl } = this.props;
    const gynecologicalExam = toApi(
      {
        ...data,
        ...values,
      },
      formDescriptionsWithoutSection,
    );
    const params = {
      ...get(personData, 'premaritalVisit'),
      gynecologicalExam,
      [type]: { id: get(personData, 'id') },
      visitType: type === 'wife' ? 1 : 2,
    };
    if (type === 'wife' || type === 'husband') {
      if (get(params, 'id')) {
        await request.put(`/${baseUrl}`, {
          data: params,
        });
        message.success(`修改${title}成功`);
      } else {
        (await request.post(baseUrl, params)).data
        message.success(`新增${title}成功`);
      }
    }
  };
}
