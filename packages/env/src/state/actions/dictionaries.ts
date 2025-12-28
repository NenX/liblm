import { request } from '@lm_fe/utils';
import { Dispatch } from 'redux';
import { ACTION_TYPE } from '../actionType';

export const initDictionary = () => async (dispatch: Dispatch) => {
  const data = await request.get('/api/dictionaries', {
    params: { size: 9999, page: 0 }
  })

  dispatch({
    type: ACTION_TYPE.INIT_DICTIONARY,
    payload: {
      data: data.data,
    },
  });
};
