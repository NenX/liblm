import React from 'react';
import Table from './components/Table';
import Query, { queryValues } from './components/Query';
import { tableColumns } from './config/table';
import { Button } from 'antd';
import { EyeOutlined, ImportOutlined } from '@ant-design/icons';
import { request } from '@lm_fe/utils';
import { map, concat, keyBy, values } from 'lodash';
import BaseListOld from 'src/BaseListOld';
export default class List extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/wives',
    baseTitle: '档案',
    needPagination: true,
    showQuery: true,
    showAdd: false,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 500 },
    },
  };

  state = {
    total: 0,
    defaultQuery: {
      page: 0,
      size: 5,
    },
    dataSource: [],
    visible: false,
    editable: false,
    id: undefined,
    loading: true,
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      align: 'center',
      width: 150,
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button className="table-action-btn" onClick={this.handleView(rowData)}>
              <EyeOutlined title="查看" />
            </Button>
            <Button title="导入" className="table-action-btn" type="primary" onClick={this.handleExport(rowData)}>
              <ImportOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  handleView = (rowData: any) => () => {
    const { id } = rowData;
    const { history } = this.props;
    history.push(`/premarital-care/wife/edit?id=${id}`);
  };

  handleExport = (rowData: any) => () => {
    const { onExport } = this.props;
    onExport && onExport(rowData);
  };

  handleQuerySearch = async (data: object) => {
    this.setState({
      loading: true,
    });
    await this.handleSearch(data);
    this.setState({
      loading: false,
    });
  };

  // TODO: 分页优化
  handleSearch = async (data: any = {}) => {
    const { queryValue } = data;
    const { baseUrl, needPagination } = this.props;
    const { defaultQuery } = this.state;
    let dataSource: any[] = [];
    for (let index = 0; index < queryValues.length; index++) {
      const value = queryValues[index];
      let query = {
        ...defaultQuery,
        [`${value}.contains`]: queryValue,
      };
      const tempData = await request.get(`${baseUrl}`, { params: query });
      dataSource = concat(dataSource, tempData);
    }
    dataSource = values(keyBy(dataSource, 'id'));
    let total = 0;
    // if (needPagination) {
    //   total = await request.get(`${baseUrl}/count`);
    // }
    this.setState({ dataSource, total, loading: false });
  };
}
