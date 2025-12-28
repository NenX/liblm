import { Alert, Button, Form, FormInstance, message, Popconfirm, Space, TablePaginationConfig } from 'antd';
import {
  cloneDeep,
  concat,
  filter,
  get,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isNil,
  join,
  keyBy,
  map,
  set, size, split, debounce, throttle
} from 'lodash';
import { FC, useRef, useState, useEffect, useCallback } from 'react';
import BaseFormComponent, { componentMap } from '../../BaseFormComponent';
import { BaseTable } from '../../BaseTable';
import { SLocal_Dictionary } from '@lm_fe/service';
import { formatDate, formatDateTime, formatDateTimeNoSecond, getSearchParamsValue, isMoment, request } from '@lm_fe/utils';
import dayjs from 'dayjs';
import { mchcModal } from '../../modals';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
interface IRenderOtherActionsProps {
  isEditing: boolean,
  disabled?: boolean,
  handleSave: () => void,
  handleEdit: () => void,
  handleCancel: () => void,
  handleDelete: () => Promise<void>,
  selectedRowKeys: any[],
}
interface IEditInTable_InnerProps {
  tableColumns: any[]
  changeImmediate?: boolean
  RenderOtherActions?: FC<IRenderOtherActionsProps>
  value: any
  disabled?: boolean
  onChange?(v: any): any
  defaultInputData?: any
  type: 'modal' | 'inner'
  pagination?: TablePaginationConfig

}
const defaultValue: any[] = [];
export function GeneralComponents_EditInTable_Inner(innerProps: IEditInTable_InnerProps) {
  const {


    type = 'modal',
    changeImmediate = true,
    RenderOtherActions = DefaultRenderOtherActions,
    disabled, onChange,
    defaultInputData = {
      recordTime: formatDateTimeNoSecond(),
      recordDateTime: formatDateTimeNoSecond(),
      date: formatDateTimeNoSecond(),
      recorder: getSearchParamsValue('empname'),
      sign: getSearchParamsValue('empname'),
      nurseSignature: getSearchParamsValue('empname'),
      responsibleSign: getSearchParamsValue('empname'),
      auditorSign: getSearchParamsValue('empname'),

      // recordDate: formatDateTimeNoSecond()
    } } = innerProps
  const _tableColumns = innerProps.tableColumns ?? []
  const isShowCalcInputOutput = mchcEnv.is('广三') && _tableColumns.some(_ => _.title?.includes('出量'))
  const tableColumns = type == 'modal' ? [..._tableColumns, {
    title: '操作',
    fixed: 'right',
    align: 'center',
    width: 90,
    render(a: any, b: any, index: number) {
      const v = getItem(dataSource, pagination, index)
      const targetKey = selectedRowKeys[0]

      return <Space>
        <Button hidden={!isShowCalcInputOutput} size='small' onClick={() => {
          const cur = getItem(dataSource, pagination, index)
          if (targetKey) {
            const startIdx = dataSource.findIndex(d => d.key === targetKey)
            const endIdx = dataSource.findIndex(_ => _.key === cur.key)
            request.post('/api/calculateTotalInputAndOutput', dataSource.slice(startIdx, endIdx)).then(res => {
              const newData = [...dataSource]
              newData.splice(endIdx, 1, { ...cur, ...res.data })
              doOutData(newData)
              message.success('操作成功！')
            })
          } else {
            message.warning('请先选定一条记录！');
          }
        }}>计算出入量</Button>
        {/* <Button size='small' onClick={e => openModal(v)}>编辑</Button> */}
        <Button size='small' danger onClick={e => handleDeleteOne(v)}>删除</Button>
      </Space >
    }
  }] : _tableColumns





  let addedNum = useRef(0);
  let onChangeRef = useRef(onChange);
  onChangeRef.current = onChange
  const isSetLast = useRef(false);
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [oldDataSource, setOldDataSource] = useState<any[]>([])
  const [pageSize, setPageSize] = useState(8)
  const [pageIdx, setPageIdx] = useState(1)
  const rawValue = useRef<any[]>([])

  const pagination = innerProps.pagination ?? {
    pageSizeOptions: ['5', '10', '20', '40'],
    pageSize,
    onChange(page, pageSize) {
      setPageIdx(page)
      setPageSize(pageSize!)
    },
    current: pageIdx,
    showSizeChanger: true,
    position: ['bottomCenter']
  }
  useEffect(() => {
    const data = innerProps.value ?? defaultValue
    const safeValue: any[] = data.map((item: any) => ({ ...item, key: item.id ?? item.key, }))
    setDataSource(safeValue)
    if (safeValue.length && !isSetLast.current) {
      setPageIdx(Math.ceil(safeValue.length / pagination.pageSize!))
      isSetLast.current = true
    }
    rawValue.current = safeValue
    setFormData(safeValue)
    return () => {

    }
  }, [innerProps.value])

  const doOutData = useCallback(
    (dataSource: any) => {
      const outData = map(dataSource, (data) => {
        const tempData = { ...data };
        map(data, (item, key) => {
          if (split(key, ',').length > 1) {
            set(tempData, split(key, ','), item);
          }
        });
        return tempData;
      });
      onChangeRef.current?.(outData);
    },
    [],
  )


  const mapFormDataToDatasource = useCallback(
    (formData: object = form.getFieldsValue()) => {
      const oldData = rawValue.current
      const _dataSource: any = [];
      const d = rawValue.current
      map(formData, (value, key) => {
        const names = split(key, '-');
        const id = names[0]
        const idx = d.findIndex(_ => _.key == id)
        let tempValue: any = value;
        if (isMoment(tempValue)) {
          tempValue = formatDate(tempValue);
        }
        set(d, `${idx}.${names[1]}`, tempValue);
      });
      map(d, (data: object, index: number) => {
        _dataSource[index] = {
          ...data,
          type: 2,
          id: get(oldData, `${index}.id`),
          key: genRandomKey(),
        };
      });
      return d;
    },
    [],
  )



  function getItem(data: any[], p: TablePaginationConfig, idx: number) {
    const current = p.current ?? 1
    const pageSize = p.pageSize ?? 1
    const curIdx = (current - 1) * pageSize
    console.log('curIdx', curIdx, curIdx + pageSize)
    const sliceData = data.slice(curIdx, curIdx + pageSize)
    return sliceData[idx]
  }
  function handleAdd() {
    // if (type === 'modal') {
    //   return openModal()
    // }
    if (isEditing) {
      addedNum.current += 1;
    }

    const newDataSource = [
      ...rawValue.current,
      {
        ...defaultInputData,
        key: genRandomKey(),
      },
    ];

    setOldDataSource(dataSource)
    setDataSource(newDataSource)
    setFormData(newDataSource);
    console.log('newDataSource', newDataSource)
    setIsEditing(true)

    setPageIdx(Math.ceil(newDataSource.length / pagination.pageSize!))

    onChange?.(newDataSource, { isAdd: true });
  };

  function handleEdit() {
    setFormData(dataSource);
    setIsEditing(true)
    setOldDataSource(dataSource)

  };

  function getAllColumnsMapping(_tableColumns: any) {
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
    const formData = {};
    // const allColumns = getAllColumnsMapping(tableColumns);
    // const allColumnsMapping = keyBy(allColumns, 'dataIndex');
    map(_rows, (item, index) => {
      map(item, (value, key) => {
        // const inputType = get(allColumnsMapping, `${key}.inputType`);
        let tempValue = value;
        // if (inputType === 'single_date_picker') {
        //   tempValue = dayjs(tempValue);
        // }
        const formItemId = genFormItemName(item, key)
        if (key !== 'key') {
          if (Object.prototype.toString.call(value) === '[object Object]') {
            // 新增 value 可能是子对象的情况
            map(value, (item, itemKey) => {
              set(formData, `${formItemId},${itemKey}`, item);
            });
          } else {
            set(formData, `${formItemId}`, tempValue);
          }
        }
      });
    });
    console.log('form', formData)
    form.resetFields();
    form.setFieldsValue(formData);
    return formData
  };

  async function handleDelete() {

    const cloneData = cloneDeep(dataSource);
    map(cloneData, (item, index) => {
      if (size(item) === 1) {
        set(cloneData, index, { ...get(rawValue.current, index), ...item });
      }
    });

    const newDataSource = filter(cloneData, (data) => !includes(selectedRowKeys, data.key));


    setDataSource(newDataSource)
    setSelectedRowKeys([])

    doOutData(newDataSource);
  };
  async function handleDeleteOne(item: any) {
    const isOk = window.confirm('确定删除吗？')
    if (!isOk) return
    const cloneData = cloneDeep(dataSource);


    const newDataSource = filter(cloneData, (data) => data.key !== item.key);


    setDataSource(newDataSource)

    doOutData(newDataSource);
  };

  function handleCancel() {
    setFormData(oldDataSource);
    setIsEditing(false)
    setDataSource(dataSource.slice(0, dataSource.length - addedNum.current))



    addedNum.current = 0;
  };

  function handleSave() {
    if (changeImmediate) {
      return handleCancel()
    }
    const dataSource = mapFormDataToDatasource();
    doOutData(dataSource);


    setIsEditing(false)
    setDataSource(dataSource)

    addedNum.current = 0;
  };




  const handleFieldsChange = useCallback(
    debounce(function handleFieldsChange(changedFields: any[], allFields: object) {

      if (form && changeImmediate) {
        const d = mapFormDataToDatasource(allFields);
        mchcLogger.log('handleFieldsChange', changedFields)
        doOutData(d);
      }
    }, 1000),
    [mapFormDataToDatasource, changeImmediate, doOutData],
  )






  // 添加 getDataSource 方法，重新渲染预览模式下的表格数据，主要是针对非输入项的 mapping 值
  function getDataSource() {
    const allTableColumns = getAllColumnsMapping(tableColumns);
    return map(dataSource, (rowData) => {
      const tempRowData = cloneDeep(rowData);
      map(allTableColumns, (col: any) => {
        const { inputType, inputProps, dataIndex } = col;
        if (isArray(dataIndex)) {
          set(tempRowData, dataIndex, get(rowData, join(dataIndex, ',')) || get(rowData, dataIndex));
        }
        if (isArray(get(rowData, dataIndex))) {
          set(tempRowData, dataIndex, join(get(rowData, dataIndex), ','));
        }
        // 如果是从字典获取 options
        if (inputType === 'dictionary_select_in_table') {
          const uniqueKey = get(inputProps, 'uniqueKey');
          const enums = SLocal_Dictionary.getDictionariesEnumerations(uniqueKey)

          const optionMapping = keyBy(enums, 'value');
          map(rowData, (item, index) => {
            if (isEqual(index, dataIndex) || isEqual(index, join(dataIndex, ','))) {
              set(tempRowData, dataIndex, get(optionMapping, `${item}.label`));
            }
          });
        }
        // 如果是从 select_with_options 获取
        if (inputType === 'select_with_options') {
          const { options } = inputProps;
          set(tempRowData, dataIndex, get(keyBy(options, 'value'), `${get(rowData, dataIndex)}.label`));
        }
      });
      return tempRowData;
    });
  };
  function openModal(data?: any) {
    const isNew = !data
    data = data ?? defaultInputData
    const configs: any[] = []
    tableColumns.forEach((e: any) => {
      if (e.children) {
        const e_c = e.children.map((_: any) => ({ ..._, isSon: true }))

        e_c.forEach((c: any) => {
          if (c.children) {
            const e_c_c = c.children.map((_: any) => ({ ..._, title: `${c.title && ''} ${_.title}`, isSon: true }))

            configs.push(...e_c_c)



          } else {
            configs.push({ ...c, title: `${e.title && ''} ${c.title}` })
          }
        });




      } else {
        configs.push(e)
      }
    });
    const formDescriptions = configs
      .filter((_: any) => _.inputType)
      .map((_: any) => {
        return { ..._, key: _.dataIndex, label: _.title, span: 12, offset: 0 }
      })
    mchcModal.open('modal_form', {
      width: "68vw",
      modal_data: {
        formDescriptions,
        labelCol: 8,
        wrapperCol: 8,
        onValuesChange: async (val, allval, form) => {

        },
        async onSubmit(values: any) {
          const oldIdx = dataSource.findIndex((_: any) => _.key === data.key)
          const newV = {
            ...data,
            ...values,
          }
          console.log('newV', newV, oldIdx, data, dataSource)
          if (!isNew) {
            dataSource.splice(oldIdx, 1, newV)
          } else {
            dataSource.push({ ...newV, key: genRandomKey(), })
            setPageIdx(Math.ceil(dataSource.length / pagination.pageSize!))
          }
          const newDataSource = [
            ...dataSource,
          ];

          onChange?.(newDataSource, { isAdd: true });


        },
        async getInitialData() {
          return data

        }
      }
    })
  }


  function getColumns(_tableColumns: any): any {
    const arr = map(_tableColumns, (col: any) => {
      if (get(col, 'children')) {
        return {
          ...col,
          children: getColumns(get(col, 'children')),
        };
      } else {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (rowData: any, rowIndex: any) => {
            return {
              ...col,
              rowData,
              record: getItem(dataSource, pagination, rowIndex),
              dataSource,
              editing: isEditing && type === 'inner',
              form,
              handleFieldsChange,
              init() {
                return setFormData(dataSource);


              },
              rowIndex,
            };
          },
        };
      }
    });

    return arr
  };


  const mergedColumns = getColumns(tableColumns);

  const mergedDataSource = getDataSource();
  return (
    <Form
      className="xx_edit_form"
      form={form}
      component={false}
      onValuesChange={handleFieldsChange}
    >
      <BaseTable
        size='small'
        {...innerProps}
        columns={mergedColumns}
        dataSource={mergedDataSource}
        scroll={{ y: 380 }}
        rowSelection={isShowCalcInputOutput ? {
          type: 'radio',
          onChange: setSelectedRowKeys,
          columnWidth: 20,
        } : undefined}
        selectedRowKeys={selectedRowKeys}
        onAdd={handleAdd}
        rowKey="key"
        components={{
          body: {
            cell: renderEditableCell,
          },
        }}
        pagination={type == 'inner' ? false : pagination}
        OtherActionsNode={
          type === 'inner' ? RenderOtherActions({ isEditing, disabled, handleSave, handleEdit, handleCancel, handleDelete, selectedRowKeys }) : <Button
            type="primary"
            danger
            onClick={handleDelete}
            disabled={disabled || isEmpty(selectedRowKeys)}
          >
            删除
          </Button>
        }
      />
      {/* <Alert
        style={{ margin: 24 }}
        message={`温馨提示：1、点击对应格子进行弹出编辑。        2、时间编辑框录入完成时，按下【Enter】键以快速确认。`}
        type="success"
        closable
      /> */}
    </Form>
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
function renderEditableCell(cell: any) {
  const {
    editing,
    dataIndex,
    title,
    inputProps,
    rules,
    record,
    rowData,
    dataSource,
    rowIndex,
    children,
    inputConfig,
    handleFieldsChange,
    init,
    ...restProps
  } = cell;
  const isPop = inputProps?.isPop
  const inputType = cell.inputType ?? 'MyAutoComplete'
  const C = componentMap[inputType] ?? (() => null)
  const DisplayFC = componentMap[inputType]?.DisplayFC
  const displayNode = DisplayFC ? <DisplayFC record={record} value={record?.[dataIndex]} {...inputProps} /> : children
  const form = cell.form as FormInstance
  // const v = form?.getFieldsValue() ?? {}
  // title === '日期' && console.log('form xx', form, v)
  const [_form] = Form.useForm()
  const formItemId = genFormItemName(record, dataIndex)
  return (
    cell.inputType ? (
      isPop ? <Popconfirm icon={null} placement="right"
        // trigger='hover'
        onVisibleChange={(v) => {
          if (v) {
            const v = init?.()
            const values = form.getFieldsValue()
            console.log('values', formItemId, values, v)
            _form.setFieldsValue(v)

          } else {
            const values = _form.getFieldsValue()
            const v = init?.()

            console.log('??', values, v, record)
            handleFieldsChange?.({}, { ...v, ...values })

          }
        }} cancelButtonProps={{ hidden: true }} okButtonProps={{ hidden: true }}
        title={

          <Form form={_form} layout="vertical"  >
            <Form.Item
              label={`${title}:`}
              name={formItemId}
              style={{
                margin: 0,
                minWidth: 180
              }}
              rules={rules}
            >
              <C popupStyle={{ zIndex: 9999 }} dropdownStyle={{ zIndex: 9999 }} style={{ zIndex: 9999 }} {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
            </Form.Item>
          </Form >


        }>
        <td {...restProps} >
          {displayNode}
        </td>
      </Popconfirm > : <td {...restProps}>

        <Form.Item

          name={formItemId}
          style={{
            margin: 0,
          }}
          rules={rules}
        >
          <C {...inputProps} inputType={inputType} config={inputConfig ?? cell} />

        </Form.Item>
      </td>
    ) : <td {...restProps}> {displayNode}</td >
  )
  return (
    editing ? (
      <td {...restProps}>

        <Form.Item

          name={formItemId}
          style={{
            margin: 0,
          }}
          rules={rules}
        >
          <BaseFormComponent {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
        </Form.Item>
      </td>
    ) : (


      cell.inputType ? <Popconfirm icon={null} placement="right"
        // trigger='hover'
        onVisibleChange={(v) => {
          if (v) {
            const v = init?.()
            const values = form.getFieldsValue()
            console.log('values', formItemId, values, v)
            _form.setFieldsValue(v)

          } else {
            const values = _form.getFieldsValue()
            const v = init?.()

            console.log('??', values, v, record)
            handleFieldsChange?.({}, { ...v, ...values })

          }
        }} cancelButtonProps={{ hidden: true }} okButtonProps={{ hidden: true }}
        title={

          <Form form={_form} layout="vertical"  >
            <Form.Item
              label={`${title}:`}
              name={formItemId}
              style={{
                margin: 0,
                minWidth: 180
              }}
              rules={rules}
            >
              <C popupStyle={{ zIndex: 9999 }} dropdownStyle={{ zIndex: 9999 }} style={{ zIndex: 9999 }} {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
            </Form.Item>
          </Form >


        }>
        <td {...restProps} >
          {displayNode}
        </td>
      </Popconfirm > : <td {...restProps}>{displayNode}</td>

    )
  );
};
function genFormItemName(item: any, key: string,) {
  return `${item?.key}-${key}`
}
function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.slice(uuid.lastIndexOf("/") + 1);
}
function genRandomKey() {
  return uuid().split('-').join('')
}