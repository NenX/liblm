import React, { useState, useEffect } from 'react';
import { Button, Row, Col, InputNumber, Input,  AutoComplete } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { SLocal_Dictionary } from '@lm_fe/service';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

interface IProps {
  value: object;
  onChange?: (value: any) => void;
}

// const positionOptions = [
//   { label: 'LOA', value: 'LOA' },
//   { label: 'LOT', value: 'LOT' },
//   { label: 'LOP', value: 'LOP' },
//   { label: 'ROA', value: 'ROA' },
//   { label: 'ROT', value: 'ROT' },
//   { label: 'ROP', value: 'ROP' },

//   { label: 'LSA', value: 'LSA' },
//   { label: 'LST', value: 'LST' },
//   { label: 'LSP', value: 'LSP' },
//   { label: 'RSA', value: 'RSA' },
//   { label: 'RST', value: 'RST' },
//   { label: 'RSP', value: 'RSP' },

//   { label: 'LMA', value: 'LMA' },
//   { label: 'LMT', value: 'LMT' },
//   { label: 'LMP', value: 'LMP' },
//   { label: 'RMA', value: 'RMA' },
//   { label: 'RMT', value: 'RMT' },
//   { label: 'RMP', value: 'RMP' },

//   { label: 'LScA', value: 'LScA' },
//   { label: 'LScP', value: 'LScP' },
//   { label: 'RScA', value: 'RScA' },
//   { label: 'RScP', value: 'RScP' },
// ];

// const presentationOptions = [
//   { label: '头', value: '头' },
//   { label: '臀', value: '臀' },
//   { label: '肩', value: '肩' },
//   { label: '脚', value: '脚' },
//   { label: '手', value: '手' },
// ];
const RenderInput = ({ label, name, inputType, options, style, value, onChange }: any) => {
  switch (inputType) {
    case 'numberInput':
      return (
        <InputNumber value={value} placeholder={`请输入${label}`} style={style} onChange={(v) => onChange(v, name)} />
      );
      break;
    case 'autoComplete':
      return (
        <AutoComplete
          value={value}
          options={options}
          placeholder={`请输入${label}`}
          style={style}
          onChange={(v) => onChange(v, name)}
        />
      );
      break;
    case 'select':
      return (
        <Select
          value={value}
          options={options}
          placeholder={`请选择${label}`}
          style={style}
          onChange={(v) => onChange(v, name)}
        />
      );
      break;
    default:
      return (
        <Input
          value={value}
          placeholder={`请输入${label}`}
          style={style}
          onChange={(e) => onChange(e.target.value, name)}
        />
      );
      break;
  }
};
const template = { fetalHeartRate: '', fetalPosition: '', presentation: '' };
export default function FetalUltrasound({ value = [], onChange = () => { } }: IProps) {
  const fileds = [
    {
      name: 'fetalHeartRate',
      label: '胎心率',
      inputType: 'numberInput',
      unit: '(bpm)',
      style: { width: 172 },
    },
    {
      name: 'fetalPosition',
      label: '胎方位',
      inputType: 'select',
      options: SLocal_Dictionary.getDictionariesEnumerations('NoenateRecord.fetalposition'),
      style: { width: 172 },
    },
    {
      name: 'presentation',
      label: '先露',
      inputType: 'select',
      options: SLocal_Dictionary.getDictionariesEnumerations('Common.presentation'),
    },
    {
      name: 'weight',
      label: '胎重',
      inputType: 'input',
      unit: '(kg)',
      style: { width: 172 },
    },
  ];
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    let defaultValue = value || [];
    if (value && !value.length) {
      defaultValue = [{ ...template }];
    }
    setDataSource(defaultValue);
  }, []);
  const handleAdd = () => {
    const d = [...dataSource, { fetalHeartRate: '', fetalPosition: '', presentation: '' }];
    setDataSource(d);
  };

  const handleSubtract = (i) => {
    const d = dataSource.filter((_, index) => index !== i);
    setDataSource(d);
    onChange(d);
  };

  const valueChange = (value, name, index) => {
    const d = [...dataSource];
    d[index][name] = value;
    setDataSource(d);
    onChange(d);
  };

  const renderChild = (item, index, length) => {
    const onChange = (value, name) => {
      valueChange(value, name, index);
    };
    return (
      <div className={styles["fetal-ultrasound-content-list"]}>
        <div className={styles["fetal-ultrasound-content-list-title"]}>
          {length > 1 && (
            <Button
              size="small"
              type="text"
              title="删除胎儿信息"
              icon={<MinusCircleOutlined />}
              onClick={() => handleSubtract(index)}
            ></Button>
          )}
          <span>胎儿{index + 1}</span>
        </div>
        <Row className={styles["fetal-ultrasound-content-list-row"]}>
          {fileds.map((_) => {
            return (
              <Col span={7} key={_.name}>
                <Row>
                  <Col span={6} className={styles["fetal-ultrasound-content-list-row-label"]}>
                    {_.label}
                    <i className={styles["unit"]}>{_.unit}</i>
                  </Col>
                  <Col span={16}>
                    <RenderInput {..._} value={item[_.name]} onChange={onChange} />
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  return (
    <div className={styles["fetal-ultrasound-wrapper"]}>
      <div className={styles["fetal-ultrasound-title"]}>
        <Button icon={<PlusOutlined />} title="增加胎儿信息" onClick={handleAdd}>
          增加
        </Button>
      </div>
      <div className={styles["fetal-ultrasound-content"]}>{dataSource.map((_, i, arr) => renderChild(_, i, arr.length))}</div>
    </div>
  );
}
