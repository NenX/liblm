import {
  createResources,
  deleteResourcesByID,
  getResources,
  getResourcesByID,
  transferDataByDate,
  updateResources,
  calEddByLmp
} from '@lm_fe/components_m';
import { fubaoRequest as request } from '@lm_fe/utils'
import { CalendarOutlined, DeleteOutlined, PlusCircleOutlined, PrinterOutlined, SaveOutlined } from '@ant-design/icons';
import { SelectTip } from '@lm_fe/pages';

import { Button, Card, Col, Collapse, Form, List, Modal, Popconfirm, Row, Tooltip, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import classnames from 'classnames';
import { debounce, first, get, isEmpty, keys, last, map, set, values } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MedicalRecord from '../../../../../.others/MedicalRecord';
import { visitTypeMapping } from './config';
import { fromApi, toApi } from './config/adapter';
import './index.less';
import { mchcModal__ } from '@lm_fe/pages';
const BASE_URL = '/api/prenatal-diagnoses';
export class SecondVisit extends Component {
  state = {
    siderPanels: [],
    loading: true,
    templateVisible: false,

    medicalHistoryVisible: false,
    activeItem: {},
    visitType: 1,
    panelsKey: [],
  };

  async componentDidMount() {
    const siderPanels = await this.initData();
    const resultItem = last(first(values(siderPanels))) || {};
    const activeItem = await getResourcesByID('/api/prenatal-diagnoses', get(resultItem, 'id'));
    this.setState(
      {
        activeItem,
        visitType: get(activeItem, 'visitType'),
      },
      () => {
        if (!isEmpty(activeItem)) {
          const form = this.form as FormInstance;
          form.setFieldsValue(fromApi(activeItem));
        }
      },
    );
  }

  initData = async () => {
    const { patientId } = this.props;
    const allPrenatalDiagnoses = await getResources(
      `${BASE_URL}?visitStyle.equals=1&prenatalPatientId.equals=${patientId}&sort=visitDate,desc&page=0&size=9999`,
    );
    const siderPanels = transferDataByDate(allPrenatalDiagnoses as any);
    this.setState({
      siderPanels,
      loading: false,
      panelsKey: keys(siderPanels),
    });
    return siderPanels;
  };

  handleAdd = async () => {
    this.setState({
      templateVisible: true,
    });
  };

  handleTemplateChoice = (visitType) => async () => {
    const { patient, user } = this.props;
    let syncPatientInfo = {};
    if (get(patient, 'idNO')) {
      syncPatientInfo = await getResources(`/api/getPrenatalSyncInfo?idNo=${get(patient, 'idNO')}`);
    }

    this.setState(
      {
        templateVisible: false,
        activeItem: {
          id: -Math.random(),
          visitType,
        },
      },
      () => {
        const form = this.form as FormInstance;
        form.setFieldsValue({
          ...(isEmpty(syncPatientInfo) ? {} : fromApi(get(syncPatientInfo, 'prenatalDiagnosis'))),
          visitDate: dayjs(),
          doctor: get(user, 'basicInfo.firstName'),
        });
      },
    );
  };

  handleClickListItem = (item) => async () => {
    const { activeItem } = this.state;
    if (get(activeItem, 'id') === get(item, 'id')) return;
    const newItem = await getResources(`${BASE_URL}/${get(item, 'id')}`);
    this.setState(
      {
        activeItem: newItem,
        visitType: get(newItem, 'visitType'),
      },
      () => {
        const form = this.form as FormInstance;
        form.setFieldsValue(fromApi(newItem));
      },
    );
  };

  handleSubmit = async () => {
    const { patient } = this.props;
    const { activeItem, visitType } = this.state;
    const form = this.form as FormInstance;
    const data = toApi(
      {
        ...form.getFieldsValue(),
        visitType: get(activeItem, 'visitType') || visitType,
        visitStyle: 1,
      },
      activeItem,
      patient,
    );
    // console.log(form.getFieldsValue());
    // console.log(data);
    // return;
    let result = {};
    if (data.id) {
      result = await updateResources(BASE_URL, data);
    } else {
      result = await createResources(BASE_URL, data);
    }
    this.setState(
      {
        activeItem: result,
      },
      () => {
        const form = this.form as FormInstance;
        form.setFieldsValue(fromApi(result));
      },
    );
    await this.initData();
    message.success('操作成功');
  };

  handleDelete = (item) => async () => {
    const { activeItem } = this.state;
    await deleteResourcesByID('/api/prenatal-diagnoses', get(item, 'id'));
    if (get(activeItem, 'id') === get(item, 'id')) {
      this.setState({
        activeItem: {},
      });
    }
    this.initData();
  };

  handleFieldsChange = (changedFields) => {
    const form = this.form as FormInstance;
    if (get(changedFields, '0.name.0') === 'historyOfPresentLmp') {
      form.setFieldsValue({
        historyOfPresentEdd: calEddByLmp(form.getFieldValue('historyOfPresentLmp')),
        historyOfPresentSureEdd: calEddByLmp(form.getFieldValue('historyOfPresentLmp')),
      });
    }
  };

  handlePrint = () => {
    const { activeItem } = this.state;

    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestData: {
          url: "/api/pdf-preview",
          resource: 'prenatalDiagnosis',
          template: get(activeItem, 'visitType'),
          version: '',
          note: '',
          id: activeItem?.id,
        }
      }
    })
  };

  getIsDisabledAll = () => {
    const { activeItem } = this.state;
    // TODO: 暂时所有人都不可编辑已归档数据
    return get(activeItem, 'editStyle') === 1;
  };

  handleTemplateClick = (type: number) => () => {
    this.setState({
      visitType: type,
      medicalHistoryVisible: true,
    });
  };

  handleRecordImport = (item?: any) => {
    const { visitType } = this.state;
    if (item) {
      this.setState(
        {
          templateVisible: false,
          activeItem: item,
        },
        () => {
          const form = this.form as FormInstance;
          set(item, 'visitType', visitType);
          form.setFieldsValue(fromApi(item));
        },
      );
    } else {
      this.handleTemplateChoice(visitType)();
    }
    this.setState({
      medicalHistoryVisible: false,
    });
  };

  renderSider = () => {
    const { siderPanels, loading, activeItem, panelsKey } = this.state;
    return (
      <Card
        size="small"
        bordered={false}
        title="复诊列表"
        extra={<PlusCircleOutlined onClick={this.handleAdd} />}
        loading={loading}
      >
        <Collapse
          // defaultActiveKey={keys(siderPanels)}
          activeKey={panelsKey}
          onChange={(key) => {
            this.setState({ panelsKey: key });
          }}
        >
          {map(siderPanels, (siderPanel, key) => {
            return (
              <Collapse.Panel
                key={key}
                header={
                  <>
                    <CalendarOutlined /> {key}
                  </>
                }
              >
                <List
                  size="small"
                  dataSource={siderPanel}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        className={classnames('doctor-desk-second-visit-sider-list__item', {
                          'doctor-desk-second-visit-sider-list__item_active': activeItem.id === item.id,
                        })}
                        onClick={this.handleClickListItem(item)}
                      >
                        <span className="doctor-desk-second-visit-sider-list__item-title">
                          {get(visitTypeMapping, `${get(item, 'visitType')}.name`)}
                        </span>
                        <Popconfirm
                          title="确定要删除这个病历吗?"
                          onConfirm={this.handleDelete(item)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </List.Item>
                    );
                  }}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Card>
    );
  };

  renderContent = () => {
    const { patient } = this.props;
    const { activeItem, visitType } = this.state;
    const disableAll = this.getIsDisabledAll();
    const type = get(activeItem, 'visitType') || visitType;
    const Component = get(visitTypeMapping, `${type}.component`);
    return (
      <Form
        key={get(activeItem, 'id')}
        ref={(form) => {
          this.form = form;
        }}
        onFinish={this.handleSubmit}
        onFieldsChange={this.handleFieldsChange}
      >
        <div className="doctor-desk-second-visit-content-block_vertical">
          {Component && <Component disableAll={disableAll} patient={patient} />}
        </div>
      </Form>
    );
  };

  renderActions = () => {
    const { activeItem } = this.state;
    const disableAll = this.getIsDisabledAll();
    return (
      // <div className="doctor-desk-second-visit-actions">
      <div className="right-bottom-btns">
        <Button size="large" onClick={this.handlePrint} disabled={isEmpty(activeItem)} icon={<PrinterOutlined />}>
          打印
        </Button>
        {disableAll ? (
          <Tooltip title="该病历已归档，无法编辑">
            <Button disabled icon={<SaveOutlined />}>
              保存
            </Button>
          </Tooltip>
        ) : (
          <Button onClick={debounce(this.handleSubmit, 300)} size="large" type="primary" icon={<SaveOutlined />}>
            保存
          </Button>
        )}
      </div>
    );
  };

  render() {
    const { patientId, user } = this.props;
    const { activeItem, templateVisible, medicalHistoryVisible } = this.state;
    return (
      <Row className="doctor-desk-second-visit">
        <Col className="doctor-desk-second-visit-sider" span={5}>
          {this.renderSider()}
        </Col>
        <Col className="doctor-desk-second-visit-content" span={19}>
          <div className="doctor-desk-second-visit-content-block">
            {isEmpty(activeItem) ? <SelectTip /> : this.renderContent()}
          </div>
        </Col>
        {this.renderActions()}
        <Modal
          visible={templateVisible}
          title="请选择复诊模板"
          footer={null}
          onCancel={() => this.setState({ templateVisible: false, medicalHistoryVisible: false })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {map(visitTypeMapping, (visiTypeConfig) => {
              return <Button onClick={this.handleTemplateClick(visiTypeConfig.key)}>{visiTypeConfig.name}</Button>;
            })}
          </div>
          {medicalHistoryVisible && (
            <MedicalRecord patientId={patientId} onImport={this.handleRecordImport} user={user} />
          )}
        </Modal>

      </Row>
    );
  }
}
export default connect(({ system, user }) => ({ systemConfig: get(system, 'config'), user }))(SecondVisit);
