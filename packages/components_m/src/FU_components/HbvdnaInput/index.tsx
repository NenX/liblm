import { Input } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
interface Iprops extends IMchc_FormDescriptions_Field {
  onChange?: Function;
  value?: string; // 'a,b,c'
  label: string;
  disabled?: boolean
}
enum UnitType {
  拷贝 = '拷贝',
  IU = 'IU'
}
export function HbvdnaInput(props: Iprops) {
  const { value, onChange, disabled } = props

  const [_value, set_value] = useState<string>()
  const [unitType, setUnitType] = useState(UnitType.拷贝)
  const [exponent, setExponent] = useState<string>()
  useEffect(() => {
    const safeValue = value || ''
    const arr = safeValue.split(',')

    arr[1] = arr[1] ?? UnitType.拷贝

    set_value(arr[0])
    setUnitType(arr[1] as any)
    setExponent(arr[2])
  }, [value])

  const isKaobei = unitType != UnitType.IU
  function handle_value(str: string) {
    onChange?.([str, unitType, exponent].join(','))
  }
  function handle_unit(str: UnitType) {
    onChange?.([_value, str, str === UnitType.IU ? undefined : exponent].join(','))

  }
  function handle_exponent(str: string) {
    onChange?.([_value, unitType, str].join(','))

  }
  return <span style={{ display: 'inline-block' }}>
    <Select style={{ width: 96 }} disabled={disabled} onChange={handle_unit} options={Object.keys(UnitType).map(_ => ({ value: UnitType[_], label: `${_}/ml` }))} value={unitType} />
    <Input disabled={disabled} style={{ width: isKaobei ? 50 : 90, marginLeft: 6 }} value={_value} onChange={e => handle_value(e.target.value)} />
    {isKaobei ? <> * 10 ^ <Input placeholder='次方' disabled={disabled} value={exponent} onChange={e => handle_exponent(e.target.value)} style={{ width: 46 }} /> </> : null}
  </span>
}

