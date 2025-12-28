import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Space } from 'antd';
import { filter, get, isEmpty, map, set } from 'lodash';
import React, { Component } from 'react';
import BaseFormComponent from '../../BaseFormComponent';

import { LazyAntd } from '@lm_fe/components';
import { request } from '@lm_fe/utils';
import styles from './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const { Option } = Select;
const { TextArea } = Input;
export default class CaesareanChildren extends Component<any, any> {
  state = {
    childrens: [{}],
    outData: {},
    areaNameList: [],
    parturientList: [],
    areaNO: '',
  };
  componentDidMount() {
    if (this.props.value && !isEmpty(this.props.value)) {
      if (this.props)
        this.setState({
          childrens: this.props.value,
        });
    }
    if (this.props.areaName && !isEmpty(this.props.areaName)) {
      setTimeout(() => {
        this.getParturientList(this.props.areaName);
      }, 300);
    }
    this.getAreaNameList();
  }

  getAreaNameList = async () => {
    const areaNameList = await request.get('/api/handover/getAreaList');
    this.setState({
      areaNameList: areaNameList,
    });
  };

  getParturientList = async (areaName) => {
    const areaNO = filter(this.state.areaNameList, { areaName: areaName })?.[0]?.areaNO;
    const parturientList = await request.get(`/api/handover/getAdmissionList?areaNO.equals=${areaNO}`);
    this.props.form?.setFieldsValue({ areaNO: areaNO });
    this.setState({
      areaNO,
      parturientList: parturientList,
    });
  };

  getParturientListByareaNO = async (areaNO) => {
    const parturientList = await request.get(`/api/handover/getAdmissionList?areaNO.equals=${areaNO}`);
    this.setState({
      parturientList: parturientList,
    });
  };

  handleAdd = () => {
    const { childrens } = this.state;
    this.setState({
      childrens: [...childrens, {}],
    });
  };
  handleDelete = (index: any) => {
    const { childrens } = this.state;
    console.log(index, 'index');
    childrens.splice(index, 1);
    this.setState({
      childrens,
    });
  };
  handleChange = (callbackData: any, name: any, index: any) => {
    const { onChange } = this.props;
    const { outData, childrens, parturientList } = this.state;
    if (name === 'bedNO') {
      const newParturient = filter(parturientList, { bedNO: callbackData });
      set(childrens[index], 'name', get(newParturient[0], 'name'));
      set(childrens[index], 'admissionId', get(newParturient[0], 'admissionId'));
    }
    if (
      name === 'chiefDiagnosis' ||
      name === 'chiefComplaint' ||
      name === 'bgstatus' ||
      name === 'assessment' ||
      name === 'advice'
    ) {
      const val = callbackData.target.value;
      set(childrens[index], name, val);
    } else {
      set(childrens[index], name, callbackData);
    }

    if (get(childrens[index], 'id')) {
      delete childrens[index].id;
    }

    this.setState(
      {
        outData: childrens,
        childrens: childrens,
      },
      () => {
        onChange && onChange(this.state.outData);
      },
    );
  };

  renderFieldPatientItem = ({
    name,
    value,
    label,
    inputType,
    labelSpan = 12,
    wrapperSpan = 12,
    inputProps = {},
    index = 0,
  }) => {
    return (
      <Row className={styles["nurse-children__field"]}>
        <Col className={styles["nurse-children__field-label"]} span={labelSpan}>
          <span>{label}：</span>
        </Col>
        <Col className={styles["nurse-children__field-input"]} span={wrapperSpan}>
          <BaseFormComponent
            name={name}
            value={value}
            inputType={inputType}
            {...inputProps}
            onChange={(e) => {
              this.handleChange(e, name, index);
            }}
          />
        </Col>
      </Row>
    );
  };

  renderFieldItem = ({ inputType, labelSpan = 12, wrapperSpan = 12, inputProps = {} }) => {
    return <BaseFormComponent inputType={inputType} {...inputProps} />;
  };

  renderChildrenItem = (children: any, index: any, value: any) => {
    const { parturientList } = this.state;
    return (
      <div key={index}>
        <div style={{ paddingLeft: 30, color: '#3d8bf7' }}>
          <span>交班患者{index + 1}：</span>
          <Space>
            <PlusCircleOutlined onClick={this.handleAdd} />
            {this.state.childrens.length > 1 ? (
              <MinusCircleOutlined
                onClick={() => {
                  this.handleDelete(index);
                }}
              />
            ) : null}
          </Space>
        </div>
        <Row>
          <Col span={8}>
            <Row className={styles["nurse-children__field"]}>
              <Col className={styles["nurse-children__field-label"]} span={9}>
                <span>床号：</span>
              </Col>
              <Col className={styles["nurse-children__field-input"]} span={8}>
                <Select
                  onChange={(e) => {
                    this.handleChange(e, 'bedNO', index);
                  }}
                  defaultValue={get(value, [`${index}`, 'bedNO'])}
                >
                  {parturientList &&
                    parturientList.map((item: any, index) => {
                      return (
                        <Option value={item.bedNO} key={index}>
                          {item.bedNO}
                        </Option>
                      );
                    })}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'name',
              value: get(value, [`${index}`, 'name']),
              label: '姓名',
              labelSpan: 9,
              wrapperSpan: 13,
              inputType: 'input_with_label',
            })}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'chiefDiagnosis',
              value: get(value, [`${index}`, 'chiefDiagnosis']),
              label: '主要诊断',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'text_area',
              inputProps: { rows: 3 },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'chiefComplaint',
              value: get(value, [`${index}`, 'chiefComplaint']),
              label: '主诉及现存主要问题',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'text_area',
              inputProps: { rows: 2 },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'bgstatus',
              value: get(value, [`${index}`, 'bgstatus']),
              label: '背景',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'text_area',
              inputProps: { rows: 2 },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'assessment',
              value: get(value, [`${index}`, 'assessment']),
              label: '评估',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'text_area',
              inputProps: { rows: 6 },
            })}
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            {this.renderFieldPatientItem({
              index: index,
              name: 'advice',
              value: get(value, [`${index}`, 'advice']),
              label: '建议',
              labelSpan: 9,
              wrapperSpan: 14,
              inputType: 'text_area',
              inputProps: { rows: 2 },
            })}
          </Col>
        </Row>
      </div>
    );
  };
  render() {
    const { childrens, areaNameList, areaNO } = this.state;
    const { value } = this.props;
    return (
      <div>
        <Row>
          <Col span={8}>
            <Form.Item label="交班日期" name="handoverDate" labelCol={{ span: 9 }} wrapperCol={{ span: 8 }}>
              {this.renderFieldItem({
                inputType: 'single_date_picker',
                inputProps: {
                  showTime: true,
                  format: 'YYYY-MM-DD HH:mm',
                },
              })}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="病区" name="areaName" labelCol={{ span: 9 }} wrapperCol={{ span: 8 }}>
              <Select
                onSelect={async (e) => {
                  if (e) {
                    this.getParturientList(e);
                  }
                }}
              >
                {areaNameList &&
                  areaNameList.map((item: any, index) => {
                    return (
                      <Option value={`${item.areaName}`} key={index}>
                        {item.areaName}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="病区号" name="areaNO" labelCol={{ span: 9 }} wrapperCol={{ span: 8 }}>
              <Input type="text" />
            </Form.Item>
          </Col>
        </Row>
        {map(childrens, (children, index) => {
          return this.renderChildrenItem(children, index, value);
        })}
        <Row style={{ paddingTop: '20px' }}>
          <Col span={8}>
            <Form.Item label="特殊情况交接" name="exceptionalCase" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}
