import { rt_ctx } from '@lm_fe/env'
import { defineFormConfig } from '@lm_fe/service'
var ctx = rt_ctx
var utils = ctx.utils

export const form_config = defineFormConfig([
    {
        label: '证件类型',
        name: 'idType',
        required: () => ctx.required,
        inputType: 'MS',
        inputProps: { uniqueKey: '证件类型', marshal: 0 },
        layout: '1/3',
    },
    {
        label: '证件号码',
        name: 'idNO',
        required: () => ctx.required,
        inputType: 'Input',
        inputProps: {},
        layout: '1/3',
    },
    {
        label: '就诊卡号',
        name: 'outpatientNO',
        required: () => ctx.required,
        inputType: 'Input',
        inputProps: {},
        layout: '1/3',
    },
    { label: '姓名', name: 'name', required: () => ctx.required, inputType: 'Input', inputProps: {}, layout: '1/3' },
    {
        label: '手机号码',
        name: 'telephone',
        required: () => ctx.required,
        inputType: 'Input',
        inputProps: {},
        layout: '1/3',
    },
    {
        label: '末次月经',
        name: 'lmp',
        required: () => ctx.required,
        inputType: 'DatePicker',
        inputProps: {},
        layout: '1/3',
    },
    {
        label: '预产期-日期',
        name: 'edd',
        required: () => ctx.required,
        inputType: 'DatePicker',
        inputProps: {},
        layout: '1/3',
    },
    {
        label: '预产期-B超',
        name: 'sureEdd',
        required: () => ctx.required,
        inputType: 'DatePicker',
        inputProps: {},
        layout: '1/3',
    },
    {
        label: '孕周',
        name: 'gestationalWeek',
        required: () => ctx.required,
        inputType: 'Input',
        inputProps: {},
        layout: '1/3',
    },
    { label: '分娩日期', name: 'deliveryDate', inputType: 'DatePicker', inputProps: {}, layout: '1/3' },
    {
        label: 'appId',
        name: 'appId',
        inputType: 'Input',
        inputProps: { disabled: true },
        layout: '1/3',
        form_hidden: true,
    },
    {
        label: 'empId',
        name: 'empId',
        inputType: 'Input',
        inputProps: { disabled: true },
        layout: '1/3',
        form_hidden: true,
    },
    {
        label: 'patId',
        name: 'patId',
        inputType: 'Input',
        inputProps: { disabled: true },
        layout: '1/3',
        form_hidden: true,
    },
])

export const fubao_form_config = defineFormConfig([

    {
        name: '本人信息',
        children: [
            {
                key: 'name',
                label: '姓名',
                inputType: 'input',
                required: true,
                inputProps: { placeholder: '请输入姓名' },
                span: 8,
            },
            {
                key: 'telephone',
                label: '手机号码',
                inputType: 'input',
                required: true,
                inputProps: { placeholder: '请输入手机号码' },
                rules: [
                    {
                        required: true,
                        message: '手机号码是必填项',
                    },
                    {
                        type: 'string',
                        min: 11,
                        message: '请输入11位手机号码',
                    },
                    {
                        max: 11,
                        message: '请输入正确的手机号码格式',
                    },
                ],
                span: 8,
            },
            {
                key: 'outpatientNo',
                label: '就诊卡号',
                inputType: 'input',
                required: true,
                inputProps: { placeholder: '请输入就诊卡号' },
                span: 8,
            },
            {
                "key": "idType",
                "label": "证件类型",
                "inputType": "MS",
                "inputProps": {
                    "marshal": 0,
                    "width": 120,
                    "uniqueKey": "证件类型"
                },
                "isNewRow": true,
                "required": function () { return ctx.required },
                "span": 8
            },
            {
                "key": "idNO",
                "label": "证件号码",
                "processLocal": function (e, form) {
                    var id_no = utils.trim(e), len = utils.size(id_no), values = form.getFieldsValue();
                    if (1 == utils.get(values, 'idType') && 18 === len) {
                        var result = utils.checkIdNo_new(id_no);
                        if (result) {
                            var n = {
                                dob: result.birth,
                                age: result.age
                            };
                            form.setFieldsValue(n)
                        } else ctx.mchcEnv.error('请输入符合规范的身份证号码！')
                    }
                },
                "inputType": "input",
                "required": function () { return ctx.required },
                "span": 8
            },
            {
                "key": "dob",
                "label": "出生日期",
                "inputType": "single_date_picker",
                "required": function () { return ctx.required },
                "span": 8
            },
            {
                "key": "maritalStatus",
                "label": "婚姻状况",
                "required": true,
                "inputType": "MS",
                "inputProps": {
                    "width": 100,
                    "uniqueKey": "婚姻",
                    "marshal": 0
                },
                "span": 8
            },
            {
                "label": "户口类型",
                "span": 8,
                "name": "householdType",
                "inputType": "MS",
                "inputProps": {
                    "width": 100,
                    "marshal": 0,
                    "options": [
                        {
                            "value": 1,
                            "label": "农业"
                        },
                        {
                            "value": 2,
                            "label": "城镇"
                        }
                    ],
                }
            },
            {
                "key": "permanentResidenceAddress",
                "label": "户籍地址",
                "inputType": "MyAddress",
                "required": true,
                "span": 23,
                rules: [
                    {
                        required: true
                    },
                    {
                        validator: function (_, value) {
                            if (!value) return Promise.reject(new Error('不能为空'))
                            var index_of_and = value.indexOf('&')
                            if (index_of_and === -1 || index_of_and === value.length - 1)
                                return Promise.reject(new Error('详细地址不能为空'))

                            return Promise.resolve()
                        },
                    },
                ],
                "isNewRow": 1
            },
            {
                "key": "residenceAddress",
                "label": "居住地址",
                "inputType": "MyAddress",
                "required": true,
                "inputProps": {
                    "addressBtns": [
                        {
                            "name": "permanentResidenceAddress",
                            "label": "同户籍地"
                        }
                    ]
                },
                "span": 24,
                "isNewRow": 1
            },
            {
                "inputType": "MyButton",
                "title": "",
                "inputProps": {
                    "size": "middle",
                    "primary": true,
                    "btn_text": "更新同步最新提交信息",
                    /**
                     * 按钮点击事件：获取报告信息并设置到 earlyPregnancyCheckInspection 字段
                     * @param {Event} e - 事件对象
                     * @param {object} form - 表单实例
                     */
                    "on_btn_click": function (e, form) {
                        var values = form.getFieldsValue();
                        var params = ctx.utils.pick(values, ['id', 'patientNO', 'outpatientNO']);
                        return ctx.request
                            .get('/api/family/planning/importCheckInspection', { params: params })
                            .then(function (e) {
                                form.setFieldValue('earlyPregnancyCheckInspection', e.data);
                            });
                    }
                },
                "span": 8
            },
        ],
    }
])
