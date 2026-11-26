import { rt_ctx } from '@lm_fe/env';
import { MyBaseList } from '@lm_fe/pages';

import React from "react";
const ctx = rt_ctx

export default function RequestLog() {
    return <MyBaseList
        table_preset={{
            title: '系统管理-Http日志',
            name: "/api/http-logs",
            searchParams: {
            },
            searchConfig: [
                {
                    name: 'reqTime',
                    label: '请求时间',
                    inputType: 'DatePicker',
                    inputProps: {
                        showTime: true,
                        format: ctx.utils.formatDateTime.format,
                    }
                },
                {
                    label: '请求地址',
                    inputType: 'input',
                    name: 'url',
                },
                {
                    name: 'clientIp',
                    label: '请求IP',
                    inputType: 'input',
                },
                {
                    label: '响应状态码',
                    inputType: 'input',
                    name: 'status',
                },


                {
                    label: '登陆账号',
                    inputType: 'input',
                    name: 'login',
                },
                {
                    label: '登录名',
                    inputType: 'input',
                    name: 'userName',
                },
            ],
            showAdd: 0,
            tableColumns: [
                {
                    title: '请求地址',
                    dataIndex: 'url',
                    ellipsis: true,
                    align: 'center',
                    layout: '1/3',
                },
                {
                    title: '请求时间',
                    dataIndex: 'reqTime',
                    ellipsis: true,
                    sortType: 'date',
                    align: 'center',
                    layout: '1/3',
                },
                {
                    title: '客请求IP',
                    dataIndex: 'clientIp',
                    ellipsis: true,
                    showSorter: false,
                    align: 'center',
                    layout: '1/3',
                },
                {
                    title: '响应状态码',
                    dataIndex: 'status',
                    align: 'center',
                    layout: '1/3',
                },
                {
                    title: '响应时长',
                    dataIndex: 'timetaken',
                    showSorter: false,
                    align: 'center',
                    layout: '1/3',
                },

                {
                    title: 'method',
                    dataIndex: 'method',
                    inputType: 'Input',
                    layout: '1/3',
                },
                {
                    title: '请求参数',
                    dataIndex: 'params',
                    hidden: true,
                    inputType: 'Input',
                    layout: '1/1',
                },
                {
                    title: 'headers',
                    containerType: 'tabs',
                    hidden: true,
                    children: [{
                        dataIndex: 'headers',
                        inputType: 'MyMonaco',
                        inputProps: { language: 'json', height: 520 },
                    }]
                },

                {
                    title: 'resData',
                    containerType: 'tabs',
                    hidden: true,
                    children: [
                        {
                            dataIndex: 'resData',
                            inputType: 'MyMonaco',
                            inputProps: { language: 'json', height: 520 },
                        }
                    ]
                },
                {
                    title: 'exception',
                    containerType: 'tabs',
                    hidden: true,
                    children: [
                        {
                            dataIndex: 'exception',
                            inputType: 'MyMonaco',
                            inputProps: { language: 'json', height: 520 },
                        }
                    ]
                },
                {
                    title: 'params',
                    containerType: 'tabs',
                    hidden: true,
                    children: [
                        {
                            dataIndex: 'params',
                            inputType: 'MyMonaco',
                            processRemote(v: any,) {
                                if (!v) return
                                const maybeObj = ctx.utils.safe_json_parse(v)
                                if (maybeObj) return JSON.stringify(maybeObj, null, 2)
                                const url = location.href + `?${v}`
                                const u = new URL(url)
                                const obj = ctx.utils.getSearchParamsAll(u)
                                return JSON.stringify(obj, null, 2)
                            },
                            inputProps: { language: 'json', height: 520 },
                        }
                    ]
                },
            ],
            initialSearchValue() { return { reqTime: ctx.utils.formatDateTime() } },

        }}

    />
}