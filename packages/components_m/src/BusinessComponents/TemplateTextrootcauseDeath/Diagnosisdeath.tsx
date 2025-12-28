// 出生缺陷诊断管理
import {
  Button, Input, List, Modal, Spin
} from 'antd';
import React from 'react';
// import { Input, Space } from 'antd';
// import { AudioOutlined } from '@ant-design/icons';
import { CustomIcon } from '../../GeneralComponents/CustomIcon';
import styles from './Modal.less';
const { Search } = Input;
export default class Diagnosisdeath extends React.Component {
  state = {
    data: [],
    dataList:this.props?.classificationData,
    isLoading: false,
  };
  //   refs = React.createRef();
  //   str = [];
  // {
  //   "id" : 768?
  //   "type" : 1,
  //   "systemType" : null,
  //   "pid" : 0,
  //   "val" : "1型糖尿病性胃轻瘫",
  //   "code" : "E10.406+G99.0*",
  //   "mnemonic" : "1xtnbxwqt",
  //   "sort" : null,
  //   "depid" : null,
  //   "userid" : null,
  //   "diagnosisCode" : null,
  //   "categoryCode" : null,
  //   "categoryName" : null,
  //   "icdCode" : null,
  //   "active" : null
  // }


  onSearch=(value)=>{
    console.log('value',value);
    
    const { dataList } = this.state;
    const searchValue: string = value;
   let newdataList= dataList.filter((item=>{
      return item.val?.search(searchValue)!=-1
    }))
    // console.log('newdataList',newdataList);
    
    this.setState({
      dataList:newdataList
     })
     if(searchValue==''){
      this.setState({
        dataList:this.props.classificationData
       })
     }
  }
  onCancel=()=>{
    this.props.onCancel(this.props.index,this.state.data)
 }
 whole=()=>{
  this.setState({
    dataList:this.props.classificationData
   })
 }
  render() {
    let {isLoading} = this.state
    return (
      <Modal
        title={
          <div>
            <CustomIcon type={'icon-doctor'} style={{ color: '#150F55', fontSize: '24px', marginRight: '10px' }} />
            <span style={{ color: '#150F55', fontSize: '16px', fontWeight: 500 }}>根本死因诊断</span>
          </div>
        }
        visible={this.props.visible}
        width="580px"
        footer={null}
        onCancel={() => this.props.onCancel()}
      >
        <div>
          <Search
            placeholder="请输入诊断信息"
            allowClear
           
            size="large"
            defaultValue={''}
            onSearch={this.onSearch}
            style={{ width: '90%' }}
          />
        </div>
        <div style={{ width: '100%', height: '460px' }}>
          <Button className={styles["list-btn"]} icon={<CustomIcon type="icon-all" />} style={{ marginTop: '6px' }} onClick={this.whole}>
            全部
          </Button>
          {isLoading?
        <Spin tip="数据加载中...">
        <div style={{ height: 128 }} />
      </Spin>:
          <List
            style={{ overflow: 'scroll', height: '430px' }}
            size="small"
            split={false}
            bordered={false}
            dataSource={this.state.dataList}
            renderItem={(item) => (
              <List.Item onClick={(value) => this.props.listClick(value, this.props.index)} style={{fontWeight:'700'}}>
                (ICD){item.val}
              </List.Item>
            )}
          />}
        </div>
      </Modal>
    );
  }
}
