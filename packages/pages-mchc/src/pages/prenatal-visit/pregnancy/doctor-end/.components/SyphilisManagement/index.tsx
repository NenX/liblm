import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { get, set, cloneDeep, size, forEach, without, orderBy } from 'lodash';
import { getGesWeek } from '@/utils/formula';
import { changeSyphilis } from '@/actions/prenatal-visit';
import MyForm from '@/components/MyForm/index';
import { FormConfig } from '@/components/MyForm/interface';
import { getFormData } from '@/components/MyForm/utils';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import * as Options from '@/pages/prenatal-visit/pregnancy/options';
import './index.less';
class Index extends Component {
  state = {
    formHandler: {},
    syphilisData: {},
  };

  async componentDidMount() {
    const { pregnancyData } = this.props;
    let syphilisData = await api.components.getSyphilisManagers(get(pregnancyData, 'id'));
    syphilisData = get(syphilisData, '0') || {};

    //数据转化处理
    const syphilisTreatments = get(syphilisData, 'syphilisTreatments');
    if (size(syphilisTreatments) > 0) {
      const newData: any[] = [];
      forEach(syphilisTreatments, (item) => {
        const syphilisInjections = orderBy(get(item, 'syphilisInjections'), 'injectionDate', ['asc']);
        const obj = {};
        set(obj, 'id', get(item, 'id'));
        set(obj, 'firstId', get(syphilisInjections, '0.id'));
        set(obj, 'firstUserId', get(syphilisInjections, '0.user.id'));
        set(obj, 'firstInjectionDate', get(syphilisInjections, '0.injectionDate'));
        set(obj, 'firstInjectionGesweek', get(syphilisInjections, '0.gesweek'));
        set(obj, 'firstInjectionResult', get(syphilisInjections, '0.injectionResult'));

        set(obj, 'secondId', get(syphilisInjections, '1.id'));
        set(obj, 'secondUserId', get(syphilisInjections, '1.user.id'));
        set(obj, 'secondInjectionDate', get(syphilisInjections, '1.injectionDate'));
        set(obj, 'secondInjectionGesweek', get(syphilisInjections, '1.gesweek'));
        set(obj, 'secondInjectionResult', get(syphilisInjections, '1.injectionResult'));

        set(obj, 'thirdId', get(syphilisInjections, '2.id'));
        set(obj, 'thirdUserId', get(syphilisInjections, '2.user.id'));
        set(obj, 'thirdInjectionDate', get(syphilisInjections, '2.injectionDate'));
        set(obj, 'thirdInjectionGesweek', get(syphilisInjections, '2.gesweek'));
        set(obj, 'thirdInjectionResult', get(syphilisInjections, '2.injectionResult'));
        newData.push(obj);
      });
      set(syphilisData, 'syphilisTreatments', newData);
    }

    this.setState({ syphilisData });
  }

  componentDidUpdate() {
    const { formHandler } = this.state;
    const { pregnancyData, headerInfo } = this.props;
    if (formHandler.subscribe) {
      formHandler.subscribe('syphilisTreatments', 'change', (val: any) => {
        // const sureEdd = get(pregnancyData, 'sureEdd');
        const sureEdd = get(headerInfo, `edd`);
        const newVal = cloneDeep(val);
        newVal.forEach((item: any) => {
          if (item.firstInjectionDate && sureEdd) {
            item.firstInjectionGesweek = getGesWeek(sureEdd, item.firstInjectionDate);
          }
          if (item.secondInjectionDate && sureEdd) {
            item.secondInjectionGesweek = getGesWeek(sureEdd, item.secondInjectionDate);
          }
          if (item.thirdInjectionDate && sureEdd) {
            item.thirdInjectionGesweek = getGesWeek(sureEdd, item.thirdInjectionDate);
          }
        });
        formHandler.syphilisTreatments.actions.setValue(newVal);
      });
    }
  }

  handleCancel = () => {
    const { changeSyphilis } = this.props;
    changeSyphilis(false);
  };

