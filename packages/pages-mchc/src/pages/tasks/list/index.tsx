import React from 'react';
import Table from './components/Table';
import Query from './components/Query';
import ModalForm from './components/ModalForm';
import { tableColumns } from './config/table';
import { get, omit } from 'lodash';
import { Button, Divider, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseListOld } from '@lm_fe/components_m';

export default class KnowledgesList extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/knowledge-tasks',
    baseTitle: '任务',
    needPagination: true,
    showQuery: true,
    showAdd: true,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    ModalForm,
    otherTableProps: {
      scroll: { x: 1278 },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
  }

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 158,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined className="global-table-action-icon" />}
              onClick={this.handleEdit(rowData)}
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
              <Button type="link" size="small" danger icon={<DeleteOutlined className="global-table-action-icon" />}>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  renderOthersModal = () => {
    const { ModalForm } = this.props;
    const { visible, editable, id } = this.state;

    return (
      visible && (
        <ModalForm
          visible={visible}
          editable={editable}
          id={id}
          onCancel={this.handleCancel}
          onSearch={this.handleSearch}
        />
      )
    );
  };
}
