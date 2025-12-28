import {
  ColumnHeightOutlined,
  // CustomIcon,
  FilterOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Divider,
  // Pagination,

  Input,
  InputNumber,
  Menu,
  Popover,
  Space,

  Tooltip,
} from 'antd';
import { TableProps } from 'antd/lib/table';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import classnames from 'classnames';
import { compact, get, indexOf, isEqual, map, set } from 'lodash';
import dayjs from 'dayjs';
import React, { Component } from 'react';
import { ContainerDimensions, LazyAntd } from '@lm_fe/components';

import store from 'store';
import styles from './index.module.less';
import { ResizableTitle } from './Resizeable';
import { Browser } from '@lm_fe/utils';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

// 不限定默认格子宽度
const TABLE_CELL_WIDTH = 200;
const browserVersion = Browser.client || {};
interface IProps extends TableProps<any> {
  onAdd?: () => void;
  onSearch?: () => void;
  addText?: string;
  baseTitle?: string;
  showQuery?: boolean;
  showTitle?: boolean;
  columns?: any;
  selectedRowKeys?: string[];
  ExtraFooter?: React.ReactNode;
  Query?: React.ReactNode;
  onRowEvent?: any;
  clearSelectedRowKeys?: any;
  toQueryMethods: any;
}
interface IState {
  searchText?: string;
  searchedColumn?: string;
  columns: [];
  checkedColumns: [];
  size: SizeType;
  queryVisible?: boolean;
  queryHeight?: number;
  [key: string]: any;
}
export default class BaseTableOld extends Component<IProps, IState> {
  tableId = dayjs().format('X');
  queryRef: any;
  searchInput: any;
  extraRef: any;

  constructor(props: any) {
    super(props);
    const checkedColumns: any = compact(map(props.columns, (column) => get(column, 'dataIndex')));
    this.state = {
      searchText: '',
      searchedColumn: '',
      size: store.get('table-size') || 'middle',
      columns: props.columns,
      checkedColumns,
      queryVisible: true,
      queryHeight: 0,
    };
  }

  componentDidUpdate(preProps: any) {
    if (!isEqual(preProps.columns.length, this.props.columns.length)) {
      console.log('this.props.columns', this.props.columns);
      console.log('next.props.columns', preProps.columns);
      // 把所有的columns重新checked
      // [todo]找到对应新增或删除的列
      const checkedColumns: any = compact(map(this.props.columns, (column) => get(column, 'dataIndex')));
      this.setState({ columns: this.props.columns, checkedColumns: checkedColumns });
    }
  }

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
        return dayjs(get(rowDataPrev, dataIndex)).valueOf() - dayjs(get(rowDataNext, dataIndex)).valueOf();
      // return dayjs(get(rowDataPrev, dataIndex)).diff(dayjs(get(rowDataNext, dataIndex)));
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

  updateTableSize = (size: any) => () => {
    store.set('table-size', size);
    this.setState(
      {
        size,
      },
      () => {
        this.forceUpdate();
      },
    );
  };

