import { get } from 'lodash';
import { request, safe_json_parse } from '@lm_fe/utils';
const tabToModuleName = {
  'tab-0': 'prenatal-examination-present',
  'tab-1': 'prenatal-examination-past',
  'tab-2': 'prenatal-examination-other',
  'tab-3': 'prenatal-examination-pregnancy-history',
  'tab-4': 'prenatal-examination-physical',
  'tab-5': 'prenatal-examination-special',
  'tab-6': 'prenatal-examination-survey',
  'tab-7': 'prenatal-examination-diagnoses',
};
export default {
  /** 获取表单配置 */
  getFormConfig: async () => {
    const formPresent =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-present`)).data,
        0,
      ) || {};
    const formPast =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-past`)).data,
        0,
      ) || {};
    const formOther =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-other`)).data,
        0,
      ) || {};
    const formPregnancyHistory =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-pregnancy-history`)).data,
        0,
      ) || {};
    const formPhysical =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-physical`)).data,
        0,
      ) || {};
    const formSpecial =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-special`)).data,
        0,
      ) || {};
    const formSurvey =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-survey`)).data,
        0,
      ) || {};
    const formDiagnoses =
      get(
        (await request.get(`/api/form-descriptions?moduleName=prenatal-examination-diagnoses`)).data,
        0,
      ) || {};

    return {
      formPresent,
      formPast,
      formOther,
      formPregnancyHistory,
      formPhysical,
      formSpecial,
      formSurvey,
      formDiagnoses,
    };
  },

  getFormConfigByTab: async (tab: string,) => {

    const res = (await request.get(`/api/form-descriptions?moduleName=` + tabToModuleName[tab])).data;
    return get(res, `[0]`);
  },

  /** 获取检验结果数据 */
  getPregnancyAnalysisResult: async (pregnancyId: any) =>
    (await request.get(`/api/getPregnancyAnalysisResult?id=${pregnancyId}`)).data,

  /** 根据末次月经计算预产期—B超 */
  calcEddByLmp: (lmp: any) => request.get(`/api/pregnancyCalc-calcEddByLmp?lmp=${lmp}`).then(r => r.data),

  /** 根据超声数据计算预产期—B超 */
  calcSureEdd: (edd: any, menopause: any, gestationalWeek: any) =>
    request.get(`/api/pregnancyCalc-calcSureEdd?edd=${edd}&menopause=${menopause}&gestationalWeek=${gestationalWeek}`).then(r => r.data),

  /** 根据预产期B超，更新当天产检孕周” */
  updateGesweekAlert: (pregnancyId: any, sureEdd: any) =>
    request.get(`/api/updateGesweekAlert?pregnancyId=${pregnancyId}&sureEdd=${sureEdd}`).then(r => r.data),
  updateGesweekBysureEdd: (data: any) => request.post(`/api/updateGesweekBysureEdd`, data).then(r => r.data),

  /** 高危因素自动判定 */
  autoCaseRecognition: (pregnancyId: any) =>
    request.get(`/api/autoCaseRecognition?pregnancyId=${pregnancyId}`).then(r => r.data),

  /** 历史首检记录 */
  findFirstVisitOperatingRecord: (pregnancyId: any) =>
    request.get(`/api/findFirstVisitOperatingRecord?pregnancyId=${pregnancyId}`).then(r => r.data),
};
