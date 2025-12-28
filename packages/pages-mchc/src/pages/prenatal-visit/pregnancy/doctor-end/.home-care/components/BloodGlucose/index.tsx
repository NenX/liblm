import { LazyAntd } from '@lm_fe/components';
import { formatDateTime } from '@lm_fe/utils';
import React, { Component } from 'react';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const _symbol = '-';
function getRemark(note: string, Exercise: string) {
  if (note && !Exercise) {
    return note;
  } else if (!note && Exercise) {
    return Exercise;
  } else if (note && Exercise) {
    return note + _symbol + Exercise;
  } else {
    return '';
  }
}

export default class Index extends Component {
  tableColumns = [
    {
      title: '日期',
      dataIndex: 'monitorDate',
      key: 'monitorDate',
      render: (text: any,) => formatDateTime(text,),
    },
    { title: '孕周', dataIndex: 'gw', key: 'gw' },
    {
      title: '早餐前',
      dataIndex: 'preBreakfast',
      key: 'preBreakfast',
      render: (text: any, record: any) => this.getText(text, record, '餐前'),
    },
    {
      title: '备注',
      dataIndex: 'preBreakfastNoteNote',
      key: 'preBreakfastNoteNote',
      render: (text: any, record: any) => {
        return getRemark(record['preBreakfastNote'], record['preBreakfastExercise']);
      },
    },
    {
      title: '早餐后2h',
      dataIndex: 'pastBreakfast',
      key: 'pastBreakfast',
      render: (text: any, record: any) => this.getText(text, record, '餐后'),
    },
    {
      title: '备注',
      dataIndex: 'pastBreakfastNote',
      key: 'pastBreakfastNote',
      render: (text: any, record: any) => {
        return getRemark(record['pastBreakfastNote'], record['pastBreakfastExercise']);
      },
    },
    {
      title: '午餐前',
      dataIndex: 'preLunch',
      key: 'preLunch',
      render: (text: any, record: any) => this.getText(text, record, '餐前'),
    },
    {
      title: '备注',
      dataIndex: 'preLunchNote',
      key: 'preLunchNote',
      render: (text: any, record: any) => {
        return getRemark(record['preLunchNote'], record['preLunchExercise']);
      },
    },
    {
      title: '午餐后2h',
      dataIndex: 'pastLunch',
      key: 'pastLunch',
      render: (text: any, record: any) => this.getText(text, record, '餐后'),
    },
    {
      title: '备注',
      dataIndex: 'pastLunchNote',
      key: 'pastLunchNote',
      render: (text: any, record: any) => {
        return getRemark(record['pastLunchNote'], record['pastLunchExercise']);
      },
    },
    {
      title: '晚餐前',
      dataIndex: 'preDinner',
      key: 'preDinner',
      render: (text: any, record: any) => this.getText(text, record, '餐前'),
    },
    {
      title: '备注',
      dataIndex: 'preDinnerNote',
      key: 'preDinnerNote',
      render: (text: any, record: any) => {
        return getRemark(record['preDinnerNote'], record['preDinnerExercise']);
      },
    },
    {
      title: '晚餐后2h',
      dataIndex: 'pastDinner',
      key: 'pastDinner',
      render: (text: any, record: any) => this.getText(text, record, '餐后'),
    },
    {
      title: '备注',
      dataIndex: 'pastDinnerNote',
      key: 'pastDinnerNote',
      render: (text: any, record: any) => {
        return getRemark(record['pastDinnerNote'], record['pastDinnerExercise']);
      },
    },
    {
      title: '睡前',
      dataIndex: 'preSleep',
      key: 'preSleep',
      render: (text: any, record: any) => this.getText(text, record, '空腹'),
    },
    {
      title: '备注',
      dataIndex: 'preSleepNote',
      key: 'preSleepNote',
      render: (text: any, record: any) => {
        return getRemark(record['preSleepNote'], record['preSleepExercise']);
      },
    },
  ];

  getText = (text: string, record: any, index: '空腹' | '餐前' | '餐后') => {
    if (index === '空腹' && Number(text) > 5.3) {
      return <span style={{ color: 'red' }}>{text}⇧</span>;
    }
    if (index === '餐前' && Number(text) > 5.6) {
      return <span style={{ color: 'red' }}>{text}⇧</span>;
    }
    if (index === '餐后' && Number(text) > 6.7) {
      return <span style={{ color: 'red' }}>{text}⇧</span>;
    }
    return text;
  };

  render() {
    const { bloodGlucose } = this.props;
    return (
      <Table
        className="prenatal-visit-main-table"
        columns={this.tableColumns}
        dataSource={bloodGlucose}
        pagination={false}
      />
    );
  }
}
