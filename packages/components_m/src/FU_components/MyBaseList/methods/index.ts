import { isFunction } from 'lodash';
import { request } from '@lm_fe/utils';

export const getDataSource = async (url: string, params: object, processFromApi: any) => {
  const data = await request.get(url, {
    params,
  });
  const _data = data.data ?? data

  return isFunction(processFromApi) ? processFromApi(_data) : _data;
};
