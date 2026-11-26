
import { getPresetOptions, mchcEnv } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable } from '@lm_fe/service';
export const queryFormDescriptions_old = () => {
  return [
    {
      label: '就诊卡号',
      name: 'outpatientNO',
      inputType: 'PatientAutoComplete',
      filterType: 'contains',
      inputProps: {
        width: 140,
      }
    },

    mchcEnv.is('南医增城')
      ? {
        label: 'ID号',
        name: 'patientNO',
        inputType: 'Input',
        filterType: 'contains',
        inputProps: {
          width: 140,
        }
      }
      : null,

    {
      label: '孕妇姓名',
      inputType: 'input',
      name: 'name',
      inputProps: {
        width: 150,
      }
    },
    {
      label: '孕期状态',
      inputType: 'select',
      filterType: 'in',
      name: 'periodState',
      inputProps: {
        options: getPresetOptions('孕期状态'),
        // defaultValue: '1',
        width: 120,

      }
    },
    {
      label: '证件号码',
      inputType: 'input',
      name: 'idNO',

      inputProps: {
        width: 156,
      }
    },
    {
      label: '手机号码',
      inputType: 'input',
      name: 'telephone',
      inputProps: {
        width: 156,
      }
    },
    {
      label: '档案状态',
      inputType: 'select',
      filterType: 'in',
      name: 'recordstate',

      // defaultValue: '1',
      inputProps: {
        width: 86,
        options: [
          // { label: '全部', value: null },
          { label: '待审核', value: '0,null' },
          { label: '已审核', value: '1,6' },
        ],
      },
    },
    {
      name: 'lastModifiedDate',

      label: '修改时间',
      inputType: 'rangeDate',

      // paramType: 'startAndEnd',
    },
    {
      name: 'createDate',

      label: '创建时间',
      inputType: 'rangeDate',

      // paramType: 'startAndEnd',
    },
    {
      name: 'validateDate',

      label: '审核时间',
      inputType: 'rangeDate',

      // paramType: 'startAndEnd',
    },
    {
      name: 'edd',

      label: '预产期',
      inputType: 'rangeDate',

      // paramType: 'startAndEnd',
    },
    {
      label: '审核人',
      inputType: 'input',
      name: 'auditorName',
      inputProps: {
        width: 150,
      }
    },
    // {
    //   label: '',
    //   inputType: 'IdNOButton',
    //   name: 'auditorName',
    //   inputProps: {
    //     width: 150,
    //   }
    // },
    // customerService: {
    //   label: '客服专员',
    //   inputType: 'select',
    //   filterType: 'equals',
    //   options: dictionary('Common.customerService'),
    //   style: {
    //     width: 86,
    //   },
    // },
  ] as IMchc_FormDescriptions_Field_Nullable[]
}

const queryFormDescriptions = [
    {
      name: 'inpatientNO',
      label: '住院号',
      inputType: 'input',
      filterType: '',
    },
    {
      name: 'name',
      label: '孕妇姓名',
      inputType: 'input',
      filterType: '',
    },
    {
      name: 'idNO',
      label: '证件号码',
      inputType: 'input',
      style: {
        width: 168,
      },
    },
    {
      name: 'state',
      label: '状态',
      inputType: 'select',
      filterType: 'equals',
      inputProps: {
        options: [
          { label: '住院', value: 1 },
          { label: '已出院', value: 2 },
          { label: '全部', value: '' },
        ],
      }
    }
  ] as IMchc_FormDescriptions_Field_Nullable[]
export default queryFormDescriptions
