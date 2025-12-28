import { LazyAntd } from "@lm_fe/components";
import { mchcEnv } from "@lm_fe/env";
import { IMchc_Doctor_PreRiskAssessmentInfo } from "@lm_fe/service";
import { ColumnType } from "antd/lib/table";
import styles from './index.module.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export const multipleOptions = [
    {
        title: '孕前危险因素',
        hide: false,
        data: [
            { key: 'preNote1', hide: false, label: 'VTE病史（与手术相关的VTE病史除外）', value: 4, },
            { key: 'preNote2', hide: false, label: '与手术相关的VTE病史', value: 3 },
            { key: 'preNote3', hide: false, label: '已知高危易栓症（抗凝血酶缺乏、莱顿第Ⅴ因子及凝血酶原G20210A双杂合突变，或其中之一为纯合突变）', value: 3, },
            { key: 'preNote4', hide: false, label: '内科合并症（癌症、心力衰竭、活动性SLE、炎症性多关节病或炎症性肠病、肾病综合征、Ⅰ型糖尿病合并肾病、镰状细胞病、静脉吸毒者）', value: 3, },
            { key: 'preNote5', hide: false, label: '肥胖（BMI≥40kg/㎡）', value: 2 },
            { key: 'preNote6', hide: false, label: '肥胖（BMI≥30kg/㎡）', value: 1 },
            { key: 'preNote7', hide: false, label: '无明显诱因的家族史或一级亲属患有与雌激素相关的VTE', value: 1 },
            { key: 'preNote8', hide: mchcEnv.is('广三'), label: '糖尿病合并妊娠', value: 1 },
            { key: 'preNote9', hide: false, label: '已知低危易栓症且无VTE病史（莱顿第Ⅴ因子或凝血酶G20210A杂合突变）', value: 1 },
            { key: 'preNote10', hide: false, label: '年龄＞35岁', value: 1 },
            { key: 'preNote11', hide: false, label: '产次≥3次', value: 1 },
            { key: 'preNote12', hide: false, label: '吸烟', value: 1 },
            { key: 'preNote13', hide: false, label: '静脉曲张', value: 1 },
        ]
    },
    {
        title: '产科危险因素',
        hide: false,
        data: [
            { key: 'obsNote1', hide: mchcEnv.is('广三'), label: '剖宫产术中切除子宫', value: 3 },
            { key: 'obsNote2', hide: mchcEnv.is('广三'), label: '中转剖宫产', value: 2 },
            { key: 'obsNote3', hide: mchcEnv.is('广三'), label: '择期剖宫产', value: 1 },
            { key: 'obsNote4', hide: false, label: '本次妊娠发生子痫前期', value: 1 },
            { key: 'obsNote5', hide: false, label: 'ART/IVF（仅限于产前阶段）', value: 1 },
            { key: 'obsNote6', hide: mchcEnv.is('广三'), label: '多胎妊娠', value: 1 },
            { key: 'obsNote7', hide: mchcEnv.is('广三'), label: '内倒转或外倒转术', value: 1 },
            { key: 'obsNote8', hide: mchcEnv.is('广三'), label: '阴道助产', value: 1 },
            { key: 'obsNote9', hide: mchcEnv.is('广三'), label: '产程延长（＞24hr）', value: 1 },
            { key: 'obsNote10', hide: mchcEnv.is('广三'), label: '产后出血（＞1000ml或需要输血）', value: 1 },
            { key: 'obsNote11', hide: mchcEnv.is('广三'), label: '本次妊娠早产（＜37周）', value: 1 },
            { key: 'obsNote12', hide: mchcEnv.is('广三'), label: '本次妊娠胎死宫内', value: 1 },
        ]
    },
    {
        title: '新发或一过性危险因素',

        hide: false,
        data: [
            { key: 'onceNote1', hide: false, label: '卵巢过度刺激综合征（仅限早孕期）', value: 4 },
            { key: 'onceNote2', hide: false, label: '孕期或产褥期手术（除外急性会阴修复）、阑尾切除术、绝育术', value: 3 },
            { key: 'onceNote3', hide: false, label: '妊娠剧吐', value: 3 },
            { key: 'onceNote4', hide: false, label: '当前系统性感染（需要静脉抗炎或住院治疗）如肺炎、伤口感染', value: 1 },
            { key: 'onceNote5', hide: false, label: '制动、脱水', value: 1 },
        ]
    },

]
export const singleOptions = [
    {
        title: '易栓症类型',
        hide: false,
        key: 'note1',
        data: [
            { hide: false, label: '高危易栓症：抗凝血酶缺乏、莱顿第Ⅴ因子及凝血酶原G20210A双杂合突变，或其中之一为纯合突变', value: 1, },
            { hide: false, label: '低危易栓症：莱顿第Ⅴ因子及凝血酶G20210A杂合突变', value: 2 },
        ]
    }
]
const dataSource = [
    {
        key: '1',
        weight: '＜50kg',
        consumption: '20mg/d',
    },
    {
        key: '2',
        weight: '50-90kg',
        consumption: '40mg/d',
    },
    {
        key: '3',
        weight: '91-131kg',
        consumption: '60mg/d',
    },
    {
        key: '4',
        weight: '131-170kg',
        consumption: '80mg/d',
    },
    {
        key: '5',
        weight: '＞170kg',
        consumption: '0.6mg/kg',
    },
];
const columns: ColumnType<any>[] = [
    {
        title: '体重范围',
        dataIndex: 'weight',
        key: 'weight',
        align: 'center',
    },
    {
        title: '用量',
        dataIndex: 'consumption',
        key: 'consumption',
        align: 'center',
    },
];
export const displayBlock = [
    {
        title: '产前评分指导',
        hide: false,
        C: () => <div style={{ lineHeight: '32px' }}>
            <p>评分≥4分：早孕期开始预防血栓；</p>
            <p>评分=3分：孕28周开始预防血栓；</p>
        </div>
    },
    {
        title: '产后（产前+产后）评分指导',
        hide: mchcEnv.is('广三'),
        C: () => <div style={{ lineHeight: '32px' }}>
            <p>评分≥2分：产后预防标准直至出院；</p>
            <p>评分≥3分：产后预防标准7天，如有持续风险则更久；</p>
            <p>产褥期延长住院（≥3d）或再住院应考虑预防血栓形成；</p>
            <p>所有产妇均气压治疗；</p>
        </div>
    },
    {
        title: '标准药物预防（低分子肝素皮下注射）',
        hide: false,
        C: (props: { data?: IMchc_Doctor_PreRiskAssessmentInfo }) => <Table rowClassName={e => {
            const weight = props.data?.weight ?? 0
            let key = '1'
            if (weight >= 50) {
                key = '2'
            }
            if (weight > 90) {
                key = '3'
            }
            if (weight >= 131) {
                key = '4'
            }
            if (weight > 170) {
                key = '5'
            }
            return e.key === key ? styles['activeRow'] : ''
        }
        } bordered rowKey={'key'} columns={columns} dataSource={dataSource} pagination={false} />
    },
]

