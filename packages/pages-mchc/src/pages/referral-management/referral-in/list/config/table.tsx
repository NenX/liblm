import { APP_CONFIG } from '@lm_fe/env';
import { Tag } from 'antd';
import React from 'react';
export const tableColumns = [
  {
    title: '姓名',
    dataIndex: ['pregnancy', 'name'],
    ellipsis: true,
    width: 86,
  },
  {
    title: '就诊卡号',
    dataIndex: ['pregnancy', 'outpatientNO'],
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    ellipsis: true,
  },
  {
    title: '年龄',
    dataIndex: ['pregnancy', 'age'],
    width: 56,
  },
  {
    title: '手机号码',
    dataIndex: ['pregnancy', 'telephone'],
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '高危等级',
    dataIndex: ['pregnancy', 'highriskGrade'],
    align: 'center',
    width: 68,
    render: (text: string) => {
      return text && <Tag style={{ marginRight: 0 }}>{text}</Tag>;
    },
  },
  {
    title: '转诊类型',
    dataIndex: 'referralDirection',
    width: 68,
    align: 'center',
    render: (value: number) => {
      let text = '';
      if (value === 1) text = '平级';
      if (value === 2) text = '上级';
      if (value === 3) text = '下级';
      return text && <Tag style={{ marginRight: 0 }}>{text}</Tag>;
    },
  },
  {
    title: '转入时间',
    dataIndex: 'referralDate',
    width: 86,
  },
  {
    title: '原单位',
    dataIndex: ['referralOrganization', 'name'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '原科室',
    dataIndex: 'referralDept',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '转入原因',
    dataIndex: 'reason',
    width: APP_CONFIG.CELL_WIDTH_LARGE,
  },
];
