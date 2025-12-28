import { LazyAntd, TimePicker_L } from '@lm_fe/components';
import { formatDate } from '@lm_fe/utils';
import { Button, Col, Form, InputNumber, Row } from 'antd';
import { cloneDeep, filter, get, indexOf, isArray, isEmpty, isEqual, join, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import BaseFormComponent from '../../../../BaseFormComponent';
import { CELL_WIDTH_SMALL } from './config/common-table-item';
import columnsConfig, { bloodFlowsColumns, hemogramExamColumns } from './config/table';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
export default class IntrauterineBloodTransfusion extends Component {
  columns: any;
  value: any;

  constructor(props) {
    super(props);
    const tableColumnName = get(props, 'input_props.tableColumnName');
    this.state = {
      dataSource: [],
      bloodFlowsDataSource: [],
      hemogramExamDataSource: [],
      selectedRowKeys: [],
      editingCol: undefined,
      editingRow: undefined,
      editingValue: undefined,
      editingTable: undefined,
    };
    this.columns = columnsConfig[tableColumnName];
    this.value = get(props, 'value') || {};
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    const bloodFlowsDataSource = [];
    const hemogramExamDataSource = [];
    if (!isEqual(prevProps.value, value)) {
      this.value = value;
      for (let i = 0; i < get(value, 'pdPreBloodFlows.length'); i++) {
        if (i > get(value, 'pdPreBloodFlows.length') - 1) {
          break;
        }
        bloodFlowsDataSource.push({
          ...get(value, `pdPreBloodFlows.${i}`),
          name: `${get(value, `pdProcedures.${i}.object`) || ''}术前血流`,
          key: get(value, `pdPreBloodFlows.${i}.key`) || 'pdPreBloodFlows' + get(value, `pdPreBloodFlows.${i}.id`),
        });
        bloodFlowsDataSource.push({
          ...get(value, `pdPostBloodFlows.${i}`),
          name: `${get(value, `pdProcedures.${i}.object`) || ''}术后血流`,
          key: get(value, `pdPostBloodFlows.${i}.key`) || 'pdPostBloodFlows' + get(value, `pdPostBloodFlows.${i}.id`),
        });
      }

      for (let i = 0; i < get(value, 'pdPreHemograms.length'); i++) {
        if (i > get(value, 'pdPreHemograms.length') - 1) {
          break;
        }
        hemogramExamDataSource.push({
          ...get(value, `pdPreHemograms.${i}`),
          name: `${get(value, `pdProcedures.${i}.object`) || ''}术前血象（胎）`,
          key: get(value, `pdPreHemograms.${i}.key`) || 'pdPreHemograms' + get(value, `pdPreHemograms.${i}.id`),
        });
        hemogramExamDataSource.push({
          ...get(value, `pdPreHemogramBanks.${i}`),
          name: `${get(value, `pdProcedures.${i}.object`) || ''}术前血象（库血）`,
          key:
            get(value, `pdPreHemogramBanks.${i}.key`) ||
            'pdPreHemogramBanks' + get(value, `pdPreHemogramBanks.${i}.id`),
        });
        hemogramExamDataSource.push({
          ...get(value, `pdPostHemograms.${i}`),
          name: `${get(value, `pdProcedures.${i}.object`) || ''}术后血象（胎）`,
          key: get(value, `pdPostHemograms.${i}.key`) || 'pdPostHemograms' + get(value, `pdPostHemograms.${i}.id`),
        });
      }
      this.setState({
        dataSource: map(get(value, 'pdProcedures'), (item) => ({ ...item, key: get(item, 'key') || get(item, 'id') })),
        bloodFlowsDataSource,
        hemogramExamDataSource,
      });
    }
  }

  formatColumns = (tableName) => (columns: any) => {
    const { editingCol, editingRow, editingTable } = this.state;
    return map(columns, (column) => {
      const { editable, inputType, dataIndex, inputProps, children, width } = column;
      if (!isEmpty(children)) {
        return {
          ...column,
          width: width || CELL_WIDTH_SMALL,
          children: this.formatColumns(tableName)(children),
        };
      }
      if (!editable) {
        return column;
      }
      return {
        ...column,
        render: (value, rowData, rowIndex) => {
          let renderValue = value;
          if (['single_date_picker'].indexOf(inputType) > -1) {
            renderValue = value ? dayjs(value, 'YYYY-MM-DD') : dayjs();
          }
          return editingTable === tableName && editingCol === dataIndex && editingRow === rowIndex && editable ? (
            <BaseFormComponent
              {...inputProps}
              inputProps={inputProps}
              key={rowIndex}
              size="small"
              inputType={inputType}
              defaultValue={renderValue}
              autoFocus
              defaultOpen={true}
              onBlur={this.handleBlur({ tableName, dataIndex, inputType, rowIndex })}
              onChange={this.handleItemChange({ tableName, dataIndex, inputType, rowIndex })}
            />
          ) : (
            <span
              className="custom-table-cell"
              onClick={() => {
                this.setState({
                  editingRow: rowIndex,
                  editingCol: dataIndex,
                  editingValue: value,
                  editingTable: tableName,
                });
              }}
            >
              {value}
            </span>
          );
        },
      };
    });
  };

  handleBlur = ({ tableName, dataIndex, inputType, rowIndex }) => () => {
    const { onChange } = this.props;
    const { editingCol, editingRow, editingValue, editingTable } = this.state;

    this.setState({
      editingRow: undefined,
      editingCol: undefined,
      editingValue: undefined,
      editingTable: undefined,
    });
    let path = dataIndex;
    if (isArray(dataIndex)) {
      path = join(dataIndex, '.');
    }
    const data = cloneDeep(this.value);
    set(data, `${rowIndex}.${path}`, editingValue);

    if (tableName === 'procedure') {
      set(data, `pdProcedures.${rowIndex}.${path}`, editingValue);
      if (dataIndex === 'actualbtvolume' || dataIndex === 'btDuration') {
        const actualbtvolume = Number(get(data, `pdProcedures.${rowIndex}.actualbtvolume`) || 0);
        const btDuration = Number(get(data, `pdProcedures.${rowIndex}.btDuration`) || 1);
        set(data, `pdProcedures.${rowIndex}.btspeed`, (actualbtvolume / btDuration).toFixed(3));
      }
    } else if (tableName === 'bloodFlows') {
      if (rowIndex % 2 === 0) {
        set(data, `pdPreBloodFlows.${Math.floor(rowIndex / 2)}.${path}`, editingValue);
      } else {
        set(data, `pdPostBloodFlows.${Math.floor(rowIndex / 2)}.${path}`, editingValue);
      }
    } else if (tableName === 'hemogramExam') {
      if (rowIndex % 3 === 0) {
        set(data, `pdPreHemograms.${Math.floor(rowIndex / 3)}.${path}`, editingValue);
      } else if (rowIndex % 3 === 1) {
        set(data, `pdPreHemogramBanks.${Math.floor(rowIndex / 3)}.${path}`, editingValue);
      } else if (rowIndex % 3 === 2) {
        set(data, `pdPostHemograms.${Math.floor(rowIndex / 3)}.${path}`, editingValue);
      }
    }
    // console.log(data);
    onChange && onChange(data);
  };

  handleItemChange = ({ tableName, dataIndex, inputType, rowIndex }) => (event) => {
    let value = get(event, 'target.value');
    switch (inputType) {
      case 'select_tag_with_options':
      case 'normal_select':
      case 'tree_select':
      case 'select_with_no':
      case 'select_with_options_or_input':
        value = event;
        break;
      case 'date':
      case 'single_date_picker':
        value = formatDate(event,);
        break;
      default:
        break;
    }
    this.setState({
      editingValue: value,
      editingTable: tableName,
    });
  };

  handleAdd = () => {
    const { onChange } = this.props;
    const { dataSource, bloodFlowsDataSource, hemogramExamDataSource } = this.state;
    const value = this.value;
    const newPdProcedure = {
      key: Math.random(),
    };
    const pdPreBloodFlow = {
      key: Math.random(),
      name: '术前血流',
      checkDate: dayjs().format('YYYY-MM-DD'),
    };
    const pdPostBloodFlow = {
      key: Math.random(),
      name: '术后血流',
      checkDate: dayjs().format('YYYY-MM-DD'),
    };
    const pdPreHemogram = {
      key: Math.random(),
      name: '术前血象(胎)',
    };
    const pdPreHemogramBank = {
      key: Math.random(),
      name: '术前血象(库血)',
    };
    const pdPostHemogram = {
      key: Math.random(),
      name: '术后血象(胎)',
    };
    this.setState({
      dataSource: [...dataSource, newPdProcedure],
      bloodFlowsDataSource: [...bloodFlowsDataSource, pdPreBloodFlow, pdPostBloodFlow],
      hemogramExamDataSource: [...hemogramExamDataSource, pdPreHemogram, pdPreHemogramBank, pdPostHemogram],
    });
    onChange &&
      onChange({
        pdProcedures: [...(get(value, 'pdProcedures') || []), newPdProcedure],
        pdPreBloodFlows: [...(get(value, 'pdPreBloodFlows') || []), pdPreBloodFlow],
        pdPostBloodFlows: [...(get(value, 'pdPostBloodFlows') || []), pdPostBloodFlow],
        pdPreHemograms: [...(get(value, 'pdPreHemograms') || []), pdPreHemogram],
        pdPreHemogramBanks: [...(get(value, 'pdPreHemogramBanks') || []), pdPreHemogramBank],
        pdPostHemograms: [...(get(value, 'pdPostHemograms') || []), pdPostHemogram],
      });
  };

  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  handlePatchDelete = () => {
    const { onChange } = this.props;
    const { selectedRowKeys, dataSource, bloodFlowsDataSource, hemogramExamDataSource } = this.state;
    const pdProcedures = filter(dataSource, (data) => indexOf(selectedRowKeys, data.key) === -1);
    let newBloodFlowsDataSource: any = [];
    let newHemogramExamDataSource: any = [];
    map(dataSource, (pdProcedure, rowIndex) => {
      if (selectedRowKeys.indexOf(get(pdProcedure, 'key')) === -1) {
        newBloodFlowsDataSource.push(bloodFlowsDataSource[rowIndex]);
        newBloodFlowsDataSource.push(bloodFlowsDataSource[rowIndex + 1]);
        newHemogramExamDataSource.push(bloodFlowsDataSource[rowIndex]);
        newHemogramExamDataSource.push(bloodFlowsDataSource[rowIndex + 1]);
        newHemogramExamDataSource.push(bloodFlowsDataSource[rowIndex + 2]);
      }
    });

    const pdPreBloodFlows = filter(newBloodFlowsDataSource, (data, key) => Number(key) % 2 === 0);
    const pdPostBloodFlows = filter(newBloodFlowsDataSource, (data, key) => Number(key) % 2 === 1);
    const pdPreHemograms = filter(newHemogramExamDataSource, (data, key) => Number(key) % 3 === 0);
    const pdPostHemograms = filter(newHemogramExamDataSource, (data, key) => Number(key) % 3 === 1);
    const pdPreHemogramBanks = filter(newHemogramExamDataSource, (data, key) => Number(key) % 3 === 2);
    this.setState({
      dataSource: pdProcedures,
      bloodFlowsDataSource: newBloodFlowsDataSource,
      hemogramExamDataSource: newHemogramExamDataSource,
    });
    onChange &&
      onChange({
        pdProcedures,
        pdPreBloodFlows,
        pdPostBloodFlows,
        pdPreHemograms,
        pdPreHemogramBanks,
        pdPostHemograms,
      });
  };

  render() {
    const { onChange } = this.props;
    const { dataSource, selectedRowKeys, bloodFlowsDataSource, hemogramExamDataSource } = this.state;
    const newProcedureColumns = this.formatColumns('procedure')(this.columns);
    const newBloodFlowsColumns = this.formatColumns('bloodFlows')(bloodFlowsColumns);
    const newHemogramExamColumns = this.formatColumns('hemogramExam')(hemogramExamColumns);
    return (
      <div className="pd-procedure">
        <div className="pd-procedure-normal">
          <Row>
            <Col span={6}>
              <Form.Item label="开始时间" {...layout}>
                <TimePicker_L
                  size="small"
                  format="HH:mm"
                  value={get(dataSource, '0.startTime') ? dayjs(get(dataSource, '0.startTime'), 'HH:mm') : null}
                  onChange={(value) => {
                    const startTime = dayjs(value).format('HH:mm').toString();
                    const result = cloneDeep(this.value);
                    set(result, 'pdProcedures.0.startTime', startTime);
                    const pdPreBloodFlow = {
                      key: Math.random(),
                      name: '术前血流',
                      checkDate: dayjs().format('YYYY-MM-DD'),
                    };
                    const pdPostBloodFlow = {
                      key: Math.random(),
                      name: '术后血流',
                      checkDate: dayjs().format('YYYY-MM-DD'),
                    };
                    const pdPreHemogram = {
                      key: Math.random(),
                      name: '术前血象(胎)',
                    };
                    const pdPreHemogramBank = {
                      key: Math.random(),
                      name: '术前血象(库血)',
                    };
                    const pdPostHemogram = {
                      key: Math.random(),
                      name: '术后血象(胎)',
                    };
                    onChange &&
                      onChange({
                        ...result,
                        pdPreBloodFlows: [...(get(value, 'pdPreBloodFlows') || []), pdPreBloodFlow],
                        pdPostBloodFlows: [...(get(value, 'pdPostBloodFlows') || []), pdPostBloodFlow],
                        pdPreHemograms: [...(get(value, 'pdPreHemograms') || []), pdPreHemogram],
                        pdPreHemogramBanks: [...(get(value, 'pdPreHemogramBanks') || []), pdPreHemogramBank],
                        pdPostHemograms: [...(get(value, 'pdPostHemograms') || []), pdPostHemogram],
                      });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="结束时间" {...layout}>
                <DatePicker_L
                  size="small"
                  format="HH:mm"
                  value={get(dataSource, '0.endTime') ? dayjs(get(dataSource, '0.endTime'), 'HH:mm') : null}
                  onChange={(value) => {
                    const minutes = dayjs(value, 'HH:mm').diff(
                      dayjs(get(dataSource, '0.startTime'), 'HH:mm'),
                      'minutes',
                    );
                    const endTime = dayjs(value).format('HH:mm').toString();
                    const result = cloneDeep(this.value);
                    set(result, 'pdProcedures.0.endTime', endTime);
                    set(result, 'pdProcedures.0.duration', minutes);
                    const pdPreBloodFlow = {
                      key: Math.random(),
                      name: '术前血流',
                      checkDate: dayjs().format('YYYY-MM-DD'),
                    };
                    const pdPostBloodFlow = {
                      key: Math.random(),
                      name: '术后血流',
                      checkDate: dayjs().format('YYYY-MM-DD'),
                    };
                    const pdPreHemogram = {
                      key: Math.random(),
                      name: '术前血象(胎)',
                    };
                    const pdPreHemogramBank = {
                      key: Math.random(),
                      name: '术前血象(库血)',
                    };
                    const pdPostHemogram = {
                      key: Math.random(),
                      name: '术后血象(胎)',
                    };
                    onChange &&
                      onChange({
                        ...result,
                        pdPreBloodFlows: [...(get(value, 'pdPreBloodFlows') || []), pdPreBloodFlow],
                        pdPostBloodFlows: [...(get(value, 'pdPostBloodFlows') || []), pdPostBloodFlow],
                        pdPreHemograms: [...(get(value, 'pdPreHemograms') || []), pdPreHemogram],
                        pdPreHemogramBanks: [...(get(value, 'pdPreHemogramBanks') || []), pdPreHemogramBank],
                        pdPostHemograms: [...(get(value, 'pdPostHemograms') || []), pdPostHemogram],
                      });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="持续时间" {...layout}>
                <InputNumber
                  size="small"
                  value={get(dataSource, '0.duration')}
                  onChange={(value) => {
                    const result = cloneDeep(this.value);
                    set(result, 'pdProcedures.0.duration', value);
                    onChange && onChange(result);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="pd-procedure-table">
          <div className="pd-procedure-table__header">
            <Button onClick={this.handleAdd}>新增</Button>
            <Button disabled={isEmpty(selectedRowKeys)} onClick={this.handlePatchDelete}>
              删除
            </Button>
          </div>
          <Table
            rowSelection={{ selectedRowKeys, onChange: this.handleRowSelectChange }}
            size="small"
            bordered
            columns={newProcedureColumns}
            dataSource={dataSource}
            pagination={false}
            scroll={{
              x: 3000,
            }}
          />
          <br />
          <Table
            size="small"
            className="blood-and-thalassemia"
            bordered
            columns={newBloodFlowsColumns}
            dataSource={bloodFlowsDataSource}
            pagination={false}
          />
          <br />
          <Table
            size="small"
            className="blood-and-thalassemia"
            bordered
            columns={newHemogramExamColumns}
            dataSource={hemogramExamDataSource}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}
