
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BaseListOld, formatTimeToUTC } from '@lm_fe/components_m';
import { request } from '@lm_fe/utils';
import { Button, Divider, message, Popconfirm } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, isFunction, map, set } from 'lodash';
import { isMoment } from 'dayjs()';
import React from 'react';
import Query from './components/Query';
import Table from './components/Table';
import { tableColumns } from './config/table';

export default class List extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/course-reservations',
    baseTitle: '预约',
    needPagination: true,
    showQuery: true,
    showAdd: false,
    showAction: true,
    needEditInTable: true,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1596 },
    },
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 186,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        const { needEditInTable } = this.props;
        // console.log('value',value);
        // status:0 未签到 1 已签到 2 已取消
        const editable = this.isEditing(rowData);
        if (needEditInTable && editable) {
          return (
            <>
              <Button size="small" className="table-action-btn" onClick={this.handleItemSave(rowData)}>
                保存
              </Button>
              <Button size="small" className="table-action-btn" onClick={this.handleItemCancel(rowData)}>
                取消
              </Button>
            </>
          );
        }

        return (
          <>
            {get(rowData, 'status') != '1' ? (
              <Button type="link" size="small" onClick={this.handleSign(rowData)}>
                <EditOutlined className="global-table-action-icon global-table-action-view" />
                签到
              </Button>
            ) : (
              <Button type="link" size="small" onClick={this.handleCancelSign(rowData)}>
                <EditOutlined className="global-table-action-icon global-table-action-view" />
                取消签到
              </Button>
            )}
            <Divider type="vertical" />
            <Button type="link" size="small" onClick={this.handleEdit(rowData)}>
              <EditOutlined
                className="global-table-action-icon global-table-action-view"
                style={{ color: rowData.status == 1 ? '#ccc' : rowData.status == 2 ? '#ccc' : '#0e318d' }}
              />
              编辑
            </Button>
            <Divider type="vertical" />

            <Popconfirm
              title={`确定要取消这个${get(this.props, 'baseTitle')}吗?`}
              onConfirm={this.handleDelete(rowData)}
              okText="确定"
              disabled={rowData.status == 1 ? true : rowData.status == 2 ? true : false}
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                disabled={rowData.status == 1 ? true : rowData.status == 2 ? true : false}
              >
                <DeleteOutlined
                  className="global-table-action-icon"
                  style={{ color: rowData.status == 1 ? '#ccc' : rowData.status == 2 ? '#ccc' : '#0e318d' }}
                />
                取消
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  handleDelete = (rowData: any) => async () => {
    const { baseUrl, baseTitle } = this.props;
    await request.get(`/api/courses/cancel-reservation`, {
      params: { pregnancyId: get(rowData, 'pregnancy.id'), courseId: get(rowData, 'course.id') },
    });
    message.success(`取消${baseTitle}成功`);
    this.handleSearch();
  };

  handleItemSave = (rowData: any) => async () => {
    const { baseUrl, baseTitle, toApi, needEditInTable, showAdd } = this.props;
    const { id } = this.state;
    const form = this.form as FormInstance;
    await this.form?.validateFields();
    const formData = form.getFieldsValue();
    map(formData, (data, key) => {
      if (isMoment(data)) {
        formData[key] = formatTimeToUTC(data);
      }
    });
    let method = 'put';
    let title = `编辑${baseTitle}成功`;
    if (!id && showAdd && needEditInTable) {
      method = 'post';
      title = `新增${baseTitle}成功`;
    }
    if (method == 'put') {
      set(rowData, 'pregnancy.telephone', get(formData, 'pregnancy.telephone'));
      set(rowData, `companionNum`, get(formData, 'companionNum'));
    }
    await request[method](
      baseUrl,
      isFunction(toApi)
        ? toApi({
          ...rowData,
        })
        : {
          ...rowData,
        },
    );
    form.resetFields();
    await this.setState({
      id: undefined,
      editKey: undefined,
    });
    message.success(title);
    await this.handleSearch();
  };
  handleSign = (rowData: any) => async () => {
    let title = `签到成功`;
    await request.put(`/api/course-reservations`, {
      ...rowData,
      status: 1,
    });
    message.success(title);
    await this.handleSearch();
  };
  handleCancelSign = (rowData: any) => async () => {
    let title = `取消签到成功`;
    await request.put(`/api/course-reservations`, {
      ...rowData,
      status: 2,
    });
    message.success(title);
    await this.handleSearch();
  };
}
