import React, { useState, useEffect, useRef } from 'react';
import { map, get, last, isNil } from 'lodash';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
export default (props: any) => {
  const { options, onChange, mode = 'single', getPopupContainer = () => document.body, ...rest } = props;
  const [value, setValue] = useState([]);
  const [open, setOpen] = useState(false);

  const selfRef = useRef();

  useEffect(() => {
    setValue(get(props, 'value'));
  }, [props.value]);

  const handleChange = (data) => {
    let selectedValue = data;
    if (mode === 'single') {
      selectedValue = last(data);
      setOpen(false);
      selfRef.current.blur();
    }
    setValue(selectedValue);
    onChange && onChange(selectedValue);
  };

  return (
    <Select
      {...rest}
      ref={selfRef}
      mode="tags"
      style={{ width: '100%', minWidth: 150 }}
      dropdownMatchSelectWidth={150}
      getPopupContainer={getPopupContainer}
      value={isNil(value) ? undefined : value}
      onChange={handleChange}
      onFocus={() => {
        setOpen(true);
      }}
      onBlur={() => {
        setOpen(false);
      }}
      open={open}
    >
      {map(options, (option) => {
        return (
          <Select.Option key={get(option, 'value')} value={get(option, 'value')}>
            {get(option, 'label') || get(option, 'value')}
          </Select.Option>
        );
      })}
    </Select>
  );
};