  handleOk = async () => {
    const { formHandler, syphilisData } = this.state;
    const { pregnancyData, changeSyphilis, handleSubmit } = this.props;
    const { res } = await formHandler.submit();
    const formData = getFormData(res);

    //数据转化处理
    const syphilisTreatments = get(formData, 'syphilisTreatments');
    if (size(syphilisTreatments) > 0) {
      const newData: any[] = [];
      forEach(syphilisTreatments, (item) => {
        const obj = {};
        set(obj, 'id', get(item, 'id'));

        if (get(item, 'firstInjectionDate') || get(item, 'firstInjectionResult')) {
          if (get(item, 'firstId')) set(obj, 'syphilisInjections.0.id', get(item, 'firstId'));
          set(obj, 'syphilisInjections.0.injectionDate', get(item, 'firstInjectionDate'));
          set(obj, 'syphilisInjections.0.gesweek', get(item, 'firstInjectionGesweek'));
          set(obj, 'syphilisInjections.0.injectionResult', get(item, 'firstInjectionResult'));
          if (get(item, 'firstUserId')) set(obj, 'syphilisInjections.0.user.id', get(item, 'firstUserId'));
        }

        if (get(item, 'secondInjectionDate') || get(item, 'secondInjectionResult')) {
          if (get(item, 'secondId')) set(obj, 'syphilisInjections.1.id', get(item, 'secondId'));
          set(obj, 'syphilisInjections.1.injectionDate', get(item, 'secondInjectionDate'));
          set(obj, 'syphilisInjections.1.gesweek', get(item, 'secondInjectionGesweek'));
          set(obj, 'syphilisInjections.1.injectionResult', get(item, 'secondInjectionResult'));
          if (get(item, 'secondUserId')) set(obj, 'syphilisInjections.1.user.id', get(item, 'secondUserId'));
        }

        if (get(item, 'thirdInjectionDate') || get(item, 'thirdInjectionResult')) {
          if (get(item, 'thirdId')) set(obj, 'syphilisInjections.2.id', get(item, 'thirdId'));
          set(obj, 'syphilisInjections.2.injectionDate', get(item, 'thirdInjectionDate'));
          set(obj, 'syphilisInjections.2.gesweek', get(item, 'thirdInjectionGesweek'));
          set(obj, 'syphilisInjections.2.injectionResult', get(item, 'thirdInjectionResult'));
          if (get(item, 'thirdUserId')) set(obj, 'syphilisInjections.2.user.id', get(item, 'thirdUserId'));
        }

        set(obj, 'syphilisInjections', without(get(obj, 'syphilisInjections'), undefined));
        newData.push(obj);
      });
      set(formData, 'syphilisTreatments', newData);
    }

    if (get(syphilisData, 'id')) {
      set(formData, 'id', get(syphilisData, 'id'));
      set(formData, 'pregnancy.id', get(pregnancyData, 'id'));
      await api.components.updateSyphilisManagers(formData);
    } else {
      set(formData, 'pregnancy.id', get(pregnancyData, 'id'));
      await api.components.createSyphilisManagers(formData);
    }
    handleSubmit && handleSubmit();
    changeSyphilis(false);
  };

