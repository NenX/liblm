import { mchcEvent } from '@lm_fe/env';
import { Button, Cascader, Input, Tooltip } from 'antd';
import { cloneDeep, get, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { IMyAddressProps } from '../type';
import { get_old_address_options } from './options';

export default function MyAddressOld({
  id,
  value,
  name,
  onChange = () => { },
  disabled = false,
  size = 'middle',
  needStreet = true,
  getPopupContainer = () => document.body,

  bordered = true,
  form,
  addressBtns = []
}: IMyAddressProps) {



  const [pcasv, setPcasv] = useState<string[]>([]);
  const [detail, setDetail] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [text, setText] = useState('');


  useEffect(() => {
    get_old_address_options(needStreet).then(opt => {
      setOptions(opt)
    })

  }, []);

  useEffect(() => {
    if (!value) {
      return;
    }
    // “&”分割选择地址和详细地址
    let [provinces, detailed] = value.split('&');
    const provincesArray = provinces ? provinces.split(',') : [];
    let initPcasv = cloneDeep(provincesArray);
    // 兼容旧版本全是“,”分割的地址（省,市,区,街道,详细地址）
    if (!value.includes('&')) {
      initPcasv = provincesArray.slice(0, 3);
      detailed = provincesArray.slice(3).join(',');
    }
    setPcasv(initPcasv);
    setDetail(detailed);
    setText(value.replace(/,|&/g, ''));
  }, [value]);

  const handlePcasvChange = (val: any[]) => {
    setPcasv(val);
    const address = val.join(',') + '&' + detail;
    onChange(address);
  };

  const handleDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDetail(val);
    const address = [...pcasv].join(',') + '&' + val;
    onChange(address);
  };



  const handleAdress = (key: string) => {
    return () => {
      const sourceValue = get(form?.getFieldsValue(), key)
      if (sourceValue) {
        onChange?.(sourceValue)
      }


    };
  };

  const filter = (inputValue: string, path: any[]) => {
    return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  return (
    <Tooltip id={id} placement="topLeft" title={text}>
      <Input.Group compact style={{ display: 'flex' }}>
        <Input.Group style={{ flex: 1 }}>
          <Cascader
            allowClear
            size={size}
            bordered={bordered}
            disabled={disabled}
            options={options}
            onChange={handlePcasvChange}
            loadData={(arr) => {

            }}
            showSearch={{ filter }}
            placeholder="请选择地区"
            value={pcasv}
            style={{ width: '40%' }}
            getPopupContainer={getPopupContainer}
          />
          <Input
            size={size}
            disabled={disabled}
            bordered={bordered}
            placeholder="请输入详细地址，如街道名称、门牌号、小区、楼栋号、单元室"
            onChange={handleDetails}
            allowClear
            value={detail}
            style={{ width: '60%' }}
          />
        </Input.Group>

        {
          addressBtns.map(({ label, name, props = {} }) => {
            return <Button
              ghost
              type="primary"
              {...props}
              onClick={handleAdress(name)}
            >
              {label ?? 'label'}
            </Button>
          })
        }

      </Input.Group>
    </Tooltip>
  );
}
