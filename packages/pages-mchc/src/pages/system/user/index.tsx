/*
 * @Author       : ZhongJun
 * @Date         : 2021-06-08
 * @Descriptions : 用户列表管理 包含查询、新增、修改、删除功能
 */

import React from 'react';
import { Popconfirm, Switch, Button, message, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import Table from './components/Table';
import Query from './components/Query';
import UsersModal from './components/UsersModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import { tableColumns } from './config/table';
import { processFromApi, toApi } from './config/adapter';
import { BaseListOld } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';

export default class UserList extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/users',
    baseTitle: '用户',
    needPagination: true,
    processFromApi,
    showAdd: true,
    showQuery: true,
    rowKey: 'id',
    tableColumns,
    Table,
    Query,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      visible: false,
      resetEditable: false,
      resetVisible: false,
    };
  }
  handleAdd = () => {
    this.setState({
      visible: true,
      editable: true,
    });
  }
  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '活跃状态',
      dataIndex: 'activated',
      showSorter: false,
      showFilter: false,
      key: 'activated',
      align: 'center',
      width: 65,
      render: (value: any, record: any) => {
        return <Switch size="small" defaultChecked={value} onChange={this.handleDisableUser(record)} />;
      },
    },
    {
      title: '操作',
      align: 'center',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 208,
      render: (value: any, record: any, index: any) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon" />}
              onClick={this.handleEdit(record)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              icon={<RedoOutlined className="global-table-action-icon" />}
              onClick={this.handleResetEdit(record)}
            >
              重置
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除这个${this.props.baseTitle}吗?`}
              onConfirm={this.handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" icon={<DeleteOutlined className="global-table-action-icon" />}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  handleEdit = (record: any) => () => {
    this.setState({
      visible: true,
      editable: true,
      id: record.id,
      primaryKey: record.login,
    });
  };

  handleResetCancel = () => {
    this.setState({
      resetVisible: false,
      resetEditable: false,
    });
  };

  handleResetEdit = (record: any) => () => {
    this.setState({
      resetVisible: true,
      resetEditable: true,
      id: record.id,
      currentRecord: record,
    });
  };

  handleDisableUser = (record: any) => async () => {
    const { baseUrl } = this.props;
    try {
      await request.put(
        baseUrl as string,
        toApi({
          ...record,
          roles: record.roles,
          activated: !record.activated,
        }),
      );
      message.success('切换用户状态成功');
    } catch (error) {
      console.log(error);
    }

    this.handleSearch();
  };

  renderOthersModal = () => {
    const { visible, editable, id, resetVisible, currentRecord, primaryKey } = this.state;
    return (
      <>
        <UsersModal
          id={id}
          primaryKey={primaryKey}
          visible={visible}
          editable={editable}
          onCancel={this.handleCancel}
          onSearch={this.handleQuerySearch}
          onSubmit={this.handleSubmit}
        />
        <ResetPasswordModal
          id={id}
          visible={resetVisible}
          dataSource={currentRecord}
          onCancel={this.handleResetCancel}
          onSearch={this.handleQuerySearch}
        />
      </>
    );
  };

  handleSubmit = async (data) => {
    try {
      let tip = '';
      let method = '';
      if (data.id) {
        tip = '修改用户成功';
        method = 'put';
      } else {
        tip = '添加用户成功';
        method = 'post';
      }
      await request[method]('/api/users', data);
      message.success(tip);
      this.handleCancel();
      this.handleQuerySearch();
    } catch (error) {
      if (error.status === 400) {
        message.error('该用户名已存在，请重新输入');
      }
    }
  };

  handleDelete = (record: any) => async () => {
    const { baseUrl, baseTitle } = this.props;
    await request.delete(`${baseUrl}/${record.login}`);
    message.success(`删除${baseTitle}成功`);
    this.handleSearch();
  };
}
