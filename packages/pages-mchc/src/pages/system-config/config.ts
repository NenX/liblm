import { mchcEnv } from "@lm_fe/env";

export const doctor_tabs = [
    { name: '首检信息', key: 'Initial', },
    { name: '复诊记录', key: 'Further', },
    { name: '产后复诊记录', key: 'Postpartum', },
    { name: '孕期曲线', key: 'Curve', },
    { name: '个案登记卡', key: 'CaseReport', },
    // { name: '产程图',  key: 'Partogram' ,  },
    { name: '检查报告', key: 'ImageReport', },
    { name: '检验报告', key: 'SurveyReport', },
    { name: '胎监报告', key: 'FetalMonitor', },
    { name: '居家监护', key: 'BloodGlucose', },
    { name: '基本信息', key: 'Base', },
    { name: '助产士预约', key: '助产士预约', },
    { name: '孕妇学校预约', key: '孕妇学校预约', },
    { name: '文书管理', key: 'InformedConsent', },
    { name: '历次孕册', key: 'AllPregnancies', },
    { name: '产前诊断', key: 'PrenatalDiagnosis', },
    { name: mchcEnv.is('广三') ? '产前诊断病历' : '遗传咨询病历', key: 'GeneticCounseling', },
]

export const NurseTypesMapping = [
    {
        key: 'firstNursing',
        name: '首次护理记录',
    },
    {
        key: 'preDeliverNursing',
        name: '待产记录',
    },
    {
        key: 'postnatalCareRecord',
        name: '产后护理记录',
    },
    {
        key: 'urinaryRetentionNursing',
        name: '产后尿潴留护理单',
    },
    {
        key: 'magnesiumNursing',
        name: '产科注射硫酸镁观察表',
    },
    {
        key: 'infantFeedingRecord',
        name: '婴儿喂哺记录单',
    },
    {
        key: 'productionTimeNursing',
        name: '产时管理卡',
    },
    {
        key: 'neonateScaleNursing',
        name: '新生儿量表检查',
    },
    {
        key: 'newbornBirthRecord',
        name: '新生儿出生记录单（二）',
    },
    {
        key: 'transvaginalDeviceList',
        name: '经阴道器械辅料清点记录单',
    },
    {
        key: 'processNursing',
        name: '产程记录',
    },
    {
        key: 'oxytocinNursing',
        name: '催产素点滴记录',
    },
    {
        key: 'pastDeliveryNursing',
        name: '产后2小时护理',
    },
    {
        key: 'normalNursing',
        name: '一般护理记录',
    },
    {
        key: 'specialNursing',
        name: '特殊护理记录',
    },
    {
        key: 'TemperatureNursing',
        name: '体温单',
    },
    {
        key: 'NeonatalCareRecord',
        name: '新生儿护理记录',
    },
    {
        key: 'noenateHandOverNursing',
        name: '新生儿交接记录',
    },
    {
        key: 'bloodSugarNursing',
        name: '血糖记录单',
    },
    {
        key: 'nutritionNursing',
        name: '营养护理单',
    },
    {
        key: 'morseNursing',
        name: 'Morse跌倒评估',
    },
    {
        key: 'RiskFactorsOfPipelineSlippage',
        name: '管道滑脱危险因素评估',
    },
    {
        key: 'vteNursing',
        name: 'VTE评估量表',
    },
    {
        key: 'PressureSoresNursing',
        name: '压疮评估量表',
    },
    {
        key: 'barthelNursing',
        name: 'Barthel评估表',
    },
    {
        key: 'painNursing',
        name: '疼痛评估表',
    },
    {
        key: 'DeliverySafetyChecklist',
        name: '分娩安全核查表',
    },
    {
        key: 'handOverNursing',
        name: '新生儿交接记录单',
    },
    {
        key: 'NurseHandOverNursing',
        name: '交接班记录',
    },
    {
        key: 'tocolysisNursing',
        name: '宫缩抑制剂静脉滴注观察护理记录',
    },
    {
        key: 'breastMilkNursing',
        name: '母婴同室母乳喂养评价登记表',
    },
]


export const medicalTypeMapping = [
    {
        key: 'deliveryNursing',
        name: '分娩记录',
    },
    {
        key: 'deliveryNursingv2',
        name: '分娩记录v2',
    },
    {
        key: 'neonatalNursing',
        name: '新生儿记录',

    },
    {
        key: 'inducedNursing',
        name: '引产记录',
    },
    {
        key: 'CaesareanRecord',
        name: '剖宫产记录',
    },
    {
        key: 'OtherDelivery',
        name: '其他手术记录',
    },
    {
        key: 'tireDischargeRecord',
        name: '排胎记录单',
    },
]
