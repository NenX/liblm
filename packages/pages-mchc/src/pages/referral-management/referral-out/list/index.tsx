import React from 'react';
import { get } from 'lodash';
import { Button, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import Table from './components/Table';
import Query from './components/Query';
import { tableColumns } from './config/table';
import store from 'store';
import { bindLifecycle } from 'react-keep-alive-pro';
import { BaseListOld,  } from '@lm_fe/components_m';
import { mchcModal__ } from '@lm_fe/pages';
class List extends BaseListOld {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    ['referralType.equals']: 1,
  };
  state = {
    total: 0,
    defaultQuery: this.staticDefaultQuery,
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
    visible: false,
    editable: false,
    id: undefined,
    editKey: undefined,
    loading: false,
    isSearchColumnModal: false,
    printId: '',
  };

  static defaultProps = {
    baseUrl: '/api/referrals',
    baseTitle: '转出记录',
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
      width: 196,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon" />}
              onClick={this.handleView(rowData)}
            >
              查看
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<PrinterOutlined className="global-table-action-icon" />}
              onClick={this.handlePrint.bind(this, rowData)}
            >
              打印
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
    history.push('/referral-management/referral-out/add');
  };

  handleView = (rowData: any) => () => {
    // @ts-ignore
    const { history } = this.props;
    const { id } = rowData;
    history.push(`/referral-management/referral-out/add?id=${id}`);
  };

  handlePrint(rowData: any) {
    console.log({ rowData });
    const localData = store.get('localData');

    mchcModal__.open('print_modal', {
      modal_data: {
        requestData: {
          url: '/api/pdf-preview',
          resource: 'referral',
          template: get(localData, `referralStyle`, 2),
          version: '',
          note: '',
          id: get(rowData, `id`),
        }
      }
    })

  }

  componentDidActivate() {
    this.handleSearch();
  }
}
export default bindLifecycle(List);