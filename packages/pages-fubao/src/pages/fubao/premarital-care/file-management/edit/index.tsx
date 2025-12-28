import { message } from 'antd';
import { get, isEmpty, isNil, map, omit, set } from 'lodash';
import dayjs from 'dayjs';
import Form from './components/Form';

import { BaseEditPanel, formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { mchcDriver } from '@lm_fe/env';
import { request } from '@lm_fe/utils';
import { valueToApi, valueToForm } from '../../.public-exam/config/adapter';
import { form_config } from './form_config';


class WifePanel extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/premarital/check/addPremaritalCheckArchives',
    moduleName: 'premarital-care-file-management',
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
          womanPremaritalCheckArchivesDetailVM: {
            premaritalCheckArchivesBasicInformation: {
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
    const id = get(this.props, 'id') || get(routerQuery, 'id');
    // 获取配置文件
    // const formDescriptions = await SMchc_FormDescriptions.getModuleParse(moduleName);
    const formDescriptions = form_config.__lazy_config;
    this.setState({ spinning: false });

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    let data = id
      ? (
        await request.get(
          `/api/premarital/check/getByPremaritalCheckArchivesId?premaritalCheckArchivesId.equals=${id}&childrenSign.equals=0`,
        )
      ).data
      : {};
    if (data) {
      data = get(data, 'data');
    }

    //是否近亲结婚
    if (get(data, 'womanPremaritalCheckArchivesDetailVM.nearRelation')) {
      set(data, 'nearRelation', get(data, 'womanPremaritalCheckArchivesDetailVM.nearRelation'));
    }
    if (get(data, 'womanPremaritalCheckArchivesDetailVM.nearRelationNote')) {
      set(data, 'nearRelationNote', get(data, 'womanPremaritalCheckArchivesDetailVM.nearRelationNote'));
    }
    if (get(data, 'manPremaritalCheckArchivesDetailVM.nearRelation')) {
      set(data, 'nearRelation', get(data, 'manPremaritalCheckArchivesDetailVM.nearRelation'));
    }
    if (get(data, 'manPremaritalCheckArchivesDetailVM.nearRelationNote')) {
      set(data, 'nearRelationNote', get(data, 'manPremaritalCheckArchivesDetailVM.nearRelationNote'));
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
    let params = valueToApi(values, formDescriptionsWithoutSection) as any;

    //女方(后台怪异结构需要这么传)
    set(
      params,
      'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.name',
      get(params, 'womanName'),
    );
    set(
      params,
      'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.age',
      get(params, 'womanAge'),
    );
    set(
      params,
      'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.outpatientNo',
      get(params, 'womanOutpatientNo'),
    );
    set(
      params,
      'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.telephone',
      get(params, 'womanTelephone'),
    );

    //男方(后台怪异结构需要这么传)
    set(
      params,
      'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.name',
      get(params, 'manName'),
    );
    set(
      params,
      'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.age',
      get(params, 'manAge'),
    );
    set(
      params,
      'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.outpatientNo',
      get(params, 'manOutpatientNo'),
    );
    set(
      params,
      'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation.telephone',
      get(params, 'manTelephone'),
    );

    //是否近亲结婚(后台怪异结构需要这么传)
    if (get(params, 'nearRelation')) {
      set(params, 'manPremaritalCheckArchivesDetailVM.nearRelation', get(params, 'nearRelation'));
      set(params, 'womanPremaritalCheckArchivesDetailVM.nearRelation', get(params, 'nearRelation'));
    }
    if (get(params, 'nearRelationNote')) {
      set(params, 'manPremaritalCheckArchivesDetailVM.nearRelationNote', get(params, 'nearRelationNote'));
      set(params, 'womanPremaritalCheckArchivesDetailVM.nearRelationNote', get(params, 'nearRelationNote'));
    }

    //判断男女各自档案信息是否为空，空就不传
    const manpremaritalCheckArchivesBasicInformation = this.isUndefined(
      get(params, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation'),
    );
    const manpremaritalCheckArchivesMedicalHistory = this.isUndefined(
      get(params, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory'),
    );
    const manpremaritalCheckArchivesPhysicalExamination = this.isUndefined(
      get(params, 'manPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination'),
    );

    //女方
    const womanpremaritalCheckArchivesBasicInformation = this.isUndefined(
      get(params, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesBasicInformation'),
    );
    const womanpremaritalCheckArchivesMedicalHistory = this.isUndefined(
      get(params, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesMedicalHistory'),
    );
    const womanpremaritalCheckArchivesPhysicalExamination = this.isUndefined(
      get(params, 'womanPremaritalCheckArchivesDetailVM.premaritalCheckArchivesPhysicalExamination'),
    );

    if (
      !isEmpty(manpremaritalCheckArchivesBasicInformation) ||
      !isEmpty(manpremaritalCheckArchivesMedicalHistory) ||
      !isEmpty(manpremaritalCheckArchivesPhysicalExamination)
    ) {
      //档案类型（1男方档案，2女方档案）
      set(params, 'manPremaritalCheckArchivesDetailVM.fileType', 1);
    } else {
      params = omit(params, ['manPremaritalCheckArchivesDetailVM']);
    }

    if (
      !isEmpty(womanpremaritalCheckArchivesBasicInformation) ||
      !isEmpty(womanpremaritalCheckArchivesMedicalHistory) ||
      !isEmpty(womanpremaritalCheckArchivesPhysicalExamination)
    ) {
      //档案类型（1男方档案，2女方档案）
      set(params, 'womanPremaritalCheckArchivesDetailVM.fileType', 2);
    } else {
      params = omit(params, ['womanPremaritalCheckArchivesDetailVM']);
    }

    //判断是否继续新建还是保存审核
    if (get(values, 'build')) {
      params = {
        ...params,
        fileStatus: 1,
      };

      const res = (await request.post(baseUrl, params)).data;
      if (get(res, 'code') === 1) {
        message.success(get(res, 'msg'));
      } else {
        message.warning(get(res, 'msg'));
      }
    } else {
      if (get(values, 'id')) {
        //男女双方档案id
        const manId = get(data, 'manPremaritalCheckArchivesDetailVM.id');
        const womanId = get(data, 'womanPremaritalCheckArchivesDetailVM.id');
        set(params, 'manPremaritalCheckArchivesDetailVM.id', manId);
        set(params, 'womanPremaritalCheckArchivesDetailVM.id', womanId);
        // 修改档案
        params = {
          ...data,
          ...params,
          fileStatus: 2,
        };
        const res = (await request.put('/api/premarital/check/updatePremaritalCheckArchivesDetail', params)).data;
        if (get(res, 'code') === 1) {
          message.success(get(res, 'msg'));
        } else {
          message.warning(get(res, 'msg'));
        }
      } else {
        //新增档案
        params = {
          ...params,
          fileStatus: 2,
        };

        const res = (await request.post(baseUrl, params)).data;
        if (get(res, 'code') === 1) {
          message.success(get(res, 'msg'));
          this.setState({
            data: get(res, 'data'),
          });
        } else {
          message.warning(get(res, 'msg'));
        }
      }
    }
  };
}
export default WifePanel