  config = () => {
    const config: Array<FormConfig> = [
      {
        name: 'referral',
        key: 'referral',
        label: '转诊',
        input_type: 'checkbox',
        input_props: {
          type: 'group',
          options: Options.nyOptions,
        },
        span: 12,
      },
      {
        name: 'consent',
        key: 'consent',
        label: '同意治疗',
        input_type: 'checkbox',
        input_props: {
          type: 'group',
          options: Options.nyOptions,
        },
        span: 12,
      },
      { name: 'tppa', key: 'tppa', label: 'TPPA滴度', input_type: 'input', span: 6 },
      { name: 'trust', key: 'trust', label: 'TRUST滴度', input_type: 'input', span: 6 },

      { name: '', key: '', label: '疗程', header_label: true, just_header: true, input_type: '' },
      {
        name: 'syphilisTreatments',
        key: 'syphilisTreatments',
        label: '',
        input_type: 'array-custom',
        is_new_row: true,
        input_props: {
          array_title: '疗程',
          config: [
            { name: 'id', key: 'id', label: 'id', input_type: 'input', hidden: true, span: 5 },
            { name: 'firstId', key: 'firstId', label: '', input_type: 'input', hidden: true, span: 5 },
            { name: 'secondId', key: 'secondId', label: '', input_type: 'input', hidden: true, span: 5 },
            { name: 'thirdId', key: 'thirdId', label: '', input_type: 'input', hidden: true, span: 5 },
            { name: 'firstUserId', key: 'firstUserId', label: '', input_type: 'input', hidden: true, span: 5 },
            { name: 'secondUserId', key: 'secondUserId', label: '', input_type: 'input', hidden: true, span: 5 },
            { name: 'thirdUserId', key: 'thirdUserId', label: '', input_type: 'input', hidden: true, span: 5 },

            { name: 'firstInjectionDate', key: 'firstInjectionDate', label: '第一针', input_type: 'date', span: 6 },
            {
              name: 'firstInjectionGesweek',
              key: 'firstInjectionGesweek',
              label: '孕周',
              input_type: 'input',
              inputProps: { disabled: true },
              span: 6,
            },
            {
              name: 'firstInjectionResult',
              key: 'firstInjectionResult',
              label: '执行情况',
              input_type: 'select',
              input_props: { options: Options.resultOptions, warningOption: '未执行' },
              span: 6,
            },
            {
              name: 'secondInjectionDate',
              key: 'secondInjectionDate',
              label: '第二针',
              input_type: 'date',
              is_new_row: true,
              span: 6,
            },
            {
              name: 'secondInjectionGesweek',
              key: 'secondInjectionGesweek',
              label: '孕周',
              input_type: 'input',
              inputProps: { disabled: true },
              span: 6,
            },
            {
              name: 'secondInjectionResult',
              key: 'secondInjectionResult',
              label: '执行情况',
              input_type: 'select',
              input_props: { options: Options.resultOptions, warningOption: '未执行' },
              span: 6,
            },
            {
              name: 'thirdInjectionDate',
              key: 'thirdInjectionDate',
              label: '第三针',
              input_type: 'date',
              is_new_row: true,
              span: 6,
            },
            {
              name: 'thirdInjectionGesweek',
              key: 'thirdInjectionGesweek',
              label: '孕周',
              input_type: 'input',
              inputProps: { disabled: true },
              span: 6,
            },
            {
              name: 'thirdInjectionResult',
              key: 'thirdInjectionResult',
              label: '执行情况',
              input_type: 'select',
              input_props: { options: Options.resultOptions, warningOption: '未执行' },
              span: 6,
            },
          ],
        },
      },

      { name: '', key: '', label: 'TRUST随访结果', header_label: true, just_header: true, input_type: '' },
      {
        name: 'syphilisFollowUps',
        key: 'syphilisFollowUps',
        label: '',
        input_type: 'array-custom',
        is_new_row: true,
        input_props: {
          array_title: '结果',
          config: [
            { name: 'id', key: 'id', label: 'id', input_type: 'input', hidden: true, span: 5 },
            { name: 'reportDate', key: 'reportDate', label: '报告时间', input_type: 'date', span: 6 },
            { name: 'trust', key: 'trust', label: 'TRUST滴度', input_type: 'input', span: 6 },
          ],
        },
      },
    ];

    return config;
  };

  render() {
    const { syphilisData } = this.state;
    const { isShowSyphilis } = this.props;

    return (
      <Modal
        title="梅毒管理"
        className="syphilis-modal label-width5"
        width={1000}
        visible={true}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <MyForm
          config={this.config()}
          value={syphilisData}
          getFormHandler={(formHandler: any) => this.setState({ formHandler })}
          submitChange={false}
        />
      </Modal>
    );
  }
}
const mapDisPathchToProps = { changeSyphilis };
export default connect(null, mapDisPathchToProps)(Index);
