import { MyCheckbox, MyIcon } from '@lm_fe/components';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field, SMchc_Admission } from '@lm_fe/service';
import { AnyObject, expect_array, formatDateTimeNoSecond, getSearchParamsValue, ICommonOption, identity, isArray, objectify, request, uuid } from '@lm_fe/utils';
import { Button, Form, message, Space, TablePaginationConfig } from 'antd';
import {
  cloneDeep,
  concat,
  debounce,
  filter,
  get,
  includes,
  isEmpty,
  isNil,
  keys,
  map,
  set, size
} from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { IMyBaseList_ColumnType } from 'src/FU_components/MyBaseList/types';
import BaseFormComponent, { componentMap } from '../../BaseFormComponent';
import { BaseTable } from '../../BaseTable';
import { FFF, PopconfirmComponent } from './components';
import { IEditInTable_InnerProps, IRenderOtherActionsProps } from './utils';

const defaultValue: any[] = [];
export default function GeneralComponents_EditInTable_Inner(innerProps: IEditInTable_InnerProps) {
  // const defaultSign = getSearchParamsValue('empname')
  const defaultSign = getSearchParamsValue('empid')
  const defaultSignData = {
    recorder: defaultSign,
    sign: defaultSign,
    nurseSignature: defaultSign,
    responsibleSign: defaultSign,
    auditorSign: defaultSign,
  }
  const {
    sp,
    default_page_size = 10,
    defaultInputData = {},
    type = 'modal',
    changeImmediate = true,
    RenderOtherActions = DefaultRenderOtherActions,
    disabled: disabledAll,
    formInstance,
    EditInTable_beforeAdd,
    fd_append_row = []
  } = innerProps


  const isSetLast = useRef(false);
  const [_formInstance] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [pageSize, setPageSize] = useState(default_page_size)
  const [pageIdx, setPageIdx] = useState(1)
  const [row_filter_data, setRow_filter_data] = useState<ICommonOption[]>([])

  const [userSignOptions, setUserSignOptions] = useState<{ "name": string, "login": string }[]>([])

  const old_dataSource = useRef<any[]>([]);


  function _defaultInputData() {
    const datetime = formatDateTimeNoSecond()
    return {
      recordTime: datetime,
      recordDateTime: datetime,
      date: datetime,
      ...defaultSignData,
      ...defaultInputData,
      // recordDate: formatDateTimeNoSecond()
    }
  }
  const _tableColumns = expect_array<IMchc_FormDescriptions_Field>(innerProps.tableColumns ?? innerProps.fds).filter(identity)
  const isShowCalcInputOutput = _tableColumns.some(_ => _.title?.includes('出量'))
  const 出入量_options = () => dataSource.map(_ => ({ label: _.recordTime, value: _.key }))
  const __tableColumns = type == 'modal' ? [..._tableColumns, {
    title: '操作',
    fixed: 'right',
    align: 'center',
    width: 40,
    render(a: any, b: any, index: number) {
      if (row_disabled(b)) return null
      const v = getItem(dataSource, pagination, index)


      return <>
        <Button icon={<MyIcon value='DeleteOutlined' />} type={b.modifyFlag ? 'dashed' : 'text'} size='small' danger onClick={e => handleDeleteOne(v)}></Button>
      </ >
    }
  }] : _tableColumns





  let addedNum = useRef(0);
  let onChangeRef = useRef(safeOnChange);
  onChangeRef.current = safeOnChange


  const rawValue = useRef<any[]>([])

  const __formInstance = formInstance ?? _formInstance
  const pagination = innerProps.pagination ?? {
    pageSizeOptions: ['5', '10', '20', '40'],
    pageSize,
    size: 'small',
    onChange(page, pageSize) {
      setPageIdx(page)
      setPageSize(pageSize!)
      syncData()
    },
    current: pageIdx,
    showSizeChanger: true,
    position: ['bottomCenter']
  }
  function safeOnChange(v: any[]) {

    innerProps.onChange?.(v)
    rawValue.current = v
    setDataSource(v)
  }



  useEffect(() => {
    const data = innerProps.value ?? defaultValue
    const safeValue = data
      .filter(_ => !_.deleteFlag)
      .map((item) => ({ ...item, key: item.id || item.key, }))
    setDataSource(safeValue)
    if (safeValue.length && !isSetLast.current) {
      const _pageIdx = Math.ceil(safeValue.length / pagination.pageSize!)
      pagination.current = _pageIdx
      setPageIdx(_pageIdx)
      isSetLast.current = true
    }
    rawValue.current = safeValue


    return () => {

    }
  }, [innerProps.value])

  useEffect(() => {


    const _curIdx = (pageIdx - 1) * pageSize
    const formData = dataSource.slice(_curIdx, _curIdx + pageSize)

    setFormData(formData)

    // console.log('useEffect form', dataSource, formData, _curIdx)
    mchcEnv.setGlobalCache('doc_arr', dataSource)
  }, [pageIdx, pageSize, dataSource])

  useEffect(() => {

    if (mchcEnv.is('广三')) {
      request.get<{ "name": string, "login": string }[]>('/api/getUserSign')
        .then(res => {
          const list = res.data ?? []
          setUserSignOptions(list)
        })
    }

    return () => {

    }
  }, [])


  const mapFormDataToDatasource = (formData: AnyObject = __formInstance.getFieldsValue(), changedKey: string = '') => {
    const __list = [...dataSource].map(_ => {
      const form_item = formData[_.key] || {}
      if (!form_item) return _
      return { ..._, ...form_item, modifyFlag: true }
    })

    return Object.values(__list);
  }

  function processNewData(row: AnyObject) {

    const newData = Object.assign({}, row, _defaultInputData(), { key: genRandomKey(), })
    return EditInTable_beforeAdd?.(newData, rawValue.current) ?? newData
  }
  function addOne(row: AnyObject) {
    // if (type === 'modal') {
    //   return openModal()
    // }
    const newRow = processNewData(row)

    const newData = [
      ...rawValue.current,
      newRow,
    ];
    return newData


  };

  function addMany(row: AnyObject[] = []) {
    // if (type === 'modal') {
    //   return openModal()
    // }
    const newRows = row.map(processNewData)
    const newData = [
      ...rawValue.current,
      ...newRows,
    ];
    return newData




  };
  function addOneOrMany(row: AnyObject | AnyObject[] = {}) {
    // if (type === 'modal') {
    //   return openModal()
    // }
    mchcLogger.log('handleAdd', { row })
    if (!row) return
    let newData = Array.isArray(row) ? addMany(row) : addOne(row)
    const _pageIdx = Math.ceil(newData.length / pagination.pageSize!)

    setPageIdx(_pageIdx)
    safeOnChange?.(newData);

  };



  function getAllColumnsMapping(_tableColumns: AnyObject) {
    let tempColumns: any = [];
    map(_tableColumns, (col) => {
      const colChildren = get(col, 'children');
      if (colChildren && !isEmpty(colChildren)) {
        tempColumns = concat(tempColumns, getAllColumnsMapping(colChildren));
      } else {
        tempColumns.push(col);
      }
    });
    return tempColumns;
  };

  function setFormData(_rows: any[]) {

    const old_form_data = __formInstance.getFieldsValue()
    const old_form_keys = Object.keys(old_form_data)
    const form_data_keys = _rows.filter(_ => !_.disabled).map(f => f.key.toString())

    if (form_data_keys.every(f => old_form_keys.includes(f)) && old_form_keys.every(f => form_data_keys.includes(f))) {
      return
    }


    const x = objectify(_rows, _ => _.key)
    __formInstance.setFieldsValue(x);
  };
  function row_disabled(rowData: any) {
    return rowData.disabled || disabledAll
  }
  async function handleDelete() {

    const cloneData = cloneDeep(dataSource);
    map(cloneData, (item, index) => {
      if (size(item) === 1) {
        set(cloneData, index, { ...get(rawValue.current, index), ...item });
      }
    });

    const newDataSource = filter(cloneData, (data) => !includes(selectedRowKeys, data.key));


    setSelectedRowKeys([])

    safeOnChange(newDataSource);
  };
  async function handleDeleteOne(item: any) {
    const isOk = window.confirm('确定删除吗？')
    if (!isOk) return
    const cloneData = cloneDeep(dataSource);


    const newDataSource = filter(cloneData, (data) => data.key !== item.key);



    safeOnChange(newDataSource);
    const newIdx = Math.ceil(newDataSource.length / pagination.pageSize!)

    if (newIdx < pageIdx)
      setPageIdx(newIdx)

  };







  const handleFieldsChange = debounce(function handleFieldsChange(changedFields: AnyObject[], allFields: AnyObject) {
    const changedKey = keys(changedFields)[0]
    mchcLogger.log('changedFields', { allFields, changedFields })
    if (changeImmediate) {
      syncData(allFields, changedKey)
    }
  }, 500)






  // 添加 getDataSource 方法，重新渲染预览模式下的表格数据，主要是针对非输入项的 mapping 值
  function getDataSource() {
    const arr = map(dataSource, (rowData) => {
      const tempRowData = { ...rowData };

      return tempRowData;
    })
    if (size(row_filter_data) !== 0) {
      return arr.filter(_ => row_filter_data.some(f => {
        if (!f.value) return true
        return !isNil(_[f.value])
      }))
    }
    return arr
  };


  function syncData(formData: AnyObject = __formInstance.getFieldsValue(), changedKey: string = '') {
    const d = mapFormDataToDatasource(formData, changedKey)
    safeOnChange(d)
  }
  function displaySign(_sign_value?: string) {
    const str = _sign_value ?? ''
    const arr = str.split('/').map(s => {
      const signData = userSignOptions.find(o => o.login === s)
      return signData?.name ?? s
    })
    return arr.join('/')
  }

  function getColumns(_tableColumns: any): any {
    const arr = map(_tableColumns, (col: IMyBaseList_ColumnType) => {


      const dataIndex = Array.isArray(col.dataIndex) ? col.dataIndex.join(',') : (col.dataIndex ?? '')
      const inputType: keyof typeof componentMap = col.inputType as any
      const inputProps: any = col.inputProps ?? {}
      const isPop = inputProps?.isPop

      const children = get(col, 'children')
      if (children) {
        return {
          ...col,
          children: getColumns(children),
        };
      } else {
        if (!col.inputType) {
          return col;
        }
        return {
          ...col,
          render(__value: any, _: any, rowIndex: any) {
            const rowData: any = getItem(dataSource, pagination, rowIndex)
            if (!rowData) return ''
            const calc_disabled = row_disabled(rowData)
            // const realValue = get(__formInstance.getFieldValue(rowData.key), dataIndex)

            // const C: any = componentMap[inputType] ?? (() => null)
            const DisplayFC = componentMap[inputType]?.DisplayFC
            // const v = getItem(dataSource,pagination,rowIndex)
            const _displayNode = DisplayFC ? <DisplayFC record={rowData} disabled={rowData.disabled} value={__value} {...inputProps} /> : __value
            if (calc_disabled) return col.render ? col.render(__value, _, rowIndex) : _displayNode
            const common = {
              disabled: row_disabled(rowData),
              popupStyle: { zIndex: 9999 },
              dropdownStyle: { zIndex: 9999 },
              style: { zIndex: 9999 },
              ...inputProps,
              placeholder: '',
              inputType,
              config: col,
            }
            const _node = (inputType) ? (
              isPop ? <PopconfirmComponent

                C={BaseFormComponent}
                CProps={common}
              >
                {_displayNode}
              </PopconfirmComponent > : <BaseFormComponent {...common} style={{}} />

            ) : _displayNode
            return <Form.Item
              name={[rowData.key, dataIndex]}
              style={{
                margin: 0,
                // display: 'inline-block'
              }}
            >
              {_node}
            </Form.Item>
          }

        };
      }
    });

    return arr
  };


  const mergedColumns = getColumns(__tableColumns);

  const mergedDataSource = getDataSource();
  return (
    <>
      {
        isArray(sp)
          ? <div style={{ padding: '6px 12px' }}>
            <span>筛选：</span>
            <MyCheckbox type='multiple' options={sp} marshal={2} onChange={setRow_filter_data} />
          </div>
          : null
      }

      <Form

        className="xx_edit_form"
        form={__formInstance}
        component={false}
        onValuesChange={handleFieldsChange}
      >
        <BaseTable
          size='small'
          {...innerProps}
          columns={mergedColumns}
          dataSource={mergedDataSource}
          scroll={{ y: 380 }}
          rowSelection={false ? {
            type: 'radio',
            onChange: setSelectedRowKeys,
            columnWidth: 20,
          } : undefined}
          selectedRowKeys={selectedRowKeys}
          onAdd={() => addOneOrMany()}
          rowKey="key"
          components={{
            body: {
              // cell: renderEditableCell,
            },
          }}
          pagination={type == 'inner' ? false : pagination}
          OtherActionsNode={

            <Space>

              {
                isShowCalcInputOutput ? <FFF
                  disabled={disabledAll}
                  config={{
                    processDataAsync: async (rowData, listData) => {

                      const { k1, k2 } = rowData
                      if (k1 && k2) {
                        const startIdx = listData.findIndex(d => d.key === k1)
                        const endidx = listData.findIndex(d => d.key === k2)

                        const res = await SMchc_Admission.calculateTotalInputAndOutput(listData.slice(startIdx, endidx + 1))
                        return res
                      } else {
                        message.warning('请先选定一条记录以计算出入量！');
                        return null
                      }
                    },
                    btnProps: { children: '出入量计算' },
                    fds: [
                      {
                        inputType: 'MS',
                        name: 'k1',
                        label: '开始时间',
                        inputProps: {
                          options: 出入量_options, marshal: 0
                        }
                      },
                      {
                        inputType: 'MS',
                        name: 'k2',
                        label: '结束时间',

                        inputProps: { options: 出入量_options, marshal: 0 }
                      },
                    ]
                  }}
                  arr={dataSource}
                  onSelect={addOneOrMany}
                /> : '.'
              }


              {
                fd_append_row.map(config => {
                  return <FFF disabled={disabledAll} config={config} arr={dataSource} onSelect={addOneOrMany} />
                })
              }
            </Space>
          }
        />

      </Form>
    </>
  );
}
function DefaultRenderOtherActions(props: IRenderOtherActionsProps) {
  const { isEditing, disabled, handleCancel, handleDelete, handleEdit, handleSave, selectedRowKeys } = props

  return (
    <>
      {isEditing ?
        (
          <Button type="primary" style={{ margin: '0 16px' }} onClick={handleSave}>
            确定
          </Button>
        ) : (
          <Button disabled={disabled} style={{ margin: '0 16px' }} onClick={handleEdit}>
            编辑
          </Button>
        )}
      {isEditing ? (
        <Button onClick={handleCancel}>取消</Button>
      ) : (
        <Button
          type="primary"
          danger
          onClick={handleDelete}
          disabled={disabled || isNil(selectedRowKeys) || isEmpty(selectedRowKeys)}
        >
          删除
        </Button>
      )}
    </>
  );
}



function genRandomKey() {
  return uuid().split('-').join('')
}
function getItem(data: any[], p: TablePaginationConfig, idx: number) {
  const current = p.current ?? 1
  const pageSize = p.pageSize ?? 1
  const curIdx = (current - 1) * pageSize
  const sliceData = data.slice(curIdx, curIdx + pageSize)
  return sliceData[idx]
}



