import request from '@/lib/request';
import { levelOptionsobj } from '@/pages/highrisk-management/configuration/contants';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { formatTimeToDate } from '@/utils/format';
import { size } from '@antv/util';
import { mchcConfig, mchcUtils } from '@lm_fe/env';
import { Button, Col, Form, Input, message, Modal, Row, Tabs, Timeline } from 'antd';
import classNames from 'classnames';
import {
  cloneDeep,
  filter,
  find,
  findIndex,
  get,
  includes,
  isEmpty,
  join,
  keyBy,
  keys,
  map,
  max,
  orderBy,
  sortBy,
  split,
} from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import './index.less';
import React from 'react';

import { LazyAntd } from '@lm_fe/components';

const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


const boundSymbol = ':';
interface IndexState {
  expandedKeys: any;
  data: any;
  highriskTreeData: any;
  currentTreeData: any;
  gradeOptions: any;
  contagionOptions: any;
  activeTabKey: string;
  contagionColor: any;
  riskRecords: any;
  selectTree: any;
  levelOptions: any;
  searchValue: any;
}
interface IProps {
  [key: string]: any;
}
class Index extends Component<IProps, IndexState> {
  highRiskTreeDataMapping: any;

  constructor(props: any) {
    super(props);
    this.state = {
      highriskTreeData: [],
      currentTreeData: [],
      gradeOptions: [],
      contagionOptions: [],
      contagionColor: '',
      expandedKeys: [],
      data:
        {
          ...get(props, 'data'),
          infectionNote:
            (!!get(props, 'data.infectionNote') &&
              get(props, 'data.infectionNote') != '' &&
              split(get(props, 'data.infectionNote'), ',')) ||
            [],
          highriskNote:
            (!!get(props, 'data.highriskNote') &&
              get(props, 'data.highriskNote') != '' &&
              split(get(props, 'data.highriskNote'), ',')) ||
            [],
          highriskGrade: get(props, `data.highriskLable`) || get(props, `data.highriskGrade`),
        } || {},
      activeTabKey: '1',
      riskRecords: [],
      selectTree: [], // 用于互斥
      levelOptions: [],
      searchValue: '',
    };
  }

  async componentDidMount() {
    const { system, dictionaries } = this.props;
    const highriskVersion = get(system, 'config.highriskVersion');
    this.setLevolOptions(highriskVersion);
    const initDictionaries = get(dictionaries, 'initDictionaries');
    const gradeDic = filter(initDictionaries, (item) => item.key === 'highriskGrade' && item.type === highriskVersion);
    const contagionDic = filter(
      initDictionaries,
      (item) => item.key === 'highriskContagion' && item.type === highriskVersion,
    );
    const treeData = await api.components.getTemplateTree(highriskVersion);
    this.highRiskTreeDataMapping = keyBy(treeData, 'id');

    let options: any[] = [];
    if (!!get(contagionDic, '0.enumerations.0.label')) {
      const arr = split(get(contagionDic, '0.enumerations.0.label'), ',');
      map(arr, (item) => {
        let option = { label: item, value: item };
        options.push(option);
      });
    }
    const highriskNote_ = split(get(this.props, 'data.highriskNote'), ',') || [];
    let selectTree: any = [];
    map(highriskNote_, (item) => {
      map(this.highRiskTreeDataMapping, (v, i) => {
        const addNote = `${get(this.highRiskTreeDataMapping, `${v.pid}.val`)}${boundSymbol}${get(v, `val`)}`;
        if (item == addNote) {
          selectTree.push(v);
        }
      });
    });
    this.setState({
      highriskTreeData: treeData,
      currentTreeData: treeData,
      gradeOptions: get(gradeDic, '0.enumerations'),
      contagionOptions: options,
      contagionColor: get(contagionDic, '0.enumerations.0.note'),
      // expandedKeys: keys(this.highRiskTreeDataMapping),
      selectTree: selectTree,
    });
  }

  setLevolOptions = (type: any) => {
    this.setState({ levelOptions: get(levelOptionsobj, `${type}`) });
  };

