[{
    "name": "检验检查",
    "flag": "产前检查-医生端-首检信息-检验检查",
    "fields": [{
        "key": "partnerBg",
        "label": "男方血型",
        "inputType": "select",
        
        "specialConfig": "",
        "inputProps": { 'options': 'aboOptions', 'placeholder': 'ABO血型', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        "span": 4,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "partnerRh",
        "label": null,
        "inputType": "select",
        
        "inputProps": { 'warningOption': 1, 'options': 'rhOptions', 'style': { 'marginLeft': '-1px' } },
        "span": 2,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "partnerThalassemia(Note)",
        "label": "男方地贫",
        "inputType": "checkbox",
        
        "inputProps": { 'type': 'custom', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'renderData': [{ 'key': 'partnerThalassemia', 'options': 'dpOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }, { 'key': 4, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 10,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "syncDate",
        "label": "上次同步时间",
        "inputType": "date",
        
        "inputProps": { 'disabled': true, 'hiddenSecond': true },
        "span": 6,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "key": "syncBtn",
        "label": "",
        "inputType": "button",
        
        "inputProps": { 'btn_text': ['同步数据'] },
        "span": 2,
        "offset": 0,
        "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },
    }, {
        "key": "personalBg",
        "label": "女方血型",
        "inputType": "select",
        
        "inputProps": { 'options': 'aboOptions', 'disabled': true, 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        "span": 4,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "personalRh",
        "label": null,
        "inputType": "select",
        
        "inputProps": { 'options': 'rhOptions', 'warningOption': 1, 'style': { 'marginLeft': '-1px' }, 'disabled': true },
        "span": 2,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "personalThalassemia(Note)",
        "label": "女方地贫",
        "inputType": "checkbox",
        
        "inputProps": { 'type': 'custom', 'renderData': [{ 'key': 'personalThalassemia', 'options': 'dpOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }, { 'key': 4, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }], 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        "span": 10,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "tsh",
        "label": "TSH",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'unit': 'uIU/ml', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "t3",
        "label": "游离T3",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': '游离T3是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'pmol/L' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "t4",
        "label": "游离T4",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': '游离T4是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'pmol/L' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hb",
        "label": "HB",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'unit': 'g/L', 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' } },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "mcv",
        "label": "MCV",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': 'MCV是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'fL' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "plt",
        "label": "PLT",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': 'PLT是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'x10^9/L' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "urokinase(Note)",
        "label": "尿蛋白",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'urokinase', 'options': 'urokinaseOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }, { 'key': 4, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbsag",
        "label": "HBsAg",
        "inputType": "autoComplete",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'options': 'hbOptions', 'positiveWarning': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbsab",
        "label": "HBsAb",
        "inputType": "autoComplete",
        
        "inputProps": { 'options': 'hbOptions', 'positiveWarning': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbeag",
        "label": "HBeAg",
        "inputType": "autoComplete",
        
        "inputProps": { 'options': 'hbOptions', 'positiveWarning': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbeab",
        "label": "HBeAb",
        "inputType": "autoComplete",
        
        "inputProps": { 'options': 'hbOptions', 'positiveWarning': true },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbcab",
        "label": "HBcAb",
        "inputType": "autoComplete",
        
        "inputProps": { 'options': 'hbOptions', 'positiveWarning': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hbvdna",
        "label": "HBV DNA",
        "inputType": "input",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'IU/ml' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "alt",
        "label": "ALT",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': 'ALT是必填项' }],
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'U/L' },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "ast",
        "label": "AST",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': 'AST是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'U/L' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "pt",
        "label": "PT",
        "inputType": "input",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 20, 'disabled': true },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "inr",
        "label": "INR",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'min': 0, 'max': 2, 'step': 0.1, 'disabled': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "aptt",
        "label": "APTT",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 50, 'disabled': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "tt",
        "label": "TT",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'unit': 'sec', 'min': 0, 'max': 20, 'disabled': true },
        "span": 6,
        "isNewRow": 1,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "fib",
        "label": "FIB",
        "inputType": "input",
        
        "inputProps": { 'type': 'number', 'unit': 'g/L', 'min': 0, 'max': 5, 'step': 0.1, 'disabled': true },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "sf",
        "label": "SF",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': 'MCV是必填项' }],
        "inputProps": { 'type': 'number', 'unit': 'ng/ml' },
        "span": 6,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hcvResult(Note)",
        "label": "丙肝抗体",
        "inputType": "checkbox",
        "rules": [{ 'required': undefined, 'message': '丙肝抗体是必填项' }],
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'hcvResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 18,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hcvrnaResult(Note)",
        "label": "丙肝RNA",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'hcvrnaResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 18,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "syphilisResult(Note)",
        "label": "梅毒",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'syphilisResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "hivResult(Note)",
        "label": "HIV",
        "inputType": "checkbox",
        "rules": [{ 'required': undefined, 'message': 'HIV是必填项' }],
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'hivResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "gbsResult(Note)",
        "label": "GBS",
        "inputType": "checkbox",
        "rules": [{ 'required': undefined, 'message': 'GBS是必填项' }],
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'gbsResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "g6pdResult(Note)",
        "label": "G6PD",
        "inputType": "checkbox",
        
        "inputProps": { 'type': 'custom', 'renderData': [{ 'key': 'g6pdResult', 'options': 'yywOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "downsScreenEarly(Note)",
        "label": "早唐",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'downsScreenEarly', 'options': 'downsScreenOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'isIssue': true }] }, { 'key': 3, 'editors': [{ 'isIssue': true }] }] }] },
        "span": 7,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "downsScreenMiddle(Note)",
        "label": "中唐",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'downsScreenMiddle', 'options': 'downsScreenOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'isIssue': true }] }, { 'key': 3, 'editors': [{ 'isIssue': true }] }] }] },
        "span": 7,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "nipt(Note)",
        "label": "NIPT",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'nipt', 'options': 'downsScreenOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'isIssue': true }] }, { 'key': 3, 'editors': [{ 'isIssue': true }] }] }] },
        "span": 7,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "prenatalDiagnosisResult(Note)",
        "label": "产前诊断",
        "inputType": "checkbox",
        "rules": [{ 'required': undefined, 'message': '产前诊断是必填项' }],
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'prenatalDiagnosisResult', 'options': 'prenatalDiagnosisOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'isIssue': true }] }, { 'key': 4, 'editors': [{ 'isIssue': true }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "ogttResult(Note)",
        "label": "OGTT",
        "inputType": "checkbox",
        
        "inputProps": { 'labelSign': { 'type': 'iconfont', 'value': 'icon-number_light' }, 'type': 'custom', 'renderData': [{ 'key': 'ogttResult', 'options': 'ogttOptions', 'extraEditors': [{ 'key': 2, 'editors': [{ 'input_type': 'input', 'isIssue': true, 'style': { 'width': '350px' } }] }] }] },
        "span": 24,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }, {
        "key": "other",
        "label": "其他",
        "inputType": "input",
        "rules": [{ 'required': undefined, 'message': '其他是必填项' }],
        "span": 18,
        "formItemLayout": { 'labelCol': { 'span': undefined }, 'wrapperCol': { 'span': undefined } },
    }]
}]