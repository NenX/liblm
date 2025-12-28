import { FormConfig } from '../../../MyForm/interface';


/**
 * 胎儿标记
 */
const signOptions = [
  { label: '胎1', value: '1' },
  { label: '胎2', value: '2' },
  { label: '胎3', value: '3' },
  { label: '胎4', value: '4' },
  { label: '胎5', value: '5' },
  { label: '胎6', value: '6' },
];

const config: Array<FormConfig> = [
  {
    name: 'fetus',
    key: '.*',
    label: '',
    input_type: 'prenatalReturnTable',
    input_props: {
      editable: true,
      hiddenSelection: true,
      tableColumns: [
        {
          key: 'checkdate',
          title: '日期',
          width: 60,
          editor: { name: '', key: '', input_type: 'date' },
        },
        {
          key: 'gestationalWeek',
          title: '孕周',
          width: 50,
          editor: { name: '', key: '', input_type: 'input' },
        },
        {
          key: 'bpd',
          title: 'BPD(mm)',
          width: 40,
          editor: { name: '', key: '', input_type: 'input', input_props: { type: 'number' } },
        },
        {
          key: 'fl',
          title: 'FL(mm)',
          width: 40,
          editor: { name: '', key: '', input_type: 'input', input_props: { type: 'number' } },
        },
        {
          key: 'ac',
          title: 'AC(cm)',
          width: 40,
          editor: { name: '', key: '', input_type: 'input', input_props: { type: 'number' } },
        },
        {
          key: 'fetal',
          title: '胎儿标记',
          width: 40,
          editor: { name: '', key: '', input_type: 'select', input_props: { options: signOptions } },
        },
      ],
    },
  },
];

export default config;
