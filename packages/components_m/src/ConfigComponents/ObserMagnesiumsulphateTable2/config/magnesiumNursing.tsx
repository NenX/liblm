/**
 * 产科注射硫酸镁观察表
 */
import { MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import dayjs from 'dayjs';
import { APP_CONFIG } from '../../../utils/constants';
export const tableColumns: any = [
  {
    title: '日期',
    dataIndex: 'recordTime',
    align: 'center',
    width: 200,
    editable: true,
    inputType: 'DateTimeInput',
    inputProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      setDefaultValue: true,
    },

    render: (value, data) => {
      return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '';
    },
  },

  {
    title: '呼吸',
    dataIndex: 'breath',
    align: 'center',
    editable: true,
    inputType: 'MyInput',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '膝反射',
    dataIndex: 'kneeJerk',
    align: 'center',
    editable: true,
    inputType: 'MyAutoComplete',
    inputProps: { optionKey: '膝反射s' },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '尿量',
    align: 'center',
    dataIndex: 'urineVolume',
    editable: true,
    inputType: 'MyInput',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '滴速g/h',
    dataIndex: 'speed',
    editable: true,
    align: 'center',
    inputType: 'MyInput',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '护士签名',
    dataIndex: 'sign',
    editable: true,
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'TextArea',
    inputProps: { type: MODAL_TEMPLATE_TYPES.科室个人, isPop: true, rows: 10 },
    fixed: 'right',
  },
];
