import { LazyAntd } from '@lm_fe/components';
import { numberLikeCompare } from '@lm_fe/utils';
import { Col, Row } from 'antd';
import { isNil } from 'lodash';
import React, { useMemo } from 'react';
import { getInputStyle } from '../../utils';
import { ICommonOption } from '../../utils/select_options';
import { TCommonComponent } from '../types';
import { componentMap } from './components';
import { IMySelectProps } from './types';
import { check_multiple, getMarshal, get_mode, parse_MC_value, use_options } from './utils';
import { mchcLogger } from '@lm_fe/env';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

function RenderComponent(p: { target?: ICommonOption, handleInputChange(a: any, b: any): void }) {
  const { target, handleInputChange } = p
  if (!target) return null


  const inputType = target.inputType as keyof typeof componentMap
  const props = target.props ?? {}


  const C = useMemo(() => {
    return componentMap[inputType!]
  }, [inputType])
  return <span key="aa" style={{ display: 'flex', alignItems: 'center', }}>
    {target.prefix ? <span style={{ margin: '0 2px', whiteSpace: 'nowrap' }}>{target.prefix}</span> : null}
    {C ? <C {...props} value={target.text} onChange={(e: any) => { handleInputChange(e, target) }} /> : '未知组件'}
    {target.suffix ? <span style={{ margin: '0 2px', whiteSpace: 'nowrap' }}>{target.suffix}</span> : null}


  </span>
}
const MySelect: TCommonComponent<IMySelectProps, string | number> = (props) => {


  const { onChange, value, marshal: _marshal, fetch_options, ...others } = props
  const { options, loading, data, setData } = use_options(props)
  const _style = getInputStyle(props)

  const marshal = getMarshal(props)
  const needToRenderComponent = options.some(_ => _.inputType);
  const type = get_mode(props)
  const is_multiple = check_multiple(props)



  function isChecked(value: any) {
    // return __data.some(d => d.value === value)
    return data.some(d => numberLikeCompare(d.value, value))

  }
  function safe_onChange(changedValue: ICommonOption[]) {
    // if (!changedValue.length) {
    //   return onChange?.(undefined)
    // }
    // const v = marshal ? (Number(marshal) == 2 ? changedValue : JSON.stringify(changedValue,)) : (type === 'single' ? (changedValue[0]?.value ?? null) : changedValue.map(_ => _.value).join(','))

    const v = parse_MC_value(props, changedValue)
    mchcLogger.log('abc', changedValue, marshal, v)
    onChange?.(v)
  }
  function handleChange(rawValue: any) {
    mchcLogger.log('handleChange1', rawValue)
    const checkedValues = (Array.isArray(rawValue) ? rawValue : [rawValue])

    const hasExclusiveItem = checkedValues
      .filter(v => {
        return !isChecked(v)
      })
      .find(v => {
        const option = options.find(o => o.value === v)
        return option?.exclusive
      })
    mchcLogger.log('handleChange2', hasExclusiveItem)
    const values = !isNil(hasExclusiveItem) ? [hasExclusiveItem] : checkedValues.filter(v => !options.find(_ => _.value === v)?.exclusive)
    mchcLogger.log('handleChange3', values)
    const changedData: ICommonOption[] = values
      .filter(v => is_multiple ? true : !isChecked(v))
      .map(v => {
        const option = options.find(o => o.value === v) ?? { label: v, value: v }
        const old = data.find(d => d.value === v)
        return { value: option?.value, label: option?.label, text: old?.text ?? undefined }
      })

    mchcLogger.log('handleChange4', changedData)
    setData(changedData)
    safe_onChange(changedData);
  };


  function handleInputChange(e: any, target: ICommonOption) {

    target.text = e;
    onChange?.(JSON.stringify(data));


  };
  const _value = is_multiple ? data.map(_ => _.value) : data[0]?.value

  const target = (Array.isArray(data) ? data : []).find(_ => _.inputType)
  // 多选不支持 非 marshal 不支持
  const isR = !is_multiple && marshal && target
  const select_node = loading ? <span>'数据加载中...'</span> : <Select loading={loading} style={_style} allowClear value={_value} onChange={handleChange} mode={type}   {...others} options={options as any} />
  return (
    isR ? <Row gutter={needToRenderComponent ? 6 : 0} >
      <Col span={needToRenderComponent ? 12 : 24}>
        {select_node}
      </Col>

      <Col span={needToRenderComponent ? 12 : 0}>
        {
          isR && <RenderComponent target={target} handleInputChange={handleInputChange} />
        }
      </Col>
    </Row> : select_node
  );
}


export default MySelect