import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
const React = ctx.React

const width = 66

export default defineFormConfig(
    [
        {
            label: '就诊卡号',
            dataIndex: 'outpatientNO',
            inputType: 'PatientAutoComplete',
            layout: '1/3',
            disabledDeps(f) {
                return !!f.getFieldValue('pregnancyId')
            },
            inputProps: {
                onPatientAutoComplete(v, form) {
                    form?.setFieldsValue(Object.assign(v, { id: undefined }))
                },
            },
            // hidden: true,
        },
        {
            dataIndex: 'id',
            hidden: true,
            form_hidden: true
        },
        {
            dataIndex: 'pregnancyId',
            hidden: true,
            form_hidden: true
        },
        {
            title: '姓名',
            dataIndex: 'name',
            layout: '1/3',
            width,
            inputProps: { disabled: true },
        },
        {
            title: '证件号码',
            dataIndex: 'idNO',
            inputProps: { disabled: true },
            // width: APP_CONFIG.CELL_WIDTH_LARGE,
            layout: '1/3',
        },

        // {
        //     title: '就诊卡号',
        //     layout: '1/3',
        //     inputProps: { disabled: true },
        //     dataIndex: 'outpatientNO',
        // },
        {
            title: '年龄',
            width: width / 2,
            layout: '1/3',
            inputProps: { disabled: true },
            dataIndex: 'age',
        },


        {
            title: '手机号',
            layout: '1/3',
            dataIndex: 'telephone',
        },

        {
            title: '孕周',
            width: width / 2,
            layout: '1/3',
            dataIndex: 'gestationalWeek',
        },
        {
            title: '产检日期',
            layout: '1/3',
            dataIndex: 'visitDate',
            inputType: 'DatePicker',
            inputProps: {
            }
        },
        {
            dataIndex: 'residenceAddress',
            title: "居住地址",
            // width: APP_CONFIG.CELL_WIDTH_LARGE,
            inputType: "MyAddress",
            layout: '2/3',
            hidden: true,
        },

        {
            title: '次数',
            layout: '1/3',
            width: width / 2,
            dataIndex: 'monitorSum',
            render(value, rowData, index) {
                if (value > 1) {
                    return <span style={{ fontSize: 18, fontWeight: 'bold' }}>{value}</span>
                }
                return value
            },
        },

        // {
        //     title: '加入队列时间',
        //     layout: '1/3',
        //     dataIndex: 'queueTime',
        //     // width: APP_CONFIG.CELL_WIDTH_LARGE,
        //     inputType: 'DatePicker',
        //     inputProps: {
        //         showTime: true
        //     }
        // },
        {
            title: '确认时间',
            layout: '1/3',
            dataIndex: 'enterTime',
            inputType: 'DatePicker',
            // width: APP_CONFIG.CELL_WIDTH_LARGE,
            inputProps: {
                showTime: true
            }
        },
        {
            title: '状态',
            width,
            layout: '1/3',
            dataIndex: 'state',
            // isActive: 0,
            inputType: 'MS',
            inputProps: {
                options: [{ value: false, label: '未确认' }, { value: true, label: '已确认' }],
                marshal: 0
            }
        },
        {
            title: '备注',
            layout: '1/3',
            width,
            dataIndex: 'note',
        },
    ]
)