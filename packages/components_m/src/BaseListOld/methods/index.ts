import { isFunction } from 'lodash';
import { request } from '@lm_fe/utils';

export const getDataSource = async (url: string, params: object, processFromApi?: any, req?: typeof request) => {
  const _request = req ?? request
  const response = await _request.get(url, {
    // getResponse: true,
    params,
  });
  const { data, headers } = response;
  const count = headers['x-total-count'];
  const _data = data.data ?? data
  return {
    count,
    data: isFunction(processFromApi) ? processFromApi(_data) : _data,
  };
};
