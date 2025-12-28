import { PrinterOutlined } from '@/components/GeneralComponents/CustomIcon';
import { AS } from '@/lib/request';
import { api } from '@/pages/prenatal-visit/pregnancy/doctor-end/api';
import { Button } from 'antd';
import { get } from 'lodash';
import { Component } from 'react';
import ReactToPrint from 'react-to-print';
import { printCanvas } from '../../func';
import './index.less';
const fontColor = '#131415';
const lineColor = '#B1E3E6';
const width = 700;
const height = 650;
interface IndexState {
  fundalHeightList: any[];
}
export default class Pregnogram extends Component<{}, IndexState> {
  constructor(props: any) {
    super(props);
    this.state = {
      fundalHeightList: [],
    };
  }

  async componentDidMount() {
 
    const { pregnancyData, headerInfo, id } = this.props;
    const pregnancyId = get(headerInfo, 'id') || id;

    const res = await api.curve.getFundalHeight(pregnancyId);
    this.drawPregnogramCanvas(res);
  }





  //绘制y轴线
  setHorizontal = (
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) => {
    for (let i = 0; i < yCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(yStep * i + baseLeft, baseTop);
      context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
      context.textAlign = 'center';
      context.fillStyle = fontColor;
      context.font = 'bold 12px consolas';
      if (i % 2 !== 0) {
        context.fillText(i + 15, baseLeft + i * yStep, xStep * xCount + baseTop);
      }
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
  };

  drawPregnogramCanvas(dd:any) {

    AS.post<{ data: { dataUrl: string } }>('/draw/pregnogram', dd).then(res => {
      const dataUrl = res.data.data.dataUrl
      document.querySelector<HTMLImageElement>('#pregnogram-canvas')!.src = dataUrl
    })

 

  }

  render() {
    return (
      <div className="pregnogram-wrapper">
        {!get(this.props, 'hidePrintBtn') && (
          <ReactToPrint
            trigger={() => (
              <Button size="small" type="primary" className="print-btn">
                <PrinterOutlined /> 打印
              </Button>
            )}
            content={() => document.querySelector<HTMLImageElement>('#pregnogram-canvas')}

          />
        )}

        <img  id="pregnogram-canvas" className="pregnogram-canvas">
        </img>
      </div>
    );
  }
}
