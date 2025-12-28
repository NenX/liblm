/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/camelcase */
import React, { ReactNode } from 'react';
import DefaultSelect from './DefaultSelect';
import MultipleSelect from './MultipleSelect';
interface MySelectProps {
  onChange: Function;
  dispatch?: Function;
  value: any;
  input_props: any;
}
export default function MySelect(props: MySelectProps) {
  const { onChange, value = '', input_props = {}, ...others } = props;
  const { type = 'default', style = {}, warningOption,disabled } = input_props;
  const renderSelect = {
    default: (input_props: any, value: any, onChange: Function): ReactNode => {
      const { options = [], radio = true, tags = false, uniqueKey } = input_props;
      return (
        <DefaultSelect
          tags={tags}
          onChange={onChange}
          value={value}
          options={options}
          multiple={!radio}
          disabled={disabled}
          dropdownMatchSelectWidth={false}
          style={{ color: warningOption === value ? '#ff517d' : '', ...style }}
          uniqueKey={uniqueKey}
          {...others}
        />
      );
    },
    multiple: (input_props: any, value: any, onChange: Function): ReactNode => {
      const { options = [], extraEditors = [], radio = true } = input_props;
      const val: any = {
        selectValue: [],
        editorsValue: [],
      };
      const keys = Object.keys(value);
      if (radio) {
        // 单选
        for (let i = 0; i < keys.length; i++) {
          if (value[keys[i]] === true) {
            val.selectValue = keys[i];
            val.editorsValue = value[`${keys[i]}Note`];
            break;
          }
        }
      } else {
        // 多选
        for (let i = 0; i < keys.length; i++) {
          if (value[keys[i]] === true) {
            val.selectValue.push(keys[i]);
            val.editorsValue.push({
              key: keys[i],
              value: value[`${keys[i]}Note`],
            });
          }
        }
      }

      const handleChange = (selectValue: any, editorsValue: any) => {
        const newVaule = JSON.parse(JSON.stringify(value));
        if (radio) {
          // 单选
          onChange({
            [selectValue]: true,
            [`${selectValue}Note`]: editorsValue,
          });
        } else {
          // 多选
          Object.keys(newVaule).forEach((key: string) => {
            if (key.indexOf('Note') === -1 && typeof newVaule[key] === 'boolean') {
              newVaule[key] = false;
            }
          });
          selectValue.forEach((key: string) => {
            newVaule[key] = true;
            editorsValue.forEach((editorValue: { key: string; value: any }) => {
              if (editorValue.key === key) {
                newVaule[`${key}Note`] = editorValue.value;
              }
            });
          });
          onChange(newVaule);
        }
      };
      return (
        <MultipleSelect
          onChange={handleChange}
          value={val}
          options={options}
          multiple={!radio}
          extraEditors={extraEditors}
          disabled={disabled}

        />
      );
    },
  };

  return renderSelect[type](input_props, value, onChange);
}
