import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";


const ctx = rt_ctx
const React = rt_ctx.React
export const form_config = defineFormConfig(
    [
        {
            title: '就诊卡号',
            dataIndex: 'outpatientNO',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,

            fixed: 'left'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: APP_CONFIG.CELL_WIDTH_SMALL,

            fixed: 'left'
        },
        {
            title: '年龄',
            dataIndex: 'age',
            width: APP_CONFIG.CELL_WIDTH_TINY,

        },
        {
            title: '孕/产',
            dataIndex: 'gravidity',
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            render: (value: any, rowData: any) => ctx.utils.format_gp(rowData),
        },
        {
            title: '孕周',
            // dataIndex: 'gestationalWeek',
            dataIndex: 'currentGestationalWeek',
            width: APP_CONFIG.CELL_WIDTH_SMALL,

        },
        {
            title: '预产期-日期',
            dataIndex: 'edd',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,

        },
        {
            title: '预产期-B超',
            dataIndex: 'sureEdd',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,

        },
        {
            title: '手机号码',
            dataIndex: 'telephone',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,

        },


        {
            title: '建档日期',
            dataIndex: 'validateDate',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,

        },
        {
            title: '户口地址',
            dataIndex: 'permanentResidenceAddress',
            width: APP_CONFIG.CELL_WIDTH_LARGE,
        },


        {
            title: '评定日期',
            dataIndex: 'eventDate',
            width: APP_CONFIG.CELL_WIDTH_SMALL,
        },
        {
            title: '评定人',
            dataIndex: 'rDoctor',

            width: APP_CONFIG.CELL_WIDTH_SMALL,
        },
        {
            title: '就诊日期',
            dataIndex: 'visitDate',
            ellipsis: false,
            width: APP_CONFIG.CELL_WIDTH_LARGE,
            render: (value: string, b: any) => {
                if (!value) return ''
                let too_much = false
                let arr = value.split(',').filter(_ => _)
                if (arr.length > 3) {
                    arr = arr.slice(0, 3)
                    too_much = true
                }
                return <span>
                    {arr.map(_ => <ctx.ui.Tag>{_}</ctx.ui.Tag>)}
                    {too_much ? '...' : ''}
                </span>
            },

        },
        {
            title: '高危因素',
            dataIndex: 'highriskNote',
            width: APP_CONFIG.CELL_WIDTH_LARGE,
        },
    ]
)