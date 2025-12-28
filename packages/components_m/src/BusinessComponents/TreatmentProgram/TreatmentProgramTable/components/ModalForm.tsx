import { formatTimeToDate, momentDate } from '@/utils/format';
import { DatePicker_L, LazyAntd } from '@lm_fe/components';
import { isMoment, request } from '@lm_fe/utils';
import { Form, Input, message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { cloneDeep, get, keys, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import { getScheduByDateAndProjectId } from '../../utils';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
const StateOptions = [
  {
    label: '预约',
    value: 1,
  },
  {
    label: '到诊',
    value: 2,
  },
  {
    label: '取消',
    value: 3,
  },
  // {
  //   label: '超时',
  //   value: 4,
  // },
  // {
  //   label: '爽约',
  //   value: 5,
  // },
];
export default class ModalForm extends Component<any, any> {
  form: FormInstance | null = null;
  state = {
    timeRangeOption: [],
  };
  componentDidMount() {
    const { record, projectId } = this.props;
    if (record.id) {
      let result: any = cloneDeep(record);
      result.timeRange = `${record.appointmentTimeRangeStart}~${record.appointmentTimeRangeEnd}`;
      result.appointmentDate = momentDate(result.appointmentDate);
      this.form?.setFieldsValue(result);
      this.getscheduOptionData(projectId, formatTimeToDate(result.appointmentDate));
    } else {
      this.form?.setFieldsValue({});
    }
  }
  handleChange = (changedValues: any, allValues: any) => {
    const changedField = get(keys(changedValues), '0');
    // 监听预约日期 查询科预约的时间段
    if (changedField === 'appointmentDate') {
      const { projectId } = this.props;
      const changedValue = get(changedValues, changedField);
      let schedulingDate = formatTimeToDate(changedValue);
      this.getscheduOptionData(projectId, schedulingDate);
    }
  };
  handleSubmit = async () => {
    const { record, onCancel, treatmentProgramId, treatmentProgramProjectName } = this.props;
    const reservationFields = this.form?.getFieldsValue();
    const treatmentOutpatientNo = localStorage.getItem('treatmentOutpatientNo');
    map(reservationFields, (data, key) => {
      if (isMoment(data)) {
        reservationFields[key] = formatTimeToDate(data);
      }
      if (key === 'timeRange') {
        if (data) {
          let appointmentTimeRangeStart = data.split('~')[0] || '';
          let appointmentTimeRangeEnd = data.split('~')[1] || '';
          set(reservationFields, 'appointmentTimeRangeStart', appointmentTimeRangeStart);
          set(reservationFields, 'appointmentTimeRangeEnd', appointmentTimeRangeEnd);
        }
      }
    });
    let submitData = { ...record, ...reservationFields };
    if (treatmentProgramId) {
      let params = {
        ...submitData,
        treatmentProgramId,
        treatmentProgramProjectName,
        outpatientNo: treatmentOutpatientNo,
      };
      if (submitData.id) {
        const res: any = await request.put(`/api/postpartum/treatment/updateReservation`, params);
        if (res.code === 1) {
          message.success(`修改预约成功`);
          await this.props.onChangeDataSource(submitData);
        } else {
          message.info(res.msg);
        }
      } else {
        const res: any = await request.post(`/api/postpartum/treatment/saveReservation`, params);
        if (res.code === 1) {
          message.success(`新增预约成功`);
          await this.props.onChangeDataSource(submitData);
        } else {
          message.info(res.msg);
        }
      }
    }
    onCancel && onCancel();
  };
  getscheduOptionData = async (projectId: any, schedulingDate: any) => {
    let params = `projectId.equals=${projectId}&schedulingDate.equals=${schedulingDate}`;
    const scheduOptionData = await getScheduByDateAndProjectId(params);
    console.log(scheduOptionData, 'optionData');
    let timeRangeOption: any = [];
    scheduOptionData.map((data: any) => {
      timeRangeOption.push({
        label: `${data.timeRangeStart}~${data.timeRangeEnd}`,
        value: `${data.timeRangeStart}~${data.timeRangeEnd}`,
      });
    });
    console.log(timeRangeOption, 'timeRangeOption');
    this.setState({ timeRangeOption });
  };
  disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < dayjs().startOf('day');
  }
  render() {
    const { visible, onCancel } = this.props as any;
    const { timeRangeOption } = this.state;
    return (
      <Form
        ref={(form) => {
          this.form = form;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={this.handleChange}
      >
        <Modal title="编辑预约信息" width={800} onOk={this.handleSubmit} visible={visible} onCancel={onCancel}>
          <Form.Item name="appointmentDate" label="预约日期">
            <DatePicker_L disabledDate={this.disabledDate} />
          </Form.Item>
          <Form.Item name="timeRange" label="时间段">
            <Select options={timeRangeOption} />
          </Form.Item>
          <Form.Item name="state" label="状态">
            <Select options={StateOptions} />
          </Form.Item>
          <Form.Item name="name" label="预约者">
            <Input />
          </Form.Item>
        </Modal>
      </Form>
    );
  }
}
