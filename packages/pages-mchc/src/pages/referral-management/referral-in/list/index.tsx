import React from 'react';
import { get } from 'lodash';
import { Button, Popconfirm, Divider, Drawer } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Table from './components/Table';
import Query from './components/Query';
import { tableColumns } from './config/table';
import { bindLifecycle } from 'react-keep-alive-pro';
import { BaseListOld } from '@lm_fe/components_m';
class ReferralInList extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    'referralType.equals': 2,
  };

  static defaultProps = {
    baseUrl: '/api/referrals',
    baseTitle: '转入记录',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作.',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 128,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon" />}
              onClick={(e) => this.handleView(rowData, e)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              placement="topRight"
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

  handleAdd = () => {
    // @ts-ignore
    const { history } = this.props;
    history.push('/referral-management/referral-in/add');
  };

  handleView = (record: any, e: any) => {
    e.stopPropagation();
    // @ts-ignore
    const { history } = this.props;
    const { id } = record;
    history.push(`/referral-management/referral-in/add?id=${id}`);
  };
  componentDidActivate() {
    this.handleSearch();
  }
}
export default bindLifecycle(ReferralInList);