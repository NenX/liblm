import { EditOutlined, PrinterOutlined } from '@/components/GeneralComponents/CustomIcon';
import MyForm from '@/components/MyForm/index';
import { getFormData } from '@/components/MyForm/utils';
import { AS } from '@/lib/request';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { Button, Modal, Radio, Space } from 'antd';
import { cloneDeep, filter, get } from 'lodash';
import { Component } from 'react';
import ReactToPrint from 'react-to-print';
import requestMethods from './../FetusCanvas/requestMethods';
import './index.less';
const curveOptions = [
  { label: 'BPD,FL,AC', value: 'bpd' },
  { label: 'HC,HL', value: 'hc' },
  { label: 'EFW', value: 'efw' },
];
export default class FetusCanvasNICHD extends Component {
  state = {
    formConfig: [],
    formHandler: {},
    formData: [],
    isShowTableModal: false,
    isShowPointModal: false,
    pointData: null,
    currentCurve: 'bpd',
  };

  async componentDidMount() {
    const { system, headerInfo, id } = this.props;
    const ultrasoundConfig = await api.further.getUltrasoundFormConfig();
    const fields = get(ultrasoundConfig, 'fields');
    const filterFields = filter(fields, (item) => item.key === 'mlUltrasounds');
    const pid: string = get(headerInfo, `id`) || id;
    const res = await requestMethods.getOutpatientFetuGrowsOfOutpatient(pid);
    const mlUltrasounds = get(res, `mlUltrasounds`);
    await this.setState({ formData: { mlUltrasounds: mlUltrasounds, midNiptUltrasounds: mlUltrasounds } });
    this.setState({ formConfig: filterFields });
    this.getFetusData();
  }

  getFetusData = async () => {
    // const { pregnancyData } = this.props;
    // const cloneData = cloneDeep(pregnancyData) || {};
    // if (cloneData.ultrasoundExams) {
    //   cloneData.midNiptUltrasounds = cloneData.ultrasoundExams.filter((v: any) => v.type == 1 || v.type == 2);
    // } else {
    //   cloneData.midNiptUltrasounds = [];
    // }
    // await this.setState({ formData: cloneData });
    const { pregnancyData, headerInfo, id } = this.props;
    const cloneData = cloneDeep(pregnancyData) || {};
    if (cloneData.ultrasoundExams) {
      cloneData.midNiptUltrasounds = cloneData.ultrasoundExams.filter((v: any) => v.type == 1 || v.type == 2);
    } else {
      cloneData.midNiptUltrasounds = [];
    }
    const pid: string = get(headerInfo, `id`) || id;
    const res = await requestMethods.getOutpatientFetuGrowsOfOutpatient(pid);
    const mlUltrasounds = get(res, `mlUltrasounds`);
    await this.setState({ formData: { mlUltrasounds: mlUltrasounds, midNiptUltrasounds: mlUltrasounds } });
    this.drawFetusCanvas(res, this.state.currentCurve);
  };





  drawFetusCanvas = (dd: any, type: any) => {
    AS.post<{ data: { dataUrl: string } }>('/draw/fetusNichd', { ...dd, type }).then(res => {
      const dataUrl = res.data.data.dataUrl
      document.querySelector<HTMLImageElement>('#fetus-canvas-NICHD')!.src = dataUrl
    })
  };

  handleEditBtn = async () => {
    const { system } = this.props;
    const ultrasoundConfig = await api.further.getUltrasoundFormConfig();
    const fields = get(ultrasoundConfig, 'fields');
    const filterFields = filter(fields, (item) => item.key === 'mlUltrasounds');
    this.setState({
      formConfig: filterFields,
      isShowTableModal: true,
    });
  };

  handleIndexBtn = async (e: any) => {
    await this.setState({ currentCurve: e.target.value });
    this.drawFetusCanvas(this.state.formConfig, this.state.currentCurve);
  };

  renderPointModal() {
    const { isShowPointModal, pointData } = this.state;

    const handleCancel = () => {
      this.setState({ isShowPointModal: false });
    };

    return isShowPointModal ? (
      <Modal
        style={pointData.style}
        className="point-modal"
        visible={isShowPointModal}
        footer={null}
        onCancel={handleCancel}
      >
        <span className="info-item">孕周：{pointData.x}</span>
        <span className="info-item">
          {pointData.line}：{pointData.y}
        </span>
        <span>胎儿信息：胎儿{pointData.fetus}</span>
      </Modal>
    ) : null;
  }

  renderTableModal() {
    const { formConfig, isShowTableModal, formData } = this.state;
    const { pregnancyData, headerInfo, id } = this.props;
    const handleCancel = () => {
      this.setState({ isShowTableModal: false });
    };

    const handleOk = async () => {
      const { formHandler } = this.state;
      const { validCode, res } = await formHandler.submit();
      const pregnancyId = get(headerInfo, 'id') || id;
      if (validCode) {
        const resData = getFormData(res);
        const postData = {
          id: pregnancyId,
          ...resData,
        };
        await requestMethods.updateOutpatientFetuGrowsOfOutpatient(postData);
        this.getFetusData();
        this.setState({ isShowTableModal: false });
      }
    };

    return (
      <Modal
        title="胎儿生长曲线绘制编辑"
        className="table-modal"
        visible={isShowTableModal}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <MyForm
          config={formConfig}
          value={formData}
          getFormHandler={(formHandler: any) => this.setState({ formHandler })}
          submitChange={false}
        />
      </Modal>
    );
  }

  render() {
    const { isShowTableModal, currentCurve } = this.state;
    const { isAllPregnancies } = this.props;
    return (
      <div className="fetus-wrapper">
        <p className="radio-wrapper">
          指标：
          <Radio.Group
            className="bmi-radio"
            value={currentCurve}
            options={curveOptions}
            onChange={this.handleIndexBtn}
          />
        </p>
        {!get(this.props, 'hidePrintBtn') && (
          <Space className="btn-wrapper">
            <ReactToPrint
              trigger={() => (
                <Button type="primary" size="small">
                  <PrinterOutlined />
                  打印
                </Button>
              )}
              content={() => document.querySelector('#fetus-canvas-NICHD')}
            />
            {!isAllPregnancies && (
              <Button size="small" onClick={() => this.handleEditBtn()}>
                <EditOutlined />
                编辑
              </Button>
            )}
          </Space>
        )}

        <img id="fetus-canvas-NICHD" className="fetus-canvas-NICHD">
        </img>
        {this.renderPointModal()}
        {isShowTableModal && this.renderTableModal()}
        <span className="fetus-wrapper-note">依据：NICHD亚裔胎儿生长曲线</span>
      </div>
    );
  }
}

// const mapDisPathchToProps = { getPregnancyData };

// export default connect(null, mapDisPathchToProps)(Index);
