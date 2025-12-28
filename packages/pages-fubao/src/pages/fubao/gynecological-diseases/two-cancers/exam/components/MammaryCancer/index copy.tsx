import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Popconfirm, Row, message } from 'antd';
import { get, isEmpty, map, cloneDeep, set } from 'lodash';
import React, { Component } from 'react';
import { NurseTypesMapping } from './config';
import './index.less';
import classnames from 'classnames';
import { fubaoRequest as request } from '@lm_fe/utils';
const DEFAULT_ACTIVE_TEMPLETE = 'Screening';
export default class Nursing extends Component<any, any> {
  state = {
    activeTemplate: DEFAULT_ACTIVE_TEMPLETE,
    siderPanels: [],
    oldsiderPanels: [],
    visible: false,
    activeItem: {},
    activeType: 'Screening',
  };

  async componentDidMount() {
    this.handleInit();
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    });
  };

  handleClickListItem = (item: any, code: any) => () => {
    const activeTemplate = get(NurseTypesMapping, `${code}.key`);
    this.setState({
      activeItem: item,
      activeTemplate,
      activeType: code,
    });
  };

  handleInit = async (activeType?: any, activeItem?: any, isAdd?: boolean) => {
    const id = get(this.props, 'id');
    const breastCancerScreeningId = get(this.props, 'breastCancerScreeningId');
    const breastCancerXRayId = get(this.props, 'breastCancerXRayId');
    let data = (await request.get(
      `/api/two/cancer/screening/getBreastCancerRecord?fileId.equals=${id}&deleteFlag.equals=0`,
    )).data;
    let breastCancerRecord: any = [];
    if (get(data, 'data')) {
      breastCancerRecord = get(data, 'data.breastCancerRecord');
    }
    if (breastCancerRecord.length > 0) {
      //病理提醒 病理结果追踪跳转对应的tab
      if (breastCancerScreeningId) {
        map(breastCancerRecord, (item, index) => {
          if (Number(breastCancerScreeningId) === get(item, 'breastCancerScreeningId')) {
            this.setState({
              siderPanels: breastCancerRecord,
              activeItem: item,
              activeType: 'Screening',
              activeTemplate: DEFAULT_ACTIVE_TEMPLETE,
            });
          }
        });
      } else if (breastCancerXRayId) {
        map(breastCancerRecord, (item, index) => {
          if (Number(breastCancerXRayId) === get(item, 'breastCancerXRayId')) {
            this.setState({
              siderPanels: breastCancerRecord,
              activeItem: item,
              activeType: 'Mammography',
              activeTemplate: get(NurseTypesMapping, `Mammography.key`),
            });
          }
        });
      } else {
        this.setState({
          siderPanels: breastCancerRecord,
          activeItem: activeItem && !isAdd ? activeItem : breastCancerRecord[breastCancerRecord.length - 1],
          activeType: activeType ? activeType : 'Screening',
          activeTemplate: activeType ? get(NurseTypesMapping, `${activeType}.key`) : DEFAULT_ACTIVE_TEMPLETE,
        });
      }
    } else {
      breastCancerRecord.push({ breastCancerScreeningId: -1 });
      this.setState({
        siderPanels: breastCancerRecord,
      });
    }
  };

  handleDelete = (item: any, code: any) => async () => {
    if (code === 'Screening') {
      const id = get(item, 'breastCancerScreeningId');
      const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerScreening/${id}`)).data;
      
      await this.handleInit();
    } else if (code === 'Mammography') {
      const id = get(item, 'breastCancerXRayId');
      const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerXRay/${id}`)).data;
      
      await this.handleInit();
    } else {
      const id = get(item, 'breastCancerBiopsyId');
      const res = (await request.delete(`/api/two/cancer/screening/deleteBreastCancerBiopsy/${id}`)).data;
      
      await this.handleInit();
    }
  };

  handleChooseTemplate = (nurseType: any) => () => {
    const clickTempKey = get(nurseType, 'key');
    const { siderPanels } = this.state as any;
    const newSiderPanels = cloneDeep(siderPanels);
    const listData = newSiderPanels[newSiderPanels.length - 1];

    if (clickTempKey === 'Screening') {
      if (get(listData, 'breastCancerScreeningId') === -1) {
        message.warning('请先保存上一次筛查！');
        return;
      }
      newSiderPanels.push({
        breastCancerScreeningId: -1,
      });
      this.setState({
        siderPanels: newSiderPanels,
        activeTemplate: get(nurseType, 'key'),
        visible: false,
        activeItem: newSiderPanels,
        activeType: clickTempKey,
      });
    } else if (clickTempKey === 'Mammography') {
      if (get(listData, 'breastCancerXRayId')) {
        this.setState({
          activeTemplate: get(nurseType, 'key'),
          visible: false,
          activeItem: listData,
          activeType: clickTempKey,
        });
      } else {
        set(listData, 'breastCancerXRayId', -1);
        this.setState({
          siderPanels: newSiderPanels,
          activeTemplate: get(nurseType, 'key'),
          visible: false,
          activeItem: listData,
          activeType: clickTempKey,
        });
      }
    } else {
      if (get(listData, 'breastCancerBiopsyId')) {
        this.setState({
          activeTemplate: get(nurseType, 'key'),
          visible: false,
          activeItem: listData,
          activeType: clickTempKey,
        });
      } else {
        set(listData, 'breastCancerBiopsyId', -1);
        this.setState({
          siderPanels: newSiderPanels,
          activeTemplate: get(nurseType, 'key'),
          visible: false,
          activeItem: listData,
          activeType: clickTempKey,
        });
      }
    }
  };

  renderSider = () => {
    const { siderPanels, activeItem, activeType } = this.state as any;
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title="就诊记录"
        extra={<PlusCircleOutlined onClick={this.handleAdd} />}
      >
        {map(siderPanels, (data, index) => {
          return (
            <div key={data.id} className="two-cancers-list">
              <div className="two-cancers-doctor-desk-first-visit-sider-list_title">{`第${index + 1}次筛查`}</div>

              {get(data, 'breastCancerScreeningId') && (
                <>
                  <div
                    className="doctor-desk-first-visit-sider-list__item"
                    style={
                      get(activeItem, 'id') === get(data, 'id') && activeType === 'Screening'
                        ? { background: '#eaf4fd' }
                        : { background: 'none' }
                    }
                    onClick={this.handleClickListItem(data, 'Screening')}
                  >
                    <span className="doctor-desk-first-visit-sider-list__item-title">
                      筛查{' '}
                      {get(data, 'breastCancerScreeningCheckDate') &&
                        '(' + get(data, 'breastCancerScreeningCheckDate') + ')'}
                    </span>
                    {get(data, 'breastCancerScreeningScreeningSuggest') && (
                      <span
                        className={classnames('label-result', {
                          red: get(data, 'breastCancerScreeningScreeningSuggest') === '复查乳腺X线',
                        })}
                      >
                        {get(data, 'breastCancerScreeningScreeningSuggest')}
                      </span>
                    )}
                    {get(data, 'breastCancerScreeningId') && get(data, 'breastCancerScreeningId') != -1 ? (
                      <Popconfirm
                        title="确定要删除这个病历吗?"
                        onConfirm={this.handleDelete(data, 'Screening')}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                      </Popconfirm>
                    ) : (
                      <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                    )}
                  </div>
                </>
              )}

              {get(data, 'breastCancerXRayId') && (
                <>
                  <div
                    className="doctor-desk-first-visit-sider-list__item"
                    style={
                      get(activeItem, 'id') === get(data, 'id') && activeType === 'Mammography'
                        ? { background: '#eaf4fd' }
                        : { background: 'none' }
                    }
                    onClick={this.handleClickListItem(data, 'Mammography')}
                  >
                    <span className="doctor-desk-first-visit-sider-list__item-title">
                      乳腺X线{' '}
                      {get(data, 'breastCancerXRayCheckDate') && '(' + get(data, 'breastCancerXRayCheckDate') + ')'}
                    </span>
                    {get(data, 'breastCancerXRayScreeningSuggest') && (
                      <span
                        className={classnames('label-result', {
                          red: get(data, 'breastCancerXRayScreeningSuggest') === '复查乳腺X线',
                        })}
                      >
                        {get(data, 'breastCancerXRayScreeningSuggest')}
                      </span>
                    )}
                    {get(data, 'breastCancerXRayId') && get(data, 'breastCancerXRayId') != -1 ? (
                      <Popconfirm
                        title="确定要删除这个病历吗?"
                        onConfirm={this.handleDelete(data, 'Mammography')}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                      </Popconfirm>
                    ) : (
                      <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                    )}
                  </div>
                </>
              )}

              {get(data, 'breastCancerBiopsyId') && (
                <div
                  className="doctor-desk-first-visit-sider-list__item"
                  style={
                    get(activeItem, 'id') === get(data, 'id') && activeType === 'PathologicalBiopsy'
                      ? { background: '#eaf4fd' }
                      : { background: 'none' }
                  }
                  onClick={this.handleClickListItem(data, 'PathologicalBiopsy')}
                >
                  <span className="doctor-desk-first-visit-sider-list__item-title">
                    病理活检{' '}
                    {get(data, 'breastCancerBiopsyCheckDate') && '(' + get(data, 'breastCancerBiopsyCheckDate') + ')'}
                  </span>
                  {get(data, 'breastCancerBiopsyScreeningSuggest') && (
                    <span
                      className={classnames('label-result', {
                        red: get(data, 'breastCancerBiopsyScreeningSuggest') === '治疗',
                      })}
                    >
                      {get(data, 'breastCancerBiopsyScreeningSuggest')}
                    </span>
                  )}
                  {get(data, 'breastCancerBiopsyId') && get(data, 'breastCancerBiopsyId') != -1 ? (
                    <Popconfirm
                      title="确定要删除这个病历吗?"
                      onConfirm={this.handleDelete(data, 'PathologicalBiopsy')}
                      okText="确定"
                      cancelText="取消"
                    >
                      <DeleteOutlined style={{ color: 'rgb(205,72,57)', float: 'right', marginTop: 2 }} />
                    </Popconfirm>
                  ) : (
                    <EditOutlined style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2 }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    );
  };

  renderContent = () => {
    const { activeTemplate, activeItem, siderPanels } = this.state;
    const { reload } = this.props as any;
    if (NurseTypesMapping[activeTemplate]) {
      const Component = NurseTypesMapping[activeTemplate]['component'];
      return (
        <Component
          {...this.props}
          activeItem={activeItem}
          onRefresh={this.handleInit}
          reload={reload}
          siderPanels={siderPanels}
        />
      );
    } else {
      return <div>该{activeTemplate}不存在此tab中</div>;
    }
  };

  render() {
    const { visible } = this.state;
    return (
      <Row style={{ height: '100%' }}>
        <Col style={{ height: '100%', width: 290, overflow: 'scroll', backgroundColor: '#fff' }}>
          {this.renderSider()}
        </Col>
        <Col style={{ height: '100%', width: 'calc(100% - 290px)', overflow: 'scroll' }}>{this.renderContent()}</Col>
        <Modal
          visible={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          {map(NurseTypesMapping, (nurseType, key) => {
            return (
              <Button style={{ margin: 8 }} key={key} onClick={this.handleChooseTemplate(nurseType)}>
                {nurseType.name}
              </Button>
            );
          })}
        </Modal>
      </Row>
    );
  }
}
