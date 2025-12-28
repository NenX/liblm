import { get_old_address_options } from '@lm_fe/components';
import { mchcEvent } from '@lm_fe/env';
import { Button, Cascader, Input, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
interface IProps {
  id?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  onChange?: (value: string) => void;
  needStreet?: boolean;
  extra?: boolean | string;
  onExtra?: (name: string, value: string) => void;
  getPopupContainer?: any;
  bordered?: boolean;
  [key: string]: any;
}
export default function AddressInput({
  id,
  value,
  placeholder,
  name,
  onChange = () => { },
  disabled = false,
  size = 'middle',
  needStreet = true,
  extra = false,
  getPopupContainer = () => document.body,
  onExtra = () => { },
  bordered = true,
  residenceAddress = false, //同居住地
  permanentResidenceAddress = false, //同户籍地
  hubbywifeResidenceAddress = false,
  hubbyResidenceAddress = false,
  hubResidenceBywifeesidenceAddress = false,
  hubResidenceBywpAddress = false,
}: IProps) {



  const [pcasv, setPcasv] = useState<string[]>([]);
  const [detail, setDetail] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {


  }, []);

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
    const provincesArray = provinces && provinces.split(',');
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

  const handlePcasvChange = (val: string[]) => {
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

  const handleExtra = () => {
    const val = [...pcasv].join(',') + '&' + detail;
    onExtra(id, val);

  };
  //同居住地
  const handleresidenceAddress = () => {
    const val = [...pcasv].join(',') + '&' + detail;
    onExtra('residenceAddress', val);
  };
  const handleAdress = (key: string) => {
    return () => {
      const val = [...pcasv].join(',') + '&' + detail;
      onExtra(key, val);
      mchcEvent.emit('my_form', {
        type: 'onClick',
        btnName: 'address',
        values: { name, sourceKey: key }
      })
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
        {!!extra && (
          <Button
            ghost
            type="primary"
            onClick={handleExtra}
          >
            {typeof extra == 'string' ? extra : 'extra'}
          </Button>
        )}
        {permanentResidenceAddress && ( // 女方产休地址同女方同户籍地
          <Button
            ghost
            type="primary"
            onClick={handleAdress('permanentResidenceAddress')}
          >
            {typeof permanentResidenceAddress == 'string' ? permanentResidenceAddress : 'extra'}
          </Button>
        )}
        {/* // 女方产休地址同女方同居住地 */}
        {residenceAddress && (
          <Button
            ghost
            type="primary"
            onClick={handleAdress('residenceAddress')}
          >
            {typeof residenceAddress == 'string' ? residenceAddress : 'residenceAddress'}
          </Button>
        )}
        {
          // 男方户籍同女方户籍
          hubResidenceBywpAddress && (
            <Button
              ghost
              type="primary"
              onClick={handleAdress('hubResidenceBywpAddress')}
            >
              {typeof hubResidenceBywpAddress == 'string' ? hubResidenceBywpAddress : 'hubResidenceBywpAddress'}
            </Button>
          )
        }
        {
          // 男方户籍同女方居住地
          hubResidenceBywifeesidenceAddress && (
            <Button
              ghost
              type="primary"
              onClick={handleAdress('hubResidenceBywifeesidenceAddress')}
            >
              {typeof hubResidenceBywifeesidenceAddress == 'string'
                ? hubResidenceBywifeesidenceAddress
                : 'hubResidenceBywpAddress'}
            </Button>
          )
        }
        {
          //男方居住地址同男方户籍
          hubbyResidenceAddress && (
            <Button
              ghost
              type="primary"
              onClick={handleAdress('hubbyResidenceAddress')}
            >
              {typeof hubbyResidenceAddress == 'string' ? hubbyResidenceAddress : 'hubResidenceBywpAddress'}
            </Button>
          )
        }
        {
          //男方居住地址同女方居住地
          hubbywifeResidenceAddress && (
            <Button
              ghost
              type="primary"
              onClick={handleAdress('hubbywifeResidenceAddress')}
            >
              {typeof hubbywifeResidenceAddress == 'string' ? hubbywifeResidenceAddress : 'hubResidenceBywpAddress'}
            </Button>
          )
        }

      </Input.Group>
    </Tooltip>
  );
}
