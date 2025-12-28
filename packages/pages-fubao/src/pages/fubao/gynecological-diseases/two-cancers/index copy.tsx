import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { BaseListOld as BaseList, fubaoHistoryPush } from '@lm_fe/components_m';
import { fubaoRequest as request } from '@lm_fe/utils';
import { Button, Divider, message, Popconfirm } from 'antd';
import { get, isArray, isNil } from 'lodash';
import React from 'react';
import Query from './components/Query';
import Table from './components/Table';
import { tableColumns } from './config/table';
import { Follow_up_btn } from './.两癌随访';



class List extends BaseList {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
    'deleteFlag.equals': 0,
  };
  static defaultProps = {
    baseUrl: '/api/two/cancer/screening/getTwoCancerScreeningFile', request,
    baseTitle: '两癌筛查',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1298 },
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
            <Follow_up_btn handleSearch={() => { }} rowData={rowData} />

            <Divider type="vertical" />

            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon global-table-action-view" />}
              onClick={this.handleEdit(rowData)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon global-table-action-edit" />}
              onClick={this.handleView(rowData)}
            >
              筛查
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
    const res = (await request.get(`${baseUrl}/page`, { params: query })).data
    if (isArray(res.data.pageData)) {
      dataSource = res.data.pageData;
    }
    if (!isNaN(Number(res.data.totalElements))) {
      total = Number(res.data.totalElements);
    }
    this.setState({ dataSource, total, loading: false });
  };

  handleAdd = () => {
    const { history } = this.props as any;
    fubaoHistoryPush('/gynecological-diseases/two-cancers/add', this.props as any);
  };

  handleView = (rowData: any) => () => {
    const { id } = rowData;
    const { history } = this.props as any;
    fubaoHistoryPush(`/gynecological-diseases/two-cancers/exam?id=${id}`, this.props as any);
  };

  handleEdit = (rowData: any) => () => {
    const { id } = rowData;
    const { history } = this.props as any;
    fubaoHistoryPush(`/gynecological-diseases/two-cancers/edit?id=${id}`, this.props as any);
  };

  handleDelete = (rowData: any) => async () => {
    const res = await request.delete(`/api/two/cancer/screening/deleteTwoCancerScreeningFile/${get(rowData, 'id')}`);

    this.handleSearch();
  };
}
export default List
