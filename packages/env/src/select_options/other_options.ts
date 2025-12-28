import { mchcEnv } from "src/env";
import { getPresetOptions, getSameOptions, getSimpleOptions, ICommonOption } from "./preset_options";
import { isFunction } from "lodash";

function toOptions(data: any) {
    if (typeof data === 'string') {
        return data.split(/[,;]/).map((v, i) => ({ label: v, value: v }));
    }
    return []
}
//Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ
const highriskLabel = {
    Ⅰ: '绿色',
    Ⅱ: '黄色',
    Ⅲ: '橙色',
    Ⅳ: '粉色',
    Ⅴ: '红色',
};

// 证件类型
const idTypeOptions = [
    { label: '身份证', value: 1 },
    { label: '护照', value: 2 },
    { label: '回乡证', value: 3 },
    { label: '台胞证', value: 4 },
    { label: '港澳台居民居住证', value: 5 },
];

// 婚姻
const maritalStatusOptions = getSimpleOptions('已婚,未婚,离异,再婚,丧偶', { useDefault: false })

// 下次复诊  门诊类型
const appointmentTypeOptions = [
    { label: ' ', value: '' },
    { label: '普通门诊', value: 1 },
    { label: '高危门诊', value: 2 },
    { label: '教授门诊', value: 3 },
    { label: '特需门诊', value: 4 },
    { label: '候床入院', value: 5 },
    { label: '留观', value: 6 },
];

// 下次复诊 时间间隔
const appointmentCycleOptions = () => [
    { label: '', value: 0 },
    { label: '1周后', value: 7 },
    { label: '2周后', value: 14 },
    { label: '3周后', value: 21 },
    { label: '4周后', value: 28 },
    { label: '1天后', value: 1 },
    { label: '2天后', value: 2 },
    { label: '3天后', value: 3 },

    ...(
        mchcEnv.is('广三')
            ? []
            : [
                { label: '4天后', value: 4 },
                { label: '5天后', value: 5 },
                { label: '6天后', value: 6 },
            ]
    )
]

// 下次复诊 时间段
const appointmentPeriodOptions = [
    { label: '上午', value: 1 },
    { label: '下午', value: 2 },
];

// 胎儿
const fetalOptions = getSameOptions('1,2,3,4,5,6')

// 胎动
const fetalMovementOptions = getSameOptions('正常,减少,增多')

// 先露
const presentationOptions = getSameOptions('头,臀,肩,不清,-')

// 胎方位
const fetalPositonOptions = getSameOptions('LOA,LOT,ROA,ROT')

// 位置
const positonOptions = getSameOptions('左,右,左上,右上,左下,右下')
const fetalHeartOptions = getSameOptions('<110,110-120,120-130,130-140,140-150,150-160')

// 下肢水肿
const edemaOptions = getSimpleOptions('-,+,++,+++,++++')

// 手术产式
const operationOptions = [
    { label: ' ', value: ' ' },
    { label: '剖宫产', value: 'cesareanSection' },
    { label: '吸引产', value: 'vacuumAssisted' },
    { label: '钳产', value: 'forceps' },
    { label: '臀助产', value: 'breechMidwifery' },
];

// 生存
const livingOptions = [
    { label: '健在', value: true },
    { label: '死亡', value: false },
];

// 性别
const genderOptions = getSimpleOptions('男,女,未知')

// 血型O,A,B,AB
const aboOptions = getSimpleOptions('A,B,AB,O')

// 血型RH(+),RH(-)
const rhOptions = [
    { label: 'RH(-)', value: 1 },
    { label: 'RH(+)', value: 2 },
];

// 经量
const menstrualVolumeOptions = getSameOptions('多,中,少')

// 地贫
const dpOptions = getSimpleOptions('正常,异常,未查,其他', { useDefault: false })

// 阴性、阳性、未查
const yywOptions = getSimpleOptions('阴性,阳性,未查', { useDefault: false })

