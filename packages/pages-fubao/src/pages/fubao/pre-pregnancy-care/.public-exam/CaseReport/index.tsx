import { Card, Checkbox, Col, Collapse, Form, List, Popconfirm, Row, message } from 'antd';
import { compact, find, first, get, isEmpty, keyBy, keys, last, map, replace, set, size, split, values } from 'lodash';
import React, { Component } from 'react';
import {
  createInformedConsent,
  getInformedConsents,
  updateInformedConsent
} from './method';
import { DataSelect, } from '@lm_fe/components_m';
import { SelectTip } from '@lm_fe/pages';

import { CalendarOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { CaseTempleteEdit, deleteResourcesByID } from '@lm_fe/components_m';
import { SLocal_Dictionary } from '@lm_fe/service';
import { getSearchParamsValue } from '@lm_fe/utils';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { getTemplateById } from '@lm_fe/components_m';
import './index.less';
const signStates = [
  { label: '已报', value: '1' },
  { label: '未报', value: '2' },
];
const archiveStates = [
  { label: '已归档', value: '1' },
  { label: '未归档', value: '2' },
];
export class CaseReport extends Component {
  state = {
    siderPanels: [],
    loading: true,
    informedConsent: {},
    isNew: false,
    allDiagnosisStr: '',
    panelsKey: [],
  };

  async componentDidMount() {
    const { id } = this.props;
    const siderPanels = await this.initData();
    const defaultActiveItem = last(first(values(siderPanels))) || {};
    this.setState({
      informedConsent: defaultActiveItem,
    });
  }

  getAllDiagnosisStr = (list: any) => {
    let allDiagnosisStr = '';
    let diags = [];
    diags = size(get(list, 'ods')) > 0 ? get(list, 'ods') : get(list, 'pds');
    map(diags, (item, index) => {
      if (!!get(item, 'diagnosis')) {
        const diagnosisNote = !!get(item, 'note') ? `(${get(item, 'note')})` : '';
        allDiagnosisStr += `${index + 1}、${get(item, 'diagnosis')}${diagnosisNote}；`;
      }
    });

    this.setState({ allDiagnosisStr });
  };

  initData = async () => {
    const { id } = this.props;
    const pregnancyId = id || getSearchParamsValue('id')
    const siderPanels = this.mergeInformedConsentByDate(await getInformedConsents(pregnancyId));
    this.setState({
      siderPanels,
      loading: false,
      panelsKey: keys(siderPanels),
    });
    return siderPanels;
  };

  mergeInformedConsentByDate = (informedConsents) => {
    const createDateKeys: Array<any> = compact(keys(keyBy(informedConsents, 'createDate')));
    const mergedInformedConsents = {};
    map(createDateKeys, (createDateKey) => {
      set(mergedInformedConsents, createDateKey, []);
    });
    map(informedConsents, (informedConsent) => {
      if (createDateKeys.indexOf(informedConsent.createDate) === -1) {
        return;
      }
      (mergedInformedConsents[informedConsent.createDate] as Array<any>).push(informedConsent);
    });
    return mergedInformedConsents;
  };

  handleSave = async (content) => {
    const { pregnancyData } = this.props;
    let { informedConsent } = this.state;
    const data = {
      ...informedConsent,
      content,
      prenatalPatient: pregnancyData,
      createDate: dayjs().utc().format(),
      documentTemplate: get(informedConsent, 'documentTemplate'),
    };
    if (informedConsent.id) {
      informedConsent = await updateInformedConsent(data);
    } else {
      informedConsent = await createInformedConsent(data);
    }
    message.success('操作成功');
    this.setState({
      informedConsent,
    });
    this.initData();
  };

  handleAdd = () => {
    this.setState({
      isNew: true,
      informedConsent: {},
    });
  };

  handleClickListItem = (oldInformedConsent) => async () => {
    const oldContent = get(oldInformedConsent, 'content');
    const newContent = this.transferContent(oldContent);
    this.setState({
      informedConsent: {
        ...oldInformedConsent,
        content: newContent,
        documentTemplate: get(oldInformedConsent, 'documentTemplate'),
      },
    });
  };

  transferContent = (oldContent) => {
    const { pregnancyData, dictionaries } = this.props;
    const { allDiagnosisStr } = this.state;
    set(pregnancyData, 'allDiagnosisStr', allDiagnosisStr);
    const reg = /\[\{\{.+?\}\}\]/g;
    const result = oldContent.matchAll(reg);
    let newContent = oldContent;
    for (const item of result) {
      if (item) {
        const itemName = item[0].slice(3, -3);
        const itemNameSplits = split(itemName, '---');
        let label = get(pregnancyData, itemName);
        if (itemName === 'residenceAddress' || itemName === 'permanentResidenceAddress') {
          label = replace(label, '&', ',');
        }
        // 用 --- 从字典获取值
        if (itemNameSplits.length === 2) {
          const value = get(pregnancyData, itemNameSplits[0]);
          const options = SLocal_Dictionary.getDictionariesEnumerations(itemNameSplits[1])

          label = get(keyBy(options, 'value'), `${value}.label`);
        }
        newContent = newContent.replace(item[0], label || '   ');
      }
    }
    return newContent;
  };

  handleConsentChange = async (value) => {
    const { informedConsent } = this.state;
    const documentTemplate = await getTemplateById(value);
    const oldContent = get(documentTemplate, 'content');
    const newContent = this.transferContent(oldContent);
    this.setState({
      informedConsent: {
        ...informedConsent,
        content: newContent,
        documentTemplate,
      },
    });
  };

  handleSignStateChange = (signStates: any) => {
    const { informedConsent } = this.state;
    const oldSignState = get(informedConsent, 'signState');
    this.setState({
      informedConsent: {
        ...informedConsent,
        signState: find(signStates, (item) => item !== oldSignState),
      },
    });
  };

  handleArchiveChange = (archives: any[]) => {
    const { informedConsent } = this.state;
    const oldArchive = get(informedConsent, 'archive');
    this.setState({
      informedConsent: {
        ...informedConsent,
        archive: find(archives, (item) => item !== oldArchive),
      },
    });
  };

  handleDelete = (item) => async () => {
    const { informedConsent } = this.state;
    await deleteResourcesByID('/api/prenatal-patient-documents', get(item, 'id'));
    if (get(informedConsent, 'id') === get(item, 'id')) {
      this.setState({
        informedConsent: {},
      });
    }
    this.initData();
  };

  rendersiderPanels = () => {
    const { siderPanels, informedConsent, loading, panelsKey } = this.state;
    return (
      <Card
        loading={loading}
        size="small"
        bordered={false}
        title="个案登记列表"
        extra={<PlusCircleOutlined onClick={this.handleAdd} />}
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
                header={
                  <>
                    <CalendarOutlined /> {key}
                  </>
                }
                key={key}
              >
                <List
                  size="small"
                  dataSource={siderPanel}
                  renderItem={(item) => {
                    return (
                      <List.Item
                        className={classnames('patient-informed-consent-list__item', {
                          'patient-informed-consent-list__item_active': informedConsent.id === item.id,
                        })}
                      >
                        <span
                          className="patient-informed-consent-list__item-title"
                          onClick={this.handleClickListItem(item)}
                        >
                          {get(item, 'documentTemplate.title')}
                        </span>
                        <Popconfirm
                          title="确定要删除这个登记表么?"
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

  render() {
    const { informedConsent, isNew } = this.state;
    const { containerProps = { height: document.getElementsByClassName('prenatal-visit-main')[0]?.clientHeight } } =
      this.props;
    return (
      <Row className="patient-informed-consent">
        <Col className="patient-informed-consent-list" span={4}>
          {this.rendersiderPanels()}
        </Col>
        <Col className="patient-informed-consent-detail" span={20}>
          {isEmpty(informedConsent) && !isNew ? (
            <SelectTip />
          ) : (
            <div className="patient-informed-consent-detail-block">
              <Row>
                <Col span={12}>
                  <Form.Item label="个案模板" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <DataSelect
                      url="document-templates?moduleType.equals=5&page=0&size=9999"
                      labelKey="title"
                      valueKey="id"
                      dropdownMatchSelectWidth={350}
                      onChange={this.handleConsentChange}
                      value={get(informedConsent, 'documentTemplate.id')}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="报卡" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Checkbox.Group
                      options={signStates}
                      onChange={this.handleSignStateChange}
                      value={[get(informedConsent, 'signState')]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <CaseTempleteEdit
                key={get(informedConsent, 'id') || Math.random()}
                containerProps={{ ...containerProps, height: containerProps.height - 10 }}
                content={get(informedConsent, 'content')}
                onSave={this.handleSave}
                toolbars={false}
                mode="STRICT"
              />
            </div>
          )}
        </Col>
      </Row>
    );
  }
}
export default CaseReport
