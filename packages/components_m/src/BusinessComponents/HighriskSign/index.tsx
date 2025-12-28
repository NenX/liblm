import React, { Component } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { get, set, isEmpty, forEach, size } from 'lodash';
import { IMchc_Doctor_OutpatientHeaderInfo, SLocal_State } from "@lm_fe/service";
import { mchcModal } from '../../modals';
import { getFutureDate } from '@lm_fe/utils';

class Index extends Component<{ form: any }> {

  handleBtnClick = () => {
    const { form } = this.props;
    const pregnancyData = form.getFieldValue();

    mchcModal.open('高危因素管理', {
      modal_data: {
        data: pregnancyData,
        pregnancyId: pregnancyData?.id,
        onFinish: this.handleSave,
      }
    })
  };



  handleSave = async (data: IMchc_Doctor_OutpatientHeaderInfo) => {
    const { form, } = this.props;
    const riskRecords = get(data, 'riskRecords') || [];
    const basicInfo = SLocal_State.getUserData()
    /**同一医生同一天只保留一条高危记录*/
    let addRecord = {};
    forEach(riskRecords, (item) => {
      if (get(item, 'eventDate') === getFutureDate(0) && get(item, 'doctor') === get(basicInfo, 'firstName')) {
        addRecord = item;
      }
    });
    if (isEmpty(addRecord)) {
      addRecord = {
        eventDate: dayjs(),
        doctor: get(basicInfo, 'firstName'),
        highriskGrade: get(data, 'highriskGrade'),
        highriskNote: get(data, 'highriskNote'),
        infectionNote: get(data, 'infectionNote'),
        gestationalWeek: get(data, 'currentGestationalWeek'),
      };
    } else {
      set(addRecord, 'highriskGrade', get(data, 'highriskGrade'));
      set(addRecord, 'highriskNote', get(data, 'highriskNote'));
      set(addRecord, 'infectionNote', get(data, 'infectionNote'));
      set(addRecord, 'gestationalWeek', get(data, 'gestationalWeek'));
    }
    riskRecords.push(addRecord);

    data = {
      ...data,
      riskRecords,
    };
    form && form.setFieldsValue(data);
  };

  render() {

    return (
      <>
        <Button onClick={this.handleBtnClick}>编辑</Button>

      </>
    );
  }
}
export default Index
