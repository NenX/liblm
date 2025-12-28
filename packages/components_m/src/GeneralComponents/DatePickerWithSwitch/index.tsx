import { DatePicker_L } from '@lm_fe/components';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import './index.less';
export default function DatePickerWithSwitch(props: any) {
  const { value, onChange, ...rest } = props;
  const [data, setData] = useState(value);

  useEffect(() => {
    setData(value);
  }, [value]);

  const handlePrevClick = () => {
    const newDate = dayjs(data).subtract(1, 'day');
    onChange && onChange(newDate);
  };

  const handleNextClick = () => {
    const newDate = dayjs(data).add(1, 'day');
    onChange && onChange(newDate);
  };

  const handleDatePick = (date) => {
    onChange && onChange(date);
  };

  return (
    <div className="date-picker-with-switch">
      <CaretLeftFilled onClick={handlePrevClick} className="date-picker-with-switch_icon" />
      <DatePicker_L {...rest} onChange={handleDatePick} value={data} />
      <CaretRightFilled onClick={handleNextClick} className="date-picker-with-switch_icon" />
    </div>
  );
}
