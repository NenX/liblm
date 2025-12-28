import {Modal,Descriptions} from 'antd';
import { get } from 'lodash';
interface Iprops{
  visible:boolean;
  onCancle:Function;
}
export default function BuildInfoModal(props:Iprops){
  const {visible,onCancle} = props;

  return <Modal
    visible={visible}
    width={700}
    style={{height:'600px'}}
    footer={null}
    onCancel={()=>{onCancle()}}
  >
<div style={{width:'100%',height:'100%',background:'#fff'}}>
    <Descriptions title="前端版本信息" bordered column={1}>
  <Descriptions.Item label="分支名称">{get(process.env,`BUILDINFO.branch`)}</Descriptions.Item>
  <Descriptions.Item label="打包时间">{get(process.env,`BUILDINFO.buildDate`)}</Descriptions.Item>
  {/* <Descriptions.Item label="打包邮箱">{get(process.env,`BUILDINFO.buildUserMail`)}</Descriptions.Item> */}
  <Descriptions.Item label="打包人">{get(process.env,`BUILDINFO.buildUserName`)}</Descriptions.Item>
  <Descriptions.Item label="最后提交信息">{get(process.env,`BUILDINFO.commit`)}</Descriptions.Item>
  <Descriptions.Item label="提交时间">{get(process.env,`BUILDINFO.commitDate`)}</Descriptions.Item>
  {/* <Descriptions.Item label="提交邮箱">{get(process.env,`BUILDINFO.commitUserMail`)}</Descriptions.Item> */}
  <Descriptions.Item label="提交人">{get(process.env,`BUILDINFO.commitUserName`)}</Descriptions.Item>
  <Descriptions.Item label="版本号">{get(process.env,`PACKAGE_VERSION`)}</Descriptions.Item>
  </Descriptions>
  </div>
  </Modal>
}