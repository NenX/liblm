import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { TType } from "./types";
const ctx = rt_ctx
const React = rt_ctx.React
const mchcEnv = rt_ctx.mchcEnv
export default function (type: TType) {
    const TYPE = type.toUpperCase()

    return defineFormConfig(
        [
            {
                label: '住院号',
                dataIndex: 'inpatientNo',
                inputType: 'PatientAutoComplete',
                layout: '1/2',
                hidden: true,
                // disabledDeps(f) {
                //     return !!f.getFieldValue('id')
                // },
                inputProps: {
                    PatientAutoComplete_url: '/api/noenate-records',
                    PatientAutoComplete_filterKey: 'admissionCriteria.inpatientNO',
                    PatientAutoComplete_displayKey: ['admission.inpatientNO', 'admission.name', 'admission.bedNO'],
                    onPatientAutoComplete(v, form) {
                        form?.setFieldsValue(Object.assign(v.admission, { id: undefined }))
                    },
                },
            },
            {
                form_hidden: true,
                hidden: true,
                dataIndex: 'id',
            },
            {
                title: '床号',
                layout: '1/2',

                dataIndex: 'bedNO',
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                fixed: 'left',
            },
            {
                title: '姓名',
                layout: '1/2',
                dataIndex: 'name',
                width: 70,
                fixed: 'left',
            },
            {
                title: '多胎',
                layout: '1/2',
                dataIndex: 'multiplets',
                width: 50,
            },
            {
                title: '性别',
                layout: '1/2',
                dataIndex: 'gender',
                inputType: 'MC',
                inputProps: { optionKey: '性别2', marshal: 0 },
                width: 50,
            },
            {
                title: '出生日期',
                layout: '1/2',
                dataIndex: 'deliveryTime',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputType: 'single_date_picker',
                // inputProps: {
                //   showTime: { format: 'HH:mm' },
                //   format: 'YYYY-MM-DD HH:mm',
                // },
                render: (value: any) => ctx.utils.formatDateTimeNoSecond(value),
            },
            {
                title: '体重（g）',
                layout: '1/2',
                dataIndex: 'weight',
                inputType: 'input_with_label',
                inputProps: { type: 'number' },

                width: APP_CONFIG.CELL_WIDTH_SMALL,
                render: (value: any, record: any) =>
                    <div title={record?.deleteFlag ? '该数据已被护理系统删除' : ''}>{value}</div>

                ,
            },
            {
                title: '新生儿记录标记',
                layout: '1/2',
                dataIndex: 'mark',
                inputType: 'MC',

                inputProps: { options: ctx.mchcEnv.get_other_options('nyOptions'), marshal: 0 },

            },
            {
                title: '接种日期',
                layout: '1/2',
                dataIndex: 'vaccinationTime',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputType: 'single_date_picker',
                inputProps: {
                    showTime: true
                },
                render: (value: any) => ctx.utils.formatDateTimeNoSecond(value),
            },
            {
                title: '接种剂量',
                layout: '1/2',
                dataIndex: 'dosage',

                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                inputProps: { memorieskey: `${type}Dosage`, memoriesname: `${TYPE}接种剂量`, },

            },
            {
                title: '接种部位',
                layout: '1/2',
                dataIndex: 'part',

                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_SMALL,
                inputProps: { memorieskey: `${type}Part`, memoriesname: `${TYPE}接种部位`, },

            },
            {
                title: '接种方式',
                layout: '1/2',
                dataIndex: 'way',
                inputProps: { memorieskey: `${type}Way`, memoriesname: `${TYPE}接种方式`, },

                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_SMALL,

            },
            {
                title: '生产厂家',
                layout: '1/2',
                dataIndex: 'vender',
                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_LARGE,

                inputProps: { memorieskey: `${type}Vender`, memoriesname: `${TYPE}生产厂家`, },

            },
            {
                title: '生产批号',
                layout: '1/2',
                dataIndex: 'batchNumber',
                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputProps: {
                    memorieskey: 'bggBatchNumber',
                    memoriesname: 'BCG生产批号',
                },
            },
            {
                title: '有效期',
                layout: '1/2',
                dataIndex: 'validity',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputType: 'single_date_picker',
                render: (value: any) => ctx.utils.formatDate(value,),
            },
            {
                title: '备注',
                layout: '1/2',
                dataIndex: 'note',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

            },
            {
                title: '阳性',
                layout: '1/2',
                dataIndex: 'hBV',
                inputType: 'MC',
                inputProps: { options: ctx.mchcEnv.get_other_options('nyOptions'), marshal: 0 },
                width: 50,
            },
            {
                title: '接种者签名',
                layout: '1/2',
                dataIndex: 'signature',
                inputType: 'MA',
                width: APP_CONFIG.CELL_WIDTH_MIDDLE,

                inputProps: {
                    memorieskey: 'bggSignature',
                    memoriesname: 'BGG接种者签名',
                },
            },
        ]
    )
}