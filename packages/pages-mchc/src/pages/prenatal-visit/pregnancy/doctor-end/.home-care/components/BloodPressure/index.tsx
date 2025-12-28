import { LazyAntd } from '@lm_fe/components';
import { formatDateTime } from '@lm_fe/utils';
import { get } from 'lodash';
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
      title: '血压',
      dataIndex: 'bloodPressure',
      key: 'bloodPressure',
      render: (text: any, record: any) => this.getText(text, record),
    },
    {
      title: '脉搏',
      dataIndex: 'pulse',
      key: 'pulse',
      render: (text: any, record: any) => {
        return <span style={{ color: text < 60 || text > 100 ? 'red' : '' }}>{text}</span>;
      },
    },
  ];

  getText = (text: string, record: any) => {
    const systolic = get(record, 'systolic') || '';
    const diastolic = get(record, 'diastolic') || '';
    return (
      <>
        <span style={{ color: systolic < 90 || systolic > 130 ? 'red' : '' }}>{systolic}</span>/
        <span style={{ color: diastolic < 60 || diastolic > 90 ? 'red' : '' }}>{diastolic}</span>
      </>
    );
  };

  render() {
    const { bloodPressure } = this.props;
    return (
      <Table
        className="prenatal-visit-main-table"
        columns={this.tableColumns}
        dataSource={bloodPressure}
        pagination={false}
      />
    );
  }
}
