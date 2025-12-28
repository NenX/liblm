
// import { PlusOutlined } from '@ant-design/icons';
// import { SMchc_FormDescriptions } from '@lm_fe/service';
// import { Tabs } from 'antd';
// import { cloneDeep, find, findIndex, get, map, set, size } from 'lodash';
// import { useEffect, useRef, useState } from 'react';
// import {
//     formDescriptionsWithoutSectionApi
// } from '../../utils/adapter';
// import RowoftireRecordBabyPanel from './frompanel';
// // import './index.less';
// const TITLE = '新生儿';

// interface Iprops {
//   value: any;
//   onChange: Function;
//   [key: string]: any;
// }
// export default function RowoftireRecordBaby(props: Iprops) {
//   const formInstance = useRef();
//   const [activeKey, setActiveKey] = useState('1');
//   const [activeArr, setActiveArr] = useState<Array<any>>(['1']);
//   const [formDescriptData, setFormDescriptData] = useState<any>({
//     formDescriptions: null,
//     formDescriptionsWithoutSection: null,
//   });
//   const [tabs, setTabs] = useState([
//     {
//       title: `${TITLE}1`,
//       key: '1',
//       value: { key: '1' },
//     },
//   ]);

//   /**初始化请求表单信息 */
//   useEffect(() => {
//     initFormDescriptions();
//   }, []);
//   async function initFormDescriptions() {
//     const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache('rowoftire-record-baby');
//     const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
//     setFormDescriptData({ formDescriptions, formDescriptionsWithoutSection });
//   }

//   useEffect(() => {
//     initValues();
//   }, [props.value]);

//   async function initValues() {
//     if (size(props.value) > 0) {
//       const newtabs = map(props.value, (item, index) => {
//         const ind = index + 1;
//         const key = get(item, 'key') || ind + '';
//         const value = { key: key, ...item };
//         return {
//           title: `${TITLE}${ind}`,
//           key: get(item, 'key') || ind + '',
//           value: value,
//         };
//       });
//       // console.log({ tabValue: newtabs });
//       setTabs(newtabs);
//     }
//   }

//   function setRef(index: number) {
//     return (ref: any) => {
//       set(formInstance, `current.tab${index}`, ref);
//     };
//   }

//   function handleItemChange(changedValues, allValues) {
//     const newValue = cloneDeep(props.value) || [];

//     const ind = findIndex(tabs, (item) => item.key == activeKey);
//     const tabsValue = tabs[ind].value;
//     newValue.splice(ind, 1, { ...allValues, key: activeKey, id: get(tabsValue, 'id') });
//     // console.log({ newValue, tabs, allValues });
//     props.onChange(newValue);
//   }

//   //#region tabs事件
//   function onEdit(targetKey: any, action: any) {
//     const handle = {
//       add: add,
//       remove: remove,
//     };
//     handle[action](targetKey);
//   }

//   function add() {
//     const newPanes = [...tabs];
//     const newActiveKey: any = Number(get(newPanes, `${newPanes.length - 1}.key`)) + 1 + '';

//     const newValue = cloneDeep(props.value) || [{}];
//     newValue.push({ key: newActiveKey });
//     setActiveKey(newActiveKey);
//     props.onChange(newValue);
//   }

//   function remove(targetKey: any) {
//     // 改变active
//     const currentKey: any = get(
//       find(tabs, (item) => item.key == targetKey),
//       'key',
//     );
//     if (currentKey == activeKey) {
//       setActiveKey((pre: any) => {
//         return Number(pre) - 1 + '';
//       });
//     }
//     // 改变value
//     const ind = findIndex(tabs, (item) => item.key == targetKey);
//     const newValue = cloneDeep(props.value);
//     const del = newValue.splice(ind, 1);
//     props.onChange(newValue);
//   }

//   function onChange(active: any) {
//     setActiveKey(active);
//   }

//   //#endregion

//   return (
//     <div className="breast-same-room-container">
//       {formDescriptData.formDescriptions == null ? null : (
//         <Tabs
//           type="editable-card"
//           onChange={onChange}
//           addIcon={
//             <div>
//               <PlusOutlined />
//               增加{TITLE}
//             </div>
//           }
//           activeKey={activeKey}
//           onEdit={onEdit}
//         >
//           {map(tabs, (tab, index) => {
//             return (
//               <Tabs.TabPane tab={tab.title} key={tab.key} closable={index === 0 ? false : true}>
//                 <RowoftireRecordBabyPanel
//                   ref={setRef(index)}
//                   formDescriptData={formDescriptData}
//                   handleItemChange={handleItemChange}
//                   fromValues={tab.value}
//                 />
//               </Tabs.TabPane>
//             );
//           })}
//         </Tabs>
//       )}
//     </div>
//   );
// }
