import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { get, map, includes } from 'lodash';
export default (props: any) => {
  const { onChange, inputProps, value } = props;
  const [options, setOptions] = useState([]);
  const apiUrl = get(inputProps, 'apiUrl') || get(props, 'apiUrl') || [];
  const type = get(inputProps, 'type') || get(props, 'type') || [];
  const maxLength = get(inputProps, 'maxLength') || get(props, 'maxLength') || 8;
  const handleChange = (data) => {
    console.log('apiUrl---------', apiUrl);
    onChange && onChange(data);
  };
  const handleFocus = () => {
    // const data = ['肌肉注射'];
    // setOptions(data);
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    if (!value) return;
    if (!includes(options, value)) options.unshift(value);
    if (options.length > maxLength) options.splice(maxLength, 1);
    setOptions(options);
    console.log(value, options, options.length, '456');
  };

  console.log(props, options, 'options69');

  return (
    <AutoComplete
      dropdownMatchSelectWidth={get(inputProps, 'dropdownMatchSelectWidth') || 120}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={value}
    >
      {map(options, (item) => (
        <AutoComplete.Option key={item} value={item}>
          {item}
        </AutoComplete.Option>
      ))}
    </AutoComplete>
  );
};
