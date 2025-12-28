import { APP_CONFIG } from '@lm_fe/env';
import { Tag } from 'antd';

export const tableColumns = [
  {
    title: '姓名',
    dataIndex: ['pregnancy', 'name'],
    width: 86,
    ellipsis: true,
  },
  {
    title: '就诊卡号',
    dataIndex: ['pregnancy', 'outpatientNO'],
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '年龄',
    dataIndex: ['pregnancy', 'age'],
    width: 46,
  },
  {
    title: '手机号码',
    dataIndex: ['pregnancy', 'telephone'],
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '高危等级',
    dataIndex: ['pregnancy', 'highriskGrade'],
    width: 68,
    align: 'center',
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
    title: '转出时间',
    dataIndex: 'referralDate',
    width: 86,
  },
  {
    title: '转至单位',
    dataIndex: ['referralOrganization', 'name'],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '转至科室',
    dataIndex: 'referralDept',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '转出原因',
    dataIndex: 'reason',
    width: APP_CONFIG.CELL_WIDTH_LARGE,
  },
];
