import { BaseEditPanel, formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { mchcModal__ } from '@lm_fe/pages';
import { SLocal_State, SMchc_FormDescriptions } from '@lm_fe/service';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { message } from 'antd';
import { get, set } from 'lodash';
import dayjs from 'dayjs';
import { valueToApi, valueToForm } from '../config/adapter';
import Form from './components/Form';
class BasicInfo extends BaseEditPanel<any> {
  static defaultProps = {
    baseUrl: '/api/progestation/check/saveProgestationCheckArchivesGuidanceAsses', request,
    moduleName: 'wife-pre-pregnancy-care-guidance',
    title: '指导与评估',
    Form,
  };

  state = {
    data: {},
    formDescriptionsWithoutSection: {},
    formDescriptions: [],
    formKey: undefined,
    spinning: true,
    activeTemplate: 'progestationCheckPrint',

    printId: '',
  };

  extraEvents = {
    //打印
    handlePrint: () => {
      this._handlePrint()
    },
  };
  _handlePrint(printId = this.state.printId) {
    const { activeTemplate } = this.state;

    mchcModal__.open('print_modal', {
      modal_data: {

        request,
        requestData: {
          url: "/api/family/planning/casePdfPreview",
          resource: activeTemplate,
          template: '',
          version: '',
          note: '',
          id: printId,
        }
      }
    })
  }
  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    const { routerQuery, moduleName, type, filesData } = this.props as any;

    const id = get(this.props, 'id') || getSearchParamsValue('id')
    let res: any;
    let data: any;
    // 获取配置文件
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
    this.setState({ spinning: false });

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    if (type === 'wife') {
      res = id
        ? await request.get(
          `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&fileType.equals=2&childrenSign.equals=6`,
        )
        : {};
    } else {
      res = id
        ? await request.get(
          `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&fileType.equals=1&childrenSign.equals=6`,
        )
        : {};
    }
    if (res) {
      data = get(res, 'data.0');
      data = { ...data, ...get(data, 'progestationCheckArchivesGuidanceAssesVM') };
    }

    data = id ? valueToForm(data, formDescriptionsWithoutSection) : {};

    const formKey = get(data, 'id') || Math.random();
    if (!get(data, 'checkDate')) set(data, 'checkDate', dayjs(new Date()));
    if (!get(data, 'checkDoctor')) set(data, 'checkDoctor', SLocal_State.userData?.firstName);
    this.setState({
      formDescriptions,
      formDescriptionsWithoutSection,
      data,
      formKey,
      printId: get(filesData, 'id'),
    });
  };

  handleSubmit = async (values: any) => {
    const { formDescriptionsWithoutSection, data, newData } = this.state as any;
    const { baseUrl, filesData, type } = this.props as any;
    let { progestationCheckArchivesGuidanceAssesVM } = data;
    if (newData) {
      progestationCheckArchivesGuidanceAssesVM = get(newData, 'progestationCheckArchivesGuidanceAssesVM');
    }
    let params = valueToApi(values, formDescriptionsWithoutSection);
    let progestationCheckArchivesDetailId = get(filesData, 'womanProgestationCheckArchivesDetailVM.id');
    if (type === 'husband') {
      progestationCheckArchivesDetailId = get(filesData, 'manProgestationCheckArchivesDetailVM.id');
    }

    params = {
      ...progestationCheckArchivesGuidanceAssesVM,
      ...params,
      progestationCheckArchivesDetailId,
    };

    const res = (await request.post(baseUrl, params)).data
    if (get(res, 'code') === 1) {
      if (get(values, 'isPrint')) {
        message.success(get(res, 'msg'), 0.5).then(() => {
          this._handlePrint(get(res, 'data.id'))

        });
      } else {

      }
      let newData = get(res, 'data.0');
      this.setState({ newData });
    } else {

    }
  };
  renderOtherModal = () => {

    return null;
  };
}
export default BasicInfo
