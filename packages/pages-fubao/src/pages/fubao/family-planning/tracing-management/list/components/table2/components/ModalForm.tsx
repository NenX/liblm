import { DatePicker_L } from '@lm_fe/components';
import { Button, Col, Form, Input, Modal, Row, Tabs } from 'antd';
import React, { Component } from 'react';
import SingleCheckBox from '../../SingleCheckBox';

const noticeTypeOptions = [
  { label: '电话', value: 1 },
  { label: '短信', value: 2 },
  { label: '微信', value: 3 },
  { label: '现场', value: 4 },
];

const option1 = [
  { label: '正常', value: 1 },
  { label: '未接听', value: 2 },
  { label: '号码错误', value: 3 },
];

const option2 = [
  { label: '未避孕', value: 1 },
  { label: '避孕失败', value: 2 },
];

const option3 = [
  { label: '复方口服避孕药', value: 1 },
  { label: 'IUD/IUS', value: 2 },
  { label: '体外排精', value: 3 },
  { label: '避孕套', value: 4 },
  { label: '杀精剂', value: 5 },
  { label: '安全期', value: 6 },
  { label: '紧急避孕药', value: 7 },
  { label: '其他', value: 8 },
];

const option4 = [
  { label: '复方口服避孕药', value: 1 },
  { label: 'IUD', value: 2 },
  { label: '曼月乐', value: 3 },
  { label: '避孕套', value: 4 },
  { label: '杀精剂', value: 5 },
  { label: '其他', value: 8 },
];

const option5 = [
  { label: '立即', value: 1 },
  { label: '流产后2周', value: 2 },
  { label: '流产后1月', value: 3 },
  { label: '其他', value: 8 },
];

const option6 = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];

export class ModalForm extends Component {
  form: any;

  async componentDidMount() {}

  handleSubmit = async () => {};
  onChange = (data: any) => {};

  renderForm = () => {
    return (
      <Form
        ref={(form) => {
          this.form = form;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <div className="basic-info" style={{ padding: 12 }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={6}>患者姓名：付小小</Col>
            <Col span={12}>年龄：25</Col>
            <Col span={6}>手机号码: 1561256682</Col>
          </Row>
          <Row>
            <Col span={6}>手术日期：2021-12-12</Col>
            <Col span={12}>手术类型: 无痛人流</Col>
            <Col span={6}>手术医生: 李玉玉</Col>
          </Row>
        </div>
        <div className="base-edit-panel">
          <div className="base-edit-panel-form_section border">
            <span className="base-edit-panel-form_section_title">随访登记</span>

            <Form.Item label="首次随访方式" name="f4all">
              <SingleCheckBox options={noticeTypeOptions} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="本次意外妊娠原因" name="faldl">
              <SingleCheckBox options={option1} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="以往避孕方式" name="fafggll">
              <SingleCheckBox options={option2} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="本次流产后建议选用方式" name="fgsgall">
              <SingleCheckBox options={option3} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="首次随访方式" name="fagsdgll">
              <SingleCheckBox options={option4} onChange={this.onChange} />
            </Form.Item>

            <Form.Item label="建议开始时间" name="falgsgl">
              <SingleCheckBox options={option5} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="是否告知注意事项" name="fsggall">
              <SingleCheckBox options={option6} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="是否立即处理落实" name="falgdghl">
              <SingleCheckBox options={option6} onChange={this.onChange} />
            </Form.Item>
            <Form.Item label="是否指导正确使用" name="falgdghl">
              <SingleCheckBox options={option6} onChange={this.onChange} />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="备注" name="person" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="随访日期" name="date" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <DatePicker_L />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="随访人" name="message" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    );
  };

  render() {
    const { visible, onCancel } = this.props as any;
    return (
      <Modal
        title="PAC追踪管理"
        width={1200}
        onOk={this.handleSubmit}
        wrapClassName="tracing-modal"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            关闭
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSubmit}>
            保存
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="首次随访" key="1">
            {this.renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="1个月随访" key="2">
            {this.renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="3个月随访" key="3">
            {this.renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="6个月随访" key="3">
            {this.renderForm()}
          </Tabs.TabPane>
          <Tabs.TabPane tab="12个月随访" key="3">
            {this.renderForm()}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default ModalForm;
