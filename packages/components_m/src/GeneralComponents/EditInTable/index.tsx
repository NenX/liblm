import { BaseTable } from '../../BaseTable';
import React, { lazy } from 'react';
const GeneralComponents_EditInTable_Inner = lazy(() => import('./EditInTable_Inner'))
export const tableColumnsSpecialInputType = ['select_tag_with_options', 'tree_select_v2', 'tree_select'];
export default function GeneralComponents_EditInTable({ tableColumns, changeImmediate = true, Table = BaseTable }: any) {

  function GeneralComponents_EditInTable_Inner_Wrapper(props: any) {

    return <GeneralComponents_EditInTable_Inner {...props} tableColumns={tableColumns} changeImmediate={changeImmediate} Table={Table} />

  }

  return GeneralComponents_EditInTable_Inner_Wrapper
};
export { GeneralComponents_EditInTable_Inner }