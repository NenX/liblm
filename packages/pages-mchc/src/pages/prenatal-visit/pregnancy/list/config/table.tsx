
import { APP_CONFIG, MyBaseTableProps } from '@lm_fe/components_m';
import { rt_ctx } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';
import { EMPTY_PLACEHOLDER } from '@lm_fe/utils';
const ctx = rt_ctx
const React = ctx.React
export default defineFormConfig([
  {
    title: '就诊卡号',
    dataIndex: 'outpatientNO',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,

    align: 'center',
  },
  {
    title: '孕妇姓名',
    dataIndex: 'name',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,

  },
  {
    title: '年龄',
    dataIndex: 'age',

    width: 42,
  },
  {
    title: '孕周',
    dataIndex: 'currentGestationalWeek',
    width: 52,

  },
  {
    title: '证件号码',
    dataIndex: 'idNO',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_MIDDLE + 20,

  },
  {
    title: '预产期-日期',
    dataIndex: 'edd',
    width: APP_CONFIG.CELL_WIDTH_SMALL,

  },
  {
    title: '预产期-B超',
    dataIndex: 'sureEdd',
    width: APP_CONFIG.CELL_WIDTH_SMALL,

  },
  {
    title: '孕/产',
    dataIndex: 'gravidity',
    width: 60,
    align: 'center',
    render: (value: any, rowData: any) => ctx.utils.format_gp(rowData),


  },
  {
    title: '产检编号',
    dataIndex: 'checkupNO',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,

  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL + 20,

  },
  {
    title: '审核日期',
    dataIndex: 'validateDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any, rowData: any) => {
      return ctx.utils.formatDate(value);
    },
  },
  {
    title: '创建日期',
    dataIndex: 'createDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any, rowData: any) => {
      return ctx.utils.formatDate(value);
    },
  },
  {
    title: '审核人',
    dataIndex: 'auditorName',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '档案状态',
    dataIndex: 'recordstate',
    width: 76,
    align: 'center',
    render: (state: any, rowData: any) => {
      const id = rowData.id
      const label = ctx.mchcEnv.get_option_label('档案状态', state)
      const Button = ctx.ui.Button
      if (label === '已审核' || label === '已结案') {
        const className = label === '已审核' ? 'egister_2' : ''
        return (
          <Button
            size="small"
            onClick={() => {
              ctx.safeTo(`/prenatal-visit/pregnancy/nurse-end?id=${id}`, { id });
            }}
            className={`egister_ ${className}`}
          >
            {label}
          </Button>
        );
      }
      return (
        <Button
          size="small"
          onClick={() => {
            ctx.safeTo(`/prenatal-visit/pregnancy/check?id=${id}`, { id })
          }}
          className={`egister_ egister_1`}
        >
          {label}
        </Button>
      );
    },
  },
  // {
  //   title: '客服专员',
  //   dataIndex: 'customerService',
  //   width: APP_CONFIG.CELL_WIDTH_SMALL,
  //   inputType: 'dictionary_select_in_table',
  //   inputProps: { type: 'select', mode: 'single', boxSpan: 6, uniqueKey: 'Common.customerService' },
  //   render: (value) => {
  //     return <DictionarySelect.Display uniqueKey="Common.customerService" value={value} />;
  //   },
  // },
])