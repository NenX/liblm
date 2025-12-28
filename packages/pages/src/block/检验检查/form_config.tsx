import { mchcEnv } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";

export const form_confg = defineFormConfig([
    {
        "key": "syncDate",
        "label": "上次同步时间",
        "inputType": 'DatePicker',

        "inputProps": { 'disabled': true, showTime: true },
        layout: '1/3'


    },
    {
        "key": "syncBtn",
        "label": "同步数据",
        "inputType": "MyButton",

        "inputProps": {},
        layout: '1/3'


    },
    {
        "key": "partnerBg",
        "label": "男方血型",
        "inputType": "select",
        "inputProps": { 'options': mchcEnv.get_other_options('aboOptions'), marshal: 0, 'placeholder': 'ABO血型', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        layout: '1/3',
        isNewRow: 1,

    },
    {
        "key": "partnerRh",
        "label": "男方RH血型",

        "inputType": "select",


        "inputProps": { 'warningOption': 1, marshal: 0, 'options': mchcEnv.get_other_options('rhOptions'), 'style': { 'marginLeft': '-1px' } },
        layout: '1/3'

    }, {
        key: "partnerThalassemia__",
        "label": "男方地贫",
        "inputType": "checkbox",

        "inputProps": { options: '正常,异常i,未查,其他i', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    },
    {
        "key": "personalBg",
        "label": "女方血型",
        "inputType": "select",


        "inputProps": { 'options': mchcEnv.get_other_options('aboOptions'), marshal: 0, 'disabled': true, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "personalRh",
        "label": "女方RH血型",

        "inputType": "select",


        "inputProps": { 'options': mchcEnv.get_other_options('rhOptions'), marshal: 0, 'warningOption': 1, 'style': { 'marginLeft': '-1px' }, 'disabled': true },
        layout: '1/3'

    }, {
        key: "personalThalassemia__",
        "label": "女方地贫",
        "inputType": "checkbox",

        "inputProps": { options: '正常,异常i,未查,其他i', },
        layout: '1/3'

    }, {
        "key": "tsh",
        "label": "TSH",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'uIU/ml', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "t3",
        "label": "游离T3",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'pmol/L' },
        layout: '1/3'

    }, {
        "key": "t4",
        "label": "游离T4",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'pmol/L' },
        layout: '1/3'

    }, {
        "key": "hb",
        "label": "HB",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'g/L', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "mcv",
        "label": "MCV",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'fL' },
        layout: '1/3'

    }, {
        "key": "plt",
        "label": "PLT",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'x10^9/L' },
        layout: '1/3'

    }, {
        key: "urokinase__",
        "label": "尿蛋白",
        "inputType": "checkbox",

        "inputProps": {
            // sp: [{ label: '弱阳性', value: 21 }],
            options: '阴性,弱阳性,阳性i,未查,其他i',
            'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' },
        },
        layout: '1/3'

    }, {
        "key": "hbsag",
        "label": "HBsAg",
        "inputType": "autoComplete",

        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, options: mchcEnv.get_other_options('hbOptions'), 'positiveWarning': true },
        layout: '1/3'

    }, {
        "key": "hbsab",
        "label": "HBsAb",
        "inputType": "autoComplete",

        "inputProps": { 'options': mchcEnv.get_other_options('hbOptions'), 'positiveWarning': true },
        layout: '1/3'

    }, {
        "key": "hbeag",
        "label": "HBeAg",
        "inputType": "autoComplete",

        "inputProps": { 'options': mchcEnv.get_other_options('hbOptions'), 'positiveWarning': true },
        layout: '1/3'

    }, {
        "key": "hbeab",
        "label": "HBeAb",
        "inputType": "autoComplete",

        "inputProps": { 'options': mchcEnv.get_other_options('hbOptions'), 'positiveWarning': true },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "hbcab",
        "label": "HBcAb",
        "inputType": "autoComplete",

        "inputProps": { 'options': mchcEnv.get_other_options('hbOptions'), 'positiveWarning': true },
        layout: '1/3'

    }, {
        "key": "hbvdna",
        "label": "HBV DNA",
        "inputType": "input",

        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'IU/ml' },
        layout: '1/3'

    }, {
        "key": "alt",
        "label": "ALT",
        "inputType": "input",

        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'U/L' },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "ast",
        "label": "AST",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'U/L' },
        layout: '1/3'

    }, {
        "key": "pt",
        "label": "PT",
        "inputType": "input",

        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 20, 'disabled': true },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "inr",
        "label": "INR",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'min': 0, 'max': 2, 'step': 0.1, 'disabled': true },
        layout: '1/3'

    }, {
        "key": "aptt",
        "label": "APTT",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 50, 'disabled': true },
        layout: '1/3'

    }, {
        "key": "tt",
        "label": "TT",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 20, 'disabled': true },
        layout: '1/3',
        "isNewRow": 1,

    }, {
        "key": "fib",
        "label": "FIB",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'g/L', 'min': 0, 'max': 5, 'step': 0.1, 'disabled': true },
        layout: '1/3'

    }, {
        "key": "sf",
        "label": "SF",
        "inputType": "input",

        "inputProps": { 'type': 'number', 'unit': 'ng/ml' },
        layout: '1/3'

    }, {
        key: "hcvResult__",
        "label": "丙肝抗体",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "hcvrnaResult__",
        "label": "丙肝RNA",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "syphilisResult__",
        "label": "梅毒",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "hivResult__",
        "label": "HIV",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "gbsResult__",
        "label": "GBS",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "g6pdResult__",
        "label": "G6PD",
        "inputType": "checkbox",

        "inputProps": { options: '阴性,阳性i,未查', },
        layout: '1/3'

    }, {
        key: "downsScreenEarly",
        "label": "早唐",
        "inputType": "checkbox",

        "inputProps": { options: mchcEnv.get_other_options('downsScreenOptions'), marshal: 0, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "downsScreenMiddle",
        "label": "中唐",
        "inputType": "checkbox",

        "inputProps": { options: mchcEnv.get_other_options('downsScreenOptions'), marshal: 0, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "nipt",
        "label": "NIPT",
        "inputType": "checkbox",

        "inputProps": { options: mchcEnv.get_other_options('downsScreenOptions'), marshal: 0, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "prenatalDiagnosisResult",
        "label": "产前诊断",
        "inputType": "checkbox",

        "inputProps": { options: mchcEnv.get_other_options('prenatalDiagnosisOptions'), marshal: 0, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    }, {
        key: "ogttResult__",
        "label": "OGTT",
        "inputType": "checkbox",

        "inputProps": { options: mchcEnv.get_other_options('ogttOptions'), 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, },
        layout: '1/3'

    },
    {
        "key": "other",
        "label": "其他",
        "inputType": "input",
        layout: '1/3'

    },
    {
        "key": "id",
        "inputType": "input",
        form_hidden: true,
    }
])