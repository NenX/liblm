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
    baseUrl: '/api/premarital/check/savePremaritalCheckArchivesGuidanceAsses', request,
    moduleName: 'wife-premarital-care-guidance-evaluation',
    title: '指导/评估',
    Form,
  };

  state = {
    data: {},
    formDescriptionsWithoutSection: {},
    formDescriptions: [],
    formKey: undefined,
    spinning: true,
    activeTemplate: '',
    printModalVisible: false,
    printId: '',
  };

  extraEvents = {
    //打印
    handlePrint: () => {
      this.print()
    },
  };
  print(printId = this.state.printId) {
    const { activeTemplate } = this.state;
    if (printId != this.state.printId) {
      this.setState({ printId })
    }
    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestConfig: {
          url: "/api/premaritalCheckupsPrint",
          data: {
            resource: activeTemplate,
            template: '',
            version: '',
            note: '',
            id: printId,
          }
        }
      }
    })
  }
  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    const { routerQuery, moduleName, type, filesData } = this.props as any;
    const id = get(this.props, 'id') || getSearchParamsValue('id');
    let res: any;
    let data: any;
    let activeTemplate = '';
    // 获取配置文件
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
    this.setState({ spinning: false });
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    if (type === 'wife') {
      res = id
        ? (await request.get(
          `/api/premarital/check/getByPremaritalCheckArchivesId?premaritalCheckArchivesId.equals=${id}&fileType.equals=2&childrenSign.equals=6`,
        )).data
        : {};
      activeTemplate = 'womanPremaritalCheckupsPrint';
    } else {
      res = id
        ? (await request.get(
          `/api/premarital/check/getByPremaritalCheckArchivesId?premaritalCheckArchivesId.equals=${id}&fileType.equals=1&childrenSign.equals=6`,
        )).data
        : {};
      activeTemplate = 'manPremaritalCheckupsPrint';
    }
    if (res) {
      data = get(res, 'data.0');
      data = { ...data, ...get(data, 'premaritalCheckArchivesGuidanceAssesVM') };
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
      activeTemplate,
      printId: get(filesData, 'id'),
    });
  };

  handleSubmit = async (values: any) => {
    const { formDescriptionsWithoutSection, data, newData } = this.state as any;
    const { baseUrl, filesData, type } = this.props as any;
    let { premaritalCheckArchivesGuidanceAssesVM } = data;
    if (newData) {
      premaritalCheckArchivesGuidanceAssesVM = get(newData, 'premaritalCheckArchivesGuidanceAssesVM');
    }
    let params = valueToApi(values, formDescriptionsWithoutSection);
    let premaritalCheckArchivesDetailId = get(filesData, 'womanPremaritalCheckArchivesDetailVM.id');
    if (type === 'husband') {
      premaritalCheckArchivesDetailId = get(filesData, 'manPremaritalCheckArchivesDetailVM.id');
    }

    params = {
      ...premaritalCheckArchivesGuidanceAssesVM,
      ...params,
      premaritalCheckArchivesDetailId,
    };

    const _res = await request.post(baseUrl, params)
    const res = _res.data
    if (get(res, 'code') === 1) {
      if (get(values, 'isPrint')) {
        message.success(get(res, 'msg'), 0.5).then(() => {
          this.print(get(filesData, 'id'))
        });
      } else {
        
      }
      let newData = get(res, 'data.0');
      this.setState({ newData });
    } else {
      
    }
  };

  // renderOtherModal = () => {
  //   const { printModalVisible, printId, activeTemplate } = this.state;
  //   return printModalVisible ? (
  //     <PrintModal
  //       onCancel={() => {
  //         this.setState({ printModalVisible: false });
  //       }}
  //       isNewEdition={true}
  //       visible={printModalVisible}
  //       url="/api/premaritalCheckupsPrint"
  //       requestData={{
  //         resource: activeTemplate,
  //         template: '',
  //         version: '',
  //         note: '',
  //         id: printId,
  //       }}
  //     />
  //   ) : null;
  // };
}
export default BasicInfo
