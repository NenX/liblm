import { LazyAntd } from '@lm_fe/components';
import { Browser } from '@lm_fe/utils';
import { Space } from 'antd';
import { TableProps } from 'antd/lib/table';
import { get, map } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


// 不限定默认格子宽度
const TABLE_CELL_WIDTH = 200;
const browserClient = Browser.client || {};
export interface MyBaseTableProps extends TableProps<any> {
  columns?: any;
  renderTitle?(): React.ReactNode
  otherTableProps?: any,
}
export const MyBaseTable: FC<MyBaseTableProps> = function MyBaseTable(props) {
  const {
    otherTableProps,
    scroll,
    components,
    style,
    pagination,
    loading,
    columns,
    renderTitle,
    ...rest
  } = props;

  // const queryRef = useRef<HTMLDivElement>(null)
  const [_columns, set_columns] = useState<any>()




  useEffect(() => {
    set_columns(columns)
    console.log('columns', columns)
    return () => {
    }
  }, [columns])






  const mergedColumns = (columns: any) => {
    return map(columns, (column: any, index) => {
      const { width, } = column;
      const cellHeaderAction = {};


      return {
        align: 'left',
        ...column,
        ...cellHeaderAction,
        width: width || TABLE_CELL_WIDTH,
      };
    });
  };












  const _mergedColumns = mergedColumns(_columns);


  return (
    <div className="global-base-table" id="global-base-table">
      {renderTitle?.()}


      <Table
        bordered
        loading={loading}
        pagination={false}
        title={undefined}
        style={{
          padding: '0 12px',
          // height: `calc(100% - 0px)`,
          // overflow:'scroll'
        }}
        components={{
          // header: {
          //   cell: ResizableTitle,
          // },
          ...components,
        }}
        scroll={{
          scrollToFirstRowOnChange: true,
          x: get(otherTableProps, 'scroll.x') || 'calc(100px)',
          y: get(otherTableProps, 'scroll.y') || (browserClient.clientHeight < 900 ? browserClient.clientHeight - 300 : 700),
          ...scroll,
        }}
        // sticky={
        //   browserVersion.version &&
        //   parseInt(browserVersion.version) > 50 && {
        //     offsetScroll: 2,
        //     getContainer: () => document.getElementById('scrollContainer') || window,
        //   }
        // }
        {...otherTableProps}
        {...rest}
        columns={_mergedColumns}
      />
      <div className="global-base-table_footer">
        {pagination && <Space>
          <Pagination defaultCurrent={1} size="small" {...pagination} />
          <span>总数: {pagination.total}条</span>
        </Space>}
      </div>
    </div>
  );
}