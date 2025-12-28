// import DataSelect from '@/components/DataSelect';
import { createResources, DataSelect, GeneralComponents_DictionarySelect, getResources, updateResources } from '@lm_fe/components_m';
import { mchcStore } from '@lm_fe/env';
import { Form, Input, message, Modal, Switch, Tooltip } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get } from 'lodash';
import React, { Component } from 'react';
import { fromApi, toApi } from '../config/adapter';
import PushDate from './PushDate';
import RangeInput from './RangeInput';
import UserSelect from './UserSelect';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
/**
 * 以下字段要和数据字典保持一致
 *
 * 推送对象 Task.pushObject
 * 孕期内所有用户	1
 * 分娩后所有用户	2
 * 指定用户类型	3
 * 指定用户	4
 * 指定手术用户	5
 *
 * 推送时间 Task.pushTimeType
 * 引产手术日期	7
 *  阴道分娩日期	8
 * 剖宫产手术日期	9
 * 手术日期	10
 * 孕周	11
 * 建档日期	1
 * 审核孕册日期	2
 * 预产期-B超日期	3
 * 指定日期	12
 * 最后复诊日期	4
 * 预约日期	5
 * 诊断日期	6
 */

export class ModalForm extends Component {
  state = {
    educationType: '',
    contentType: '',
  };

  form: any;

  async componentDidMount() {
    const { id } = this.props;
    const form: FormInstance = this.form;
    if (id) {
      const result = await getResources(`/api/knowledge-tasks/${id}`);
      const data = fromApi(result);
      form.setFieldsValue(data);
      this.forceUpdate();
    }
  }

  handleSubmit = async () => {
    const { id, onCancel, onSearch } = this.props;
    await this.form.validateFields();
    const formData = this.form.getFieldsValue();
    const data = toApi({ ...formData, id });
    //return;
    if (id) {
      await updateResources('/api/knowledge-tasks', data);
    } else {
      await createResources('/api/knowledge-tasks', data);
    }
    message.success('操作成功');
    onCancel && onCancel();
    onSearch && onSearch();
  };

  handleFieldsChange = (changedFields: any[], allFields: any[]) => {
    this.forceUpdate();
  };

  renderKnowlodgeFormItems = () => {
    let contentType, showEducationType, educationType;
    let educationContentItem = (
      <Form.Item name="educationContent" label="宣教内容">
        <Input disabled />
      </Form.Item>
    );
    if (this.form) {
      contentType = this.form.getFieldValue('contentType');
      educationType = this.form.getFieldValue('educationType');
      // contentType 枚举 Task.contentType
      if (get(contentType, 'selectedData') === 1) {
        showEducationType = true;
        const educationContentUrl = get(educationType, 'selectedData')
          ? `knowledges?page=0&size=99999&type.equals=${get(educationType, 'selectedData')}&sort=id,desc`
          : 'knowledges?page=0&size=99999&sort=id,desc';
        educationContentItem = (
          <Form.Item name="educationContent" label="宣教内容1">
            <DataSelect key={educationContentUrl} url={educationContentUrl} valueKey="id" labelKey="title" />
          </Form.Item>
        );
      }
      if (get(contentType, 'selectedData') === 2) {
        showEducationType = false;
        educationContentItem = (
          <Form.Item name="educationContent" label="宣教内容2">
            <DataSelect
              key="videos?page=0&size=99999&sort=id,desc"
              url="videos?page=0&size=99999&sort=id,desc"
              valueKey="id"
              labelKey="title"
            />
          </Form.Item>
        );
      }
      if (get(contentType, 'selectedData') === 3) {
        showEducationType = false;
        educationContentItem = (
          <Form.Item name="educationContent" label="宣教内容3">
            <Input />
          </Form.Item>
        );
      }
      if (get(contentType, 'selectedData') === 4) {
        showEducationType = false;
        educationContentItem = (
          <Form.Item name="educationContent" label="宣教内容4">
            <DataSelect
              key="work-questions?page=0&size=99999&sort=id,desc"
              url="work-questions?page=0&size=99999&sort=id,desc"
              valueKey="id"
              labelKey="title"
            />
          </Form.Item>
        );
      }
    }
    return (
      <>
        {showEducationType && (
          <Form.Item name="educationType" label="宣教类型">
            <GeneralComponents_DictionarySelect placeholder="请选择宣教类型" uniqueKey="Knowledge.knowledgeType" />
          </Form.Item>
        )}
        {educationContentItem}
      </>
    );
  };

