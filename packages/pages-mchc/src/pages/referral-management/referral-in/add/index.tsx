import { get, set } from 'lodash';
// import { formDescriptionsFromApi, formDescriptionsWithoutSectionApi, fromApi as defaultFromApi } from '@/utils/adapter';
import Form from './components/Form';
import { request } from '@lm_fe/utils';
import { BaseEditPanel, formDescriptionsWithoutSectionApi, observePatientData, fromApi as defaultFromApi } from '@lm_fe/components_m';
import { SLocal_State, SMchc_FormDescriptions } from '@lm_fe/service';

export default class ReferralOut extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/referrals',
    moduleName: 'referral-in',
    title: '转入登记',
    Form,
  };

  async componentDidMount() {
    const { routerQuery, moduleName, baseUrl, fromApi = defaultFromApi } = this.props;
    // 订阅从 panel 获取的数据
    observePatientData.subscribe((data: any) => {
      const { data: prevData } = this.state;
      this.setState({
        data: {
          ...prevData,
          ...data,
        },
      });
    });
    // 优先从 props 里面获取id，因为可能作为组件，被其它页面引用使用
    const id = get(this.props, 'id') || get(routerQuery, 'id');
    // 上线的时候，把配置文件放在项目中，而不是通过接口获取，运行 yarn fetch-form 同步 dev 表单
    const formDescriptions = await SMchc_FormDescriptions.getModuleParse(moduleName!);

    this.setState({ spinning: false });
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    const data = id ? fromApi((await request.get(`${baseUrl}/${id}`)).data, formDescriptionsWithoutSection) : {};
    const formKey = get(data, 'id') || Math.random();

    if (!get(data, 'recorder')) set(data, 'recorder', SLocal_State.userData?.firstName);

    this.setState({ formDescriptions, formDescriptionsWithoutSection, data, formKey });
  }
}
