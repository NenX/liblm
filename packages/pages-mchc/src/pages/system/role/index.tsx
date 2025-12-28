import React from 'react';
import RoleTable from './components/RoleTable';
import RolesModal from './components/RolesModal';
import { tableColumns } from './config/table';
import { Popconfirm, Button, Row, Col, message, Divider } from 'antd';
import { get } from 'lodash';
import { processFromApi, toApi } from './config/adapter';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MenuPermissionCard from './components/MenuPermissionCard';
import ApiPermissionCard from './components/ApiPermissionCard';

import './index.less';
import { BaseListOld } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';

export default class Roles extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/groups',
    baseTitle: '角色1',
    needPagination: false,
    showQuery: false,
    tableColumns,
    rowKey: 'id',
    showAdd: false,
  };

  state = {
    dataSource: [],
    menuDataSource: [],
    visible: false,
    editable: false,
    id: undefined,
    defaultCheckedMenu: [],
    activeRole: {},
  };

  roleColumns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      align: 'center',
      width: 136,
      render: (value: any, rowData: any) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon" />}
              onClick={() => {
                this.setState({
                  visible: true,
                  editable: true,
                  id: rowData.id,
                });
              }}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`确定要删除这个${get(this.props, 'baseTitle')}吗?`}
              onConfirm={this.handleDelete(rowData)}
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

  handleSearch = async () => {
    const { baseUrl, needPagination } = this.props;
    const dataSource = processFromApi((await request.get(baseUrl as string)).data);
    let total = 0;
    if (needPagination) {
      total = (await request.get(`${baseUrl}/count`)).data;
    }
    this.setState({ dataSource, total });
  };

  handleRowClick = (rowData: any) => (e: any) => {
    this.setState({
      defaultCheckedMenu: get(rowData, 'permissions'),
      activeRole: rowData,
    });
  };

  setRowClassName = (rowData: any) => {
    const { activeRole } = this.state;
    if (get(rowData, 'id') === get(activeRole, 'id')) {
      return 'table-row-active';
    }
    return '';
  };

  handleSaveApiPermission = async (checkedData: any[]) => {
    const { activeRole } = this.state;
    const { baseUrl } = this.props;
    try {
      await request.put(baseUrl as string, toApi({ ...activeRole, authorities: checkedData }));
      message.success('保存 API 权限成功');
      await this.handleSearch();
    } catch (error) {
      console.log(error);
    }
  };

  handleSaveMenuPermission = async (checkedData: any[]) => {
    const { activeRole } = this.state;
    const { baseUrl } = this.props;
    try {
      await request.put(baseUrl as string, toApi({ ...activeRole, permissions: checkedData }));
      message.success('保存菜单/权限成功');
      await this.handleSearch();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { baseTitle } = this.props;
    const { dataSource, visible, editable, id, activeRole } = this.state;

    return (
      <>
        <Row gutter={12} className="role-wrap">
          <Col flex="700px">
            <RoleTable
              columns={this.roleColumns}
              dataSource={dataSource}
              onAdd={() => {
                this.setState({
                  visible: true,
                  editable: true,
                });
              }}
              pagination={false}
              rowClassName={this.setRowClassName}
              onRow={(record: any) => {
                return {
                  onClick: this.handleRowClick(record),
                };
              }}
              baseTitle={baseTitle}
              scroll={{}}
            />
          </Col>
          <Col flex="1">
            <MenuPermissionCard
              key={get(activeRole, 'id')}
              role={activeRole}
              onSaveMenuPermission={this.handleSaveMenuPermission}
            />
          </Col>
          <Col flex="1">
            <ApiPermissionCard
              key={get(activeRole, 'id')}
              role={activeRole}
              onSaveApiPermission={this.handleSaveApiPermission}
            />
          </Col>
        </Row>
        {visible && (
          <RolesModal
            visible={visible}
            editable={editable}
            id={id}
            onCancel={this.handleCancel}
            onSearch={this.handleSearch}
          />
        )}
      </>
    );
  }
}