  renderInputNode = (filterType: string = 'string', column: any, filterDropdownProps: FilterDropdownProps) => {
    const { setSelectedKeys, selectedKeys, confirm, clearFilters } = filterDropdownProps;
    const { title, dataIndex } = column;
    const commonProps = {
      ref: (node: any) => {
        this.searchInput = node;
      },
      placeholder: `请输入${title}`,
      // size: 'small',
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
        return <Input {...commonProps} onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])} />;
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
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            style={{ width: 90 }}
          >
            查询
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    );
  };

  handleResize =
    (index) =>
      (e, { size }) => {
        this.setState(({ columns }) => {
          const nextColumns = [...columns];
          nextColumns[index] = {
            ...nextColumns[index],
            width: size.width,
          };
          return { columns: nextColumns };
        });
      };

  mergedColumns = (columns: any) => {
    return map(columns, (column: any, index) => {
      const { width, showSorter, showFilter, showResize = true } = column;
      const cellHeaderAction = {};
      if (showResize) {
        set(cellHeaderAction, 'onHeaderCell', () => ({
          width: width || TABLE_CELL_WIDTH,
          onResize: this.handleResize(index),
        }));
      }
      if (showSorter) {
        set(cellHeaderAction, 'sorter', this.handleSorter(column));
      }
      if (showFilter) {
        set(cellHeaderAction, 'filterDropdown', this.renderFilterDown(column));
        set(cellHeaderAction, 'onFilter', this.handleFilter(column));
        set(
          cellHeaderAction,
          'filterIcon',
          <div className={styles["filter-block"]}>
            <FilterOutlined />
          </div>,
        );
      }
      return {
        // key: isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex,
        align: 'left',
        width: width || TABLE_CELL_WIDTH,
        ...column,
        ...cellHeaderAction,
      };
    });
  };

  renderAdd = () => {
    const { onAdd, addText, disabled } = this.props;
    if (onAdd) {
      return (
        <Button disabled={disabled} icon={<PlusOutlined />} type="primary" onClick={onAdd}>
          {addText || '新增'}
        </Button>
      );
    }
    return;
  };

  handleColumnsChange = (checkedColumns: any) => {
    const { columns } = this.props;
    const newColumns: any = compact(
      map(columns, (column) => {
        if (get(column, 'dataIndex')) {
          if (indexOf(checkedColumns, get(column, 'dataIndex')) > -1) {
            return column;
          }
          return;
        }
        return column;
      }),
    )

    this.setState({
      checkedColumns,
      columns: newColumns,
    });
  };

  handleQueryClick = () => {
    const { queryVisible } = this.state;
    // TODO you bug
    this.setState(
      {
        queryVisible: !queryVisible,
      },
      () => {
        // 为了刷新 ref 强制渲染
        this.forceUpdate();
      },
    );
  };

  renderOtherActions = (): any => { };

  renderOtherTableConfig = (): any => { };

  renderColumnsConfig = () => {
    const { columns } = this.props;
    const { checkedColumns } = this.state;
    const options = compact(
      map(columns, ({ dataIndex, label, title }) => {
        if (dataIndex) {
          return {
            label: label || title,
            value: dataIndex,
            // value: isArray(dataIndex) ? dataIndex.join('.') : dataIndex,
          };
        }
        return;
      }),
    );
    const allKeys = compact(columns.map((_: any) => _.dataIndex))
    const isEmpty = checkedColumns.length === 0
    const isFull = checkedColumns.length === allKeys.length
    console.log('checkedColumns', checkedColumns, columns)
    return <div>
      <div>
        <Checkbox checked={isFull} onChange={(e) => {
          const a = e.target.checked ? allKeys : []
          this.handleColumnsChange(a)
        }} indeterminate={!isEmpty && !isFull}>全选</Checkbox>
      </div>
      {/* <Button size='small' onClick={() => this.handleColumnsChange()}>{isEmpty ? '全选' : '全空'}</Button>
        <Button size='small' onClick={() => this.handleColumnsChange([])}>全空</Button> */}
      <Checkbox.Group options={options} value={checkedColumns} onChange={this.handleColumnsChange} />
    </div>;
  };

  renderTableConfig = () => {
    const { queryVisible, size } = this.state;
    return (
      <div className={styles["global-base-table_title-operations-right-config"]}>
        {/* {queryVisible ? (
          <DownOutlined
            className={styles["global-base-table_title-operations-right-config__icon"]}
            onClick={this.handleQueryClick}
            title="收起"
          />
        ) : (
          <UpOutlined
            className={styles["global-base-table_title-operations-right-config__icon"]}
            onClick={this.handleQueryClick}
            title="展开"
          />
        )} */}
        <Divider type="vertical" />
        <Tooltip title="刷新">
          <RedoOutlined
            className={styles["global-base-table_title-operations-right-config__icon"]}
            onClick={() => {
              this.props.onSearch && this.props.onSearch();
            }}
          />
        </Tooltip>
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu selectedKeys={[size]}>
              <Menu.Item key="small" onClick={this.updateTableSize('small')}>
                紧凑
              </Menu.Item>
              <Menu.Item key="middle" onClick={this.updateTableSize('middle')}>
                中等
              </Menu.Item>
              <Menu.Item key="default" onClick={this.updateTableSize('default')}>
                偏大
              </Menu.Item>
            </Menu>
          }
        >
          <Tooltip title="间距">
            <ColumnHeightOutlined className={styles["global-base-table_title-operations-right-config__icon"]} />
          </Tooltip>
        </Dropdown>
        {/* <Dropdown
          trigger={['click']}
          overlay={
            <Menu>
              <Menu.Item>导出选中</Menu.Item>
              <Menu.Item>导出本页</Menu.Item>
              <Menu.Item>导出全部</Menu.Item>
            </Menu>
          }
        >
          <ExportOutlined className={styles["global-base-table_title-operations-right-config__icon"]} />
        </Dropdown> */}
        <Popover
          overlayClassName={styles["global-base-table_title-operations-right-config__columns"]}
          content={this.renderColumnsConfig()}
          trigger="click"
        >
          <Tooltip title="列展示">
            <SettingOutlined className={styles["global-base-table_title-operations-right-config__icon"]} />
          </Tooltip>
        </Popover>
        {this.renderOtherTableConfig()}
      </div>
    );
  };

  renderTitle = () => {
    const { baseTitle, Query, showQuery, onSearch, history, selectedRowKeys, toQueryMethods, ...rest } = this.props;
    const { queryVisible, checkedColumns } = this.state;
    return (
      <div
        ref={(queryRef) => {
          this.queryRef = queryRef;
        }}
        className={styles["global-base-table_title"]}
      >
        <div className={styles["global-base-table_title-operations"]}>
          <div className={styles["global-base-table_title-operations-left"]}>
            {showQuery ? (
              <Button
                className={styles["global-base-table_title-operations-left_filter"]}
                type="link"
                icon={<FilterOutlined />}
                onClick={this.handleQueryClick}
              >
                <div style={{ display: 'inline-flex', marginLeft: '5px' }}>
                  筛选
                  {/* {queryVisible ? (
                    <CustomIcon type="icon-down"  />
                  ) : (
                    <CustomIcon type="icon-dropdown"  />
                  )} */}
                </div>
              </Button>
            ) : (
              <Button type="text" style={{ padding: '0 1px' }}>
                {baseTitle}
              </Button>
            )}
            {this.renderOtherActions()}
          </div>
          <div className={styles["global-base-table_title-operations-right"]}>
            {this.renderAdd()}
            {this.renderTableConfig()}
          </div>
        </div>
        <div
          className={classnames('global-base-table_title-query', {
            'global-base-table_title-query-hide': !(queryVisible && showQuery),
          })}
        >
          {/* true时导致重新渲染数据 */}
          {/* {queryVisible && showQuery && <Query onSearch={onSearch} />} */}
          {/* TODO 处理rest，多余属性过多 */}
          {!!Query && (
            <Query
              {...rest}
              onSearch={onSearch}
              checkedColumns={checkedColumns}
              history={history}
              selectedRowKeys={selectedRowKeys}
              style={{ height: queryVisible ? 'auto' : 0 }}
              toQueryMethods={toQueryMethods}
            />
          )}
        </div>
      </div>
    );
  };

  tableRowDoubleClick = (record: any, event: any) => {
    const { onRowEvent } = this.props;
    onRowEvent.tableRowDoubleClick && onRowEvent.tableRowDoubleClick(record, event);
  };

  render() {
    const {
      otherTableProps,
      containerProps,
      scroll,
      components,
      style,
      showTitle = true,
      ExtraFooter,
      selectedRowKeys,
      onSearch,
      className,
      onChange,
      ...rest
    } = this.props;
    const { columns, size } = this.state;
    const mergedColumns = this.mergedColumns(columns);
    // TODO fixed table header
    const restHeight = this.queryRef?.clientHeight + this.extraRef?.clientHeight;
    // 如果一个页面多次引用此组件，则添加唯一标记id
    const selector = `#t_${this.tableId} thead.ant-table-thead`;
    return (
      <div className={classnames('global-base-table', className)} id={`t_${this.tableId}`}>
        {showTitle && this.renderTitle()}
        <div
          id="table-scrollContainer"
          className={classnames('global-base-table_table', {
            'table-cell-without-fix':
              (browserVersion.name === 'Chrome' && browserVersion.version && parseInt(browserVersion.version) < 58) ||
              browserVersion.name === 'unknow',
          })}
          style={{ height: `calc(100% - ${restHeight}px)` }}
        >
          <ContainerDimensions>
            {({ width, height }) => {
              const theadHeight = document.querySelector(selector)?.clientHeight || 0;
              const scrollY = height - theadHeight - 40;
              // console.log({ aa: height - theadHeight - 40 < 50, y: height - theadHeight - 40 });
              return (
                <Table
                  bordered={get(otherTableProps, 'bordered', true)}
                  size={size}
                  onRow={(record) => {
                    return {
                      onDoubleClick: (event) => {
                        this.tableRowDoubleClick(record, event);
                      },
                    };
                  }}
                  components={{
                    header: {
                      cell: ResizableTitle,
                    },
                    ...components,
                  }}
                  scroll={
                    scroll
                      ? {
                        scrollToFirstRowOnChange: true,
                        x: scroll.x || '100%',
                        y: scroll.y,
                      }
                      : {
                        scrollToFirstRowOnChange: true,
                        x: '100%',
                        y: scrollY,
                      }
                  }
                  // sticky={
                  //   browserVersion.version &&
                  //   parseInt(browserVersion.version) > 50 && {
                  //     getContainer: () => document.getElementById('table-scrollContainer'),
                  //     getContainer: () => this.tableRef,
                  //   }
                  // }
                  {...rest}
                  columns={mergedColumns}
                  expandable={get(otherTableProps, 'expandable')}
                />
              );
            }}
          </ContainerDimensions>
        </div>

        <div
          ref={(ref) => {
            this.extraRef = ref;
          }}
          className={styles["global-base-table_extra-footer"]}
        >
          {!!ExtraFooter && <ExtraFooter selectedRowKeys={selectedRowKeys} onSearch={onSearch} />}
        </div>
      </div>
    );
  }
}
