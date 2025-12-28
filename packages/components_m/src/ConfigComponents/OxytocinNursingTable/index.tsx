import { GeneralComponents_EditInTable_Inner } from '../../GeneralComponents/EditInTable';
import { getTableColumns } from './table/index';
import React from 'react';
export default function CustomEditInTable(props: any) {
  const { config, value, onChange, ...rest } = props;

  const fetalCount = sessionStorage.getItem('fetalCount');
  let tableColumns = getTableColumns(Number(fetalCount));


  return <GeneralComponents_EditInTable_Inner tableColumns={tableColumns} {...rest} onChange={onChange} value={value} />;
}
