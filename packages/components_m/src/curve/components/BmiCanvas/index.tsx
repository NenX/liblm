import React, { Component, createRef } from 'react';
import { Button, Radio } from 'antd';
import ReactToPrint from 'react-to-print';
import { get, cloneDeep, forEach } from 'lodash';
import { PrinterOutlined } from '@ant-design/icons';
import { api } from '../api';
import { bmiData1, bmiData2, bmiData3, bmiData4 } from '../../data';
import { judgeAreas, setHorRules, setVerRules, printCanvas } from '../../func';
import './index.less';

const fontColor = '#131415';
const lineColor = '#B1E3E6';
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

export default class BmiCanvas extends Component<{ hidePrintBtn?: boolean, onLoad?(): void }, IndexState> {
  imageRef = createRef();
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
    await this.setState({ ...bmiData2 });
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
    if (get(res, 'preBmi') < 18.5) {
      this.setState({ ...bmiData1 });
    } else if (get(res, 'preBmi') < 25) {
      this.setState({ ...bmiData2 });
    } else if (get(res, 'preBmi') < 30) {
      this.setState({ ...bmiData3 });
    } else if (get(res, 'preBmi') >= 30) {
      this.setState({ ...bmiData4 });
    }
    await this.setState({
      bmiNum: get(res, 'preBmi'),
      bmiTz: get(res, 'weight'),
      bmiList: get(res, 'items'),
    });
    this.drawBmiCanvas();
  };

  handleRadioChange = (e: any) => {
    this.getBmiData(e.target.value);
  };

  //绘制曲线
  drawScaleLine(
    canvas: any,
    ctx: any,
    oringin: any[],
    steps: any[],
    data: any,
    point: any[],
    color: string,
    shape: any[],
    lineWidth: number,
  ) {
    for (let i = 0; i < data.length; i++) {
      //绘制曲线
      ctx.beginPath();
      ctx.setLineDash(shape);
      ctx.lineWidth = lineWidth;
      if (i < data.length - 1) {
        ctx.moveTo(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y);
        ctx.lineTo(oringin[0] + steps[0] * data[i + 1].x, oringin[1] - steps[1] * data[i + 1].y);
      }
      ctx.strokeStyle = color;
      ctx.stroke();
      //绘制红点
      if (point[0]) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.arc(oringin[0] + steps[0] * data[i].x, oringin[1] - steps[1] * data[i].y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = point[1];
        ctx.fill();
      }
    }
  }

  //绘制x轴线
  setVertical = (
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) => {
    context.strokeStyle = lineColor;
    for (let i = 0; i < xCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(baseLeft, baseTop + xStep * i);
      context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
      context.textBaseline = 'middle';
      context.fillStyle = fontColor;
      context.font = 'bold 12px consolas';
      context.fillText(i * 2 + -8, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('体重增长(kg)', baseLeft - 20, baseTop - 20);
  };

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
    let count = 0;
    for (let i = 0; i < yCount; i++) {
      count++;
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(yStep * i + baseLeft, baseTop);
      context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
      context.textAlign = 'center';
      context.fillStyle = fontColor;
      context.font = 'bold 12px consolas';
      if (count === 1 || count === 4) {
        count = count === 4 ? 1 : count;
        context.fillText(i + 1, baseLeft + i * yStep, xStep * xCount + baseTop - 15);
      }
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('孕周(周)', yStep * yCount + baseLeft + 15, (xCount - 1) * xStep + baseTop);
  };

  drawBmiCanvas() {
    const { bmiBottomLine, bmiTopLine, bmiLinesPoints, bmiNum, bmiTz, bmiList, bmiIntro } = this.state;
    let newBmiList = cloneDeep(bmiList);
    newBmiList &&
      newBmiList.map((item: any) => {
        if (!item.weight || !item.week) {
          item.weight = 0;
          item.week = -1;
        } else {
          item.weight = item.weight - Number(bmiTz);
          if (item.week.indexOf('+') !== -1) {
            const arr = item.week.split('+');
            item.week = Number(arr[0]) + Number(arr[1]) / 7;
          }
          item.week = item.week - 1;
        }
      });
    // console.log(newBmiList, 'bmi1');
    newBmiList = newBmiList.filter((i: any) => i.week >= 0 && i.week <= 39 && i.weight >= -8 && i.weight <= 24);
    // 统一曲线 x,y 表示
    newBmiList.length > 0 &&
      newBmiList.map((item: any) => {
        item.x = item.week;
        item.y = item.weight;
      });
    const unusualColor =
      newBmiList.length > 0 && judgeAreas(newBmiList[newBmiList.length - 1], bmiLinesPoints) ? fontColor : '#FF0909';

    const canvas = document.getElementById('bmi-canvas');
    const context = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 650;

    const baseLeft = 60;
    const baseTop = 150;
    const xStep = 30;
    const yStep = 15;
    const xCount = 17;
    const yCount = 40;

    context.fillStyle = fontColor;
    context.font = 'bold 16px normal';
    context.textAlign = 'center';
    context.fillText('BMI孕期体重管理曲线', canvas.width / 2, baseTop - 80);

    context.fillStyle = '#52aaff';
    context.font = 'normal 12px normal';
    context.fillText(`孕前BMI: ${bmiNum} kg/㎡`, canvas.width / 2, baseTop - 50);
    context.fillText(bmiIntro, canvas.width / 2, baseTop - 30);
    context.fillStyle = fontColor;

    this.setVertical(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    this.setHorizontal(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, lineColor, 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, lineColor, 1, xStep, 5);

    const endLineArr = [bmiBottomLine, bmiTopLine];
    forEach(endLineArr, (line) => {
      this.drawScaleLine(
        canvas,
        context,
        [baseLeft, baseTop + (xCount - 5) * xStep],
        [yStep, xStep / 2],
        line,
        [true, '#787878'],
        '#787878',
        [8],
        2,
      );
    });

    // console.log(newBmiList, 'bmi2');
    this.drawScaleLine(
      canvas,
      context,
      [baseLeft, baseTop + (xCount - 5) * xStep],
      [yStep, xStep / 2],
      newBmiList,
      [true, unusualColor],
      unusualColor,
      [0],
      2,
    );
    this.imageRef.current = canvas?.toDataURL('image/jpg');
    this.props.onLoad && this.props.onLoad();
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
            content={() => printCanvas('bmi-canvas')}
          />
        )}

        <canvas id="bmi-canvas" className="bmi-canvas">
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div>
    );
  }
}
