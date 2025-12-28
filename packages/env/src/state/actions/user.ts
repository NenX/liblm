// import store from 'store';
// import { get, reduce, concat, keyBy, pick, values, uniqBy, isEqual, sortBy, cloneDeep } from 'lodash';
// import { initDictionary } from '@/actions/dictionaries';
// import { initFormDescriptions, getSystemConfig } from '@/actions/system';
// import { omitRoutes } from '@/routes';
// import { Modal } from 'antd';

// // 用户登录
// export const login =
//   ({ username, password }: any) =>
//     async (dispatch) => {
//       const res = await request.post('/api/authenticate', { username, password });
//       const token = get(res, 'id_token');
//       store.set(APP_CONFIG.TOKEN, token);
//       store.set(APP_CONFIG.AUTH_NAME, username);
//       store.set(APP_CONFIG.LOGIN_TIME, new Date().getTime());
//       // 初始化用户信息
//       await initUser(username)(dispatch);
//       // 获取字典
//       await initDictionary()(dispatch);
//       return {
//         token,
//         username,
//       };
//     };

// // 单点登录
// export const loginByOauth = (data: {}) => async (dispatch) => {
//   const result = await request.post('/api/desklogin', data);
//   const { emp_id = 'admin', id_token: idToken, pat_id: patId } = result;
//   store.set(APP_CONFIG.TOKEN, idToken);
//   store.set(APP_CONFIG.AUTH_NAME, emp_id);
//   store.set(APP_CONFIG.LOGIN_TIME, new Date().getTime());
//   await initUser(emp_id)(dispatch);
//   await initDictionary()(dispatch);
//   const systemConfig = await getSystemConfig()(dispatch);
//   if (systemConfig.systemMode === 'production') {
//     await initFormDescriptions()(dispatch);
//   }
//   return {
//     ...result,
//     patId,
//   };
// };

// export const initUser = (username: any) => async (dispatch) => {
//   const basicInfo = await request.get(`/api/users/${username}`, {
//     headers: {
//       isLoading: false,
//     },
//   });

//   let menuArray = reduce(get(basicInfo, 'groups'), (sum, group) => concat(sum, get(group, 'permissions') as []), []);
//   // 去重
//   menuArray = uniqBy([...menuArray, ...omitRoutes], 'key');
//   // 排序
//   menuArray = sortBy(menuArray, (menu) => get(menu, 'sort'));
//   const allMenuTree = arrayToTree(
//     menuArray.filter((_) => _.key),
//     'id',
//     'parentid',
//     'children',
//   );
//   const menuTree = arrayToTree(
//     menuArray.filter((_) => _.type === 'menu' && _.key),
//     'id',
//     'parentid',
//     'children',
//   );

//   const permissionsMapping = keyBy(menuArray, 'key');
//   const selfPermissions = values(permissionsMapping);

//   // 用户角色
//   const groups = basicInfo.groups.map((e) => e.name);
//   // if (groups && groups.includes('SpecialReminder')) {
//   //   setTimeout(() => {
//   //     Modal.warning({
//   //       title: '请注意！',
//   //       content: '发现阳性预警未有通知，请及时处理！',
//   //     });
//   //   }, 1000 * 5);
//   // }

//   const user = {
//     allMenuTree,
//     menuTree,
//     permissions: selfPermissions,
//     permissionsMapping,
//     userData: basicInfo,
//     basicInfo: {
//       groups,
//       ...pick(basicInfo, [
//         'activated',
//         'authorities',
//         'createdBy',
//         'createdDate',
//         'email',
//         'config',
//         'firstName',
//         'id',
//         'imageUrl',
//         'lastModifiedBy',
//         'lastModifiedDate',
//         'login',
//       ]),
//     },
//   };
//   await dispatch({
//     type: ACTION_TYPE.INIT_USER,
//     payload: {
//       data: user,
//     },
//   });
//   // then()调用
//   return user;
// };

// export const initUserByToken = (token: string) => async (dispatch) => {
//   await store.set(APP_CONFIG.TOKEN, token);
//   const basicInfo = await request.get(`/api/getUserInfo`);

//   let menuArray = reduce(get(basicInfo, 'groups'), (sum, group) => concat(sum, get(group, 'permissions') as []), []);
//   // menuArray = uniqWith([...menuArray, ...omitRoutes], isEqual);
//   // 去重
//   menuArray = uniqBy([...menuArray, ...omitRoutes], 'key');
//   // 排序
//   menuArray = sortBy(menuArray, (menu) => get(menu, 'sort'));
//   const allMenuTree = arrayToTree(
//     menuArray.filter((_) => _.key),
//     'id',
//     'parentid',
//     'children',
//   );
//   const menuTree = arrayToTree(
//     menuArray.filter((_) => _.type === 'menu' && _.key && _.active !== false),
//     'id',
//     'parentid',
//     'children',
//   );

//   const permissionsMapping = keyBy(menuArray, 'key');
//   const selfPermissions = values(permissionsMapping);

//   const user = {
//     allMenuTree,
//     menuTree,
//     permissions: selfPermissions,
//     permissionsMapping,
//     userData: basicInfo,
//     basicInfo: {
//       ...pick(basicInfo, [
//         'activated',
//         'authorities',
//         'createdBy',
//         'createdDate',
//         'email',
//         'config',
//         'firstName',
//         'id',
//         'imageUrl',
//         'lastModifiedBy',
//         'lastModifiedDate',
//         'login',
//       ]),
//     },
//   };
//   await dispatch({
//     type: ACTION_TYPE.INIT_USER,
//     payload: {
//       data: user,
//     },
//   });

//   return user;
// };

// export const updateUserInfo = (data: any) => async (dispatch) => {
//   const result = await request.put('/api/users', data);
//   const basicInfo = {
//     ...pick(result, [
//       'activated',
//       'authorities',
//       'createdBy',
//       'createdDate',
//       'email',
//       'config',
//       'firstName',
//       'id',
//       'imageUrl',
//       'lastModifiedBy',
//       'lastModifiedDate',
//       'login',
//     ]),
//   };
//   dispatch({
//     type: ACTION_TYPE.INIT_USER,
//     payload: {
//       data: {
//         basicInfo,
//         userData: result,
//       },
//     },
//   });
// };

// export const singleSignGetToken = async (user: string, token: string) => {
//   const res = await request.get(`/api/singleSignOn?user=${user}&token=${token}`);
//   return res;
// };

// function arrayToTree(array: any[], id = 'id', parentId = 'pid', children = 'children') {
//   const result: any[] = [];
//   const hash: any = {};
//   const data = cloneDeep(array);

//   data.forEach((item, index) => {
//     hash[data[index][id]] = data[index];
//   });

//   data.forEach((item) => {
//     const hashParent = hash[item[parentId]];
//     if (hashParent) {
//       !hashParent[children] && (hashParent[children] = []);
//       hashParent[children].push(item);
//     } else {
//       result.push(item);
//     }
//   });
//   return result;
// }
