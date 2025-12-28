import { LazyAntd } from '@lm_fe/components';
import { get } from 'lodash';
import React from 'react';
import BaseTableOld from 'src/BaseTableOld';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export default class ProductsTable extends BaseTableOld {
  renderTitle = () => {
    return <></>;
  };

  render() {
    const { columns, ...rest } = this.props;
    const mergedColumns = this.mergedColumns(columns);

    return (
      <Table
        size="small"
        style={{
          marginTop: 20,
          paddingBottom: 10,
          height: '100%',
          overflowY: 'scroll',
        }}
        {...rest}
        scroll={{ x: get(rest, 'scroll.x') || '100vw' }}
        columns={mergedColumns}
        title={this.renderTitle}
        className="global-base-table"
      />
    );
  }
}
