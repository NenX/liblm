import {
  FilterOutlined,
  PlusOutlined, SearchOutlined
} from '@ant-design/icons';
import { ContainerDimensions, LazyAntd } from '@lm_fe/components';
import { Browser } from '@lm_fe/utils';
import {
  Input, InputNumber, Space
} from 'antd';
import { TableProps } from 'antd/lib/table';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import classnames from 'classnames';
import { compact, get, indexOf, map, set } from 'lodash';
import dayjs from 'dayjs';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { mchcEnv } from '@lm_fe/env';
import React from 'react';
import { OkButton } from '../FU_components';
import {
  CustomIcon
} from '../GeneralComponents/CustomIcon';
import styles from './index.module.less';
import { ResizableTitle } from './Resizeable';

// 不限定默认格子宽度
const TABLE_CELL_WIDTH = 200;
const browserVersion = Browser.client;
interface IProps extends TableProps<any> {
  otherTableProps?: TableProps<any>
  containerProps: any
  onAdd?: () => void;
  onSearch?: () => void;
  addText?: string;
  disabled?: boolean
  baseTitle?: string;
  showQuery?: boolean;
  showTitle?: boolean;
  columns?: any;
  selectedRowKeys?: string[];
  ExtraFooter?: any;
  Query?: any;
  onRowEvent?: any;
  clearSelectedRowKeys?: any;
  toQueryMethods: any;
  history?: any
  OtherActionsNode?: ReactNode
}
export function BaseTable(props: IProps) {

  const {
    otherTableProps = {},
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
    OtherActionsNode,
    size,
    ...rest
  } = props;
  const isFucking广三 = mchcEnv.in(['广三'])
  const queryRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const searchInput = useRef<any>(null);

  const tableId = 1

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [inner_columns, setInner_columns] = useState(props.columns)
  const [checkedColumns, setCheckedColumns] = useState()
  const [queryVisible, setQueryVisible] = useState(true)
  const [queryHeight, setQueryHeight] = useState(0)

  useEffect(() => {
    const _checkedColumns: any = compact(map(props.columns, (column) => get(column, 'dataIndex')));
    setInner_columns(props.columns)
    setCheckedColumns(_checkedColumns)
  }, [props.columns])


  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)

  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('')

  };

  const handleSorter = (column: any) => (rowDataPrev: any, rowDataNext: any) => {
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

  const handleFilter = (column: any) => (value: any, record: any) => {
    const { dataIndex } = column;
    // TODO: 过滤的时候，可能是 checkbox，待优化
    return String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase());
  };



  const renderInputNode = (filterType: string = 'string', column: any, filterDropdownProps: FilterDropdownProps) => {
    const { setSelectedKeys, selectedKeys, confirm, clearFilters } = filterDropdownProps;
    const { title, dataIndex } = column;
    const commonProps = {
      ref: searchInput,
      placeholder: `请输入${title}`,
      // size: 'small',
      style: { width: 188, marginBottom: 8, display: 'block' },
      onPressEnter: () => handleSearch(selectedKeys, confirm, dataIndex),
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

  const renderFilterDown = (column: any) => (filterDropdownProps: FilterDropdownProps) => {
    const { selectedKeys, confirm, clearFilters } = filterDropdownProps;
    const { dataIndex, filterType = 'string' } = column;

    return (
      <div style={{ padding: 8 }}>
        {renderInputNode(filterType, column, filterDropdownProps)}
        <Space>
          <OkButton
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            style={{ width: 90 }}
          >
            查询
          </OkButton>
          <OkButton onClick={() => handleReset(clearFilters)} style={{ width: 90 }}>
            重置
          </OkButton>
        </Space>
      </div>
    );
  };

  const handleResize = (index: any) =>
    (e: any, { size }: any) => {
      const nextColumns = [...inner_columns] as any[];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      setInner_columns(nextColumns)
    };

  const mergedColumns = (columns: any) => {
    return map(columns, (column: any, index) => {
      const { width, showSorter, showFilter, showResize = true } = column;
      const cellHeaderAction = {};
      if (showResize) {
        set(cellHeaderAction, 'onHeaderCell', () => ({
          width: width || TABLE_CELL_WIDTH,
          onResize: handleResize(index),
        }));
      }
      if (showSorter) {
        set(cellHeaderAction, 'sorter', handleSorter(column));
      }
      if (showFilter) {
        set(cellHeaderAction, 'filterDropdown', renderFilterDown(column));
        set(cellHeaderAction, 'onFilter', handleFilter(column));
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

  const renderAdd = () => {
    const { onAdd, addText, disabled } = props;
    if (onAdd) {
      return (
        <OkButton disabled={disabled} icon={<PlusOutlined />} type="primary" onClick={onAdd}>
          {addText || '新增'}
        </OkButton>
      );
    }
    return null;
  };

  const handleColumnsChange = (checkedColumns: any) => {
    const { columns } = props;
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
    );
    setCheckedColumns(checkedColumns)
    setInner_columns(newColumns)

  };

  const handleQueryClick = () => {
    // TODO you bug
    setQueryVisible(!queryVisible)

  };







  const renderTitle = () => {
    if (!showTitle) return <></>
    const { baseTitle, Query, showQuery, onSearch, history, selectedRowKeys, toQueryMethods, ...rest } = props;
    return (
      <div
        ref={queryRef}
        className={styles["global-base-table_title"]}
      >
        <div className={styles["global-base-table_title-operations"]}>
          <div className={styles["global-base-table_title-operations-left"]}>
            {showQuery ? (
              <OkButton
                className={styles["global-base-table_title-operations-left_filter"]}
                type="link"
                icon={<FilterOutlined />}
                onClick={handleQueryClick}
              >
                <div style={{ display: 'inline-flex', marginLeft: '5px' }}>
                  筛选
                  {queryVisible ? (
                    <CustomIcon type="icon-down"  />
                  ) : (
                    <CustomIcon type="icon-dropdown"  />
                  )}
                </div>
              </OkButton>
            ) : (
              <OkButton type="text" style={{ padding: '0 1px' }}>
                {baseTitle}
              </OkButton>
            )}
            {OtherActionsNode ?? null}
          </div>
          <div className={styles["global-base-table_title-operations-right"]}>
            {renderAdd()}
            {/* {renderTableConfig()} */}
          </div>
        </div>
        {
          Query ? <div
            className={classnames('global-base-table_title-query', {
              'global-base-table_title-query-hide': !(queryVisible && showQuery),
            })}
          >
            {/* true时导致重新渲染数据 */}
            {/* {queryVisible && showQuery && <Query onSearch={onSearch} />} */}
            {/* TODO 处理rest，多余属性过多 */}
            <Query
              {...rest}
              onSearch={onSearch}
              checkedColumns={checkedColumns}
              history={history}
              selectedRowKeys={selectedRowKeys}
              style={{ height: queryVisible ? 'auto' : 0 }}
              toQueryMethods={toQueryMethods}
            />
          </div> : null
        }
      </div>
    );
  };

  const tableRowDoubleClick = (record: any, event: any) => {
    const { onRowEvent } = props;
    onRowEvent?.tableRowDoubleClick?.(record, event);
  };

  const _mergedColumns = mergedColumns(inner_columns);
  // TODO fixed table header
  const restHeight = (queryRef.current?.clientHeight ?? 0) + (extraRef.current?.clientHeight ?? 0)
  // 如果一个页面多次引用此组件，则添加唯一标记id
  const selector = `#t_${tableId} thead.ant-table-thead`;

  console.log('scrollY', restHeight)
  return (
    <div className={classnames('global-base-table', className)} id={`t_${tableId}`}>
      {!isFucking广三 && renderTitle()}
      <div
        id="table-scrollContainer"
        className={classnames('global-base-table_table', {
          'table-cell-without-fix':
            (browserVersion.name === 'Chrome' && browserVersion.version && parseInt(browserVersion.version) < 58) ||
            browserVersion.name === 'unknow',
        })}
        style={{ height: `calc(100% - ${restHeight}px)`, overflow: 'visible' }}
      >
        <ContainerDimensions>
          {({ width, height }) => {
            const theadHeight = document.querySelector(selector)?.clientHeight || 0;
            const scrollY = height - theadHeight - 40;
            console.log('scrollY', height, scrollY, theadHeight)
            // console.log({ aa: height - theadHeight - 40 < 50, y: height - theadHeight - 40 });
            return (
              <LazyAntd.Table
                footer={isFucking广三 ? renderTitle : undefined}
                size={size}
                onRow={(record) => {
                  return {
                    onDoubleClick: (event) => {
                      tableRowDoubleClick(record, event);
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
                      x: scroll.x ?? '100%',
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
                columns={_mergedColumns}
                expandable={get(otherTableProps, 'expandable')}
                bordered={otherTableProps?.bordered ?? true}
                {...otherTableProps}
              />
            );
          }}
        </ContainerDimensions>
      </div>

      <div
        ref={extraRef}
        className={styles["global-base-table_extra-footer"]}
      >
        {!!ExtraFooter && <ExtraFooter selectedRowKeys={selectedRowKeys} onSearch={onSearch} />}
      </div>
    </div>
  );
}
