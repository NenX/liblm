import {
  BaseEditPanel,
  fromApi as defaultFromApi,
  toApi as defaultToApi,
  formDescriptionsWithoutSectionApi,
  formatTimeToStandard,
} from '@lm_fe/components_m';
import { SLocal_History, SMchc_FormDescriptions } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { message } from 'antd';
import { get, isEmpty, map, set } from 'lodash';
import dayjs from 'dayjs';
import Form from './components/Form';
import { form_config } from './form_config'
class FolicAcidNurse extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/addFolateManagementFile',
    moduleName: 'folic-acid-file',
    title: '档案信息',
    Form,
  };

  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    const { routerQuery, moduleName, fromApi = defaultFromApi } = this.props as any;
    const id = get(this.props, 'id') || get(routerQuery, 'id');
    // 获取配置文件
    this.setState({ spinning: false });
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(form_config);
    let data = id ? (await request.get(`/api/getFolateManagementFile/${id}`)).data : {};
    if (data) {
      data = get(data, 'data');
    }
    data = id ? fromApi(data, formDescriptionsWithoutSection) : {};
    const formKey = get(data, 'id') || Math.random();

    if (!isEmpty(data)) {
      //处理发放叶酸记录数据（有效日期）
      const { folateDistributionRecords } = data as any;
      if (!isEmpty(folateDistributionRecords)) {
        map(folateDistributionRecords, (item) => {
          const effectiveDate = get(item, 'effectiveDate');
          if (effectiveDate) {
            const effectiveDateArr = effectiveDate.split('~');
            set(item, 'effectiveDateBegin', effectiveDateArr[0]);
            set(item, 'effectiveDateEnd', effectiveDateArr[1]);
          }
        });
      }
    }

    if (!get(data, 'filingDate')) set(data, 'filingDate', dayjs(new Date()));
    this.setState({ formDescriptions: form_config, formDescriptionsWithoutSection, data, formKey });
  };

  handleSubmit = async (values: any) => {
    const { user } = this.props as any;
    const { formDescriptionsWithoutSection } = this.state as any;
    const {
      toApi = defaultToApi,
      history,
      baseUrl,
      deleteTab,
      routerPath,
      keepAliveProviderRef,
      updateTabs,
      tabs,
    } = this.props as any;
    let params = await toApi(values, formDescriptionsWithoutSection);


    //处理发放叶酸记录数据
    const folateDistributionRecords = get(params, 'folateDistributionRecords');
    map(folateDistributionRecords, (item) => {
      if (!get(item, 'issueDate')) {
        set(item, 'issueDate', formatTimeToStandard(dayjs(new Date()), 'YYYY-MM-DD'));
      }
      if (!get(item, 'registerPerson')) {
        set(item, 'registerPerson', get(user, 'basicInfo.firstName'));
      }
      if (get(item, 'effectiveDateBegin') && get(item, 'effectiveDateEnd')) {
        set(item, 'effectiveDate', `${get(item, 'effectiveDateBegin')}~${get(item, 'effectiveDateEnd')}`);
      }
    });

    let res = get(values, 'id')
      ? (await request.put('/api/updateFolateManagementFile', params)).data
      : (await request.post(baseUrl, params)).data
    if (get(res, 'code') === 1) {
      message.success(get(res, 'msg'));

      SLocal_History.closeAndPush('/fubao/folic-acid/file-management/list')
    } else {
      message.warning(get(res, 'msg'));
    }
  };
}
export default FolicAcidNurse
