import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { LazyAntd } from '@lm_fe/components';
import { Button, Input, InputNumber, Space } from 'antd';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { filter, get, indexOf, isArray, isNil, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import { getAllResources } from '../../utils/defaultMethod';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
  value: any;
  onChange: any;
  columns: any[];
  dataSource: any[];
  callbackDataIndex: string;
  apiUrl: string;
  mode: 'single' | 'multiple';
}
interface IState {
  value: undefined | string | [];
  dataSource: any;
  visible: boolean;
  searchText: any;
  searchedColumn: any;
}
export default class SelectTable extends Component<IProps, IState> {
  state = {
    value: undefined,
    dataSource: [],
    visible: false,
    searchText: '',
    searchedColumn: '',
  };

  async componentDidMount() {
    const { apiUrl, dataSource: oldDataSource } = this.props;
    let dataSource: any = oldDataSource;
    if (apiUrl) {
      dataSource = await getAllResources(apiUrl);
    }
    this.setState({
      dataSource,
    });
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    if (!isNil(prevState.value) || isNil(nextProps.value)) return null;
    return {
      value: nextProps.value,
    };
  }

  handleClear = () => {
    const { onChange } = this.props;
    this.setState(
      {
        value: undefined,
      },
      () => {
        onChange && onChange(undefined);
      },
    );
  };

  handleRowClick = (rowData) => () => {
    const { callbackDataIndex, onChange, mode } = this.props;
    const { value: oldValue } = this.state;
    const newValue = get(rowData, callbackDataIndex);
    let value: any = newValue;
    if (mode === 'multiple') {
      if (indexOf(oldValue as any, newValue) === -1) {
        if (isArray(oldValue)) {
          value = [...(oldValue as any), newValue];
        } else if (isNil(oldValue)) {
          value = [newValue];
        } else {
          value = [oldValue, newValue];
        }
      } else {
        value = filter(oldValue, (item) => item !== newValue);
      }
    }
    this.setState(
      {
        value,
        visible: false,
      },
      () => {
        onChange && onChange(value);
      },
    );
  };

  setRowClassName = (rowData: any) => {
    const { value } = this.state;
    const { callbackDataIndex } = this.props;
    if (get(rowData, callbackDataIndex) === value || indexOf(value, get(rowData, callbackDataIndex)) > -1) {
      return 'table-row-active';
    }
    return '';
  };

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSorter = (column: any) => (rowDataPrev: any, rowDataNext: any) => {
    const { dataIndex, sortType = 'string' } = column;
    switch (sortType) {
      case 'number':
        return Number(get(rowDataPrev, dataIndex)) - Number(get(rowDataNext, dataIndex));
      case 'date':
        return dayjs(get(rowDataPrev, dataIndex)).diff(dayjs(get(rowDataNext, dataIndex)));
      case 'string':
      default:
        return String(get(rowDataPrev, dataIndex)).localeCompare(String(get(rowDataPrev, dataIndex)));
    }
  };

  handleFilter = (column: any) => (value: any, record: any) => {
    const { dataIndex } = column;
    // TODO: 过滤的时候，可能是 checkbox，待优化
    return String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase());
  };

  renderInputNode = (filterType: string = 'string', column: any, filterDropdownProps: FilterDropdownProps) => {
    const { setSelectedKeys, selectedKeys, confirm, clearFilters } = filterDropdownProps;
    const { title, dataIndex } = column;
    const commonProps = {
      ref: (node: any) => {
        this.searchInput = node;
      },
      placeholder: `请输入${title}`,
      style: { width: 188, marginBottom: 8, display: 'block' },
      onPressEnter: () => this.handleSearch(selectedKeys, confirm, dataIndex),
    };

    switch (filterType) {
      case 'number':
        return (
          <InputNumber {...commonProps} onChange={(inputNumber) => setSelectedKeys(inputNumber ? [inputNumber] : [])} />
        );
      case 'string':
      default:
        return (
          <Input
            {...commonProps}
            onClick={() => {
              this.setState({ visible: true });
            }}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          />
        );
    }
  };

  renderFilterDown = (column: any) => (filterDropdownProps: FilterDropdownProps) => {
    const { selectedKeys, confirm, clearFilters } = filterDropdownProps;
    const { dataIndex, filterType = 'string' } = column;

    return (
      <div style={{ padding: 8 }}>
        {this.renderInputNode(filterType, column, filterDropdownProps)}
        <Space>
          <Button
            type="primary"
            onClick={(e) => {
              this.handleSearch(selectedKeys, confirm, dataIndex);
            }}
            icon={<SearchOutlined />}
            style={{ width: 90 }}
          >
            查询
          </Button>
          <Button
            onClick={(e) => {
              this.handleReset(clearFilters);
            }}
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    );
  };

  mergedColumns = (columns: any) => {
    return map(columns, (column: any, index) => {
      const { showSorter, showFilter } = column;
      const cellHeaderAction = {};
      if (showSorter) {
        set(cellHeaderAction, 'sorter', this.handleSorter(column));
      }
      if (showFilter) {
        set(cellHeaderAction, 'filterDropdown', this.renderFilterDown(column));
        set(cellHeaderAction, 'onFilter', this.handleFilter(column));
        set(
          cellHeaderAction,
          'filterIcon',
          <div className="filter-block">
            <FilterOutlined />
          </div>,
        );
      }
      return {
        align: 'center',
        ...column,
        ...cellHeaderAction,
      };
    });
  };

  renderTable = () => {
    const { columns } = this.props;
    const { dataSource } = this.state;
    const mergedColumns = this.mergedColumns(columns);

    return (
      <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
        <Table
          columns={mergedColumns}
          dataSource={dataSource}
          size="middle"
          bordered={true}
          rowClassName={this.setRowClassName}
          onRow={(rowData) => ({
            onClick: this.handleRowClick(rowData),
          })}
        />
      </div>
    );
  };

  render() {
    const { value, visible } = this.state;
    const { mode, ...rest } = this.props;
    const extraProps = { mode };
    return (
      <div>
        <Select
          allowClear
          dropdownMatchSelectWidth={500}
          onClear={this.handleClear}
          removeIcon={<span />}
          {...rest}
          {...extraProps}
          value={value}
          dropdownRender={this.renderTable}
          onDropdownVisibleChange={(visible) => {
            this.setState({ visible: true });
          }}
          open={visible}
        />
      </div>
    );
  }
}
