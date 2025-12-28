import { set, get, forEach, cloneDeep, assign, isEmpty, filter } from 'lodash';

import { formatDate, fubaoRequest as request, transmit_happy, transmit_happy_pre } from '@lm_fe/utils';
import { getPresetOptions, historyPush, mchcUtils } from '@lm_fe/env';
import { SLocal_History, SLocal_State } from '@lm_fe/service';
import _ from 'lodash';
/*
 * @Author: ZHONG JUN
 * @Date: 2020-03-28 21:43:23
 * @Description: 身份证校验规则
 */

// fixedSelects 固定选项，渲染表单项，在 adapter 中有使用，勿删
export const fixedSelects = {
    // 分娩方式
    deliverWays: ['vaginalDelivery', 'cesareanSection', 'forceps', 'vacuumAssisted', 'breechMidwifery'],
    // 流产方式
    abortionWays: ['naturalAbortion', 'medicalAbortion', 'surgicalAbortion', 'currettage'],
    // 不良生育史
    badPregnancies: ['inducedLabor', 'fetusdeath', 'ectopicPregnancy', 'hydatidMole', 'multiple'],
};










/**
 * 过滤出孕产史信息
 */
export function filterPregnancyHistories(data: any) {
    const cloneData = cloneDeep(data);
    const allItem: string[] = [];
    const hisArr: any[] = [];
    let hisSortArr: number[] = [];

    forEach(cloneData, (value, key) => {
        if (key.indexOf('_') > -1) allItem.push(key);
        /*获取需要保存的孕次*/
        if (key.indexOf('year') > -1) {
            const num = Number(key.slice(-1));
            hisSortArr.push(num);
        }
    });
    if (allItem.length === 0) return [];

    for (const i of hisSortArr) {
        const hisObj = {};

        set(hisObj, 'year', get(cloneData, `year_${i}`));
        set(hisObj, 'complicationNote', get(cloneData, `complicationNote_${i}`));
        set(hisObj, 'exceptionalcase', get(cloneData, `exceptionalcase_${i}`));
        /*是否分娩*/
        if (get(cloneData, `hasPregnancy_${i}`)) {
            set(hisObj, 'hospital', get(cloneData, `hospital_${i}`));
            set(hisObj, 'gestationalWeek', get(cloneData, `gestationalWeek_${i}`));
            set(hisObj, 'puerperalFever', get(cloneData, `puerperalFever_${i}`));
            set(hisObj, 'hemorrhage', get(cloneData, `hemorrhage_${i}`));
            /*分娩方式*/
            const deliverWay = get(cloneData, `deliverWay_${i}`);
            forEach(fixedSelects.deliverWays, (item) => {
                if (item === deliverWay) {
                    set(hisObj, item, true);
                } else {
                    set(hisObj, item, false);
                }
            });

            /*胎儿信息*/
            const fetalcount = get(cloneData, `fetalcount_${i}`) || 0;
            set(hisObj, 'fetalcount', fetalcount);
            if (fetalcount > 0) {
                const fetalArr: any[] = [];
                for (let j = 0; j < fetalcount; j++) {
                    const fetalObj = {};
                    if (get(cloneData, `childLiving_${i}_${j}`)) {
                        set(fetalObj, 'childLiving', true);
                        set(fetalObj, 'childGender', get(cloneData, `childGender_${i}_${j}`));
                        set(fetalObj, 'sequelaNote', get(cloneData, `sequelaNote_${i}_${j}`));
                        set(fetalObj, 'childDeformity', get(cloneData, `childDeformity_${i}_${j}`));
                        set(fetalObj, 'neonateWeight', get(cloneData, `neonateWeight_${i}_${j}`));
                        set(fetalObj, 'neonateHeight', get(cloneData, `neonateHeight_${i}_${j}`));
                    } else {
                        set(fetalObj, 'childLiving', false);
                        set(fetalObj, 'childDeathTime', get(cloneData, `childDeathTime_${i}_${j}`));
                        set(fetalObj, 'childDeathNote', get(cloneData, `childDeathNote_${i}_${j}`));
                    }
                    fetalArr.push(fetalObj);
                }
                set(hisObj, 'children', fetalArr);
            }
        } else {
            /*流产方式*/
            const abortionWay = get(cloneData, `abortionWay_${i}`);
            forEach(fixedSelects.abortionWays, (item) => {
                if (abortionWay && abortionWay.includes(item)) {
                    set(hisObj, item, true);
                } else {
                    set(hisObj, item, false);
                }
            });

            /*不良生育史*/
            const badPregnancy = get(cloneData, `badPregnancy_${i}`);
            forEach(fixedSelects.badPregnancies, (item) => {
                if (badPregnancy && badPregnancy.includes(item)) {
                    set(hisObj, item, true);
                } else {
                    set(hisObj, item, false);
                }
            });
        }

        hisArr.push(hisObj);
    }

    /*与之前的孕产史做合并*/
    const preHisArr = get(cloneData, 'pregnancyHistories');
    if (isEmpty(preHisArr)) {
        return hisArr;
    } else {
        forEach(hisArr, (value, key) => {
            hisArr[key] = assign({}, preHisArr[key], value);

            /*胎儿信息作额外的合并处理*/
            const children = get(hisArr, `${key}.children`);
            const preChildren = get(preHisArr, `${key}.children`);
            if (preChildren && preChildren.length > 0 && children) {
                const newChildren: any[] = [];
                forEach(children, (item, index) => {
                    newChildren[index] = assign({}, preChildren[index], item);
                });
                set(hisArr, `${key}.children`, newChildren);
            }
        });
        return hisArr;
    }
}

