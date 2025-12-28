import React from 'react';
import { get } from 'lodash';
import { APP_CONFIG } from '@lm_fe/env';
import { formatTimeToStandard, GeneralComponents_DictionarySelect_Display } from '@lm_fe/components_m';

export const tableColumns = [
  {
    title: '就诊卡号',
    dataIndex: ['outpatientNO'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '姓名',
    dataIndex: ['name'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '任务标题',
    dataIndex: ['title'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '推送内容类型',
    dataIndex: ['contentType'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    render: (value) => <GeneralComponents_DictionarySelect_Display value={value} uniqueKey="Task.contentType" />,
  },
  {
    title: '推送内容',
    dataIndex: 'content',
    width: APP_CONFIG.CELL_WIDTH_LARGE + 100,
    ellipsis: true,
    // render: (value, rowData) => {
    //   const contentType = get(rowData, 'contentType');
    //   let educationContent = value;
    //   if (contentType === 1) {
    //     educationContent = get(rowData, 'knowledge.title');
    //   }
    //   if (contentType === 2) {
    //     educationContent = get(rowData, 'video.title');
    //   }
    //   if (contentType === 3) {
    //     educationContent = get(rowData, 'url');
    //   }
    //   if (contentType === 4) {
    //     educationContent = get(rowData, 'workQuestion.title');
    //   }

    //   return educationContent;
    // },
  },
  {
    title: '推送时间',
    dataIndex: 'pushTime',
    width: APP_CONFIG.CELL_WIDTH_LARGE,
    render: (value) => formatTimeToStandard(value),
  },
  {
    title: '推送状态',
    dataIndex: 'pushStatus',
    inputType: 'MS',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    // render: (value) => <GeneralComponents_DictionarySelect_Display uniqueKey="Task.runStatus" value={value} />,
    inputProps: {
      optionKey: '推送状态'
    }
  },
  {
    title: '推送情况说明',
    dataIndex: 'pushNote',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
];