  handleChange = (name: any) => (value: any) => {
    const { data, highriskTreeData } = this.state;
    if (name === 'highriskNote') {
      let highriskGrade = get(data, 'highriskGrade');
      const gradeArr: any[] = [],
        selectTree: any = [];
      if (value.length === 0) {
        highriskGrade = '';
      } else {
        map(value, (item) => {
          const words = split(item, boundSymbol)[1];
          map(highriskTreeData, (data) => {
            if (data.val === words) gradeArr.push(data.code);
          });
        });
        highriskGrade = max(gradeArr);
        map(value, (item) => {
          map(this.highRiskTreeDataMapping, (v, i) => {
            const addNote = `${get(this.highRiskTreeDataMapping, `${v.pid}.val`)}${boundSymbol}${get(v, `val`)}`;
            if (item == addNote) {
              selectTree.push(v);
            }
          });
        });
      }
      this.setState({
        data: { ...data, highriskGrade, [name]: value },
        selectTree: selectTree,
      });
    } else {
      this.setState({
        data: { ...data, [name]: value },
      });
    }
  };

  handleSubmit = async () => {
    const { onFinish, onClose, handleSubmit, isNew } = this.props;
    const { data, activeTabKey } = this.state;
    if (isNew) {

      // 新建孕册
      onFinish &&
        onFinish({
          ...data,
          infectionNote: get(data, 'infectionNote').length > 0 ? join(get(data, 'infectionNote'), ',') : '',
          highriskNote: get(data, 'highriskNote').length > 0 ? join(get(data, 'highriskNote'), ',') : '',
          highriskGrade: this.renderHighriskLabel(get(data, `highriskGrade`)),
        });
      onClose && onClose();
    } else {
      if (activeTabKey === '1') {
        await this.updateRiskRecords();
        handleSubmit && handleSubmit();
      } else {
        onClose && onClose();
      }
    }
  };

  async updateRiskRecords() {
    const { data } = this.state;
    const { onClose, saveHeaderInfo } = this.props;
    const post = {
      outEmrId: get(data, 'id'),
      infectionNote: join(get(data, 'infectionNote'), ','),
      highriskNote: join(get(data, 'highriskNote'), ','),
      highriskGrade: get(data, 'highriskGrade'),
      gestationalWeek: get(data, `gesweek`),
    };
    if (get(post, `highriskGrade`)) {
      if (!get(post, `highriskNote`)) {
        message.error('请填写高危因素');
        return false;
      }
    }
    if (get(post, `highriskNote`)) {
      if (!get(post, `highriskGrade`)) {
        message.error('请填写高危等级');
        return false;
      }
    }
    const res = await request.put('/api/doctor/assessHighRisk', post);
    // const ress = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(data, `id`));
    message.success('信息保存成功');
    // saveHeaderInfo({
    //   ...this.props.data,
    //   ...pick(post, ['infectionNote', 'highriskNote']),
    //   highriskLable: get(post, `highriskGrade`),
    // });
    // saveHeaderInfo(ress);
    onClose && onClose();
  }

  handleSearch = (e: any) => {
    const { highriskTreeData } = this.state;
    const searchValue: string = get(e, 'target.value');
    const { treeData, expandedKeys } = this.searchTreeData(searchValue, highriskTreeData);
    this.setState({
      currentTreeData: !!searchValue ? treeData : highriskTreeData,
      expandedKeys: !!searchValue ? expandedKeys : [],
      searchValue: searchValue,
    });
  };

