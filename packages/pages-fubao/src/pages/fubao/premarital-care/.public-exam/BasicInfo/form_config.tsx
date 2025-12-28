import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig(
    [{
        "name": "基本信息",

        "children": [{
            "key": "name",
            "label": "姓名",

            "inputType": "input",
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "outpatientNo",
            "label": "门诊号",

            "inputType": "input",
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "telephone",
            "label": "电话号码",

            "inputType": "input",
            "rules": [{ 'type': 'string', 'min': 11, 'message': '请输入11位手机号码' }, { 'max': 11, 'message': '请输入正确的手机号码格式' }],
            layout: '1/3',


        }, {
            "key": "idType",
            "label": "证件类型",

            "inputType": "normal_select",
            "tranferRules": { 'type': 'IDCardMapping' },
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "idNO",
            "label": "证件号码",

            "inputType": "input",
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "dob",
            "label": "出生日期",

            "inputType": "single_date_picker",
            "tranferRules": { 'type': 'dayjs()' },
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "ethnic",
            "label": "民族",

            "inputType": "MS",
            required() {
                return ctx.required
            },
            "inputProps": { optionKey: '民族s', marshal: 0 },
            layout: '1/3',


        }, {
            "key": "age",
            "label": "年龄",

            "inputType": "input_number",
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "permanentResidence",
            "label": "籍贯",

            "inputType": "MS",
            required() {
                return ctx.required
            },
            "inputProps": { optionKey: '省份s', },
            layout: '1/3',


        }, {
            "key": "education",
            "label": "文化程度",

            "inputType": "MS",

            "inputProps": { optionKey: '文化程度s', marshal: 0 },
            layout: '1/3',


        }, {
            "key": "profession",
            "label": "职业",

            "inputType": "MS",

            "inputProps": { optionKey: '职业s', marshal: 0 },
            layout: '1/3',


        }, {
            "key": "nationality",
            "label": "国籍",

            "inputType": "country_select",
            required() {
                return ctx.required
            },
            layout: '1/3',


        }, {
            "key": "permanentResidenceAddress",
            "label": "户口地址",

            "inputType": "MyAddress",
            required() {
                return ctx.required
            },
            layout: '2/3',


        }, {
            "key": "residenceAddress",
            "label": "居住地址",

            "inputType": "MyAddress",
            required() {
                return ctx.required
            },
            "inputProps": {
                addressBtns: [
                    { name: 'permanentResidenceAddress', label: '同上' },
                ]
            },
            layout: '2/3',


        }, {
            "key": "imageAddress",
            "label": "上传图片",

            "inputType": "image_upload_preview_Intranet",

            "inputProps": { 'placeholder': '', 'actionApi': '/api/premarital/check/uploadImage', 'outputParamType': 'new' },
            "span": 12,
            "offset": 0,

            "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 8 } },

        }, {
            "key": "imageName",
            "label": "图片名称",

            "inputType": "input",
            required() {
                return ctx.required
            },
            "inputProps": { 'placeholder': '' },
            "span": 12,
            "offset": 0,

            "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 8 } },
            "styles": { 'opacity': 0 },

        }]
    }]
)
