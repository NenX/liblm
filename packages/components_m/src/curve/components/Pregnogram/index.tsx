import React, { Component, createRef } from 'react';
import { Button } from 'antd';
import ReactToPrint from 'react-to-print';
import { get, cloneDeep, forEach } from 'lodash';
import { PrinterOutlined } from '@ant-design/icons';
import { api } from '../api';
import { fundalHeightData } from '../../data';
import { judgeAreas, setHorRules, setVerRules, printCanvas } from '../../func';
import './index.less';
const fontColor = '#131415';
const lineColor = '#B1E3E6';
interface IndexState {
  fundalHeightList: any[];
}
export default class Pregnogram extends Component<{ hidePrintBtn?: boolean, onLoad?(): void }, IndexState> {
  imageRef = createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      fundalHeightList: [],
    };
  }

  async componentDidMount() {
    // this.drawPregnogramCanvas();
    const { pregnancyData, headerInfo, id } = this.props;
    const pregnancyId = get(headerInfo, 'id') || id;

    const res = await api.curve.getFundalHeight(pregnancyId);
    await this.setState({ fundalHeightList: get(res, 'items') });
    this.drawPregnogramCanvas();
  }

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
      if (i % 2 !== 0) {
        context.fillText(i + 12, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
      }
      context.stroke();
    }
    context.font = 'bold 12px normal';
    context.fillText('宫高(cm)', baseLeft - 20, baseTop - 20);
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

  drawPregnogramCanvas() {
    const { fundalHeightList } = this.state;
    let cloneList = cloneDeep(fundalHeightList);
    cloneList &&
      cloneList.map((item: any) => {
        if (!item.fundalHeight || !item.week) {
          item.fundalHeight = 0;
          item.week = -1;
        } else {
          item.fundalHeight = Number(item.fundalHeight) - 12;
          if (item.week.indexOf('+') !== -1) {
            const arr = item.week.split('+');
            item.week = Number(arr[0]) + Number(arr[1]) / 7;
          }
          item.week = item.week - 15;
        }
      });
    cloneList = cloneList.filter(
      (i: any) => i.week >= 0 && i.week <= 27 && i.fundalHeight >= 0 && i.fundalHeight <= 30,
    );
    // 统一曲线 x,y 表示
    cloneList.length > 0 &&
      cloneList.map((item: any) => {
        item.x = item.week;
        item.y = item.fundalHeight;
      });
    const unusualColor =
      cloneList.length > 0 && judgeAreas(cloneList[cloneList.length - 1], get(fundalHeightData, 'lineArea'))
        ? fontColor
        : '#FF0909';

    const canvas = document.getElementById('pregnogram-canvas');
    const context = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 650;

    const baseLeft = 60;
    const baseTop = 150;
    const xStep = 16;
    const yStep = 20;
    const xCount = 31;
    const yCount = 28;

    context.fillStyle = fontColor;
    context.font = 'bold 16px normal';
    context.textAlign = 'center';
    context.fillText('妊娠图', canvas.width / 2, baseTop - 80);

    this.setVertical(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    this.setHorizontal(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, lineColor, 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, lineColor, 1, xStep, 5);

    this.drawScaleLine(
      canvas,
      context,
      [baseLeft, baseTop + (xCount - 1) * xStep],
      [yStep, xStep],
      cloneList,
      [true, unusualColor],
      unusualColor,
      [0],
      2,
    );

    const solidLineArr = [get(fundalHeightData, 'topSolidLine'), get(fundalHeightData, 'bottomSolidLine')];
    forEach(solidLineArr, (line) => {
      this.drawScaleLine(
        canvas,
        context,
        [baseLeft, baseTop + (xCount - 1) * xStep],
        [yStep, xStep],
        line,
        [true, '#787878'],
        '#787878',
        [0],
        2,
      );
    });

    const dashLineArr = [get(fundalHeightData, 'topDashLine'), get(fundalHeightData, 'bottomDashLine')];
    forEach(dashLineArr, (line) => {
      this.drawScaleLine(
        canvas,
        context,
        [baseLeft, baseTop + (xCount - 1) * xStep],
        [yStep, xStep],
        line,
        [true, '#787878'],
        '#787878',
        [8],
        2,
      );
    });
    this.imageRef.current = canvas?.toDataURL('image/jpg');
    this.props.onLoad && this.props.onLoad();
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
            content={() => printCanvas('pregnogram-canvas')}
          />
        )}

        <canvas id="pregnogram-canvas" className="pregnogram-canvas">
          您的浏览器不支持canvas，请更换浏览器.
        </canvas>
      </div>
    );
  }
}
