import { FormConfig } from '@lm_fe/components_m';
import { otherOptions as Options } from '@lm_fe/env';

const config: Array<FormConfig> = [
  { name: 'lmp', key: '.lmp', label: '末次月经', input_type: 'date', span: 5, rules: [{ required: true }] },
  { name: 'edd', key: '.edd', label: '预产期-日期', input_type: 'date', span: 5 },
  { name: 'sureEdd', key: '.sureEdd', label: '预产期-B超', input_type: 'date', span: 5, rules: [{ required: true }] },

  {
    name: 'conceiveMode',
    key: '.personalProfile.conceiveMode(Note)',
    label: '受孕方式',
    input_type: 'checkbox',
    span: 9,
    rules: [{ required: true }],
    input_props: {
      type: 'custom',
      renderData: [
        {
          key: 'conceiveMode',
          label: '',
          options: Options.conceiveModeOptions,
          extraEditors: [
            {
              key: 1,
              editors: [{ name: '', key: '', label: '', input_type: 'input' }],
            },
            {
              key: 3,
              editors: [{ name: '', key: '', label: '', input_type: 'input' }],
            },
          ],
        },
      ],
    },
  },

  {
    name: 'sac',
    key: '.sac',
    label: '孕囊',
    input_type: 'input',
    unit: '个',
    span: 5,
    input_props: { type: 'number' },
  },
  {
    name: 'yolksac',
    key: '.yolksac',
    label: ' 卵黄囊',
    input_type: 'input',
    unit: '个',
    span: 5,
    input_props: { type: 'number' },
  },

  {
    name: 'ntUltrasounds',
    key: '.ntUltrasounds',
    label: '',
    input_type: 'array-custom',
    is_new_row: true,
    input_props: {
      array_title: 'NT检查',
      config: [
        { name: 'id', key: '.id', label: 'id', input_type: 'input', hidden: true, span: 5 },
        { name: 'checkdate', key: '.checkdate', label: '检查时间', input_type: 'date', span: 5 },
        { name: 'menopause', key: '.menopause', label: '停经', input_type: 'input', span: 5, unit: '周' },
        {
          name: 'crl',
          key: '.crl',
          label: 'CRL',
          input_type: 'input',
          span: 5,
          unit: 'mm',
          input_props: { type: 'number' },
        },
        {
          name: 'nt',
          key: '.nt',
          label: 'NT',
          className: 'label-width4',
          input_type: 'input',
          span: 4,
          unit: 'mm',
          rules: [{ type: 'rang', min: 0, max: 3 }],
          input_props: { type: 'number' },
        },
        { name: 'gestationalWeek', key: '.gestationalWeek', label: '如孕', input_type: 'input', span: 5, unit: '周' },
      ],
    },
  },

  {
    name: 'midNiptUltrasounds',
    key: '.midNiptUltrasounds',
    span: 24,
    label: '中晚孕超声',
    input_type: 'table',
    input_props: {
      editable: true,
      tableColumns: [
        {
          key: 'gestationalWeek',
          title: '孕周',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'fetal',
          title: '胎儿',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'bpd',
          title: 'BPD',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'hc',
          title: 'HC',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'ac',
          title: 'AC',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'fl',
          title: 'FL',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'afv',
          title: 'AFV',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'ubf',
          title: '脐血流',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
        {
          key: 'note',
          title: '其他异常描述',
          editor: {
            key: '',
            name: '',
            input_type: 'input',
          },
        },
      ],
    },
  },
];

export default config;
