import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Checkbox, Row, Col, Input, AutoComplete } from 'antd';
import { get, map, set, indexOf, filter, isEmpty, cloneDeep, values, isEqual } from 'lodash';
import GeneralComponents_InputWithLabel from '../InputWithLabel';
import MultipleInputWithLabel, { Option as MultipleInputWithLabelOption } from '../MultipleInputWithLabel';
import DatePickerCus from '../DatePicker';
import classnames from 'classnames';
import styles from './index.less';
import { safe_json_parse } from '@lm_fe/utils';
interface Option {
  value: any;
  label?: any;
  span?: number;
  withInput?: boolean;
  isIssue?: boolean;
  inputType?: 'multiple_input' | 'checkbox' | 'input';
  inputSpan?: number;
  options?: MultipleInputWithLabelOption[] | any[];
}
interface IProps {
  value?: any;
  options?: Option[];
  onChange?: any;
  type?: 'single' | 'multiple';
  disabled?: boolean;
}
export default (props: IProps) => {
  const { options = [], type, value, onChange, disabled = false } = props;
  const [__data, setData] = useState({});
  const [inputOffset, setInputOffset] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    !isEmpty(value) && setData(safe_json_parse(value));
  }, [value]);

  useEffect(() => {
    const el = rowRef.current
    if (el && el['children']['length']) {
      const colWidth = el['children'][0]['scrollWidth'];
      const labelWidth = el['children'][0]['children'][0]['scrollWidth'];
      setInputOffset(colWidth - labelWidth - 2);
    }
  }, [value]);

  const handleBoxGroupChange = (checkedValues: any[]) => {
    const tempData = cloneDeep(__data);
    const oldCheckedValues = get(tempData, 'checkedValues');
    let newCheckedValues = checkedValues;
    if (type === 'single') {
      newCheckedValues = filter(checkedValues, (item) => indexOf(oldCheckedValues, item) === -1);
      set(tempData, 'withInputValues', {});
    }
    set(tempData, 'checkedValues', newCheckedValues);
    setData(tempData);
    onChange && onChange(tempData);
  };

  const handleInputChange = (inputType: any, option: any) => (inputValue: any) => {
    const tempData = cloneDeep(__data);

    if (inputType === 'input') {
      set(tempData, `withInputValues.${get(option, 'value')}`, {
        key: get(option, 'value'),
        value: {
          0: inputValue,
        },
      });
    }

    if (inputType === 'autoComplete') {
      set(tempData, `withInputValues.${get(option, 'value')}`, {
        key: get(option, 'value'),
        value: {
          0: inputValue,
        },
      });
    }

    if (inputType === 'multiple_input') {
      set(tempData, `withInputValues.${get(option, 'value')}`, {
        key: get(option, 'value'),
        value: inputValue,
      });
    }

    if (inputType === 'checkbox') {
      set(tempData, `withInputValues.${get(option, 'value')}`, {
        key: get(option, 'value'),
        value: inputValue,
      });
    }

    if (inputType === 'single_date_picker') {
      set(tempData, `withInputValues.${get(option, 'value')}`, {
        key: get(option, 'value'),
        value: {
          0: inputValue,
        },
      });
    }

    setData(tempData);
    onChange && onChange(tempData);
  };

  const handleDoubleInputChange = (e: any, option: any, optionValue: any) => {
    const tempData = cloneDeep(__data);
    const val = e.target.value;
    set(tempData, `withInputDoubleValues.${get(option, 'value')}`, {
      ...get(__data, `withInputDoubleValues.${get(option, 'value')}`),
      [`inputValue${optionValue}`]: val,
    });
    setData(tempData);
    onChange && onChange(tempData);
  };

  const renderInput = (option: any) => {
    const {
      inputSpan = 6,
      offset = 0,
      inputType = 'input',
      needWrapper = false,
      enterType = 'string',
      ...others
    } = option;
    const { checkedValues, withInputValues, withInputDoubleValues } = __data;

    if (indexOf(checkedValues, option.value) > -1) {
      // 简单的接一个 input
      if (inputType === 'input') {
        const inputValue = get(withInputValues, `${option.value}.value.0`);
        return (
          <Col span={inputSpan}>
            {/* <Col span={inputSpan} style={{ position: 'relative', left: `-${inputOffset}px` }}> */}
            <div>
              <GeneralComponents_InputWithLabel
                {...others}
                disabled={disabled}
                className={classnames({
                  'global-issue-input': option.isIssue && indexOf(get(__data, 'checkedValues'), option.value) > -1,
                })}
                type={enterType}
                style={get(option, 'exceptionStyle.inputStyle')}
                onChange={handleInputChange(inputType, option)}
                value={inputValue}
              />
            </div>
          </Col>
        );
      }

      if (inputType === 'autoComplete') {
        const inputValue = get(withInputValues, `${option.value}.value.0`);
        return (
          <Col span={inputSpan}>
            {/* <Col span={inputSpan} style={{ position: 'relative', left: `-${inputOffset}px` }}> */}
            <div>
              <AutoComplete
                {...others}
                disabled={disabled}
                className={classnames({
                  'global-issue-input': option.isIssue && indexOf(get(__data, 'checkedValues'), option.value) > -1,
                })}
                type={enterType}
                style={get(option, 'exceptionStyle.inputStyle')}
                onChange={handleInputChange(inputType, option)}
                value={inputValue}
                options={get(option, 'inputOption')}
              />
            </div>
          </Col>
        );
      }

      // 接多个 checkbox
      if (inputType === 'checkbox') {
        const checkboxOptions = get(option, 'options');
        const boxValues = values(get(withInputValues, `${get(option, 'value')}.value`));

        return (
          <Col span={inputSpan} style={{ display: 'flex' }}>
            <span style={{ display: 'inline-block', marginRight: 4 }}>( </span>
            <Checkbox.Group
              style={{ width: 'auto' }}
              disabled={disabled}
              value={boxValues}
              onChange={handleInputChange(inputType, option)}
            >
              {map(checkboxOptions, (checkboxOption, index) => {
                return (
                  <React.Fragment key={index}>
                    <Checkbox
                      key={index}
                      value={get(checkboxOption, 'value')}
                      className={classnames({
                        'global-issue-checkbox':
                          checkboxOption.isIssue && indexOf(boxValues, checkboxOption.value) > -1,
                      })}
                    >
                      {get(checkboxOption, 'label')}
                    </Checkbox>
                    {get(checkboxOption, 'withInput') && indexOf(boxValues, checkboxOption.value) > -1 && (
                      <Input
                        style={{ width: 100, marginRight: 8 }}
                        onChange={(e) => handleDoubleInputChange(e, option, get(checkboxOption, 'value'))}
                        value={get(
                          withInputDoubleValues,
                          `${get(withInputValues, `${get(option, 'value')}.key`)}.inputValue${index + 1}`,
                        )}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Checkbox.Group>
            <span style={{ display: 'inline-block', marginLeft: 4 }}> )</span>
          </Col>
        );
      }

      // 接多个 input
      if (inputType === 'multiple_input') {
        const inputOptions = get(option, 'options');
        const inputValue = get(withInputValues, `${option.value}.value`);
        return (
          <Col span={inputSpan}>
            <MultipleInputWithLabel
              disabled={disabled}
              className={classnames({
                'global-issue-multiple-input': option.isIssue && indexOf(get(__data, 'checkedValues'), option.value) > -1,
              })}
              needWrapper={needWrapper}
              options={inputOptions}
              value={inputValue}
              onChange={handleInputChange(inputType, option)}
            />
          </Col>
        );
      }

      // 新增 接一个时间选择器
      if (inputType === 'single_date_picker') {
        const dateValue = get(withInputValues, `${option.value}.value.0`);
        if (get(props, 'options.1.labelBefore')) {
          return (
            <Col span={inputSpan}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: 4,
                    marginRight: 4,
                    wordBreak: 'keep-all',
                    ...get(props, 'labelBeforeStyle'),
                  }}
                >
                  {get(props, 'options.1.labelBefore')}
                </span>
                <div style={{ width: '280px' }}>
                  <DatePickerCus
                    value={dateValue}
                    valueType={'YYYY-MM-DD'}
                    onChange={handleInputChange(inputType, option)}
                  />
                </div>
              </div>
            </Col>
          );
        } else {
          return (
            <Col span={inputSpan}>
              <DatePickerCus value={dateValue} valueType={'YYYY-MM-DD'} onChange={handleInputChange(inputType, option)} />
            </Col>
          );
        }
      }
    }

    return <></>;
  };

  return (
    <Checkbox.Group disabled={disabled} value={get(__data, 'checkedValues')} onChange={handleBoxGroupChange}>
      <Row ref={rowRef}>
        {map(options, (option, index) => {
          const { span = 3, offset = 0 } = option;
          if (option.withInput) {
            return (
              <Fragment key={index}>
                <Col offset={offset} className={styles["checkbox-col"]} style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    style={
                      indexOf(get(__data, 'checkedValues'), option.value) > -1
                        ? get(option, 'exceptionStyle.checkboxStyle')
                        : {}
                    }
                    className={classnames({
                      'global-issue-checkbox': option.isIssue && indexOf(get(__data, 'checkedValues'), option.value) > -1,
                    })}
                    value={option.value}
                  >
                    {option.label}
                  </Checkbox>
                </Col>
                {renderInput(option)}
                <span style={{ marginRight: 12 }} />
              </Fragment>
            );
          }

          return (
            <Col offset={offset} key={index} className="checkbox-col" style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                className={classnames({
                  'global-issue-checkbox': option.isIssue && indexOf(get(__data, 'checkedValues'), option.value) > -1,
                })}
                value={option.value}
              >
                {option.label}
              </Checkbox>
            </Col>
          );
        })}
      </Row>
    </Checkbox.Group>
  );
};
