import { PrinterOutlined } from '@/components/GeneralComponents/CustomIcon';
import { AS } from '@/lib/request';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { Button, Radio } from 'antd';
import { get } from 'lodash';
import { Component, createRef } from 'react';
import ReactToPrint from 'react-to-print';
import './index.less';
const recordOptions = [
  { label: '全部', value: 0 },
  { label: '产检记录', value: 1 },
  { label: '居家记录', value: 2 },
];
interface IndexState {
  bmiIntro: string;
  bmiBottomLine: any[];
  bmiTopLine: any[];
  bmiLinesPoints: any[];
  bmiNum: string;
  bmiTz: string;
  bmiList: any[];
  resdata: any;
}
export default class BmiCanvas extends Component<{}, IndexState> {
  constructor(props: any) {
    super(props);
    this.state = {
      bmiIntro: '',
      bmiBottomLine: [],
      bmiTopLine: [],
      bmiLinesPoints: [],
      bmiNum: '',
      bmiTz: '',
      bmiList: [],
      resdata: null,
    };
  }

  async componentDidMount() {
    await this.getResData();
    this.getBmiData(0);
  }

  async getResData() {
    const { pregnancyData, headerInfo, id } = this.props;
    const pregnancyId = get(headerInfo, 'id') || id;
    const res0 = await api.curve.getBmi(pregnancyId, 0);
    const res1 = await api.curve.getBmi(pregnancyId, 1);
    const res2 = await api.curve.getBmi(pregnancyId, 2);
    this.setState({ resdata: { 0: res0, 1: res1, 2: res2 } });
  }

  getBmiData = async (type: number) => {
    const { resdata } = this.state;
    let res = get(resdata, `${type}`);

    this.drawBmiCanvas(res);
  };

  handleRadioChange = (e: any) => {
    this.getBmiData(e.target.value);
  };





  drawBmiCanvas(dd: any) {
    AS.post<{ data: { dataUrl: string } }>('/draw/bmi', dd)
      .then(res => {
        const dataUrl = res.data.data.dataUrl
        document.querySelector<HTMLImageElement>('#bmi-canvas')!.src = dataUrl
      })

  }

  render() {
    return (
      <div className="bmi-wrapper">
        <Radio.Group className="bmi-radio" options={recordOptions} defaultValue={0} onChange={this.handleRadioChange} />
        {!get(this.props, 'hidePrintBtn') && (
          <ReactToPrint
            trigger={() => (
              <Button type="primary" size="small" className="print-btn">
                <PrinterOutlined /> 打印
              </Button>
            )}
            content={() => document.querySelector<HTMLImageElement>('#bmi-canvas')}
          />
        )}

        <img id="bmi-canvas" className="bmi-canvas">
        </img>
      </div>
    );
  }
}
