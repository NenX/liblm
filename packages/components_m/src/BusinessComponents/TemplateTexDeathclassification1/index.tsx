import { request } from '@lm_fe/utils';
import { Input, message } from 'antd';
import { get } from 'lodash';
import { Component } from 'react';
import Deathclassification from './deathclassification';
import styles from './index.less';
// import Modal from '@/pages/deliver-management-v2/admission/deliver-edit/components/CaseTemplete/Modal';
interface IProps {
  onChange: Function;
  value: any;
  input_props: any;
  depid?: any;
  user?: any;
  disabled?: boolean;
}
interface IState {
  modalVisible: boolean;
  value: any;
  inputValue:any;
  modalcontent:any;
  str:any;
  classificationData:any;
}
export default class TextareaWithTemplate extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      value: props.value,
      inputValue: [],
      modalcontent: [],
      str: [],
      classificationData: [],
    };
  }

  handleTextareaChange = (e: any): void => {
    const { onChange } = this.props;
    this.setState({
      value: e.target.value,
    });
    onChange && onChange(e.target.value);
  };
  openModal = async (value, data) => {
        let detail = await request.get('/api/ic/getMaternalDeathClassifications');
        this.setState({
          classificationData: detail.data,
        });
    this.setState({ modalVisible: true });
  };

  closeModal = (value) => {
    const { onChange } = this.props;
    this.setState({ modalVisible: false });
    // if (data !== [] && data !== undefined) { 
    //     this.setState({
    //       value:this.state.str.join('/')
    //     })
    //     onChange && onChange(this.state.str.join('/'));
    // }

  };
  onOk=(data)=>{
    const { onChange } = this.props;
    this.setState({ modalVisible: false });
    if (data !== [] && data !== undefined) { 
        this.setState({
          value:this.state.str.join('/')
        })
        onChange && onChange(this.state.str.join('/'));
    }
  }
 
  listClick = (e) => {
    
    if(!this.state.str.includes(e.target.innerText)){
      this.setState({
        str: [...this.state.str, e.target.innerText],
      });
    }else{
      message.error("不可重复添加")
    }
     
    
  };

  onDeselect = (val) => {
    let data = this.state.str.filter((item) => {
      return item !== val;
    });
    this.setState({
      str: data,
    });
  };
  ificationReset=()=>{
    this.setState({
      str: [],
    });
  }
  render() {
    const { modalVisible, value,inputValue } = this.state;

    
    const { disabled, patientId, admissionId, pregnancyId } = this.props;
   
    
    const inputProps = get(this.props, 'config.inputProps') || {};
    return (
      <div className={styles["textarea-with-template"]}>
        <Input
          disabled={disabled}
          title={value}
          value={value}
          autoSize={{ minRows: 2, maxRows: 5 }}
          onChange={this.handleTextareaChange}
          className={styles["template-text"]}
          {...inputProps}
          onClick={(value) => {
            this.openModal(value);
          }}
        />
        {modalVisible && (
        // ></Deathclassification>
          <Deathclassification
            visible={modalVisible}
            str={this.state.str}
            onCancel={this.closeModal}
            listClick={this.listClick}
            onDeselect={this.onDeselect}
            // onSearch={this.onSearch}
            onOk={this.onOk}
            ificationReset={this.ificationReset}
            patientId={patientId}
            classificationData={this.state.classificationData}
            admissionId={admissionId}
            pregnancyId={pregnancyId}
            index="Maternal"
            // deleteinputValue={this.deleteinputValue}
          />
        )}
      </div>
    );
  }
}
