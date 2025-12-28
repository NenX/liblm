import { OkButton } from "@lm_fe/components_m";
import { getSameOptions, mchcDriver, mchcEnv, mchcStore } from "@lm_fe/env";
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { lm_pdfjs_info } from "@lm_fe/static";
import React from "react";
import { doctor_tabs, medicalTypeMapping, NurseTypesMapping } from "./config";
// c: "devlopment" | "test" | "production"
// systemTheme: string
// expireTime: number
// openWebsocket: boolean
// websocketAddress: "ws://127.0.0.1:8087/Laputa",
// auditRestriction: boolean
// openIntro: boolean
// fetalMonitor: string
// openHighriskSign: boolean
// highriskVersion: number
// curveVersion: "nichd",
// prenatalDiagnosis: boolean
// CaseReport: boolean
// FetalMonitor: boolean
// InformedConsent: boolean
// nurseDeskVoucher: boolean
// pregnancyInitial: 'tab' | 'vertical'
// isOpenDiabetes: boolean
// diagnosisStyle: "tab",
// diagnosisFollowUpRecord: boolean
// diagnosisLaboratoryReport: boolean
// diagnosisPrenatalVisit: boolean
// tablePrintBtn: boolean
// homeStatistics: boolean
// highriskStatistics: boolean
// customerService: true
// highriskType: string
// 禁止编辑高危等级: boolean
// 系统环境: any
// 护士端_禁止编辑高危因素_传染病: boolean
// 医生端_模块隐藏: string[]
// doctorOpenWebsocket: boolean
// VTE预防用药筛查表: string
// nurseHide: string[],
// medicalHide: string[]
// PDF预览组件版本?: string
const switchOptions = mchcEnv.get_options('yesOrNoMapping')