// 乙肝两对半
const urokinaseOptions = [
    { label: '阴性', value: 1 },
    { label: '弱阳性', value: 21 },
    { label: '阳性', value: 2 },
    { label: '未查', value: 3 },
    { label: '其他', value: 4 },
];

// OGTT
const ogttOptions = getSimpleOptions('正常,GDM,未查', { useDefault: false })

// 无、有
const nhOptions: ICommonOption[] = [
    { label: '无', value: false },
    { label: '有', value: true },
];

// 无、有(值枚举)
const nhiOptions = [
    { label: '无', value: 1 },
    { label: '有', value: 2 },
];

// 否、是
const nyOptions: ICommonOption[] = [
    { label: '否', value: false },
    { label: '是', value: true, },
];

// 正常、其他
const zqOptions = [
    { label: '正常', value: 1 },
    { label: '其他', value: 2 },
];

// 心律
const rhythmOptions = [
    { label: '齐', value: 1 },
    { label: '不齐', value: 2 },
];

// 肝脏
const liverOptions = [
    { label: '未触及', value: 1 },
    { label: '可触及', value: 2 },
];

// 唐氏
const downsScreenOptions = [
    { label: '低风险', value: 1 },
    { label: '临界风险', value: 3 },
    { label: '高风险', value: 2 },
];

// 产前诊断
const prenatalDiagnosisOptions = [
    { label: '正常', value: 1 },
    { label: '异常', value: 2 },
    { label: '拒绝产前诊断和知情同意书', value: 4 },
];

// 受孕方式
const conceiveModeOptions = [
    { label: '自然', value: 2 },
    { label: 'IVF', value: 1 },
    { label: 'ICSI', value: 4 },
    { label: 'PGT', value: 5 },
    { label: 'AIH', value: 6 },
    { label: 'AID', value: 7 },
    { label: '其他', value: 3 },
];

// 衔接
const engagementOptions = toOptions('入,半,未');

// 乙肝两对半细项
const hbOptions = toOptions('阴性,阳性');

// 未见异常
const wjycOptions = toOptions('未见异常');

// 诺和平、诺和锐
const insOptions = toOptions('诺和平,诺和锐');

// 拉贝洛尔、硝苯地平、硫酸镁
const pvPihOptions = toOptions('拉贝洛尔,硝苯地平,硫酸镁');

// 酒的类型
const jiuOptions = toOptions('无,白酒,啤酒,红酒,其他');

// 职业
const occupationOptions = toOptions(
    '国家公务员,专业技术人员,企业管理人员,自由职业者,工人,现役军人,个体经营者,职员,农民,学生,退（离）休人员,其他',
);

// 疾病
const diseaseOptions = toOptions(
    '无,高血压,心脏病,癫痫,甲亢,甲减,糖尿病,肾脏疾病,风湿,肝脏疾病,肺结核,血栓疾病,地中海贫血,G6PD缺乏症,其他',
);

// 籍贯
const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
};
const nativeplaceOptions = Object.keys(city).map((e) => ({ label: city[e], value: city[e] }));

// 民族
const ethnicOptions = getPresetOptions('民族s')

/**
 * 执行状况
 */
const resultOptions = toOptions('未执行,已执行');
/**
 * 心理状况
 */
const mentalstateOptions = toOptions('平稳,焦虑,抑郁');
/**
 * 健康状况
 */
const jkzkOptions = toOptions('健康,良好,一般,较差');
/**
 * 新生儿喂养
 */
const xsewyOptions = toOptions('母乳,混合,人工');
/**
 * 乳房
 */
const breastOptions = toOptions('未见异常,硬结,红肿');
/**
 * 恶露
 */
const lochiaOptions = toOptions('干净,未净');
/**
 * 会阴
 */
const vulvaOptions = toOptions('未见异常,异常');
/**
 * 盆底肌
 */
const pdjOptions = toOptions('IC级,Ⅰ级,Ⅱ级,Ⅲ级,Ⅳ级,Ⅴ级');
/**
 * 盆底恢复
 */
