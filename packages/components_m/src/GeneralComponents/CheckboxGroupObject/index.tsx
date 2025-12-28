import React, { useState, useEffect } from 'react';
import { Checkbox, Input } from 'antd';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import { set } from 'lodash';
import { pickBy } from 'lodash';
import styles from './index.module.less';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { safe_json_parse } from '@lm_fe/utils';
interface optionProps {
  key: string;
  label: string;
  warning?: boolean; // 默认不做waring样式提示
}
const extraObj = {
  key: 'nothing',
  label: '无',
};
interface IProps {
  value?: object;
  options?: optionProps[];
  optionKey?: '家族史';
  [propName: string]: any;
}

// { key: 'value', keyNote: '', key1: 'value1'} --> [value, value1, ...]
// 获取checkboxValue <string[]>
function getCheckboxGroupValue(value = {}) {
  const objValue = pickBy(value, (value, key) => !key.includes('Note') && key !== 'id' && value);
  return Object.keys(objValue);
}
export default function CheckboxGroupObject(props: IProps) {

  const optionKeyMap = {
    '家族史': {
      options: [
        // mchcEnv.is('建瓯') ? { key: 'twins', label: '双胎', "warning": true } : null,
        { "key": "hypertension", "label": "高血压", "warning": true },
        { "key": "diabetes", "label": "糖尿病", "warning": true },
        { "key": "heritableDisease", "label": "遗传疾病", "warning": true },
        mchcEnv.in(['建瓯']) ? { key: 'dementia', label: '痴呆', "warning": true } : null,
        { "key": "birthdefects", "label": "先天畸形", "warning": true },
        // 新增
        mchcEnv.in(['广三']) ? { "key": "tuberculosis", "label": "结核", "warning": true } : null,
        mchcEnv.in(['广三']) ? { "key": "mentalDisease", "label": "精神病", "warning": true } : null,
        mchcEnv.in(['广三']) ? { "key": "thalassemia", "label": "地贫", "warning": true } : null,
        mchcEnv.in(['广三']) ? { "key": "g6pdLack", "label": "g6pd缺乏", "warning": true } : null,
        mchcEnv.in(['建瓯', '广三']) ? { key: 'twins', label: '双胎', "warning": true } : null,

        // 新增 end
        { "key": "other", "label": "其它", "warning": true },


      ],
      type: 'withInput'
    }
  }

  const {
    value,
    onChange,
    optionKey,
    options: _options = [],
    type: _type = 'withoutInput',

    ...restProps
  } = props

  const options = optionKeyMap[optionKey!]?.options ?? _options

  const type = optionKeyMap[optionKey!]?.type ?? _type
  // dataSource value值本地变量
  const [dataSource, setDataSource] = useState<any>(null);

  useEffect(() => {
    // 未有记录的状态

    const _value = safe_json_parse(value, {})
    if (_value.nothing) {
      setDataSource({ nothing: true });
    }
    else if (isEmpty(_value)) {
      setDataSource(null);
    }
    else {

      setDataSource(_value);
    }

  }, [value]);

  const handleChange = (checkedValue) => {
    mchcLogger.log('-----handle change----', checkedValue, checkedValue.slice(-1));
    let val: any = {};
    // 选择“无”时
    if (checkedValue[checkedValue.length - 1] === 'nothing') {
      //val = { id: value.id, nothing: true };
      val['nothing'] = true
    } else {
      // 选择非“无”
      for (let i = 0; i < checkedValue.length; i++) {
        const key = checkedValue[i];
        val = { ...val, [key]: true };
      }
      const noteValue = pickBy(value, (value, key) => key.includes('Note') || key === 'id');
      val = { ...val, ...noteValue, nothing: false };
    }
    options.forEach(_ => val[_?.key!] = val[_?.key!] || false)
    onChange(val);
    setDataSource(val);
  };

  const handleTextChange = (name: string, val: string | number) => {
    const newValue = {
      ...dataSource,
      [name]: val,
    };
    setDataSource(newValue);
    onChange(newValue);
  };

  return (
    <Checkbox.Group value={getCheckboxGroupValue(value)} className={styles["checkbox-group-object"]} onChange={handleChange}>
      {[extraObj, ...options].map((_) => {
        if (!_) return null
        const itemVal = { key: get(dataSource, [_.key]), keyNote: get(dataSource, [`${_.key}Note`]) };
        return <CheckboxItem key={_.key} type={type} option={_} value={itemVal} onTextChange={handleTextChange} />;
      })}
    </Checkbox.Group>
  );
}
export function CheckboxItem({ value = { key: null, keyNote: '' }, option, onTextChange, type = 'withoutInput' }: any) {
  const inputChange = (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    onTextChange(`${option.key}Note`, val);
  };
  return (
    <Checkbox
      name={option.key}
      value={option.key}
      checked={value.key}
      className={classnames(
        styles['checkbox-group-object-item'],
        { [styles['warning']]: option.warning },
        {
          'global-issue-checkbox': option.warning && value.key,
        },
      )}
    >
      {option.label}
      {type === 'withInput' && option.key !== extraObj.key && value.key && (
        <Input
          name={option.key}
          value={value.keyNote}
          onChange={inputChange}
          title={value.keyNote}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
        />
      )}
    </Checkbox>
  );
}
