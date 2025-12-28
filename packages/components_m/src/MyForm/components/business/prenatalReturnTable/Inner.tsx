import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { LazyAntd } from '@lm_fe/components';
import { Button, Space } from 'antd';
import classNames from 'classnames';
import { cloneDeep, debounce, find, get, isArray, map, set, split } from 'lodash';
import React, { Component } from 'react';
import EditableCell from '../../MyTable/TableEditableCell';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface PrenatalReturnTableProps {
  onChange: Function;
  dispatch?: Function;
  value: any;
  input_props: any;
}
interface MyTableState {
  selectedRowKeys: Array<number | string>;
  tableColumns: any;
  dataSource: any;
}
export default class PrenatalReturnTable extends Component<PrenatalReturnTableProps, MyTableState> {
  constructor(props: PrenatalReturnTableProps) {
    super(props);
    this.state = {
      tableColumns: [],
      dataSource: [],
      selectedRowKeys: [],
    };
  }
  update() {
    const { value } = this.props;
    console.log('componentDidUpdate', this.props);
    this.setState({
      tableColumns: this.props.input_props.tableColumns,
      // 处理dataSource，为了dataSource拥有_key值,用于rowSelection
      dataSource: isArray(value)
        ? value.map((v: any, i: number) => ({ ...v, _key: v.checktime || -Math.random() }))
        : [],
      //由于产程图的新增往头部新增，_key用i有问题
      selectedRowKeys: [],
    });
  }
  // 因为要维护tableRow的状态，所有需要保存在本地
  componentDidUpdate(prevProps: PrenatalReturnTableProps) {


    if (prevProps.value !== this.props.value) {
      this.update()
    } else {
      console.log('componentDidUpdate xxx', this.props);
    }
  }
  componentDidMount(): void {
    this.update()
  }
  handleEdit = debounce((val: any, key: string, index: number, record: any) => {
    const { onChange, dispatch } = this.props;
    const { dataSource } = this.state;

    //todo：按时间升序编辑会导致index不正确
    let editIndex: any = index;
    if (record._key !== dataSource[editIndex]._key) {
      map(dataSource, (item, itemIndex) => {
        if (item._key === record._key) {
          editIndex = itemIndex;
        }
      });
    }

    if (key.indexOf('+') > -1) {
      const paramsArr = split(key, '+');
      const firstParam = get(paramsArr, '0');
      const secondParam = get(paramsArr, '1');
      set(dataSource[editIndex], firstParam, get(val, firstParam));
      set(dataSource[editIndex], secondParam, get(val, secondParam));
    } else {
      set(dataSource[editIndex], key, val);
    }

    onChange(dataSource);
    const rowData = dataSource[editIndex];
    if (dispatch) dispatch('tableEdit', { rowData, key });
  }, 800);

  handleAdd = () => {
    const { dispatch } = this.props;
    if (dispatch) dispatch('tableAdd');
  };

  handleDelete = () => {
    const { selectedRowKeys, dataSource } = this.state;
    const { dispatch } = this.props;
    if (dispatch) dispatch('tableDelete', { selectedRowKeys, dataSource });
  };

  handleRowSelectChange = (selectedRowKeys: Array<number | string>, selectedRows: any[]): void => {
    const { dispatch } = this.props;
    this.setState({ selectedRowKeys });
    dispatch && dispatch('rowSelect', { selectedRowKeys, selectedRows });
  };

  handleRowDoubleClick = (record: any) => {
    const { dispatch } = this.props;
    dispatch && dispatch('rowDBClick', record);
  };

  handleRowClick = (row: any, index: any) => {
    const { dataSource } = this.state;
    const newValue = cloneDeep(dataSource);
    newValue.forEach((item: any) => (item.rowClassName = ''));
    set(newValue[index], 'rowClassName', 'row-select');
    this.setState({ selectedRowKeys: [index], dataSource: newValue });
  };

  rowClassName(row: any) {
    return row.rowClassName;
  }

  // 对于二级表单的处理
  handleTabColumnsFormat = (tableColumns: Array<any>): any => {
    const { dispatch } = this.props;
    const { editable } = this.props.input_props;
    return tableColumns.map((v: any, i: number) => {
      if (v.key) {
        return {
          render: (text: string, record: any, index: number) => {
            if (editable) {
              let cellValue: any = '';
              if (v.key.indexOf('+') > -1) {
                const paramsArr = split(v.key, '+');
                const firstParam = get(paramsArr, '0');
                const secondParam = get(paramsArr, '1');
                cellValue = {
                  [firstParam]: get(record, firstParam),
                  [secondParam]: get(record, secondParam),
                };
              } else {
                cellValue = get(record, v.key);
              }
              return (
                <EditableCell
                  value={cellValue}
                  onChange={(val: any) => this.handleEdit(val, v.key, index, record)}
                  rowItem={record}
                  dispatch={dispatch}
                  editor={v.editor}
                />
              );
            } else {
              const options = get(v, `selectOptions`);
              let value = get(record, v.key) || '-';
              if (options && value != '-') {
                value = get(
                  find(options, (item) => item.value == value),
                  `label`,
                  '-',
                );
              }
              return <span>{value}</span>;
            }
          },
          ...v,
          title: () => {
            return get(v, `suffixNewLine`) ? (
              <div className={classNames({ 'title-content': get(v, `suffixNewLine`) })}>
                {v.title}
                <em className={classNames('label-suffix-line', { 'new-line': get(v, `suffixNewLine`) })}>{v.suffix}</em>
              </div>
            ) : (
              <>
                {v.title}
                <em className="label-suffix">{v.suffix}</em>
              </>
            );
          },
          dataIndex: v.key,
        };
      }
      if (v.children) {
        return {
          title: v.title,
          children: this.handleTabColumnsFormat(v.children),
        };
      }
      return {};
    });
  };

  render() {
    const { input_props } = this.props;
    let { tableColumns } = this.state;
    const { dataSource } = this.state;
    const { editable, hiddenBtn, hiddenSelection, pagination, scroll, size = 'small', bordered = true } = input_props;
    tableColumns = this.handleTabColumnsFormat(tableColumns);
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div className="prenatal-return-table">
        {editable && !hiddenBtn && (
          <Space className="btns-wrapper">
            <Button type="primary" onClick={this.handleAdd}>
              <PlusCircleOutlined />新 增
            </Button>
            <Button onClick={this.handleDelete}>
              <DeleteOutlined />删 除
            </Button>
          </Space>
        )}
        <Table
          bordered={bordered}
          size={size}
          rowSelection={!hiddenSelection ? rowSelection : undefined}
          onRow={(record, index) => {
            return {
              onClick: () => this.handleRowClick(record, index),
              onDoubleClick: () => this.handleRowDoubleClick(record),
            };
          }}
          rowClassName={(row) => this.rowClassName(row)}
          columns={tableColumns || []}
          dataSource={dataSource || []}
          childrenColumnName="noChildren"
          rowKey={(record: any) => record._key}
          pagination={pagination ? pagination : false}
          scroll={scroll}
        />
      </div>
    );
  }
}
