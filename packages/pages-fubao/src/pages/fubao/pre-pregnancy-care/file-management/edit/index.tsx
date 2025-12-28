import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { BaseEditPanel, formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { message } from 'antd';
import { get, isEmpty, isNil, map, omit, set } from 'lodash';
import dayjs from 'dayjs';
import { valueToApi, valueToForm } from '../../.public-exam/config/adapter';
import Form from './components/Form';
import { form_config } from './form_config';
import { mchcDriver } from '@lm_fe/env';

class WifePanel extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/progestation/check/addProgestationCheckArchives', request,
    moduleName: 'pre-pregnancy-care-file-management',
    title: '档案信息',
    Form,
  };

  rm = () => { }
  async componentDidMount() {
    this.handleInit();
    this.rm = mchcDriver.on_rm('data', e => {
      if (e.type === 'ReadCard') {
        let res = e.data

        this.formRef?.form?.setFieldsValue?.({
          womanName: res.name,
          womanProgestationCheckArchivesDetailVM: {
            progestationCheckArchivesBasicInformation: {
              ...res
            }
          }

        })
      }
    })
  }
  componentWillUnmount(): void {
    this.rm()
  }
  isUndefined = (obj: object) => {
    map(obj, (item, key) => {
      if (isNil(item)) {
        obj = omit(obj, [key]);
      }
    });
    return obj;
  };

  handleInit = async () => {
    const { routerQuery, moduleName, user } = this.props as any;
    const id = get(this.props, 'id') || getSearchParamsValue('id')
    // 获取配置文件
    const formDescriptions = form_config.__lazy_config;
    // const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
    this.setState({ spinning: false });

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    let data = id
      ? (
        await request.get(
          `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&childrenSign.equals=0`,
        )
      ).data
      : {};
    if (data) {
      data = get(data, 'data');
    }

    //是否近亲结婚
    if (get(data, 'womanProgestationCheckArchivesDetailVM.nearRelation')) {
      set(data, 'nearRelation', get(data, 'womanProgestationCheckArchivesDetailVM.nearRelation'));
    }
    if (get(data, 'womanProgestationCheckArchivesDetailVM.nearRelationNote')) {
      set(data, 'nearRelationNote', get(data, 'womanProgestationCheckArchivesDetailVM.nearRelationNote'));
    }

    data = id ? valueToForm(data, formDescriptionsWithoutSection) : {};

    const formKey = get(data, 'id') || Math.random();

    if (!get(data, 'filingDay')) set(data, 'filingDay', dayjs(new Date()));
    if (!get(data, 'auditor')) set(data, 'auditor', get(user, 'basicInfo.firstName'));
    this.setState({ formDescriptions, formDescriptionsWithoutSection, data, formKey });
  };

  handleSubmit = async (values: any) => {
    const { formDescriptionsWithoutSection, data } = this.state as any;
    const { baseUrl } = this.props as any;
    let params = valueToApi(values, formDescriptionsWithoutSection);

    //女方
    set(
      params,
      'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.name',
      get(params, 'womanName'),
    );
    set(
      params,
      'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.age',
      get(params, 'womanAge'),
    );
    set(
      params,
      'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.outpatientNo',
      get(params, 'womanOutpatientNo'),
    );
    set(
      params,
      'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.telephone',
      get(params, 'womanTelephone'),
    );

    //男方
    set(
      params,
      'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.name',
      get(params, 'manName'),
    );
    set(
      params,
      'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.age',
      get(params, 'manAge'),
    );
    set(
      params,
      'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.outpatientNo',
      get(params, 'manOutpatientNo'),
    );
    set(
      params,
      'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation.telephone',
      get(params, 'manTelephone'),
    );

    //是否近亲结婚
    if (get(params, 'nearRelation')) {
      set(params, 'manProgestationCheckArchivesDetailVM.nearRelation', get(params, 'nearRelation'));
      set(params, 'womanProgestationCheckArchivesDetailVM.nearRelation', get(params, 'nearRelation'));
    }
    if (get(params, 'nearRelationNote')) {
      set(params, 'manProgestationCheckArchivesDetailVM.nearRelationNote', get(params, 'nearRelationNote'));
      set(params, 'womanProgestationCheckArchivesDetailVM.nearRelationNote', get(params, 'nearRelationNote'));
    }

    //判断男女各自档案信息是否为空，空就不传
    const manprogestationCheckArchivesBasicInformation = this.isUndefined(
      get(params, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation'),
    );
    const manprogestationCheckArchivesMedicalHistory = this.isUndefined(
      get(params, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesMedicalHistory'),
    );
    const manprogestationCheckArchivesPhysicalExamination = this.isUndefined(
      get(params, 'manProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination'),
    );

    //女方
    const womanprogestationCheckArchivesBasicInformation = this.isUndefined(
      get(params, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesBasicInformation'),
    );
    const womanprogestationCheckArchivesMedicalHistory = this.isUndefined(
      get(params, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesMedicalHistory'),
    );
    const womanprogestationCheckArchivesPhysicalExamination = this.isUndefined(
      get(params, 'womanProgestationCheckArchivesDetailVM.progestationCheckArchivesPhysicalExamination'),
    );

    if (
      !isEmpty(manprogestationCheckArchivesBasicInformation) ||
      !isEmpty(manprogestationCheckArchivesMedicalHistory) ||
      !isEmpty(manprogestationCheckArchivesPhysicalExamination)
    ) {
      //档案类型（1男方档案，2女方档案）
      set(params, 'manProgestationCheckArchivesDetailVM.fileType', 1);
    } else {
      params = omit(params, ['manProgestationCheckArchivesDetailVM']);
    }

    if (
      !isEmpty(womanprogestationCheckArchivesBasicInformation) ||
      !isEmpty(womanprogestationCheckArchivesMedicalHistory) ||
      !isEmpty(womanprogestationCheckArchivesPhysicalExamination)
    ) {
      //档案类型（1男方档案，2女方档案）
      set(params, 'womanProgestationCheckArchivesDetailVM.fileType', 2);
    } else {
      params = omit(params, ['womanProgestationCheckArchivesDetailVM']);
    }

    //判断是否继续新建还是保存审核
    if (get(values, 'build')) {
      params = {
        ...params,
        fileStatus: 1,
      };
      const _res = await request.post(baseUrl, params)
      const res = _res.data

    } else {
      if (get(values, 'id')) {
        //男女双方档案id
        const manId = get(data, 'manProgestationCheckArchivesDetailVM.id');
        const womanId = get(data, 'womanProgestationCheckArchivesDetailVM.id');
        set(params, 'manProgestationCheckArchivesDetailVM.id', manId);
        set(params, 'womanProgestationCheckArchivesDetailVM.id', womanId);
        // 修改档案
        params = {
          ...data,
          ...params,
          fileStatus: 2,
        };
        const res = (await request.put('/api/progestation/check/updateProgestationCheckArchivesDetail', params)).data;
        // const res = _res.data

        if (get(res, 'code') === 1) {

        } else {

        }
      } else {
        //新增档案
        params = {
          ...params,
          fileStatus: 2,
        };
        const _res = await request.post(baseUrl, params)
        const res = _res.data

        if (get(res, 'code') === 1) {

          this.setState({
            data: get(res, 'data'),
          });
        } else {

        }
      }
    }
  };
}
export default WifePanel;