  searchTreeData(value: string, highriskTreeData: any) {
    const expandedKeys: any = [];
    const treeData: any = [];
    const searchValueArr = split(value, ',') || [];
    while (size(searchValueArr) > 0) {
      let searchValue = searchValueArr[0];
      if (!searchValue) {
        searchValueArr.shift();
        continue;
      }
      map(highriskTreeData, (item) => {
        const val = item.val || '';
        const mnemonic = item.mnemonic || '';
        let pid = item.pid;
        const id = item.id;
        if (
          (val.indexOf(searchValue) > -1 || mnemonic.indexOf(searchValue) > -1) &&
          pid === 0 &&
          !includes(expandedKeys, String(item.id))
        ) {
          treeData.push(item);
          expandedKeys.push(String(item.id));
          map(highriskTreeData, (subItem) => {
            if (subItem.pid === id && !includes(expandedKeys, String(subItem.id))) {
              treeData.push(subItem);
              expandedKeys.push(String(subItem.id));
            }
          });
        } else if (
          searchValue &&
          val.indexOf(searchValue) > -1 &&
          pid !== 0 &&
          !includes(expandedKeys, String(item.id))
        ) {
          treeData.push(item);
          expandedKeys.push(String(item.id));
          while (pid != 0) {
            let bool = false;
            map(highriskTreeData, (subItem) => {
              if (subItem.id === pid && !includes(expandedKeys, String(subItem.id))) {
                treeData.push(subItem);
                expandedKeys.push(String(subItem.id));
                pid = subItem.pid;
                bool = true;
              }
            });
            if (!bool) pid = 0;
          }
          const id = get(item, 'id');
          searchValueArr.push(id);
        } else if (searchValue == get(item, 'pid')) {
          if (findIndex(treeData, (treeValue) => get(treeValue, 'id') == get(item, 'id')) == -1) {
            treeData.push(item);
          }
        }
      });
      searchValueArr.shift();
    }
    const sortTreeData = sortBy(treeData, (item: any) => get(item, 'id'));
    return { treeData: sortTreeData, expandedKeys };
  }

  handleClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };

  handleSelectHighrisk = (values: any, e) => {
    if (size(get(e.node, 'children')) > 0) return;
    const { data } = this.state;
    const key = get(values, '0');
    const code = get(this.highRiskTreeDataMapping, `${key}.code`);
    const pid = get(this.highRiskTreeDataMapping, `${key}.pid`);
    let highriskGrade = get(data, 'highriskGrade') || 'Ⅰ';
    highriskGrade = code > highriskGrade ? code : highriskGrade;
    if (!key) return;
    if (pid !== 0) {
      const obj = this.conflict(key);
      if (obj.isConflict) return;
      const addNote = `${get(this.highRiskTreeDataMapping, `${pid}.val`)}${boundSymbol}${get(
        this.highRiskTreeDataMapping,
        `${key}.val`,
      )}`;
      if (!includes(get(data, 'highriskNote'), addNote)) {
        this.setState({
          data: {
            ...data,
            highriskGrade: highriskGrade,
            highriskNote: [...get(data, 'highriskNote'), addNote],
          },
        });
      }
    }
  };

  // 互斥操作
  conflict(key: any) {
    const { selectTree } = this.state;
    const treeItem = get(this.highRiskTreeDataMapping, `${key}`);
    const ind = findIndex(selectTree, (item: any) => item.pid == treeItem.pid);
    let addNoteArr: any = [],
      highriskGrade = '';
    let selectTree_ = cloneDeep(selectTree);
    if (ind != -1) {
      selectTree_.splice(ind, 1, treeItem);
      map(selectTree_, (item: any) => {
        let code = get(item, `code`);
        const addNote = `${get(this.highRiskTreeDataMapping, `${item.pid}.val`)}${boundSymbol}${get(item, `val`)}`;
        if (!includes(addNoteArr, addNote)) {
          addNoteArr.push(addNote);
        }
        if (highriskGrade == '' || code > highriskGrade) {
          highriskGrade = code;
        }
      });
    } else {
      selectTree_.push(treeItem);
    }
    this.setState({
      data: {
        ...this.state.data,
        highriskGrade: highriskGrade,
        highriskNote: addNoteArr,
      },
      selectTree: selectTree_,
    });
    //高危因素，高危等级，是否互斥
    return { isConflict: ind != -1 };
  }

  transferHighRiskData = (data: any, pid = 0) => {
    const treeData: any = [];
    map(data, (item: any) => {
      if (item.pid === pid) {
        item.title = item.val; // pid === 0 ? item.val : `${item.code} ${item.val}`;
        item.key = String(item.id);
        item.children = this.transferHighRiskData(data, item.id);
        if (isEmpty(item.children)) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
        treeData.push(item);
      }
    });
    return treeData;
  };

  handleExpend = (expandedKeys: any) => {
    this.setState({
      expandedKeys,
    });
  };

  handleReset = () => {
    const { data } = this.state;
    this.setState({
      data: {
        ...data,
        highriskGrade: '',
        highriskNote: [],
        infectionNote: [],
      },
      selectTree: [],
    });
  };

  handleTabChange = (key: any) => {
    this.setState({ activeTabKey: key });
    this.getRiskRecords();
  };

  async getRiskRecords() {
    // /api/doctor/getRiskRecordsOfOutpatient
    const { riskRecords } = this.state;
    if (size(riskRecords) > 0) return false;
    const { data } = this.props;
    const id = get(data, 'id');

    const res =
      id == undefined
        ? await request.get('/api/doctor/getRiskRecordsOfOutpatient?id=')
        : await request.get('/api/doctor/getRiskRecordsOfOutpatient?id=' + id);
    this.setState({ riskRecords: res });
  }

  getGradeColor = (grade: any) => {
    const { gradeOptions } = this.state;
    grade = !grade ? 'I' : grade;
    let color = '';

    map(gradeOptions, (item) => {
      if (get(item, 'label') === grade) color = get(item, 'note');
    });
    return color;
  };
  renderHighriskLabel = (value: string) => {
    const { levelOptions } = this.state;
    return get(
      find(levelOptions, (item: any) => item.value == value),
      'label',
    );
  };

  renderTree = ({ treeData, expandedKeys }) => {
    return (
      <Tree
        showLine={{ showLeafIcon: false }}
        treeData={treeData}
        onSelect={this.handleSelectHighrisk}
        onExpand={this.handleExpend}
        expandedKeys={expandedKeys}
        titleRender={(data: any) => {
          return (
            <div>
              {size(get(data, `children`)) == 0 && (
                <span
                  style={{
                    background: this.getGradeColor(data.code),
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    margin: '0 10px',
                  }}
                ></span>
              )}
              {get(data, `title`)}
            </div>
          );
        }}
      />
    );
  };

  renderhiskTree = (treeData: any, expandedKeys: any) => {
    const { system } = this.props;
    const { searchValue, currentTreeData } = this.state;
    if (get(system, 'config.highriskVersion') == 23) {
      return this.renderTree({ treeData, expandedKeys });
    } else {
      return (
        <Row className="row-content" key={searchValue ? searchValue : size(currentTreeData)}>
          <Col span={7}>
            <div className="tree-title">{get(treeData, `[0].title`)}</div>
            <div className="col-content">
              {this.renderTree({ treeData: get(treeData, `[0].children`), expandedKeys })}
            </div>
          </Col>
          <Col span={7}>
            <div className="tree-title">{get(treeData, `[1].title`)}</div>
            <div className="col-content">
              {this.renderTree({ treeData: get(treeData, `[1].children`), expandedKeys })}
            </div>
          </Col>
          <Col span={7}>
            <div className="tree-title">{get(treeData, `[2].title`)}</div>
            <div className="col-content">
              {this.renderTree({ treeData: get(treeData, `[2].children`), expandedKeys })}
            </div>
          </Col>
        </Row>
      );
    }
  };
  render() {
    const { visible, index } = this.props;
    const {
      data,
      currentTreeData,
      expandedKeys,
      gradeOptions,
      contagionOptions,
      contagionColor,
      activeTabKey,
      riskRecords,
    } = this.state;
    const treeData = this.transferHighRiskData(currentTreeData);
    let newRiskRecords = cloneDeep(riskRecords);
    newRiskRecords = orderBy(riskRecords, ['eventDate'], ['desc']);
    const is禁止编辑高危等级 = mchcConfig.get('禁止编辑高危等级')

    return (
      <Modal
        className="highrisk-pop"
        visible={visible}
        width={1000}
        onCancel={this.handleClose}
        onOk={this.handleSubmit}
      >
        <Tabs activeKey={activeTabKey} onChange={this.handleTabChange}>
          <Tabs.TabPane tab="高危标记" key="1">
            <div className="highrisk-sign">
              <div className="highrisk-sign-header">
                <Row>
                  <Form.Item label="高危等级">
                    <Select
                      disabled={is禁止编辑高危等级}
                      onChange={this.handleChange('highriskGrade')}
                      style={{ width: 128 }}
                      value={get(data, 'highriskGrade')}
                    >
                      {map(gradeOptions, (item) => (
                        <Select.Option value={item.label}>{this.renderHighriskLabel(item.label)}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="传染病">
                    <Select
                      className="highrisk-infec"
                      mode="tags"
                      style={{ width: 256 }}
                      options={contagionOptions}
                      onChange={this.handleChange('infectionNote')}
                      value={get(data, 'infectionNote')}
                    ></Select>
                  </Form.Item>
                </Row>
                <Row>
                  <Form.Item label="高危因素">
                    <Select
                      mode="tags"
                      className="highrisk-factor"
                      onChange={this.handleChange('highriskNote')}
                      value={get(data, 'highriskNote')}
                    ></Select>
                  </Form.Item>
                  <Form.Item label="">
                    <Button onClick={this.handleReset}>重置</Button>
                  </Form.Item>
                </Row>
                <Row style={{ paddingLeft: '70px' }}>
                  <Form.Item label="">
                    <Input style={{ width: 376 }} onChange={this.handleSearch} placeholder="输入模糊查找" />
                  </Form.Item>
                  <Form.Item label="">
                    <Button
                      onClick={() => {
                        this.setState({ expandedKeys: [] });
                      }}
                    >
                      全部收起
                    </Button>
                  </Form.Item>
                  <Form.Item label="">
                    <Button
                      onClick={() => {
                        this.setState({ expandedKeys: keys(this.highRiskTreeDataMapping) });
                      }}
                    >
                      全部展开
                    </Button>
                  </Form.Item>
                </Row>
              </div>
              {/* style={{ overflow: 'hidden' }} */}
              <div className="highrisk-sign-content">{this.renderhiskTree(treeData, expandedKeys)}</div>
            </div>
          </Tabs.TabPane>
          {/* 暂时屏蔽 */}
          {index != 0 &&
            <Tabs.TabPane tab="高危时间轴" key="2">
              {isEmpty(newRiskRecords) ? (
                '暂无高危记录~'
              ) : (
                <Timeline mode="left" className="highrisk-timeline">
                  {map(newRiskRecords, (item) => (
                    <Timeline.Item>
                      <div className="record-left">
                        <div className="record-grade" style={{ background: this.getGradeColor(item.highriskGrade) }}>
                          {this.renderHighriskLabel(item.highriskGrade)}
                        </div>
                        <div className="record-week">{item.gestationalWeek ? `孕${item.gestationalWeek}周` : ''}</div>
                      </div>
                      <div className="record-right">
                        <div className={classNames('record-item', { 'infectionNote-item': !!item.infectionNote })}>
                          <div className="item-label" style={{ background: !!item.infectionNote ? contagionColor : '' }}>
                            传染病：
                          </div>
                          <div className="item-note">{item.infectionNote || '无'}</div>
                        </div>
                        <div className="record-item">
                          <div className="item-label">高危因素：</div>
                          <div className="item-note">{item.highriskNote || '无'}</div>
                        </div>
                        <div className="record-item">
                          <div className="item-label">评定日期：</div>
                          <div className="item-note">{formatTimeToDate(item.eventDate)}</div>
                        </div>
                        <div className="record-item">
                          <div className="item-label">评定医生：</div>
                          <div className="item-note">{item.doctor}</div>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </Tabs.TabPane>}
        </Tabs>
      </Modal>
    );
  }
}
const mapStateToProps = ({ system, dictionaries }) => ({ system, dictionaries });
// console.dir("mapStateToProps",mapStateToProps);
export default connect(mapStateToProps, null)(Index);
