import { toApi, fromApi } from './adapter';
import { get } from 'lodash';
import { message } from 'antd';
import { BaseEditPanel, BaseEditPanelForm, BaseEditPanelIProps, formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { fubaoRequest as request } from '@lm_fe/utils';
interface IProps extends BaseEditPanelIProps {
  data?: any;
  type: 'wife' | 'husband';
}
export default class PhysicalExam extends BaseEditPanel<IProps> {
  static defaultProps = {
    baseUrl: '/api/premarital-visits', request,
    moduleName: 'wife-premarital-care-physical-examination',
    title: '体格检查',
    Form:BaseEditPanelForm,
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
      data: fromApi(get(data, 'premaritalVisit.physicalExam'), formDescriptionsWithoutSection),
    });
  }

  handleSubmit = async (values: any) => {
    const { data: personData } = this.props;
    const { data, formDescriptionsWithoutSection } = this.state;
    const { type, title, baseUrl } = this.props;
    const physicalExam = toApi(
      {
        ...data,
        ...values,
      },
      formDescriptionsWithoutSection,
    );
    const params = {
      ...personData,
      ...get(personData, 'premaritalVisit'),
      physicalExam,
      [type]: { id: get(personData, 'id') },
      visitType: type === 'wife' ? 1 : 2,
    };
    if (type === 'wife' || type === 'husband') {
      if (get(params, 'id')) {
        await request.put(baseUrl, params);
        message.success(`修改${title}成功`);
      } else {
        (await request.post(baseUrl, params)).data
        message.success(`新增${title}成功`);
      }
    }
  };
}
