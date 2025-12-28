export * from './modal_template_types'
export * from './APP_CONFIG'

const GZlevelOptions = [
    { label: '绿色', value: 'Ⅰ' },
    { label: '黄色', value: 'Ⅱ' },
    { label: '橙色', value: 'Ⅲ' },
    { label: '粉色', value: 'Ⅳ' },
    { label: '红色', value: 'Ⅴ' },
];
// 全国高危
const nationLevelOptions = [
    { label: '绿色', value: 'Ⅰ' },
    { label: '黄色', value: 'Ⅱ' },
    { label: '橙色', value: 'Ⅲ' },
    { label: '红色', value: 'Ⅳ' },
];

const levelOptionsobj = {
    21: GZlevelOptions,
    22: GZlevelOptions,
    23: nationLevelOptions,
};
export const mchcConstant = {
    levelOptionsobj
}