const pelvicfloorOptions = toOptions('未见异常,压力性尿失禁,其它类型尿失禁,脱垂,尿频,粪失禁,盆腔疼痛');
/**
 * 高危转危
 */
const highriskOptions = toOptions('痊愈,好转，定期复查,转专科治疗');
/**
 * 诊断
 */
const diagnosisOptions = toOptions('常规产后随诊,子宫复旧不良,伤口愈合不良,盆底功能障碍');

const MAPS = {
    name: 'a',
    telephone: 'b',
    tel: 'c',
    outpatientNO: 'd',
    birthPermit: 'e',
    idType: 'f',
    idNO: 'g',
    dob: 'h',
    age: 'i',
    nationality: 'j',
    nativeplace: 'k',
    ethnic: 'l',
    occupation: 'n',
    maritalStatus: 'm',
    maritalAge: 'o',
    permanentResidenceAddress: 'p',
    residenceAddress: 'q',
    gravidity: 'r',
    parity: 's',
    nearRelation: 't',
    lmp: 'u',
    gestationalWeek: 'v',
    edd: 'w',
    sureEdd: 'x',
    menstrualHistory: 'y',
    y: {
        dysmenorrhea: 'a',
        menarche: 'b',
        menstrualCycle: 'c',
        menstrualPeriod: 'd',
    },
    personalProfile: 'z',
    z: {
        aBO: 'a',
        bmi: 'b',
        preheight: 'c',
        preweight: 'd',
    },
    diseaseHistory: 'A',
    allergyHistory: 'B',
    familyHistory: 'C',
    procedureHistory: 'D',
    partnerName: 'E',
    partnerTelephone: 'F',
    partnerIdType: 'G',
    partnerIdNO: 'H',
};

const WEBSOCKETMAPS = (function overturnMap() {
    const object = MAPS;
    let result = {};
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if (Object.prototype.toString.call(element) == '[object Object]') {
                let kk = '';
                for (const k in object) {
                    if (Object.prototype.hasOwnProperty.call(object, k)) {
                        if (object[k] === key) {
                            kk = k;
                        }
                    }
                }
                let subObject = {};
                for (const subKey in element) {
                    if (Object.prototype.hasOwnProperty.call(element, subKey)) {
                        subObject = { ...subObject, [element[subKey]]: subKey };
                    }
                }
                result = { ...result, [key]: kk, [kk]: { ...subObject } };
            } else {
                result = { ...result, [element]: key };
            }
        }
    }
    // console.log('---result---', result)
    return result;
})();

export const otherOptions = {
    highriskLabel,
    idTypeOptions,
    maritalStatusOptions,
    appointmentTypeOptions,
    appointmentCycleOptions,
    appointmentPeriodOptions,
    fetalOptions,
    fetalMovementOptions,
    presentationOptions,
    fetalPositonOptions,

    positonOptions,
    fetalHeartOptions,

    edemaOptions,
    operationOptions,
    livingOptions,
    genderOptions,
    aboOptions,
    rhOptions,
    menstrualVolumeOptions,
    dpOptions,
    yywOptions,
    urokinaseOptions,
    ogttOptions,
    nhOptions,
    nhiOptions,
    nyOptions,
    zqOptions,
    rhythmOptions,
    liverOptions,
    downsScreenOptions,
    prenatalDiagnosisOptions,
    conceiveModeOptions,
    engagementOptions,
    hbOptions,
    wjycOptions,
    insOptions,
    pvPihOptions,
    jiuOptions,
    occupationOptions,
    diseaseOptions,
    nativeplaceOptions,
    ethnicOptions,
    resultOptions,
    mentalstateOptions,
    jkzkOptions,
    xsewyOptions,
    breastOptions,
    lochiaOptions,
    vulvaOptions,
    pdjOptions,
    pelvicfloorOptions,
    highriskOptions,
    diagnosisOptions,
    WEBSOCKETMAPS,
}
export function getOtherOptions(key: keyof typeof otherOptions,) {
    let options = otherOptions[key] ?? []
    if (isFunction(options)) options = options()
    return options as unknown as ICommonOption[]
}