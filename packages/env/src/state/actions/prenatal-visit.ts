import { filter, findIndex, get } from 'lodash';
import { Dispatch } from 'redux';
import { ACTION_TYPE } from '../actionType';
import { request } from '@lm_fe/utils';

/**初始化高位标记ws实例 */
export const initRiskWs = (ws: any) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.INIT_HIGH_RISK_WS, data: ws });
};

/** 获取孕册数据*/
export const getPregnancyData = (pregnancyId: string) => async (dispatch: Dispatch) => {
  const data = (await request.get(`/api/pregnancies/${pregnancyId}`)).data;
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_PREGNANCY,
    payload: {
      data,
    },
  });
  // console.log('data',data);

  return data;
};

/**保存头部信息 */
export const saveHeaderInfo = (data: any) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_HEADERINFO, data });
};

/** 诊断搜索词*/
export const setDiagnosesWord = (data: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_DIAGNOSESWORD,
    payload: {
      data,
    },
  });
};

export const changeDiagnosesTemplate = (data: boolean) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_DIAGNOSESTEMPLATE,
    payload: {
      data,
    },
  });
};

/** 获取诊断数据*/
export const getDiagnosesList = (pregnancyId: string) => async (dispatch: Dispatch) => {
  const data = (await request.get(`/api/diagnoses?pregnancyId.equals=${pregnancyId}`)).data;
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_DIAGNOSES,
    payload: {
      data,
    },
  });
};

/** 获取高危诊断*/
export const getHighriskDiagnosis = (pregnancyId: string) => async (dispatch: Dispatch) => {
  const data = await request.get(`/api/getHighriskDiagnosis?pregnancyId=${pregnancyId}`);
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_HIGHRISKDIAGNOSES,
    payload: {
      data: get(data, 'content'),
    },
  });
};

/** 修改诊断数据*/
export const setDiagnosesList = (data: any) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_DIAGNOSES,
    payload: {
      data,
    },
  });
};

/** 获取高危因素标记数据*/
export const getHighriskSign = (pregnancyId: string) => async (dispatch: Dispatch) => {
  const res = await request.get(`/api/autoCaseRecognition?pregnancyId=${pregnancyId}`);
  const data = filter(res, (item) => item.type === 'ALERT_HIGHRISK');
  // if (isArray(data) && data.length > 0) {
  //   forEach(data, (item) => (item.visible = true));
  // }
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_HIGHRISKSIGN,
    payload: {
      data,
    },
  });
};

/** 修改高危因素标记数据*/
export const setHighriskSign = (data: any) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_HIGHRISKSIGN,
    payload: {
      data,
    },
  });
};
// 疤痕子宫
export const changeTolac = (isShowTolac: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_TOLAC,
    payload: {
      data: isShowTolac,
    },
  });
  // dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CANCLEFORM, data: 'cicatrix' });
};
// 静脉血栓
export const changeScreening = (isShowScreening: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_SCREENING,
    payload: {
      data: isShowScreening,
    },
  });
  // dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CANCLEFORM, data: 'thrombus' });
};

// 子痫
export const changePreeclampsia = (isShowPreeclampsia: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_PREECLAMPSIA,
    payload: {
      data: isShowPreeclampsia,
    },
  });
  // dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CANCLEFORM, data: 'eclampsia' });
};

export const changePreventPreeclampsia = (isShowPreventPreeclampsia: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_PREVENTPREECLAMPSIA,
    payload: {
      data: isShowPreventPreeclampsia,
    },
  });
};
// 产染病
export const changeSyphilis = (isShowSyphilis: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.PRENATAL_VISIT_MAIN_SYPHILIS,
    payload: {
      data: isShowSyphilis,
    },
  });
  // dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CANCLEFORM, data: 'infection-syphilis' });
};

/**存储websocktet实例 */
export const initWebsocketInstance = (instance: any) => (dispatch: Dispatch, getState: any) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_INSTANCE, data: instance });
};

export const changeWebsocket = (data: any) => (dispatch: Dispatch, getState: any) => {
  const prenatalVisit = get(getState(), `prenatalVisit`);
  const key = get(data, `type`) == 'CaseForm' ? 'CaseForm' : 'multiterm';
  const Arr = get(prenatalVisit, `websocketSum.${key}`);
  const ind = findIndex(Arr, (item: any) => item.id == get(data, `id`));
  // console.log({ ind, Arr, key, prenatalVisit });
  if (ind != -1) return;
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET, data });
};
export const changewWebsocketSum = () => (dispatch: Dispatch, getState: any) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_SUM_CHANGE });
};

export const delWebsocketMultierm = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_DEL });
};

export const changeWebsocketLevel = (data: any) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_LEVEL, data });
};
export const changeWebsocketLevelNew = (data: any) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_LEVEL_NEW, data });
};

export const changeWebsocketCaseFormCalcle = (type: string) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CANCLEFORM, data: type });
};

export const changeVisibleIsWebsocket = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CHANGE_VISIBLE });
};

export const websocketClose = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CLOSE });
};

export const clearWebsocket = () => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_CLEAR });
};

export const changeWsShow = (bool: boolean) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_SHOW, data: bool });
};

/**更新头部信息 */
export const updateHeaderInfo = (id: string) => async (dispatch: Dispatch) => {
  const res = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + id);
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_HEADERINFO, data: res });
};

export const changeWebsocketDataMultiterm = (data: any) => (dispatch: Dispatch) => {
  dispatch({ type: ACTION_TYPE.PRENATAL_VISIT_WEBSOCKET_MULTITERM, data });
};
