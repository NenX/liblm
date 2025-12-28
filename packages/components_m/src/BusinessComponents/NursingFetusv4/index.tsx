// import { Tabs } from 'antd';
// import { get, map } from 'lodash';
// import { Component } from 'react';
// import BaseFormComponent from '../../BaseFormComponent';
// import FetusForm from './components';
// import { PlusOutlined } from '@ant-design/icons';

// const TITLE = '胎儿';

// export default class NursingFetus extends Component {
//   state = {
//     tabs: [
//       {
//         title: `${TITLE}1`,
//         key: 'tab1',
//         value: {},
//       },
//     ],
//     activeKey: 'tab1',
//   };

//   formRefs: any = {};

//   componentDidMount() {
//     this.props.onRef(this);

//     const { id, activeItem } = this.props as any;


//     if (this.props.value && this.props.value.length > 0) {
//       this.setState({
//         tabs: map(this.props.value, (item, index) => ({
//           title: `${TITLE}${index + 1}`,
//           key: `tab${index + 1}`,
//           value: item,
//         })),
//       });
//     }
//   }

//   onChange = (activeKey: any) => {
//     this.setState({
//       activeKey,
//     });
//   };

//   onEdit = (targetKey: any, action: any) => {
//     this[action](targetKey);
//   };

//   handleClick = () => {
//     const { tabs, activeKey } = this.state;
//     const activeKeyNew = Math.random().toString();
//     const newPanes: any = [...tabs];
//     const key = tabs[tabs.length - 1].key;

//     //自动打开下一个tab，若没有则新增一个
//     if (key === activeKey) {

//       // newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKeyNew });
//       // this.setState({
//       //   tabs: newPanes,
//       //   activeKey: activeKeyNew,
//       // });
//     } else {

//       this.setState({
//         activeKey: key,
//       });
//     }

//     //回到tab顶部
//     const dom = document.getElementById('scroll-top');
//     dom && dom.scrollIntoView({ behavior: 'smooth' });
//   };

//   add = () => {
//     const { tabs } = this.state;
//     const activeKey = Math.random().toString();
//     const newPanes: any = [...tabs];
//     newPanes.push({ title: `${TITLE}${tabs.length + 1}`, key: activeKey });
//     this.setState({
//       tabs: newPanes,
//       activeKey,
//     });
//   };

//   remove = (targetKey: any) => {
//     if (!confirm('确定删除吗？')) return

//     const { tabs, activeKey } = this.state;
//     let newActiveKey = activeKey;
//     let lastIndex: any;
//     tabs.forEach((pane, i) => {
//       if (pane.key === targetKey) {
//         lastIndex = i - 1;
//       }
//     });
//     const newPanes = tabs.filter((pane) => pane.key !== targetKey);
//     if (newPanes.length && newActiveKey === targetKey) {
//       if (lastIndex >= 0) {
//         newActiveKey = newPanes[lastIndex].key;
//       } else {
//         newActiveKey = newPanes[0].key;
//       }
//     }
//     this.setState({
//       tabs: newPanes,
//       activeKey: newActiveKey,
//     });
//   };

//   handleDelete = (tab: any) => () => {
//     const targetKey = get(tab, 'key');
//     this.remove(targetKey);
//   };

//   renderFieldItem = ({ inputType, labelSpan = 12, wrapperSpan = 12, inputProps = {} }) => {
//     return <BaseFormComponent inputType={inputType} {...inputProps} />;
//   };

//   render() {
//     const { tabs, activeKey } = this.state;
//     const { value } = this.props as any;
//     console.log('tab', tabs);

//     return (
//       <>

//         <div className="base-edit-panel-form_section border" style={{ margin: '16px -16px' }}>
//           <span className="base-edit-panel-form_section_title">新生儿出生情况</span>
//           <div style={{ position: 'relative' }}>
//             <div id="scroll-top"></div>
//             <Tabs
//               onChange={this.onChange}
//               activeKey={activeKey}
//               onEdit={this.onEdit}
//               addIcon={
//                 <div>
//                   <PlusOutlined />
//                   增加{TITLE}
//                 </div>
//               }
//               type="editable-card"

//             >
//               {map(tabs, (tab, index) => (
//                 <Tabs.TabPane tab={tab.title} key={tab.key} forceRender >
//                   <FetusForm
//                     ref={(ref) => {
//                       this.formRefs[index] = ref;
//                     }}
//                     data={(value && (value.length > 0 ? value[index] : tab.value)) || tab.value}
//                   //onValuesChange={this.handleChange}
//                   />
//                 </Tabs.TabPane>
//               ))}
//             </Tabs>
//             {/* {tabs.length>=2 &&
//             <Button
//               size="large"
//               style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)' }}
//               onClick={this.handleClick}
//             >
//               + 查看其他胎儿信息
//             </Button>} */}
//           </div>
//         </div>
//       </>
//     );
//   }
// }