  renderUserFormItems = () => {
    let pushObject;
    let pushObjectItems = <></>;
    if (this.form) {
      pushObject = this.form.getFieldValue('pushObject');
      // pushObject 枚举 Task.pushObject
      if (get(pushObject, 'selectedData') === 3) {
        pushObjectItems = (
          <>
            <Form.Item name="gestationalRange" label="孕周范围">
              <RangeInput labelAfter="周" />
            </Form.Item>
            <Form.Item name="ageRange" label="年龄范围">
              <RangeInput labelAfter="岁" />
            </Form.Item>
            <Form.Item name="dangeLevel" label="高危等级">
              <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.dangeLevel" />
            </Form.Item>
            <Form.Item name="diseases" label="传染病">
              <GeneralComponents_DictionarySelect type="select" mode="multiple" uniqueKey="Task.diseases" />
            </Form.Item>
            {/* <Form.Item name="operationKeywords" label="诊断关键词">
              <Select mode="tags" defaultOpen={false} />
            </Form.Item>
            <Form.Item name="inspectionReport" label="检验报告">
              <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.inspectionReport" />
            </Form.Item>
            <Form.Item name="inspectionReportResult" label="检验报告结果">
              <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.inspectionReportResult" />
            </Form.Item> */}
            <Form.Item name="userLabel" label="用户标签">
              <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.tag" />
            </Form.Item>
          </>
        );
      }
      if (get(pushObject, 'selectedData') === 4) {
        pushObjectItems = (
          <>
            <Form.Item name="outpatientNO" label="就诊卡号">
              <UserSelect />
            </Form.Item>
          </>
        );
      }
      if (get(pushObject, 'selectedData') === 5) {
        pushObjectItems = (
          <>
            <Form.Item name="operationKeywords" label="手术名称关键词">
              <Select mode="tags" defaultOpen={false} />
            </Form.Item>
            <Form.Item name="gestationalRange" label="孕周范围">
              <RangeInput labelAfter="周" />
            </Form.Item>
          </>
        );
      }
    }
    return <>{pushObjectItems}</>;
  };

  judgeReportBtnPermission = () => {
    const permissions = Object.values(mchcStore.state?.user?.permissionsMapping ?? {})
    for (let index = 0; index < permissions.length; index++) {
      const permission = permissions[index];
      if (get(permission, 'type') === 'function' && get(permission, 'key') === 'follow-up-report-permission') {
        return true;
      }
    }
    return false;
  };

  render() {
    const { visible, onCancel } = this.props;
    const reportBtnPermission = this.judgeReportBtnPermission();
    return (
      <Form
        ref={(form) => {
          this.form = form;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFieldsChange={this.handleFieldsChange}
      >
        <Modal title="编辑任务" width={800} onOk={this.handleSubmit} visible={visible} onCancel={onCancel}>
          <Form.Item rules={[{ required: true, message: '任务标题是必填项' }]} name="title" label="任务标题">
            <Input />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '任务类型是必填项' }]} name="contentType" label="任务类型">
            <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.contentType" />
          </Form.Item>
          {this.renderKnowlodgeFormItems()}
          <Form.Item
            rules={[{ required: true, message: '推送目标对象是必填项' }]}
            name="pushObject"
            label="推送目标对象"
          >
            <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.pushObject" />
          </Form.Item>
          {this.renderUserFormItems()}
          <Form.Item rules={[{ required: true, message: '推送频率是必填项' }]} name="pushFrequency" label="推送频率">
            <GeneralComponents_DictionarySelect type="select" mode="single" uniqueKey="Task.pushFrequency" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '推送时间是必填项' }]}
            name="pushFrequencyNote"
            label="推送时间"
          >
            <PushDate />
          </Form.Item>
          <Form.Item name="releaseStatus" label="发布状态" valuePropName="checked">
            {reportBtnPermission ? (
              <Switch checkedChildren="开启" />
            ) : (
              <Tooltip title="无发布权限">
                <Switch disabled checkedChildren="开启" />
              </Tooltip>
            )}
          </Form.Item>
        </Modal>
      </Form>
    );
  }
}


export default ModalForm