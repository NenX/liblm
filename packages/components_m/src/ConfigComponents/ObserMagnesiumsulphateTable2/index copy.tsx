/*
 * @Descripttion: 项目描述
 * @Author: cjl
 * @Date: 2022-05-13 15:26:51
 * @LastEditTime: 2022-05-20 11:35:57
 */
import React from 'react';
import { GeneralComponents_EditInTable_Inner } from '../../GeneralComponents/EditInTable';
import { safe_json_parse } from '@lm_fe/utils';
import { get } from 'lodash';
import tableColumnsObj from './config/index';
export default function CustomEditInTable(props: any) {
  const { config, value, onChange, ...rest } = props;

  

  const specialConfig = safe_json_parse(get(config, 'specialConfig'));
  let tableColumns = get(specialConfig, 'tableColumns');
  if (typeof tableColumns == 'string') {
    tableColumns = tableColumnsObj[tableColumns] || [];
  }

  return  <GeneralComponents_EditInTable_Inner tableColumns={tableColumns} {...rest} onChange={onChange} value={value} />;
}
