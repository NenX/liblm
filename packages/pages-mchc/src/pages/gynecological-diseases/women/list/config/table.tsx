import { APP_CONFIG } from "@lm_fe/components_m"
import { defineFormConfig } from "@lm_fe/service";
const required = true
export default defineFormConfig(
  [

    {
      title: '检查编号',
      dataIndex: 'archivesNO',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      layout: '1/3',
      ellipsis: true,
    },
    {
      title: '门诊号',
      dataIndex: 'outpatientNO',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      required,
      ellipsis: true,
      layout: '1/3',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      required,
      width: 86,
      layout: '1/3',
      ellipsis: true,
    },
    {
      title: '设备读取',
      dataIndex: 'insuranceType',
      inputType: 'IdNOButton',
      layout: '1/3',
      hidden: true,
    },
    // {
    //   title: '社保卡类型',
    //   dataIndex: 'insuranceType',
    //   inputType: 'MA',
    //   layout: '1/3',
    //   hidden: true,
    // },

    {
      title: '年龄',
      dataIndex: 'age',
      inputType: 'input_number',
      required,
      layout: '1/3',
      width: 42,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      inputType: 'MS',
      inputProps: { optionKey: '性别2', marshal: 0, },
      layout: '1/3',
      width: 42,
    },
    {
      title: '出生日期',
      dataIndex: 'dob',
      required,
      layout: '1/3',
      inputType: 'DatePicker',
      width: APP_CONFIG.CELL_WIDTH_SMALL - 10,
    },
    {
      title: '证件类型',
      layout: '1/3',
      required,
      inputType: 'MS',
      inputProps: { optionKey: '证件类型', marshal: 0, },
      dataIndex: 'idType',
      hidden: true,
      width: 80,
    },
    {
      title: '证件号码',
      dataIndex: 'idNO',
      width: APP_CONFIG.CELL_WIDTH_MIDDLE + 20,
      required,
      layout: '1/3',
      ellipsis: true,
    },
    {
      title: '国籍',
      layout: '1/3',
      inputType: 'MA',
      inputProps: { optionKey: '国家s' },
      dataIndex: 'nationality',
      hidden: true,
    },
    {
      title: '籍贯',
      layout: '1/3',
      required,
      inputType: 'MA',
      inputProps: { optionKey: '省份s' },
      dataIndex: 'nativeplace',
      hidden: true,
    },
    {
      title: '民族',
      required,
      layout: '1/3',
      inputType: 'MA',
      inputProps: { optionKey: '民族s' },
      dataIndex: 'ethnic',
      hidden: true,
    },

    {
      title: '联系电话',
      required,
      dataIndex: 'telephone',
      width: APP_CONFIG.CELL_WIDTH_SMALL,
      layout: '1/3',
      ellipsis: true,
    },

    //
    {
      title: '婚姻状况',
      layout: '1/3',
      required,
      inputType: 'MS',
      inputProps: { optionKey: '婚姻', marshal: 0, },
      dataIndex: 'maritalStatus',
      hidden: true,
    },
    {
      title: '近亲结婚',
      layout: '1/3',
      inputType: 'MS',
      inputProps: { options: [{ label: '否', value: false }, { label: '是', value: true }], marshal: 0, },
      dataIndex: 'nearRelation',
      hidden: true,
    },

    {
      title: '结婚年龄',
      layout: '1/3',
      inputType: 'input_number',
      required,
      dataIndex: 'maritalYears',
      hidden: true,
    },

    {
      title: '教育程度',
      layout: '1/3',
      inputType: 'MA',
      inputProps: { optionKey: '教育程度s' },
      dataIndex: 'education',
      hidden: true,
    },

    {
      title: '职业',
      layout: '1/3',
      inputType: 'MA',
      inputProps: { optionKey: '职业s' },
      dataIndex: 'occupation',
      hidden: true,
    },

    {
      title: '工作地',
      layout: '1/1',
      inputType: 'input',
      dataIndex: 'workplace',
      hidden: true,
    },

    {
      title: '居住地',
      required,
      layout: '1/1',
      inputType: 'MyAddress',
      dataIndex: 'residenceAddress',
      // hidden: true,
    },

    {
      title: '户籍地',
      required,
      layout: '1/1',
      inputType: 'MyAddress',
      inputProps: {
        addressBtns: [
          {
            label: '同上',
            name: "residenceAddress"
          }
        ]
      },
      dataIndex: 'permanentResidenceAddress',
      hidden: true,
    },

    // {
    //   title: '创建时间',
    //   layout: '1/3',
    //   inputType: 'DatePicker',
    //   dataIndex: 'createDate',
    //   hidden: true,
    // },

    {
      title: '特殊说明',
      layout: '1/1',

      dataIndex: 'note',
      hidden: true,
    },


  ]
)
