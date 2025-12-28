import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
const options = [
  {
    label: '无',
    value: '无',
  },
];
export default function SelectWithNo(props: any) {
  const { onChange, options: inputOptions, value } = props;
  // const [value, setValue] = useState();

  // useEffect(() => {
  //   setValue(props.value);
  // }, [props.value]);

  const handleChange = (data) => {
    onChange && onChange(data);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={100}
      {...props}
      options={inputOptions || options}
      onChange={handleChange}
      value={value}
    />
  );
}
