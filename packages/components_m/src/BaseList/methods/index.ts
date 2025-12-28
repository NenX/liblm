import { isFunction, get } from 'lodash';
import { request } from '@lm_fe/utils';

export const getDataSource = async (url: string, params: object, processFromApi?: any) => {
  const response = await request.get(url, {
    getResponse: true,
    params,
  });
  const { data, headers } = response;
  const count = headers['x-total-count'];
  let newData = data;
  if ('code' in data) {
    newData = get(data, 'data');
  }
  return {
    count,
    data: isFunction(processFromApi) ? processFromApi(newData) : newData,
  };
};