/**
 * 处理转诊数据
 */
export function filterReferrals(pregnancyData: any, formData: any, type = 2) {
    if (type === 1) return filterReferrals_Out(pregnancyData, formData)
    const referrals = get(pregnancyData, 'referrals');
    const referralOut = filter(referrals, (referral) => {
        return referral.referralType !== 2;
    });
    const referralIn = get(formData, 'referralIn');
    if (!!get(formData, 'referralInReferralDate')) {
        set(referralIn, 'referralType', 2);
        set(referralIn, 'reason', get(formData, 'referralInReason'));
        set(referralIn, 'referralDate', formatDate(get(formData, 'referralInReferralDate')));
        set(referralIn, 'referralOrganization', get(formData, 'referralInReferralOrganization'));
        set(referralIn, 'referralDept', get(formData, 'referralInReferralDept'));
        set(referralIn, 'referralDirection', get(formData, 'referralInReferralDirection'));
        set(referralIn, 'referralDoctor', get(formData, 'referralInReferralDoctor'));
        set(referralIn, 'referralContactNumber', get(formData, 'referralInReferralContactNumber'));
        set(referralIn, 'recorder', get(formData, 'referralInRecorder'));
        referralOut.push(referralIn);
    }
    return referralOut;
}
function filterReferrals_Out(pregnancyData: any, formData: any) {
    const referrals = get(pregnancyData, 'referrals');
    const referralIn = filter(referrals, (referral) => {
        return referral.referralType !== 1;
    });
    const referralOut = get(formData, 'referralOut');
    if (!!get(formData, 'referralOutReferralDate')) {
        set(referralOut, 'referralType', 1);
        set(referralOut, 'reason', get(formData, 'referralOutReason'));
        set(referralOut, 'organizationName', get(formData, 'referralOutReferralOrganization.name'));
        set(referralOut, 'organizationId', get(formData, 'referralOutReferralOrganization.id'));
        set(referralOut, 'referralDate', formatDate(get(formData, 'referralOutReferralDate')));
        // set(referralOut, 'referralOrganization', get(formData, 'referralOutReferralOrganization'));
        set(referralOut, 'referralDept', get(formData, 'referralOutReferralDept'));
        set(referralOut, 'referralDirection', get(formData, 'referralOutReferralDirection'));
        set(referralOut, 'referralDoctor', get(formData, 'referralOutReferralDoctor'));
        set(referralOut, 'referralContactNumber', get(formData, 'referralOutReferralContactNumber'));
        set(referralOut, 'recorder', get(formData, 'referralOutRecorder'));
        referralIn.push(referralOut);
    }

    return referralIn;
}
/**
 * 转换体征数据
 */
export function getPhysicalExamdata(measureData: any) {
    let physicalExamMeasure = get(measureData, '0.physicalExamMeasure') || measureData || {};
    if (isEmpty(physicalExamMeasure)) {
        return {};
    }
    physicalExamMeasure = {
        ...physicalExamMeasure,
        measureId: get(measureData, '0.id'),
        bloodPressure: {
            systolic: get(physicalExamMeasure, 'systolic'),
            diastolic: get(physicalExamMeasure, 'diastolic'),
        },
        bloodPressure2: {
            systolic: get(physicalExamMeasure, 'systolic2'),
            diastolic: get(physicalExamMeasure, 'diastolic2'),
        },
        bloodPressure3: {
            systolic: get(physicalExamMeasure, 'systolic3'),
            diastolic: get(physicalExamMeasure, 'diastolic3'),
        },
    };
    return physicalExamMeasure;
}




export const getTemplateById = async (id: any) => {
    return (await request.get(`/api/document-templates/${id}`)).data
};

export const createTemplate = async (data: any) => {
    return (await request.post('/api/document-templates', data)).data
};

export const updateTemplate = async (data: any) => {
    return (await request.put('/api/document-templates', data)).data
};
// export function getBMI(weight: number, height: number) {
//     if (!weight || !height) return '';
//     return ((weight / (height * height)) * 10000).toFixed(2);
// }

/**
 * 获取报告列表
 * type, 1 为产前检查, 2位产前诊断
 */
export const getLabExamGroup = async (id: number, type: number = 1) => {
    if (type === 1) {
        return (await request.get(`/api/getLabExamGroup?pregnancyId=${id}`)).data;
    } else if (type === 2) {
        return (await request.get(`/api/getLabExamGroupByPrenatal?prenatalPatientId=${id}`)).data
    }
    return [];
}

/** 标记报告已读 */
export const saveFirstReader = async (data: any) => (await request.post(`/api/saveFirstReader`, data)).data

/** 获取外院报告pdf */
export const getOutReportFileBase64 = async (path: string) => (await request.get(`/api/getOutReportFileBase64?path=${path}`)).data


export function fubaoHistoryPush(url: string, props?: { history?: History }) {
    // historyPush(resolveFubaoPath(url), props)
    SLocal_History.historyPush(resolveFubaoPath(url))
}
export function resolveFubaoPath(url: string,) {
    return transmit_happy_pre(url, '/fubao')
}














