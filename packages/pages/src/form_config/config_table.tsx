import { mchcModal__ } from "@lm_fe/pages"

import { IMchc_FormDescriptions_Field_Nullable, SLocal_History } from "@lm_fe/service"
import { copyText, genHappyPath } from "@lm_fe/utils"
import { Space, message } from "antd"
import React from "react"
export const config_table_fd = (props: any): IMchc_FormDescriptions_Field_Nullable[] => [
    {
        title: '字段设置',
        containerType: 'tabs',
        hidden: true,
        children: [
            {
                inputType: 'MyMonaco',
                inputProps: { language: 'javascript', height: '70vh' },
                dataIndex: 'tableColumns',
            }
        ]
    },
    {
        title: '通用',
        containerType: 'tabs',

        children: [
            {
                title: 'id',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'id',
                inputProps: { disabled: true }
            },
            {
                title: '名称',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'title',
                width: 320,
                render(value, record, index) {
                    const text = `${value}(${record.id})`
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '模块',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'type',
            },
            {
                title: '接口路径',
                inputType: 'MyInput',
                layout: '1/3',
                dataIndex: 'name',
            },
            {
                title: '接口前缀',
                layout: '1/3',
                inputType: 'MyInput',
                dataIndex: 'apiPrefix',
            },
            {
                title: '历史接口',
                layout: '1/3',
                inputType: 'MyInput',
                dataIndex: 'dept',
            },




            {
                title: '表单联动设置',

                hidden: true,
                containerType: 'tabs',

                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'watchScript',
                    }
                ]
            },
            {
                title: '表单回选前钩子',

                hidden: true,
                containerType: 'tabs',

                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'handleBeforePopup',
                    }
                ]
            },
            {
                title: '表单提交前钩子',

                containerType: 'tabs',
                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'beforeSubmit',
                    }
                ]
            },
        ],
    },

    {
        title: '表格地址',
        isActive: 0,
        dataIndex: 'id',
        render(value, record, index) {
            const p = genHappyPath('/config-table/list', [value])
            return <Space>
                <a target="blank" onClick={() => SLocal_History.safe_history_push(p, props)}>
                    打开
                </a>

                <a onClick={() => copyText(p) && message.success('复制成功！')}>
                    复制地址
                </a>
            </Space>
        },
    },
    {
        title: '表单地址',
        isActive: 0,
        dataIndex: 'id',
        render(value, record, index) {
            const p = genHappyPath('/config-table/panel', [value], `?id=1`)
            return <Space>
                <a target="blank" onClick={() => SLocal_History.safe_history_push(p, props)}>
                    打开
                </a>

                <a onClick={() => copyText(p) && message.success('复制成功！')}>
                    复制地址
                </a>
            </Space>
        },
    },
    {
        title: "表格",
        containerType: 'tabs',
        hidden: true,
        children: [

            {
                title: '显示默认操作列',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showAction',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示添加按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showAdd',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示行打印按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showRowPrintBtn',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示导出按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showExport',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '显示打印按钮',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'showPrint',
                hidden: true,
                layout: '1/4',
            },
            {
                title: '行标识',
                inputType: 'MyInput',
                layout: '1/4',
                dataIndex: 'rowKey',
                hidden: true,
            },
            // {
            //     title: '行打印接口后缀',
            //     inputType: 'MyInput',
            //     layout: '1/4',
            //     dataIndex: 'rowPrintUrlSuffix',
            //     hidden: true,
            // },
            {
                title: '静态查询参数',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'searchParams',
                    }
                ]

            },
            {
                title: '查询配置',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'searchConfig',
                    }
                ]
            },
            {
                title: '默认查询参数',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'initialSearchValue',
                    }
                ]
            },
            {
                title: '表格字段设置',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'genColumns',
                    }
                ]
            },
            {
                title: '自定义按钮',
                containerType: 'tabs',

                hidden: true,
                children: [
                    {
                        inputType: 'MyMonaco',
                        inputProps: { language: 'javascript', height: '50vh' },
                        dataIndex: 'RenderBtns',
                    }
                ]
            },
        ]
    },
    {
        title: "表单",
        containerType: 'tabs',
        hidden: true,

        children: [

            {
                title: '打印',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needPrint',
                hidden: true,
                layout: '1/3',
            },
            {
                title: '同步',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needSync',
                hidden: true,
                layout: '1/3',
            },
            {
                title: '导入',
                inputType: 'MyCheckbox',
                inputProps: {
                    optionKey: '否是',
                    marshal: 0,
                },
                dataIndex: 'needImport',
                hidden: true,
                layout: '1/3',
            },
        ]
    },
    
]