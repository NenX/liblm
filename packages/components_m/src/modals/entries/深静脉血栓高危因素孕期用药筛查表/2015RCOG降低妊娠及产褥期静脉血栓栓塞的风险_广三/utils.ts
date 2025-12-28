import { IMchc_Doctor_PreRiskAssessmentInfo } from "@lm_fe/service";
import { multipleOptions } from "./config";
import { AnyObject, unmarshalGestationWeek } from '@lm_fe/utils'

export function getMultipleOptionByFuzzyWord(text: string) {
    const target = multipleOptions
        .map(o => {
            const item = o.data.find(_ => _.label.includes(text) || text.includes(_.label))
            return item
        })
        .find(_ => _)

    return target
}

function getResultItem(text: string) {
    const result: AnyObject = {}
    const item = getMultipleOptionByFuzzyWord(text)
    if (item) {
        result[item.key] = item.value
    }
    return result
}

export function getDefaultResultBaseOnInfo(data: IMchc_Doctor_PreRiskAssessmentInfo) {
    const result: AnyObject = {}
    // const { diagnosesList } = props;
    const _diagnosesList = data.diagnoses;
    /**自动勾选项判断*/
    const bmi = data.bmi ?? 0;

    const parity = data.parity ?? 0
    const futureAge = data.eddAge ?? 0
    const smoke = data.smoke
    const conceiveMode = data.conceiveMode
    const week = unmarshalGestationWeek(data.curgesweek).week

    let flag = false

    flag = _diagnosesList.some((_) => ['癌', '肿瘤', '心衰', '心力衰竭', '狼疮', 'SLE', '肠炎', '肠道感染', '镰状细胞', '多关节', '肾病'].some(str => _.diagnosis?.includes(str)));
    flag && Object.assign(result, getResultItem('内科'))

    flag = _diagnosesList.some((_) => _.diagnosis?.includes('1型糖尿病')) && _diagnosesList.some((_) => _.diagnosis?.includes('肾') && !_.diagnosis?.includes('胎'))
    flag && Object.assign(result, getResultItem('内科'))

    flag = bmi >= 30 && bmi < 40
    flag && Object.assign(result, getResultItem('30kg'))

    flag = bmi >= 40
    flag && Object.assign(result, getResultItem('40kg'))

    flag = futureAge >= 35
    flag && Object.assign(result, getResultItem('年龄'))

    flag = parity >= 3
    flag && Object.assign(result, getResultItem('产次'))

    smoke && Object.assign(result, getResultItem('吸烟'))

    flag = _diagnosesList.some((_) => _.diagnosis?.includes('静脉曲张'))
    flag && Object.assign(result, getResultItem('静脉曲张'))

    flag = _diagnosesList.some((_) => _.diagnosis?.includes('子痫前期'))
    flag && Object.assign(result, getResultItem('子痫前期'))


    flag = conceiveMode === 1
    flag && Object.assign(result, getResultItem('IVF'))

    flag = _diagnosesList.some((_) => ['三胎', '四胎', '五胎', '六胎', '七胎', '八胎'].some(str => _.diagnosis?.includes(str)));
    flag && Object.assign(result, getResultItem('多胎'))

    flag = _diagnosesList.some((_) => _.diagnosis?.includes('卵巢过度刺激综合征')) && week < 14
    flag && Object.assign(result, getResultItem('卵巢过度刺激综合征'))

    flag = _diagnosesList.some((_) => _.diagnosis?.includes('剧吐'))
    flag && Object.assign(result, getResultItem('剧吐'))

    flag = _diagnosesList.some((_) => ['脱水', '截瘫',].some(str => _.diagnosis?.includes(str)))
    flag && Object.assign(result, getResultItem('制动'))



    return result;
};