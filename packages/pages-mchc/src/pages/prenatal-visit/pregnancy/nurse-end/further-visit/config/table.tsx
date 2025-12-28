import React from 'react';
import { get } from 'lodash';
import { APP_CONFIG, InputWithRange, PressureInput } from '@lm_fe/components_m';
export const tableColumns = [
  {
    title: '创建时间',
    dataIndex: 'createDate',
    editable: true,
    rules: [{ required: true, message: '创建时间是必填项' }],
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    inputType: 'single_date_picker',
  },
  // {
  //   title: '孕周',
  //   dataIndex: 'gestationalWeek',
  //   editable: true,
  //   inputType: 'input_with_label',
  //   width: APP_CONFIG.CELL_WIDTH_SMALL,
  //   render: (value: any) => value || '',
  // },
  {
    title: () => (
      <span>
        血压-首测<em className="suffix">(mmHg)</em>
      </span>
    ),
    dataIndex: 'bloodPressure',
    editable: true,
    inputType: 'pressure',
    render: (value: any, rowData: any) => (
      <PressureInput value={get(rowData, 'physicalExamMeasure')} hiddenIpt={true} />
    ),
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: () => (
      <span>
        血压-二测<em className="suffix">(mmHg)</em>
      </span>
    ),
    dataIndex: 'bloodPressure2',
    editable: true,
    inputType: 'pressure',
    render: (value: any, rowData: any) => {
      const pressure = {
        systolic: get(rowData, 'physicalExamMeasure.systolic2'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic2'),
      };
      return <PressureInput value={pressure} hiddenIpt={true} />;
    },
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: () => (
      <span>
        血压-三测<em className="suffix">(mmHg)</em>
      </span>
    ),
    dataIndex: 'bloodPressure3',
    editable: true,
    inputType: 'pressure',
    render: (value: any, rowData: any) => {
      const pressure = {
        systolic: get(rowData, 'physicalExamMeasure.systolic3'),
        diastolic: get(rowData, 'physicalExamMeasure.diastolic3'),
      };
      return <PressureInput value={pressure} hiddenIpt={true} />;
    },
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: () => (
      <span>
        脉搏<em className="suffix">(bpm)</em>
      </span>
    ),
    dataIndex: ['physicalExamMeasure', 'pulse'],
    editable: true,
    inputType: 'input_with_range',
    inputProps: { min: 60, max: 100, tip: '脉搏的正常范围值是60~100bpm' },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => <InputWithRange value={value} min={60} max={100} hiddenIpt={true} />,
  },
  {
    title: () => (
      <span>
        体重<em className="suffix">(kg)</em>
      </span>
    ),
    dataIndex: ['physicalExamMeasure', 'weight'],
    editable: true,
    inputType: 'input_with_label',
    inputProps: { min: 0, type: 'number' },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value || '',
  },
  {
    title: () => (
      <span>
        宫高<em className="suffix">(cm)</em>
      </span>
    ),
    dataIndex: ['gynecologicalExamMeasure', 'fundalHeight'],
    editable: true,
    inputType: 'input_with_label',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value || '',
  },
  {
    title: () => (
      <span>
        腹围<em className="suffix">(cm)</em>
      </span>
    ),
    dataIndex: ['gynecologicalExamMeasure', 'waistHip'],
    editable: true,
    inputType: 'input_with_label',
    inputProps: { min: 0, type: 'number' },
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value || '',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    editable: true,
    inputType: 'input_with_label',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => value || '',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    editable: false,
    inputType: 'input_with_label',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    render: (value: any) => value || '',
    inputProps: {
      disabled: true,
    },
  },
];
