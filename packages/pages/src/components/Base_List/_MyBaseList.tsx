import {
    DeleteOutlined,
    EditOutlined,
    CopyOutlined,
    ExportOutlined,
    PlusOutlined,
    PrinterOutlined,
    ReloadOutlined, SearchOutlined
} from '@ant-design/icons';
import { mchcConfig, mchcEnv, mchcEvent, mchcLogger } from '@lm_fe/env';
import { ModelService, TIdTypeCompatible } from '@lm_fe/service';
import { Browser, downloadFile, formatDateTime, safe_async_call, sleep } from '@lm_fe/utils';
import { Button, Divider, Form, message, Space, TablePaginationConfig } from 'antd';
import { get, isFunction, isNil, isString, omit } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { MyBaseListRenderFormSection } from './Helper';
import './index.module.less';
import { IMyBaseList_ActionCtx, IMyBaseList_ColumnType, MyBaseListProps } from './types';
import { formatProps, get_dataIndex, get_title, tranformQueryData, use_my_baselist } from './utils';

import { LazyAntd, useMyEffectSafe } from '@lm_fe/components';
import { getDefaultRequiredRules, InterceptDisplayFC, MyBaseListComponents, OkButton } from '@lm_fe/components_m';
import { mchcModal__ } from '../../modals';
const browserClient = Browser.client || {};
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export function _MyBaseList<T extends { [x: string]: any, id?: TIdTypeCompatible }>(_props: MyBaseListProps<T>) {
    const staticDefaultQuery = {
        // current: 1,
        // pageSize: 14,
        page: 0,
        size: mchcConfig.get('列表一页显示条数') || 14,
        sort: 'id,desc', // 基本列表都需要倒序
        'deleteFlag.equals': 0
    };
    type TStaticQuery = typeof staticDefaultQuery

    const props = formatProps(_props);
    const {
        dbg_dataSource,
        needPagination = true,
        showAdd = true,
        showAction = true,
        modalFormConfig,
        useListSourceCount,
        fuckPage,
        ignore_usr,
        ignore_env,
        get_fuck_page,
        ModalForm,
        baseTitle,

        rowKey,
        showExport,
        showPrint,
        showCopy,
        otherTableProps,
        needEditInTable,

        needChecked,
        requestBeforeEdit,
        addText,
        name,
        apiPrefix,
        ActionAddonBefore,
        RenderAction,
        RenderBtns,
        RenderSearchBtns,
        searchConfig = [],
        searchParams = {},
        initialSearchValue = {},
        showRowDelBtn = true,
        showRowEditBtn = true,
        showRowPrintBtn = false,
        // rowPrintUrlSuffix = 'rowprint',
        customModelService,
        genColumns,
        onAdd,
        onExport,
        onPrint,
        beforeSearch,
        handleClickRow,
        handleDoubleClickRow = item => handleEdit(item),
        onModalOpen,
        printDefaultConfig = {},
        beforeSubmit = v => {
            return v
        },
        handleBeforePopup,
        effect_ctx,
        action_col
    } = props



    const myBaseListService = useRef<ModelService<T>>()
    const [_searchForm] = Form.useForm()
    const { children } = props;
    const queryRef = useRef<HTMLDivElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)

    const defaultQueryValue = Object.assign({} as TStaticQuery, staticDefaultQuery, searchParams as TStaticQuery)

    const defaultQuery = useRef(defaultQueryValue)
    const showSearch = !!(searchConfig.length)
    // Object.assign(defaultQuery.current, searchParams)

    const { table_columns } = use_my_baselist<T>(props)
    let actCellWidth = (+showRowDelBtn + +showRowEditBtn + +showRowPrintBtn) * 50
    if (ActionAddonBefore) {
        actCellWidth += 70
    }
    const searchForm = props.searchForm ?? _searchForm
    useEffect(() => {
        myBaseListService.current = customModelService || new ModelService<T>({
            n: name,
            useListSourceCount,
            needTransferParams: false,
            apiPrefix,
            fuckPage,
            get_fuck_page,
            ignore_env,
            ignore_usr
        })

    }, [name, customModelService])
    const [total, setTotal] = useState(0)
    const [dataSource, setDataSource] = useState<any[]>([])
    const [visible, setVisible] = useState(false)
    const [editable, setEditable] = useState(false)
    const [___id, set___Id] = useState<TIdTypeCompatible | undefined>()
    const [extraModalData, setExtraModalData] = useState()
    const [editKey, setEditKey] = useState(0)
    const [loading, setLoading] = useState(false)
    const [longSearchForm, setLongSearchForm] = useState(false)
    const [tableHeight, setTableHeight] = useState(500)
    const [checkRows, setCheckRows] = useState<T[]>([])

    const [form] = Form.useForm()


    const editKeyRef = useRef(0)
    const formWrapper = useRef<HTMLDivElement>(null)
    const propsCache = useRef(props)
    propsCache.current = props
    const inited = useRef(false)
    const [__pageSize, set__pageSize] = useState(defaultQueryValue.size)
    const [__current, set__current] = useState(1)

    function setPageSize(n: number) {
        set__pageSize(n)
        defaultQuery.current.size = n
    }
    function setCurrent(n: number) {
        set__current(n)
        defaultQuery.current.page = n - 1
    }

    function safe_set_edit_key(id: number) {
        setEditKey(id)
        editKeyRef.current = id
    }
    useEffect(() => {

        setTimeout(() => {

            const h = browserClient.clientHeight
            const formHeight = formWrapper.current?.clientHeight ?? 0
            const queryHeight = queryRef.current?.clientHeight ?? 0
            const tableHeaderHeight = wrapRef.current?.querySelector('.ant-table-header')?.clientHeight ?? 0
            setTableHeight(h - queryHeight - tableHeaderHeight - 100 - 80)
            if (formHeight > 40) {
                setLongSearchForm(true)
            }

            if (dbg_dataSource) {

                setDataSource(dbg_dataSource)
            } else {
                search()
            }
            inited.current = true


        }, 600);



        return () => { }

    }, [dbg_dataSource])


    useEffect(() => {

        setTimeout(() => {
            const h = browserClient.clientHeight
            const formHeight = formWrapper.current?.clientHeight ?? 0
            const queryHeight = queryRef.current?.clientHeight ?? 0
            const tableHeaderHeight = wrapRef.current?.querySelector('.ant-table-header')?.clientHeight ?? 0
            mchcLogger.log('formHeight', { queryHeight, formHeight, h, tableHeaderHeight })

            // setTableHeight(browserClient.clientHeight - queryHeight - 200)

        }, 1000);


        return () => {
        }

    }, [])


    if (effect_ctx) {
        useMyEffectSafe(effect_ctx)(() => {
            if (inited.current) {
                message.info('刷新成功！')
                handleSearch()

            }
        }, [])
    }

    const actionCtx: IMyBaseList_ActionCtx<T> = {
        handleSearch,
        getSearchParams,
        getCheckRows() {
            return checkRows
        },
    }

    async function create_or_update(submitData: Partial<T>) {
        if (isFunction(props.create_or_update)) {
            return props.create_or_update(submitData)
        }
        const service = myBaseListService.current
        if (!service) return

        const isUpdate = !!submitData?.id
        const text = isUpdate ? '更新' : '新增'
        let res: any
        if (submitData?.id) {
            res = await myBaseListService.current?.put?.(submitData)
        } else {
            res = await myBaseListService.current?.post?.(submitData)
        }
        message.info(text + '成功！')

        safe_set_edit_key(0)
        set___Id(undefined)
        handleSearch();
        return res
    }
    function _onModalOpen(rowData?: T,) {
        const id = rowData?.id
        if (onModalOpen)
            return onModalOpen({ rowData, handleSearch, create_or_update, table_columns })
        mchcModal__.open('modal_form', {

            ...modalFormConfig,
            modal_data: {
                onValuesChange: async (val, allval, form) => {

                },
                ...(modalFormConfig?.modal_data),
                formDescriptions: cal_columns,

                async onSubmit(values) {
                    const _data = Object.assign({}, rowData, values)

                    const submitData = await safe_async_call(beforeSubmit, _data)
                    mchcLogger.log('submitData', submitData)
                    if (!submitData) return
                    return create_or_update(submitData)


                },
                async getInitialData() {
                    const fn = handleBeforePopup
                    let _data = rowData ?? {}
                    if (rowData?.id && requestBeforeEdit) {
                        const res = await myBaseListService.current?.getOne(rowData?.id)
                        if (res) _data = res
                    }

                    return fn ? fn(_data) : _data

                }

            }
        })
    }

    const render_props = {
        createOrUpdate: create_or_update,
        handleView: handleView,
        handleDelete: handleDelete,
        handleEdit: handleEdit,
        handleSearch: handleSearch,
        setExtraModalData: setExtraModalData,
        setEditable: setEditable,
        setVisible: setVisible,
        setId: set___Id,
        create_or_update
    }

    /* istanbul ignore next */
    const actionCol: IMyBaseList_ColumnType<T> = action_col?.(render_props) ?? {
        title: '操作',
        dataIndex: '__operation',
        fixed: 'right',
        align: 'center',
        isActive: 0,
        showSorter: false,
        showFilter: false,
        width: actCellWidth,
        render: (value: any, rowData: T, index: number) => {
            const editable = isEditing(rowData);


            if (needEditInTable && editable) {
                return (
                    <Space>
                        <OkButton size="small" onClick={() => handleItemSave()}>
                            保存
                        </OkButton>
                        <OkButton size="small" onClick={() => handleItemCancel()}>
                            取消
                        </OkButton>
                    </Space>
                );
            }
            if (RenderAction) {
                return <RenderAction rowData={rowData} {...render_props} />
            }
            return (
                <Space size='small'>
                    {
                        ActionAddonBefore && <ActionAddonBefore rowData={rowData} {...render_props} />
                    }

                    {
                        showRowEditBtn ? <OkButton title='编辑/查看' icon={<EditOutlined />} size="small" onClick={e => handleEdit(rowData)} /> : null
                    }
                    {
                        showCopy ? <OkButton title='复制' icon={<CopyOutlined />} size="small" onClick={e => handleEdit(omit(rowData, ['id']) as T)} /> : null
                    }

                    {
                        showRowPrintBtn ? <OkButton title='打印' icon={<PrinterOutlined />} size="small" onClick={e => handleRowPrint(rowData)} /> : null
                    }
                    {
                        showRowDelBtn ? <OkButton title='删除' icon={<DeleteOutlined />} danger type="primary" size="small" onClick={e => handleDelete(rowData)} /> : null
                    }

                </Space>
            );
        },

    };

    const _columns = (!table_columns.some(_ => _.title === '操作') && showAction) ? [...table_columns, actionCol] : table_columns
    const cal_columns = genColumns?.({ handleEdit, handleDelete, handleSearch, handleItemCancel, handleItemSave, editKey, tableColumns: table_columns, actionCol, getSearchParams }) ?? _columns



    const isEditing = (rowData: any) => (rowData.editKey || rowData.id) === editKey;

    async function handleDelete(rowData: T) {
        const isOk = confirm('确认是否删除？')
        if (!isOk) return
        await myBaseListService.current?.del(rowData.id);
        message.success(`删除${baseTitle}成功`);
        handleSearch();
    };
    async function handleRowPrint(rowData: T) {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    // url: name + rowPrintUrlSuffix,
                    url: name + 'rowprint',
                    id: rowData?.id,
                    ...getSearchParams()
                }
            }
        })
    };

    async function handleItemSave(_data?: any) {
        await form.validateFields();
        const rowData = _data ?? dataSource.find(_ => _.id === editKeyRef.current) ?? {}
        const submitData = { ...rowData, ...form.getFieldsValue() }
        await create_or_update(submitData)

        form.resetFields();


    }

    function handleItemCancel() {
        form.resetFields();
        set___Id(undefined)
        safe_set_edit_key(0)



        setDataSource(typeof editKey === 'string' ? dataSource.slice(1, dataSource.length) : dataSource)
    }

    async function handleEdit(rowData: T) {
        if (needEditInTable) {
            // Object.keys(rowData).reduce((a, key) => {
            //   const item = rowData[key]
            //   const target = tableColumns.find(_ => _.dataIndex === key)
            //   const inputType = target?.inputType

            //   return Object.assign(a, { [key]: ['single_date_picker', 'single_time_picker'].includes(inputType || '') ? dayjs(item) : item })
            // }, {})
            if (editKeyRef.current) {
                if (mchcEnv.in(['广三'])) {
                    await handleItemSave()
                } else {
                    message.warning('请先保存上一条数据！')
                    return
                }

            }

            form.setFieldsValue(rowData);
            const key = rowData.editKey || rowData.id
            set___Id(rowData.id)
            safe_set_edit_key(key)



        } else {

            if (ModalForm) {
                setVisible(true)
                setEditable(true)
                set___Id(rowData.id)
            } else {
                _onModalOpen(rowData)
            }

        }
    };
    function handleView(rowData: T) {

        setVisible(true)
        setEditable(false)
        set___Id(rowData.id)

    };

    const handleAdd = () => {
        if (onAdd) {
            onAdd()
            return;
        }
        if (needEditInTable) {
            if (editKeyRef.current) {
                message.error('请先保存上一条记录');
                return;
            }
            const mockKey = +new Date();


            safe_set_edit_key(mockKey)

            setDataSource([
                {
                    editKey: mockKey,
                },
                ...dataSource,
            ])

        } else {
            if (ModalForm) {

                setEditable(true)
                setVisible(true)
            } else {
                _onModalOpen()
            }

        }
    };

    const handleCancel = () => {
        setVisible(false)
        setEditable(false)
        set___Id(undefined)
        setExtraModalData(undefined)
    };

    const handleFieldsChange = () => { };



    function getSearchParams(isFuck = false) {
        const { searchConfig } = propsCache.current

        const values = searchForm.getFieldsValue()
        const data = tranformQueryData(values, searchConfig, isFuck)
        const v = beforeSearch?.(data as any) ?? data



        // defaultQuery.current = { ...defaultQuery.current, ...v }

        mchcLogger.log('getSearchParams', defaultQuery.current, { values, v, data })

        // return { ...defaultQuery.current }
        return { ...defaultQuery.current, ...v }

    }



    async function handleSearch(params: any = defaultQuery.current) {


        if (!myBaseListService.current) return


        // if (editKeyRef.current) {
        //   message.error('请保存未保存的记录');
        //   return;
        // }


        if (dataSource.some(_ => isNil(_.id)))
            setDataSource([])

        setLoading(true)

        const [res] = await Promise
            .all([myBaseListService.current.page({ params, }), sleep(.2)])
            .finally(() => setLoading(false))

        const { data, pagination } = res

        setDataSource(data)
        setTotal(pagination.total)
        mchcEvent.emit('BaseList_hook', {
            type: 'search',
            data,
            name
        })

    };

    const handlePageChange = (current: any, size: any) => {
        mchcLogger.log('handlePageChange', current, size)
        setPageSize(size)
        setCurrent(current)
        // setDataSource([])
        handleSearch()

    };

    const handleRowSelected = (keys: any[], rows: T[]): any => {
        setCheckRows(rows)
    };

    function format_columns(cols: (IMyBaseList_ColumnType | null)[] = [],) {


        return cols

            .filter(_ => _ && !_.hidden)
            .map((col = {}) => {

                const { inputProps, props, dataIndex, width } = col!
                const isOperativeCell = isString(dataIndex) && ['__operation', 'operation'].includes(dataIndex)
                const format_data = {
                    title: get_title(col!),
                    dataIndex: get_dataIndex(col!)
                }
                const a: IMyBaseList_ColumnType<T> = {
                    width: (width ?? 120),
                    ...col,
                    ...format_data,
                    children: format_columns(col?.children),
                    align: 'center' as const,
                    ellipsis: col?.ellipsis ?? { showTitle: true },
                    onCell: (rowData: T) => {
                        return {
                            ...col,
                            ...format_data,
                            inputProps: inputProps ?? props,
                            record: rowData,
                            editing: isOperativeCell ? false : isEditing(rowData),
                        };
                    },
                } as any;
                return a
            })
    };

    const renderEditableCell = (cell: any) => {
        const {
            editing,
            dataIndex,
            title,
            inputType = 'input',
            inputProps,
            rules,
            record,
            index,
            children,
            inputConfig,
            render,
            ...restProps
        } = cell;
        const C: any = MyBaseListComponents[inputType as 'MyCheckbox'] ?? (() => "Unkown Cell Component!")
        return (
            <td {...restProps} title={get(record, dataIndex)}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={getDefaultRequiredRules(rules, title || dataIndex)}
                    >
                        <C {...inputProps} inputType={inputType} config={inputConfig ?? cell} />
                    </Form.Item>
                ) : (
                    (C.DisplayFC && !render) ? <InterceptDisplayFC C={C} config={inputConfig ?? cell} value={get(record, dataIndex)} /> : children
                )}
            </td>
        );
    };

    const renderOthersModal = () => {
        return (
            <>
                {visible && ModalForm && (
                    <ModalForm
                        visible={visible}
                        editable={editable}
                        id={___id}
                        extraModalData={extraModalData}
                        onCancel={() => { handleCancel(); handleSearch(); }}
                        onSearch={handleSearch}
                        onOk={() => { handleCancel(); handleSearch(); }}
                    />
                )}
            </>
        );
    };
    async function search() {
        // setDataSource([])
        setCheckRows([])
        setCurrent(1)

        const q = getSearchParams()
        defaultQuery.current = q
        handleSearch(q)

    }
    const renderAdd = () => {

        return (
            <Space>

                {RenderBtns?.call(window, actionCtx)}
                {
                    (showExport || onExport) ? <OkButton icon={<ExportOutlined />} type="primary" onClick={() => {
                        if (onExport) {
                            onExport(actionCtx)
                        } else {
                            myBaseListService.current?.export(getSearchParams() as any).then(r => {
                                downloadFile(r, `${baseTitle}${formatDateTime()}.xlsx`, 'application/vnd.ms-excel')
                            })
                        }
                    }}>
                        {'导出'}
                    </OkButton> : null
                }
                {
                    showPrint ? <OkButton icon={<ExportOutlined />} type="primary" onClick={() => {
                        if (onPrint) {
                            onPrint(actionCtx)
                        } else {
                            mchcModal__.open('print_modal', {
                                modal_data: {
                                    requestData: {
                                        url: name + 'print',
                                        ...getSearchParams(),
                                        ...printDefaultConfig
                                    }
                                }
                            })
                        }
                    }}>
                        {'打印'}
                    </OkButton> : null
                }
                {
                    showAdd ? <OkButton disabled={loading} icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
                        {addText || '新增'}
                    </OkButton> : null
                }
                {
                    showSearch ? (
                        <>
                            <Divider type='vertical' />
                            <Button.Group >
                                {RenderSearchBtns?.call(window, actionCtx)}

                                <OkButton htmlType="reset" icon={<ReloadOutlined />} disabled={loading} onClick={() => {
                                    searchForm.resetFields()
                                    defaultQuery.current = defaultQueryValue
                                    setDataSource([])
                                    setCurrent(1)
                                    setPageSize(defaultQueryValue.size)
                                    handleSearch()

                                }} >
                                    重置
                                </OkButton>

                                <OkButton type="primary" htmlType="submit" disabled={loading} onClick={() => search()} icon={<SearchOutlined />}
                                >
                                    查询
                                </OkButton>
                            </Button.Group>
                        </>
                    ) : null
                }
            </Space>
        );


    };
    const renderTitle = () => {
        return (
            <div
                ref={queryRef}
                style={{ padding: 4, ...(longSearchForm ? { display: 'flex', flexDirection: 'column-reverse' } : { display: 'flex', justifyContent: 'space-between' }) }}
            >
                <div ref={formWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                    {
                        showSearch ? (
                            <Form initialValues={initialSearchValue} form={searchForm} layout="inline" onFinish={() => {
                                search()
                            }}>
                                {searchConfig ? <MyBaseListRenderFormSection config={searchConfig} disabled={loading} /> : null}







                            </Form>
                        ) : null
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: longSearchForm ? '1px dashed #ddd' : 0, paddingBottom: 4, paddingRight: 28 }}>
                    {renderAdd()}
                    {/* <OkButton icon={<ReloadOutlined />} onClick={e => {
              searchForm.resetFields()
              handleSearch()
            }} loading={loading} style={{ margin: '0 6px' }} /> */}
                </div>





            </div>
        );
    };

    const mergedColumns = format_columns(cal_columns);

    const __pagination: TablePaginationConfig = needPagination ? {
        position: ['bottomCenter'],
        total,
        size: 'small',
        showTotal: (_total) => `总共 ${total} 条`,
        // showTotal: () => {
        //   const min = defaultQuery.page * defaultQuery.size + 1;
        //   const max = (defaultQuery.page + 1) * defaultQuery.size;
        //   return `第 ${min}-${max < total ? max : total} 条 / 总共 ${total} 条`;
        // },
        pageSizeOptions: [10, 20, 50, 100].map(_ => _.toString()),
        pageSize: __pageSize,
        current: __current,
        onChange: handlePageChange,
        onShowSizeChange: handlePageChange,
        showQuickJumper: true,
        showSizeChanger: true,
    } : {}
    const __components = (needEditInTable || true)
        ? {
            body: {
                cell: renderEditableCell,
            },
        }
        : {}
    return (
        <div className="base-list" ref={wrapRef}>
            <Form
                onSubmitCapture={e => {
                    message.info('onSubmitCapture')
                }}
                onFinish={() => {
                    message.info('onFinish')

                }}
                form={form}
                component={false}
                onFieldsChange={handleFieldsChange}
            >



                <div className="global-base-table" id="global-base-table">
                    {renderTitle?.()}


                    <Table
                        dataSource={dataSource}
                        rowKey={rowKey || 'id'}
                        bordered
                        loading={loading}
                        pagination={__pagination}
                        title={undefined}
                        style={{
                            padding: '0 12px',
                            // height: `calc(100% - 0px)`,
                            // overflow:'scroll'
                        }}
                        components={__components}
                        scroll={{
                            scrollToFirstRowOnChange: true,
                            x: get(otherTableProps, 'scroll.x') || 'calc(100px)',
                            // y: get(otherTableProps, 'scroll.y') || (browserClient.clientHeight < 900 ? browserClient.clientHeight - 300 : 700),
                            y: get(otherTableProps, 'scroll.y') || tableHeight,
                        }}


                        columns={mergedColumns}

                        rowSelection={
                            needChecked ? {
                                type: 'checkbox',
                                onChange: handleRowSelected,
                                selectedRowKeys: checkRows.map(_ => _.id as any)
                            } : undefined
                        }

                        onRow={(record: T) => {
                            // if (editKeyRef.current) {
                            //   return {};
                            // }
                            return {
                                onClick: (event) => handleClickRow?.(record, render_props, event),
                                onDoubleClick: (event) => handleDoubleClickRow?.(record, render_props, event),
                                onContextMenu: (event) => {
                                    event.preventDefault();
                                },
                            };
                        }}
                    />

                </div>

            </Form>
            {renderOthersModal()}
            {
                children
            }
        </div>
    );
}
export default _MyBaseList
