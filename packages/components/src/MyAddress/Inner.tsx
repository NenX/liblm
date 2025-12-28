import { IMchc_AddressItemType, SMchc_Address } from '@lm_fe/service';
import { Button, Cascader, Input, message, Tooltip } from 'antd';
import { get, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { IMyAddressProps } from './type';
import { checkFetchAddrOptionsNeed, parseValue } from './utils';
import { CopyOutlined } from '@ant-design/icons';
import { copyText } from '@lm_fe/utils';






export default function MyAddressNew(props: IMyAddressProps) {
  const {
    id, value, form, disabled, onChange,

    size = 'middle',
    getPopupContainer = () => document.body,
    bordered = true,

    addressBtns = []
  } = props
  function safeChange(str: string) {
    onChange?.(str)
  }

  const [detail, setDetail] = useState('');
  const [cascaderOptions, setCascaderOptions] = useState<IMchc_AddressItemType[]>([])
  const [cascaderValue, setCascaderValue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const task_queue = useRef<(() => Promise<void>)[]>([])

  // turn the concurrent reqs into linear ones
  async function consume() {
    const task = task_queue.current[0]
    if (task) {
      await task()
      task_queue.current.shift()
      consume()
    }
  }


  function __setCascaderValue(arr: string[]) {
    setCascaderValue(arr)
    cascaderValueCache.current = arr
  }
  function __setCascaderOptions(arr: IMchc_AddressItemType[]) {
    setCascaderOptions(arr)
    cascaderOptionsCache.current = arr
  }

  const valueCache = useRef<string>()
  const cascaderValueCache = useRef<string[]>([])
  const cascaderOptionsCache = useRef<IMchc_AddressItemType[]>([])

  valueCache.current = value



  useEffect(() => {
    // setLoading(true)
    // setTimeout(() => {
    //   const p = valueCache.current
    //     ? SMchc_Address.getAddressTree(valueCache.current)
    //     : SMchc_Address.getAddressFirst()

    //   p
    //     .then(res => {
    //       const list = Array.isArray(res) ? res : []
    //       __setCascaderOptions(list)
    //     })
    //     .finally(() => setLoading(false))

    // }, 1400);



  }, []);



  useEffect(() => {

    const { arr, str } = parseValue(value)
    setDetail(str);
    const flag = checkFetchAddrOptionsNeed(value, cascaderValueCache.current, cascaderOptionsCache.current)

    if (flag === 'noNeed') {
      __setCascaderValue(arr);
      return
    }

    const p = flag === 'init'
      // ? SMchc_Address.getAddressListFirst()
      ? SMchc_Address.getAddressFirst()
      : SMchc_Address.getAddressByDetail(value)

    const task = async () => {
      setLoading(true)

      try {
        const res = await p;
        const list = Array.isArray(res) ? res : []
        // 级联 options 和 value 不对应时候，必须同时更新，否则会报错


        __setCascaderOptions(list)
        __setCascaderValue(arr);
      } catch (e) {

      }
      setLoading(false)

    }
    if (task_queue.current.length) {
      task_queue.current.push(task)
    } else {
      task_queue.current.push(task)
      consume()
    }

    return () => {

    }
  }, [value]);

  const handlePcasvChange = (val?: (string | number)[]) => {
    const strArr = val?.map?.(_ => _?.toString() ?? '') ?? []
    __setCascaderValue(strArr)
    const address = strArr.join(',') + '&' + detail;
    safeChange(address);
  };

  const handleDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDetail(val);
    const address = [...cascaderValue].join(',') + '&' + val;
    safeChange(address);
  };



  const handleSameAdress = (key: string) => {
    return () => {
      const sourceValue = get(form?.getFieldsValue(), key)
      if (sourceValue) {
        safeChange?.(sourceValue)
      }


    };
  };
  function copy() {
    copyText(txt ?? '')
    message.success('复制成功')
  }
  if (loading) {
    return <span>数据加载中....</span>
  }

  const txt = value?.replace?.(/,|&/g, '')
  const node = <Input.Group compact style={{ display: 'flex' }}>
    <Input.Group style={{ flex: 1 }}>
      <Cascader
        changeOnSelect
        allowClear
        size={size}
        bordered={bordered}
        disabled={disabled}
        options={cascaderOptions}
        onChange={handlePcasvChange}
        loadData={(arr) => {
          if (arr) {
            const item = arr[arr.length - 1] as unknown as IMchc_AddressItemType
            if (item && isEmpty(item.children)) {
              item.loading = true
              SMchc_Address.getAddressList(item)
                .then(async r => {
                  // await sleep(.2)
                  item.loading = false
                  item.children = r
                  __setCascaderOptions([...cascaderOptions])
                })
            }
          }

        }}
        // showSearch={{ filter }}
        placeholder="请选择地区"
        value={cascaderValue}
        style={{ width: '50%' }}
        getPopupContainer={getPopupContainer}
      />
      <Input
        // title={txt}
        size={size}
        disabled={disabled}
        bordered={bordered}
        placeholder="请输入详细地址，如门牌号、小区、楼栋号、单元室"
        onChange={handleDetails}
        allowClear
        value={detail}
        style={{ width: '50%' }}
      />
    </Input.Group>

    {
      addressBtns.map(({ label, name, props = {} }) => {
        return <Button
          ghost
          type="primary"
          {...props}
          onClick={handleSameAdress(name)}
        >
          {label ?? 'label'}
        </Button>
      })
    }

  </Input.Group>
  return (
    <Tooltip
      id={id}
      placement="topLeft"
      title={
        <div>
          <span>{txt} </span>
          <span onClick={copy} style={{ cursor: 'pointer', outline: '2px solid #fff', wordBreak: 'keep-all' }}>点击复制</span>
        </ div>
      }
    >
      {node}
    </Tooltip>
  );
}
