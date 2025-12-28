import { formatDateTime } from "@lm_fe/utils"
import { get, isFunction, set } from "lodash"
export interface IMchc_TableConfig {
    "id": 16,
    "initialSearchValue": any,
    searchParams: any
    tableColumns: any
    searchConfig: any
    watchScript: any
    "name": string,
    "dept": string,
    "apiPrefix": string,
    "title": string,
    "rowKey": string,
    handleBeforePopup: any
    genColumns: any
    beforeSubmit: any
    "showAction": number,
    "category": null,
    "needSync": number,
    "needPrint": null,
    "showAdd": null,
    "showExport": number,
    "deleteFlag": false
}


export function format_fn_string(config: any, name: string) {
    const fn = get(config, name)
    if (isFunction(fn)) {
        // const fn_str = fn.toString().replaceAll('\r\n', '').replaceAll('\n', '')
        const fn_str = fn.toString()
        set(config, name, `#${fn_str}#`)
    }
}
export function make_bf_script_field(fd?: any, example = false) {
    // if (!fd) return script_field_template(undefined, false)
    if (!fd) return ''
    const conf_str = JSON.stringify(fd, null, 4)
        .replaceAll(/"#(.*?)#"/g, (a, b) => b)
        .replaceAll(`\\"`, `'`)
        .replaceAll("\\r\\n", '\r\n')
        .replaceAll("\\n", '\n')
        .replaceAll("\\\\u", '\\u')

    return script_field_template(conf_str, example)
}
const example_tmp = `||
// 下面是一个示例
// 常用组件: MC(单选、多选, options, marshal, type), MS(下拉 options, marshal, type), MA(下拉输入 options), 
// 常用组件: Input(输入框, 数字 {type:number} ), DatePicker(时间日期), MyEditTable(表格), ArrayPanel(胎儿)
    [
        {
            "label": "示例标题",
            "name": "字段",
            "inputType": "MA", // 组件类型 MC 勾选框 MS 下拉 MA 可选择输入(inputProps配置memorieskey 可升级为记忆组件)
            "width": 120, // 表格所占宽度
            "layout": "2/3", // 表单布局
            // hidden: true, // 表格隐藏
            // isActive: false, // 表单显示
            inputProps: { options: '红色,白色i,紫色i', marshal:1, type:'multiple' }, // options 选项(后缀i代表输入框) marshal 0基本值 1序列化对象 2对象 type 配置多选
            processRemote: function(v, form){return v || 'default'}, // 配置表单默认值
            checkWarn: function (v) { return v > 5 }, // 配置表单警告
            render: function (a, row) { // 表格自定义渲染, a 当前行字段值, row 当前行数据
                if (a == '阳性')
                    return c('span', { style: { color: 'red' }, }, a)
                return ( a + 'id:' + row.id ) || '默认值' // 表格默认值
            }
        }
    ]`
function script_field_template(conf_str?: string, example = false) {

    return `/**
 * @author brainfucker
 * @email lixf@lian-med.com
 * @create date ${formatDateTime()}
 */
var React = ctx.React, utils = ctx.utils, mchcEnv = ctx.mchcEnv, request = ctx.request, goTo = ctx.goTo;

var c = React.createElement;
var formatDate = utils.formatDate, formatDateTime = utils.formatDateTime, getSearchParamsAll = utils.getSearchParamsAll;
ctx.required = true; // 表单必填

var fd = ${conf_str || '[]'}
ret = function (){
    return fd ${example ? example_tmp : ''}
};`
}


