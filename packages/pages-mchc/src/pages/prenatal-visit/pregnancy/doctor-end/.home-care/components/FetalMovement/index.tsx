import { LazyAntd } from '@lm_fe/components';
import { formatDateTime } from '@lm_fe/utils';
import React, { Component } from 'react';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default class Index extends Component {
  tableColumns = [
    {
      title: '日期',
      dataIndex: 'monitorDate',
      key: 'monitorDate',
      render: (text: any, record: any) => formatDateTime(text),
    },
    { title: '孕周', dataIndex: 'gw', key: 'gw' },
    {
      title: '第一次数胎动',
      children: [
        { title: '时长（分钟）', dataIndex: 'firstDuration', key: 'firstDuration' },
        { title: '次数（次）', dataIndex: 'firstCount', key: 'firstCount' },
      ],
    },
    {
      title: '第二次数胎动',
      children: [
        { title: '时长（分钟）', dataIndex: 'secondDuration', key: 'secondDuration' },
        { title: '次数（次）', dataIndex: 'secondCount', key: 'secondCount' },
      ],
    },
    {
      title: '第三次数胎动',
      children: [
        { title: '时长（分钟）', dataIndex: 'thirdDuration', key: 'thirdDuration' },
        { title: '次数（次）', dataIndex: 'thirdCount', key: 'thirdCount' },
      ],
    },
    { title: '总次数（次）', dataIndex: 'sumCount', key: 'sumCount' },
    {
      title: '12小时评估结果',
      dataIndex: 'result',
      key: 'result',
      render: (text: any, record: any) => this.getText(text),
    },
  ];

  getText = (text: string) => {
    if (text === '异常') {
      return <span style={{ color: 'red' }}>{text}</span>;
    }
    return <span>{text}</span>;
  };

  render() {
    const { fetalMovement } = this.props;
    return (
      <Table
        className="prenatal-visit-main-table"
        columns={this.tableColumns}
        dataSource={fetalMovement}
        pagination={false}
      />
    );
  }
}
