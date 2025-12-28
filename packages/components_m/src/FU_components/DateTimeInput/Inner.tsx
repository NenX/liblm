import { mchcEnv } from '@lm_fe/env';
import { getMomentObj } from '@lm_fe/utils';
import { Input, InputProps, message } from 'antd';
import React, { FocusEvent, useEffect, useRef, useState } from 'react';
import { TCommonComponent } from '../types';
import styles from './index.module.less';
import { MyInput } from '@lm_fe/components';
const DateTimeInput: TCommonComponent<{ size?: any, showSecond?: boolean }, string> = function DateTimeInput(props) {
  const { onChange, value, size, disabled, showSecond = !mchcEnv.is('广三') } = props;
  const [_value, set_value] = useState<number>()
  const [height, setHeight] = useState<number>()
  const [weight, setWeight] = useState<number>()
  const [visible, setVisible] = useState(false)


  const [年, set_年] = useState<string>()
  const [月, set_月] = useState<string>()
  const [日, set_日] = useState<string>()
  const [时, set_时] = useState<string>()
  const [分, set_分] = useState<string>()
  const [秒, set_秒] = useState<string>()

  const 年Ref = useRef<Input>(null)
  const 月Ref = useRef<Input>(null)
  const 日Ref = useRef<Input>(null)
  const 时Ref = useRef<Input>(null)
  const 分Ref = useRef<Input>(null)
  const 秒Ref = useRef<Input>(null)

  const [年Warning, set_年Warning] = useState<boolean>()
  const [月Warning, set_月Warning] = useState<boolean>()
  const [日Warning, set_日Warning] = useState<boolean>()
  const [时Warning, set_时Warning] = useState<boolean>()
  const [分Warning, set_分Warning] = useState<boolean>()
  const [秒Warning, set_秒Warning] = useState<boolean>()

  const myMap = {
    年: { value: 年, setter: set_年, ref: 年Ref, warning: 年Warning, setWarning: set_年Warning, next: () => myMap.月 },
    月: { value: 月, setter: set_月, ref: 月Ref, warning: 月Warning, setWarning: set_月Warning, next: () => myMap.日 },
    日: { value: 日, setter: set_日, ref: 日Ref, warning: 日Warning, setWarning: set_日Warning, next: () => myMap.时 },
    时: { value: 时, setter: set_时, ref: 时Ref, warning: 时Warning, setWarning: set_时Warning, next: () => myMap.分 },
    分: { value: 分, setter: set_分, ref: 分Ref, warning: 分Warning, setWarning: set_分Warning, next: () => myMap.秒 },
    秒: { value: 秒, setter: set_秒, ref: 秒Ref, warning: 秒Warning, setWarning: set_秒Warning, next: () => null },
  }
  function formatNumberToStr(value?: string) {
    return value
    const str = value?.toString() ?? ''
    return str.length > 1 ? str.replace(/^0*/g, '') : str.padStart(2, '0')
  }
  function getValue(type: keyof typeof myMap, defaultValue = '00') {
    const v = formatNumberToStr(myMap[type].value)
    // return v === '00' ? (defaultValue ?? v) : v
    return v || defaultValue
  }
  useEffect(() => {
    const safeV = value ?? ''
    const m = getMomentObj(value ?? '')
    const arr = safeV.split(' ')
    const dateArr = (arr[0] ?? '').split('-')
    const timeArr = (arr[1] ?? '').split(':')
    const year = dateArr[0] ?? ''
    const month = dateArr[1] ?? ''
    const day = dateArr[2] ?? ''
    const hour = timeArr[0] ?? ''
    const minute = timeArr[1] ?? ''
    const second = timeArr[2] ?? ''

    set_年(year)
    set_月(month)
    set_日(day)
    set_时(hour)
    set_分(minute)
    set_秒(second)

    return () => {

    }
  }, [value])

  function format(a: string | number, escape = false) {
    const str = a.toString()
    if (escape) return str
    return str.length >= 2 ? str.replace(/^0*/g, '') : str.padStart(2, '0')


  }

  const handleChange = (type: keyof typeof myMap) => {
    const len = type === '年' ? 4 : 2
    const ctx = myMap[type]
    return (v: string) => {
      ctx.setWarning(true)
      const next = ctx.next()
      ctx.setter(v)
      ctx.value = v
      onPressEnter()
      if (v.length === len) {

        next?.ref?.current?.focus()
      }
      // ctx.setter(v)
      // ctx.setter(v)

    }

  };



  const commonProps: InputProps = {
    size: "small",
    // precision: 0,
    // stringMode: true,
    // type: 'number',
    "aria-controls": 'false',
    disabled,
    style: { padding: 0, width: 30, },
    // formatter(value) {
    //   if (isNil(value) || isEmpty(value)) return ''
    //   return formatNumberToStr(value)
    // },
    // controls: false,
  }
  function onFocus(e: FocusEvent<HTMLInputElement, Element>) {
    e.currentTarget.setSelectionRange(0, 99)

  }
  function onPressEnter(e?: React.KeyboardEvent<HTMLInputElement>) {
    const second = showSecond ? `:${getValue('秒', '01')}` : ''
    const format = `${getValue('年', '1980')}-${getValue('月', '01')}-${getValue('日', '01')} ${getValue('时')}:${getValue('分')}${second}`
    const m = getMomentObj(format)
    return onChange?.(format)
    if (m.isValid()) {
      onChange?.(format)

    } else {
      e?.preventDefault?.()
      message.warning('错误的时间格式')
    }
    // console.log('format', format)
  }

  function FuckInput({ type, style }: { type: keyof typeof myMap } & InputProps) {
    const ctx = myMap[type]
    return <MyInput {...commonProps} style={{ ...commonProps.style, ...style, background: ctx.warning ? 'orange' : 'unset' }}
      min={1980}
      max={2099}
      placeholder={type}
      value={myMap[type].value}
      ref={myMap[type].ref}
      onChange={handleChange(type)}
      onFocus={onFocus}
    // onPressEnter={onPressEnter}
    // onBlur={onBlur(type)}
    />
  }
  return (
    <div className={styles['date-time-input']} style={{ display: 'inline-block' }}>
      <Input.Group size="small" compact style={{ display: 'inline-block', width: 'auto', marginRight: 6 }}>
        {FuckInput({ type: "年", style: { padding: 0, width: 44 } })}
        {FuckInput({ type: "月" })}
        {FuckInput({ type: "日" })}
      </Input.Group>

      <Input.Group size="small" compact style={{ display: 'inline-block', width: 'auto', }}>


        {FuckInput({ type: "时" })}
        {FuckInput({ type: "分" })}


        {

          showSecond && FuckInput({ type: "秒" })

        }





      </Input.Group>
    </div>
  );
};
export default DateTimeInput