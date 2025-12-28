
import { message, Switch } from 'antd';
import classnames from 'classnames';
import { find, get, map } from 'lodash';
// import { ArticleModal, Query, Table } from './../components/index';
import Query from './../components/query';
import Table from './../components/table';
import ArticleModal from './../components/article-modal/article-modal';
import { departmentScope } from './../config/contants';
import requestMethods from '../request';
import { BaseListOld, CustomIcon } from '@lm_fe/components_m';
import './index.less';
import { APP_CONFIG } from '@lm_fe/env';
import React from 'react';

export default class List extends BaseListOld {
  static defaultProps = {
    baseUrl: '/api/medical-practices-departments',
    baseTitle: '我的知识库',
    needPagination: true,
    showQuery: true,
    showAdd: false,
    addText: '返回孕册',
    tableColumns: [], // transformToColumns(columns),
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1140 },
    },
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
    selectArticle: null,
  };

  columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
      render: (recordstate: any, rowData: any) => {
        return (
          <span className="table-title-span" onClick={this.handleTitleClick.bind(this, rowData)}>
            {recordstate}
          </span>
        );
      },
    },
    {
      title: '文章类型',
      dataIndex: 'type',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
      render: (recordstate: any, rowData: any) => {
        return recordstate == 1 ? '诊疗指南' : '科室流程';
      },
    },
    {
      title: '科室范围',
      dataIndex: 'departmentScope',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
      render: (recordstate: any, rowData: any) => {
        const data = recordstate && JSON.parse(recordstate);
        let str = '';
        map(data, (item, index) => {
          const val = get(
            find(departmentScope, (i) => i.key == item),
            `value`,
          );
          str += val + '; ';
        });
        return str;
      },
    },
    {
      title: '阅读状态',
      dataIndex: 'readingState',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
      render: (recordstate: any, rowData: any) => {
        return (
          <div className="read-content">
            <CustomIcon
              type={recordstate ? 'icon-finish' : 'icon-eyes'}
              className={`cus-icon ${recordstate ? 'icon-read' : 'icon-noread'}`}
            ></CustomIcon>
            <span className={classnames('noread', { read: recordstate })}>{recordstate ? '已读' : '未读'}</span>
          </div>
        );
      },
    },
    {
      title: '创建者',
      dataIndex: 'createDoctor',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      ellipsis: true,
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      align: 'center',
    },
    {
      title: '置顶',
      dataIndex: 'stickyReader',
      width: 68,
      ellipsis: true,
      align: 'center',
      fixed: 'right',
      render: (recordstate: any, rowData: any) => {
        return (
          <Switch
            disabled={get(rowData, `sticky`)}
            checked={get(rowData, `sticky`) || recordstate}
            onChange={this.releaseChange.bind(this, rowData)}
            size={'small'}
          />
        );
      },
    },
  ];
  async releaseChange(rowData: any, checked: boolean) {
    const postData = {
      ...rowData,
      stickyReader: checked,
    };
    await requestMethods.medicalTop(postData);
    this.handleSearch();
    message.success(`${checked ? '开启' : '关闭'}置顶`);
  }
  handleTitleClick(rowData: any) {
    this.changeState('visible', true);
    this.setState({ selectArticle: rowData });
    console.log({ rowData });
  }

  changeState(key: string, value: any) {
    this.setState({ [key]: value });
  }
  async handleSureRead(data: any) {
    await requestMethods.medicalRead(data);
    this.handleSearch();
  }


  renderOthersModal = () => {
    const { visible, selectArticle } = this.state;
    return visible ? (
      <ArticleModal
        visible={visible}
        articleData={selectArticle}
        onCancle={this.changeState.bind(this)}
        sureRead={this.handleSureRead.bind(this)}
      />
    ) : (
      <></>
    );
  };
}

// export default bindLifecycle(List);
