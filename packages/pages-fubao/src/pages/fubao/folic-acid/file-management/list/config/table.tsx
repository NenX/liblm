import { APP_CONFIG } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SLocal_State } from '@lm_fe/service';
import { expect_array, formatDate, safe_json_parse } from '@lm_fe/utils';
import { map, get } from 'lodash';

const hashMap = new Map([
  [0, '无'],
  [1, '既往生育神经缺陷胎儿'],
  [2, '服用抗癫痫药物'],
  [3, '其他'],
]);

export const tableColumns: IMchc_FormDescriptions_Field_Nullable[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    required: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    layout: '1/2',
  },
  {
    title: '年龄(岁)',
    dataIndex: 'age',
    layout: '1/2',
    width: 58,
  },
  {
    title: '手机号码',
    layout: '1/2',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '证件类型',
    layout: '1/2',
    dataIndex: 'idType',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'MS',
    inputProps: {
      optionKey: '证件类型',
      marshal: 0
    }
  },
  {
    layout: '1/2',
    title: '证件号码',
    dataIndex: 'idNO',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '建档日期',
    layout: '1/2',
    dataIndex: 'filingDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    inputType: 'DatePicker'
  },
  {
    title: '高危因素',
    dataIndex: 'highRiskFactors',
    layout: '1/1',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    inputType: 'MC',
    inputProps: {
      options: '无,既往生育神经缺陷胎儿,服用抗癫痫药物,其他',
      type: 'multiple',
    },
    processRemote(v, form) {
      const obj = safe_json_parse(v, {})
      if (Array.isArray(obj)) return obj
      const checkedValues = expect_array(obj.checkedValues)
      console.log('checkedValues', { checkedValues })
      return checkedValues.map(_ => ({ value: _ }))
    }
  },

  {
    "dataIndex": "folateDistributionRecords",
    title: '发放叶酸',
    layout: '1/1',
    hidden: true,
    "inputType": "MyEditTable",


    inputProps: {
      marshal: 0,
      showEdit: true,
      genRowData(list) { return { issueDate: formatDate(), effectiveDateBegin: formatDate(), registerPerson: SLocal_State.getUserData().login } },
      // frontCols: [{ title: '序号', render(a, b, c) { return c + 1 }, align: 'center', width: 86 }],
      formDescriptions: [
        {

          dataIndex: 'issueDate',
          title: '发放日期',
          inputType: 'DatePicker',
        },
        {
          dataIndex: 'currentStage',
          title: '当前阶段',
          inputType: 'MA',
          inputProps: {
            options: '备孕,孕早期',
          },
        },
        {
          dataIndex: 'gestationalWeek',
          title: '孕周',
          inputType: 'MA',
        },
        {
          dataIndex: 'issueNumber',
          title: '发放数量(瓶)',
          inputType: 'MA',
        },
        {
          "title": "有效日期",
          dataIndex: 'effectiveDate',
          inputType: 'ArrayInput',
          width: 240,
          inputProps: {
            options: [
              { inputType: 'DatePicker' },
              { inputType: 'DatePicker' },
            ]
          },
          processRemote(v?: string,) {
            const arr = safe_json_parse(v)
            if (Array.isArray(arr)) return arr
            const obj = v?.split?.('~') ?? []

            return JSON.stringify(obj)
          }
        },
        {
          dataIndex: 'registerPerson',
          title: '登记者',
          inputType: 'MA',
        },
        {

          dataIndex: 'followUpDate',
          title: '随访时间',
          inputType: 'DatePicker',
        },
        {
          dataIndex: 'followUpCondition',
          title: '随访情况',
          inputType: 'MA',
          inputProps: {
            options: '正常,号码错误,未接听',
          },
        },
        {
          dataIndex: 'followUpWay',
          title: '随访方式',
          inputType: 'MA',
          inputProps: {
            options: '电话,微信,现场',
          },
        },
        {
          dataIndex: 'takeCondition',
          title: '服用情况',
          inputType: 'MA',
          inputProps: {
            options: '规律,间断,未服',
          },
        },

        { "dataIndex": "remark", "title": "备注", inputType: 'MA', }
      ]
    },


  }
];