export default defineFormConfig([


    {
        label: '系统配置',
        children: [
            {
                label: 'id',
                name: 'id',
                layout: '1/3',
                inputProps: { disabled: true }
            },
            {
                label: '系统环境',
                name: '系统环境',
                inputType: 'MS',
                inputProps: { options: getSameOptions(mchcEnv.all_env as any as string[]), marshal: 0 },
                layout: '1/3'
            },
            {
                label: '系统名称',
                name: 'systemName',
                inputType: 'Input',
                layout: '1/3'
            },
            {
                label: '系统模式',
                name: 'systemMode',
                inputType: 'MS',
                inputProps: {
                    options: [
                        { value: 'production', label: '生产模式' },
                        { value: 'devlopment', label: '开发模式' },
                        { value: 'test', label: '测试模式' },
                    ],
                    marshal: 0
                },
                layout: '1/3'
            },



            {
                label: 'PDF预览组件版本',
                name: 'PDF预览组件版本',
                inputType: 'MS',
                inputProps: { options: Object.keys(lm_pdfjs_info.dirs).map(value => ({ label: value, value })), marshal: 0 },
                layout: '1/3'
            },

            {
                label: '登录过期时间(秒)',
                name: 'expireTime',
                inputType: 'Input',
                inputProps: { type: 'number' },
                layout: '1/3'
            },

            {
                label: 'websocket服务',
                name: 'openWebsocket',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },
            {
                label: 'websocket服务地址',
                name: 'websocketAddress',
                inputType: 'Input',
                disabledDeps: {
                    openWebsocket: [false]
                },
                layout: '1/3'
            },
            {
                label: '老人模式',
                name: '老人模式',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },
            {
                label: '列表一页显示条数',
                name: '列表一页显示条数',
                inputType: 'Input',
                inputProps: { type: 'number' },
                layout: '1/3'
            },
            {
                label: 'OBIS外设驱动下载',
                name: 'OBIS外设驱动下载',
                inputType: 'node',
                inputProps: { node: <OkButton onClick={mchcDriver.download}>下载</OkButton> },
                layout: '1/3'
            },
            {
                label: '顶部工具栏隐藏',
                name: '顶部工具栏隐藏',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },

        ]
    },
    {
        label: '产科门诊配置',
        children: [

            {
                label: '医生端',
                children: [

                    {
                        label: '模块隐藏',
                        name: '医生端_模块隐藏',
                        inputType: 'MS',
                        inputProps: {
                            options: doctor_tabs.map(({ name, key }) => ({ label: name, value: key })),
                            type: 'multiple',
                            marshal: 2
                        },
                        layout: '2/3'
                    },
                    {
                        label: '检验检查时间轴隐藏',
                        name: '医生端_检验检查时间轴隐藏',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '复诊按钮浮动',
                        name: '医生端_复诊按钮浮动',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '复诊左侧隐藏',
                        name: '医生端_复诊左侧隐藏',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '复诊编辑控制',
                        name: '医生端_复诊编辑控制',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '禁止编辑高危等级',
                        name: '禁止编辑高危等级',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '看诊审核限制',
                        name: 'auditRestriction',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },

                        layout: '1/3'
                    },


                    {
                        label: '操作引导提示',
                        name: 'openIntro',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },

                        layout: '1/3'
                    },


                    {
                        label: '胎监报告服务地址',
                        name: 'fetalMonitor',
                        inputType: 'Input',
                        inputProps: { options: switchOptions, marshal: 0 },

                        layout: '1/3'
                    },


                    {
                        label: '高危提醒功能',
                        name: 'openHighriskSign',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },

                        layout: '1/3'
                    },
                    {
                        label: '高危版本',
                        name: 'highriskVersion',
                        inputType: 'MS',
                        inputProps: { options: mchcStore.highrisk_version_options, marshal: 0 },
                        layout: '1/3'
                    },




                    {
                        label: 'VTE预防用药筛查表',
                        name: 'VTE预防用药筛查表',
                        inputType: 'MS',
                        inputProps: {
                            options: getSameOptions([
                                '《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录1',
                                '《2015RCOG降低妊娠及产褥期静脉血栓栓塞的风险》附录3(广三用)',
                                '《妊娠期及产褥期静脉血栓栓塞症预防和诊治专家共识》2021中文共识(越秀妇幼用)',
                            ]), marshal: 0
                        },
                        layout: '1/3'
                    },
                    {
                        label: '胎儿生长曲线版本',
                        name: 'curveVersion',
                        inputType: 'MS',
                        inputProps: {
                            options: [
                                { value: 'southChina', label: '中国南方人群' },
                                { value: 'nichd', label: 'NICHD亚裔人群' },
                            ], marshal: 0
                        },
                        layout: '1/3'
                    },

                    {
                        label: '高危展示',
                        name: 'highriskType',
                        inputType: 'MS',
                        inputProps: {
                            options: [
                                { value: 'highRiskDiagnosis', label: '高危诊断' },
                                { value: 'highriskNote', label: '高危因素' },
                            ], marshal: 0
                        },
                        layout: '1/3'
                    },


                    {
                        label: '首检信息病历风格',
                        name: 'pregnancyInitial',
                        inputType: 'MS',
                        inputProps: {
                            options: [
                                { value: 'tab', label: 'TAB风格' },
                                { value: 'vertical', label: '垂直风格' },
                            ], marshal: 0
                        },
                        layout: '1/3'
                    },







                    {
                        label: '漏诊和高危因素标识提醒',
                        name: 'isOpenDiabetes',
                        inputType: 'MS',
                        inputProps: {
                            options: switchOptions
                        },
                        layout: '1/3'
                    },
                    {
                        label: '专案管理-糖尿病专案',
                        name: 'isOpenDiabetes',
                        inputType: 'MS',
                        inputProps: {
                            options: switchOptions
                        },
                        layout: '1/3'
                    },

                    {
                        label: '疤痕子宫评估孕周',
                        name: 'ScarredUterusGestationalWeek',
                        inputType: 'Input',
                        inputProps: {

                        },
                        layout: '1/3'
                    },
                ]
            },

            {
                label: '护士端',
                children: [

                    {
                        label: '补助券管理模块',
                        name: 'nurseDeskVoucher',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },
                    {
                        label: '禁止编辑高危因素、传染病',
                        name: '护士端_禁止编辑高危因素_传染病',
                        inputType: 'MS',
                        inputProps: { options: switchOptions, marshal: 0 },
                        layout: '1/3'
                    },

                ]
            },


        ]
    },
    {
        label: '统计管理配置',
        children: [
            {
                label: '首页统计模块',
                name: 'homeStatistics',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },
            {
                label: '高危统计-导出统计按钮',
                name: 'highriskStatistics',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },
            {
                label: '建档统计搜索-客服专员',
                name: 'customerService',
                inputType: 'MS',
                inputProps: { options: switchOptions, marshal: 0 },
                layout: '1/3'
            },


        ]
    },
    {

        label: '产科住院配置',
        children: [
            {
                label: '护理文书隐藏表单',
                name: 'nurseHide',
                inputType: 'MS',
                inputProps: {
                    options: NurseTypesMapping.map(_ => ({ label: _.name, value: _.key })), type: 'multiple',
                    marshal: 2
                },
                layout: '1/1'
            },
            {
                label: '病历文书隐藏表单',
                name: 'medicalHide',
                inputType: 'MS',
                inputProps: {
                    options: medicalTypeMapping.map(_ => ({ label: _.name, value: _.key })), type: 'multiple',
                    marshal: 2
                },
                layout: '1/1'
            },



        ]
    }
],
    { containerType: 'tabs' }
)