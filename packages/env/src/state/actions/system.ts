import { Dispatch } from 'redux';
import { get, set, map, keys, keyBy, isNil } from 'lodash';
import { request, safe_json_parse } from '@lm_fe/utils';
import { ACTION_TYPE } from '../actionType';
import { ISystemConfig } from '../types';

export const initFormDescriptions = () => async (dispatch: Dispatch) => {
  const formDescriptions = (await request.get('api/form-descriptions')).data;
  const formDescriptionsKeys = keys(keyBy(formDescriptions, 'moduleName'));
  const data: any = {};
  map(formDescriptionsKeys, (formDescriptionsKey) => {
    set(data, formDescriptionsKey, []);
  });
  map(formDescriptions, (formDescription) => {
    const { moduleName } = formDescription;
    if (!isNil(data[moduleName])) {
      data[moduleName].push(formDescription);
    }
  });
  sessionStorage.setItem('formDescriptionsJson', JSON.stringify(data));
  // TODO 涉及引用过多，暂不改动
  // dispatch({
  //   type: ACTION_TYPE.FORMDESCRIPTIONS_INIT,
  //   payload: {
  //     formDescriptions,
  //   },
  // });
};



export const _getSystemConfig = () => async (dispatch: Dispatch) => {
  const res = (await request.get('/api/dictionaries?type.equals=99')).data;
  const data = {
    id: get(res, '0.id'),
    ...safe_json_parse(get(res, '0.note')),
  };
  dispatch({
    type: ACTION_TYPE.UPDATE_SYSTEM_CONFIG,
    payload: {
      data,
    },
  });
  return data as ISystemConfig;
};

export const _updateSystemConfig = (data: any) => async (dispatch: Dispatch) => {
  const res = (await request.put('/api/dictionaries', data)).data;
  const dataSource = {
    id: get(res, 'id'),
    ...safe_json_parse(get(res, 'note')),
  };
  dispatch({
    type: ACTION_TYPE.UPDATE_SYSTEM_CONFIG,
    payload: {
      data: dataSource,
    },
  });
};

export const updateCollapsed = (collapsed: boolean) => (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.UPDATE_COLLAPSED,
    payload: {
      collapsed,
    },
  });
};

export const updateSocketState = (state: number) => async (dispatch: Dispatch) => {
  dispatch({
    type: ACTION_TYPE.UPDATE_SOCKET_STATE,
    payload: {
      socketState: state,
    },
  });
  return state;
};

export const updateTheme = (theme: string, showTip: boolean) => async (dispatch: Dispatch) => {
  // setThemeColor(theme, showTip);
  dispatch({
    type: ACTION_TYPE.UPDATE_SYSTEM_THEME,
    payload: {
      theme,
    },
  });
};
