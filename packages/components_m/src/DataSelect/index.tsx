import React, { useEffect, useState } from 'react';

import { TIdTypeCompatible } from '@lm_fe/service';
import { AnyObject, request } from '@lm_fe/utils';
import { SelectProps } from 'antd/lib/select';

import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


interface IProps extends SelectProps<any> {
  labelKey?: string;
  valueKey?: string;
  method?: 'get' | 'post' | 'put';
  url?: string;
  dataSource?: AnyObject[];
}
function DataSelect({ valueKey = 'value', labelKey = 'label', url, method = 'get', dataSource = [], ...rest }: IProps) {
  const Option = Select.Option;
  const [options, setOptions] = useState<AnyObject>(dataSource);
  useEffect(() => {
    url &&
      request[method](`/api/${url}`).then((r) => {
        const remote_data: any[] = r.data ?? []
        const path_arr = url?.split?.('?') ?? []
        const path = path_arr[0] ?? 'default'
        const old = obj.maps[path] ?? {}
        const x = remote_data.reduce((sum, _) => Object.assign(sum, { [_[valueKey]]: _ }), old)
        obj.maps[path] = x
        setOptions(r.data);
      });
  }, []);

  return (
    <Select {...rest}>
      {options &&
        options.map((_) => {
          const value = _[valueKey]
          return (
            <Option key={value} value={value}>
              {_[labelKey]}
            </Option>
          )
        })}
    </Select>
  );
};
const obj = Object.assign(DataSelect, {
  maps: {} as {
    [x: string]: { [id: string]: any }
  },
  get_data(name: string, id: TIdTypeCompatible) {
    const md = obj.maps[name] ?? {}
    return md[id]
  }
})

export default obj