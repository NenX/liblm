import React, { useState } from 'react';
import { Button } from 'antd';

/*
 * 用于产科门诊-首诊-体格检查页面的业务组件
 */
interface MyButtonProps {
  dispatch: Function;
  input_props: any;
  onClick: Function;
  disabled?:boolean
}
export default function MyButton(props: MyButtonProps) {
  const [words, setWords] = useState('全部正常');
  const handleClick = (item: string) => {
    props.onClick(item);
    words === '全部正常' ? setWords('取消全选') : setWords('全部正常');
  };

  return <Button disabled={props.disabled} onClick={() => handleClick(words)}>{words}</Button>;
}
