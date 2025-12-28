import { LazyAntd } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from '@lm_fe/service';
import { uuid } from '@lm_fe/utils';
import { Button, Space, TableProps } from 'antd';
import { cloneDeep, identity, indexOf, isArray, isEmpty, isEqual, join, set } from 'lodash';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { MyLazyComponent } from '../../MyLazyComponent';
import { useMarshal } from '../../utils/useMarshal';
import { TCommonComponent } from '../types';
import styles from './index.module.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


const BaseFormComponent = lazy(() => import('../../BaseFormComponent'));
interface IProps extends Omit<TableProps<any>, 'onChange'> {
  disabled?: boolean
  formDescriptions?: IMchc_FormDescriptions_Field_Nullable[]
  value?: any[]
  onChange?(v: any[]): void
  marshal?: boolean
  showEdit?: boolean
  showTitle?: boolean
  hideAction?: boolean
  frontCols?: any[]
  backCols?: any[]
  rowKey?: string
  changeImmediate?: boolean
  genRowData?: (list: any[]) => any
}
export const MyEditTable: TCommonComponent<IProps, string | any[]> = (props) => {
  const { formDescriptions = [], value, showTitle, changeImmediate, disabled, onChange, marshal, scroll, showEdit, frontCols, backCols, rowKey = '_key', genRowData, ...others } = props
  const hideAction = props.hideAction || disabled
  const defaultValue = useRef<any[]>([])

  const { safe_value = [], set_safe_value, onChangeSafeValue } = useMarshal<any[]>(marshal, value ?? defaultValue.current, onChange, 'MyEditTable')
  const columns = useRef<IMchc_FormDescriptions_Field_Nullable[]>([])
  columns.current = formDescriptions ?? []
  const [dataSource, set_dataSource] = useState<any[]>([])
  const [selectedRowKeys, set_selectedRowKeys] = useState([])
  const [editingCol, set_editingCol] = useState<string | string[]>()
  const [editingRow, set_editingRow] = useState<number>()
  const [editingValue, set_editingValue] = useState()

  const changeCb = (value: any, rowIndex?: any, dataIndex?: string | string[]) => {

    let path = dataIndex;
    if (isArray(dataIndex)) {
      path = join(dataIndex, '.');
    }
    const oldRow = __safe_value_cache.current[rowIndex]
    const data = __safe_value_cache.current[rowIndex] = cloneDeep(oldRow);
    set(data, `${path}`, value);

    onChangeSafeValue(__safe_value_cache.current);
  }


  const [__safe_value, set__safe_value] = useState<any[]>([])
  const __safe_value_cache = useRef<any[]>([])
  useEffect(() => {
    const arr = safe_value.map(_ => ({ ..._, [rowKey]: _.id ?? _[rowKey] ?? uuid() }))
    set__safe_value(arr)
    __safe_value_cache.current = arr
  }, [safe_value])


  function formatColumns(columns: IMchc_FormDescriptions_Field_Nullable[], isParent = true): any[] {
    const { onChange } = props;
    const cols =
      columns.filter(identity)
        .map((column: any) => {
          const { children = [], align, width, render } = column;
          const inputType = column.inputType;
          const dataIndex = SMchc_FormDescriptions.get_form_item_name_str(column);
          const title = SMchc_FormDescriptions.get_form_item_title(column);
          const inputProps = column.inputProps
          const editable = !inputProps?.disabled;
          if (!isEmpty(children)) {
            return {
              ...column,
              children: formatColumns(children, false),
            };
          }
          if (!editable) {
            return {
              ...column,
              ellipsis: showTitle ? { showTitle: true } : undefined,
              title,
              dataIndex,
            };
          }
          return {
            ...column,
            align: align || 'center',
            title,
            width,
            dataIndex,
            render:
              // render || 
              (
                (value: any, rowData: any, rowIndex: number) => {

                  const isEditingThis = (isEqual(editingCol, dataIndex) && editingRow === rowIndex && editable)
                  const isEditing = (isEditingThis || showEdit)
                  return <div title={showTitle ? value : undefined}>
                    {
                      isEditing ? (
                        <MyLazyComponent fallback={"..."}>
                          <BaseFormComponent
                            {...inputProps}
                            disabled={disabled}
                            inputProps={inputProps}
                            key={rowIndex}
                            size="small"
                            inputType={inputType}
                            value={isEditingThis ? editingValue : value}
                            autoFocus={!showEdit}
                            defaultOpen={!showEdit}
                            // title={showTitle ? value : undefined}
                            onBlur={(event: any) => {
                              set_editingRow(undefined)
                              set_editingCol(undefined)
                              set_editingValue(undefined)
                              if (!changeImmediate) {
                                changeCb(editingValue, editingRow, editingCol);

                                // mchcLogger.log('blur', { event, target: event.target, editingValue, editingRow, editingCol })
                              }


                            }}
                            onChange={(value: any) => {
                              if (changeImmediate) {
                                changeCb(value, rowIndex, dataIndex);

                              } else {
                                set_editingRow(rowIndex)
                                set_editingCol(dataIndex)
                                set_editingValue(value)
                              }

                            }}
                            config={column}

                          />
                        </MyLazyComponent>
                      ) : (
                        <div
                          style={{ minHeight: 20 }}
                          onClick={() => {
                            if (disabled || !inputType) return

                            set_editingRow(rowIndex)
                            set_editingCol(dataIndex)
                            set_editingValue(value)
                          }}
                        >
                          {render ? render(value, rowData, rowIndex) :
                            <MyLazyComponent fallback={"..."}>

                              <BaseFormComponent
                                {...inputProps}
                                inputProps={inputProps}
                                key={rowIndex}
                                size="small"
                                display
                                inputType={inputType}
                                value={value}
                                config={column}

                              />
                            </MyLazyComponent>
                          }
                        </div>
                      )
                    }

                  </div>
                }
              )
          };
        });
    if (isParent && frontCols) {
      cols.unshift(...frontCols)
    }
    if (isParent && backCols) {
      cols.push(...backCols)
    }
    return cols
  };




  function handleAdd() {
    const uid = uuid()
    const userData = genRowData?.(__safe_value)
    const newItem = Object.assign({}, userData, { [rowKey]: uid, })
    const newData = [
      ...__safe_value,
      newItem,
    ]
    onChangeSafeValue(newData)
    mchcLogger.log('add', newData)
  };

  function handleRowSelectChange(_selectedRowKeys: any) {
    set_selectedRowKeys(
      _selectedRowKeys,
    );
  };

  function handlePatchDelete() {
    const newDataSource = __safe_value.filter((data) => indexOf(selectedRowKeys, data[rowKey]) === -1);
    onChangeSafeValue?.(newDataSource);

  };
  function handleCopy() {
    let newDataSource = __safe_value.filter((data) => indexOf(selectedRowKeys, data[rowKey]) !== -1);
    newDataSource = newDataSource
      .map(_ => ({ ..._, [rowKey]: uuid(), id: undefined }))
    onChangeSafeValue?.([...safe_value, ...newDataSource]);

  };



  return (
    <div className={styles["pd-procedure-table"]}>
      <div hidden={hideAction} className={styles["pd-procedure-table__header"]}>
        <Space size="small" style={{ marginBottom: 6 }}>
          <Button type="primary" ghost onClick={handleAdd}>
            新增
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={handleCopy}>
            复制
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={handlePatchDelete}>
            删除
          </Button>
        </Space>
      </div>
      <Table
        className={styles["my-table"]}
        rowSelection={hideAction ? undefined : { selectedRowKeys, onChange: handleRowSelectChange }}
        rowKey={rowKey}
        bordered
        columns={formatColumns(formDescriptions)}
        dataSource={__safe_value}
        pagination={false}
        scroll={scroll ?? { y: 350 }}
        {...others}
        size="small"

      />
    </div>
  );
}
MyEditTable.DisplayFC = (props) => {
  const {
    value,
    onChange,
    marshal = true,
  } = props


  const { safe_value = [], set_safe_value, onChangeSafeValue } = useMarshal<any[]>(marshal, value ?? [], onChange)

  return <div>
    {safe_value.length}项
  </div>
}