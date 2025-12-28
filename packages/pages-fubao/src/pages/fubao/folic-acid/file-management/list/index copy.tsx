import React from 'react';
import { map, isNil, isArray } from 'lodash';
import Table from './components/Table';
import Query from './components/Query';
import { tableColumns } from './config/table';
import { Button, Popconfirm, Divider, message } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { BaseListOld } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';

class List extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
    'deleteFlag.equals': 0,
  };
  static defaultProps = {
    baseUrl: '/api/getFolateManagementFile',
    addText: '发放叶酸',
    baseTitle: '档案',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    tableColumns: tableColumns, // transformToColumns(columns),
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1140 },
    },
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 200,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon global-table-action-view" />}
              onClick={this.handleEdit(rowData)}
            >
              发放叶酸
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon global-table-action-edit" />}
              onClick={this.handleView(rowData)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除这个${get(this.props, 'baseTitle')}吗?`}
              onConfirm={this.handleDelete(rowData)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined className="global-table-action-icon global-table-action-delete" />}
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  async componentDidActivate() {
    this.handleSearch();
  }

  handleSearch = async () => {
    const { editKey, defaultQuery } = this.state;
    const { baseUrl } = this.props;
    if (!baseUrl) {
      return;
    }
    if (!isNil(editKey)) {
      message.error('请保存未保存的记录');
      return;
    }
    this.setState({ loading: true });
    let dataSource = [];
    let total = 0;
    const query = this.formatQuery(defaultQuery);
    const res = (await request.get(`${baseUrl}/page`, { params: query })).data;
    if (isArray(res.data.pageData)) {
      dataSource = res.data.pageData;
    }
    if (!isNaN(Number(res.data.totalElements))) {
      total = Number(res.data.totalElements);
    }
    this.setState({ dataSource, total, loading: false });
  };

  handleAdd = () => {
    // @ts-ignore
    const { history } = this.props;
    history.push('/fubao/folic-acid/file-management/add');
  };

  handleView = (rowData: any) => () => {
    const { id } = rowData;
    // @ts-ignore
    const { history } = this.props;
    history.push(`/fubao/folic-acid/file-management/edit?id=${id}`);
  };

  handleEdit = (rowData: any) => () => {
    const { id } = rowData;
    // @ts-ignore
    const { history } = this.props;
    history.push(`/fubao/folic-acid/file-management/edit?id=${id}`);
  };

  handleDelete = (rowData: any) => async () => {
    const res = (await request.delete(`/api/deleteFolateManagementFile/${get(rowData, 'id')}`)).data;
    if (get(res, 'code') === 1) {
      message.success(get(res, 'data'));
    } else {
      message.warning(get(res, 'data'));
    }
    this.handleSearch();
  };
}

export default List
