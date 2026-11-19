import { MyIcon } from '@lm_fe/components';
import { Button, Modal, Space } from 'antd';
import { forEach, get, set } from 'lodash';
import React, { useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { draw_info, get_abnormal_color, get_canvas_el, get_fetus_color } from 'src/curve/utils';
import { acData, bpdData, flData } from '../../data';
import { judgeAreas, printCanvas, setHorRules, setVerRules, TPoint } from '../../func';
import { FetuGrowsEdit } from './FetuGrowsEdit';
import './index.less';
import { IProps, use_fetus } from './use_fetus';
export default function FetusCanvas(props: IProps) {
  const { headerInfo, id, isAllPregnancies } = props;




  const {
    sys_theme,
    line_color,
    font_color,
    imageRef,
    pointData,
    isShowPointModal,
    set_pointData,
    set_isShowPointModal,
    getFetusData,
    formData
  } = use_fetus(props)





  useEffect(() => {
    if (formData)
      drawFetusCanvas()

    return () => {

    }
  }, [formData])



  //绘制曲线
  function drawScaleLine(
    canvas: HTMLCanvasElement | null,
    ctx: CanvasRenderingContext2D,
    oringin: any[],
    steps: any[],
    data: TPoint[],
    point: [false] | [boolean, string, string], // boolean,color,name
    color: string,
    shape: number[],
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
        point[1] && (ctx.fillStyle = point[1]);
        ctx.fill();
        const that = this;
        canvas &&
          canvas.addEventListener(
            'click',
            (e: any) => {
              const X = oringin[0] + steps[0] * data[i].x;
              const Y = oringin[1] - steps[1] * data[i].y;
              const obj = { x: X, y: Y, r: 5 };

              let x = e.pageX - canvas.getBoundingClientRect().left;
              let y = e.pageY - canvas.getBoundingClientRect().top;
              if (x > obj.x - obj.r && x < obj.x + obj.r && y > obj.y - obj.r && y < obj.y + obj.r) {
                const obj = {
                  x: data[i].gestationalWeek,
                  y: data[i].value,
                  line: point[2],
                  fetus: data[i].sort,
                  style: {
                    position: 'fixed' as const,
                    top: e.pageY,
                    left: e.pageX,
                  },
                };
                set_pointData(obj)
                set_isShowPointModal(true)
              }
            },
            false,
          );
      }
    }
  }

  //绘制x轴线
  function setVertical(
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) {
    context.strokeStyle = line_color;
    for (let i = 0; i < xCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(baseLeft, baseTop + xStep * i);
      context.lineTo(baseLeft + (yCount - 1) * yStep, baseTop + xStep * i);
      context.textBaseline = 'middle';
      context.fillStyle = font_color;
      context.font = 'bold 12px normal';
      if ((i * 2) % 10 === 0) {
        context.lineWidth = 2;
        context.fillText(i * 2, baseLeft - 20, (xCount - 1) * xStep + baseTop - i * xStep);
      }
      context.stroke();
    }
  };

  //绘制y轴线
  function setHorizontal(
    context: any,
    xCount: number,
    yCount: number,
    xStep: number,
    yStep: number,
    baseLeft: number,
    baseTop: number,
  ) {
    for (let i = 0; i < yCount; i++) {
      context.beginPath();
      context.lineWidth = 1;
      context.moveTo(yStep * i + baseLeft, baseTop);
      context.lineTo(yStep * i + baseLeft, baseTop + xStep * (xCount - 1));
      context.textAlign = 'center';
      context.fillStyle = font_color;
      context.font = 'bold 12px normal';
      if (i % 5 === 0) {
        context.lineWidth = 2;
        context.fillText(i + 10, baseLeft + i * yStep, xStep * xCount + baseTop + 5);
      }
      context.stroke();
    }
  };

  function drawFetusCanvas() {
    const mlUltrasounds = get(formData, 'mlUltrasounds') || [];

    let allBpdArr: any = [];
    let allFlArr: any = [];
    let allAcArr: any = [];
    if (mlUltrasounds.length > 0) {
      forEach(mlUltrasounds, (item) => {
        let yunWeek = item.gestationalWeek;
        if (yunWeek && yunWeek.indexOf('+') !== -1) {
          const arr = yunWeek.split('+');
          yunWeek = Number(arr[0]) + Number(arr[1]) / 7;
        }
        const setData = (param: string, arr: any) => {
          const obj: any = {};
          const sort = +item.fetal - 1;
          obj.x = yunWeek - 10;
          if (param === 'ac') {
            obj.y = Number(item[param]) / 10;
          } else {
            obj.y = Number(item[param]);
          }
          obj.value = Number(item[param]);
          obj.gestationalWeek = item.gestationalWeek;
          obj.sort = item.fetal;
          if (yunWeek && item[param] && yunWeek >= 10 && yunWeek <= 40 && obj.y <= 110) {
            const arrItem = get(arr, sort) || [];
            arrItem.push(obj);
            set(arr, sort, arrItem);
          }
        };

        setData('bpd', allBpdArr);
        setData('fl', allFlArr);
        setData('ac', allAcArr);
      });
    }

    const canvas = get_canvas_el('fetus-canvas', sys_theme);
    const context = canvas.getContext('2d');
    if (!context) return
    canvas.width = 660;
    canvas.height = 710;

    const baseLeft = 50;
    const baseTop = 120;
    const xStep = 10;
    const yStep = 17;
    const xCount = 56;
    const yCount = 31;

    context.fillStyle = font_color;
    context.font = 'bold 16px normal';
    context.textAlign = 'center';
    context.fillText(`${draw_info(headerInfo,)}`, canvas.width / 2, baseTop - 60);

    context.fillText('胎儿生长曲线', canvas.width / 2, baseTop - 25);

    setVertical(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setHorizontal(context, xCount, yCount, xStep, yStep, baseLeft, baseTop);
    setVerRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (yCount - 1) * yStep, line_color, 1, yStep, 5);
    setHorRules(context, [baseLeft, baseTop + (xCount - 1) * xStep], (xCount - 1) * xStep, line_color, 1, xStep, 5);

    //手动绘制标尺最右端点
    //BPD
    context.fillText('+2SD', baseLeft + yCount * yStep, baseTop + 4.2 * xStep);
    context.fillText('Mean', baseLeft + yCount * yStep, baseTop + 8 * xStep);
    context.fillText('-2SD', baseLeft + yCount * yStep, baseTop + 11.5 * xStep);
    //FL
    context.fillText('+2SD', baseLeft + yCount * yStep, baseTop + 16.5 * xStep);
    context.fillText('Mean', baseLeft + yCount * yStep, baseTop + 19 * xStep);
    context.fillText('-2SD', baseLeft + yCount * yStep, baseTop + 21.5 * xStep);
    //AC
    context.fillText('37', baseLeft + yCount * yStep, baseTop + 36.5 * xStep);
    context.fillText('34', baseLeft + yCount * yStep, baseTop + 38 * xStep);
    context.fillText('31', baseLeft + yCount * yStep, baseTop + 39.5 * xStep);

    context.font = 'bold 18px normal';
    context.textAlign = 'center';
    context.fillText('BPD', baseLeft + (yCount - 6) * yStep, baseTop + 6 * xStep);
    context.fillText('FL', baseLeft + (yCount - 6) * yStep, baseTop + 28 * xStep);
    context.fillText('AC', baseLeft + (yCount - 6) * yStep, baseTop + 44 * xStep);

    const middleLineArr = [get(bpdData, 'middleLine'), get(flData, 'middleLine'), get(acData, 'middleLine')];
    const endLineArr = [
      get(bpdData, 'bottomLine'),
      get(bpdData, 'topLine'),
      get(flData, 'bottomLine'),
      get(flData, 'topLine'),
      get(acData, 'bottomLine'),
      get(acData, 'topLine'),
    ];

    forEach(middleLineArr, (line) => {
      drawScaleLine(
        null,
        context,
        [baseLeft, baseTop + (xCount - 1) * xStep],
        [yStep, xStep / 2],
        line,
        [false],
        '#787878',
        [],
        2,
      );
    });

    forEach(endLineArr, (line) => {
      drawScaleLine(
        null,
        context,
        [baseLeft, baseTop + (xCount - 1) * xStep],
        [yStep, xStep / 2],
        line,
        [false],
        '#787878',
        [8],
        2,
      );
    });
    const drawItemLine = (itemArr: TPoint[][], itemData: { lineArea: TPoint[] }, itemName: string) => {
      itemArr.forEach((child_data, child_idx) => {
        console.log('aax item', { item: child_data, itemName, itemData, child_idx })
        if (child_data.length > 0) {
          const color = judgeAreas(child_data[child_data.length - 1], get(itemData, 'lineArea')) ? get_fetus_color(sys_theme, child_idx) : get_abnormal_color(sys_theme);
          drawScaleLine(
            canvas,
            context,
            [baseLeft, baseTop + (xCount - 1) * xStep],
            [yStep, xStep / 2],
            child_data,
            [true, color, itemName],
            color,
            [],
            2,
          );
        }
      });
    };
    drawItemLine(allBpdArr, bpdData, 'BPD');
    drawItemLine(allFlArr, flData, 'FL');
    drawItemLine(allAcArr, acData, 'AC');
    imageRef.current = canvas?.toDataURL('image/jpg');
    props.onLoad && props.onLoad();
  };



  function renderPointModal() {
    const handleCancel = () => {
      set_isShowPointModal(false)
    };

    return (isShowPointModal && pointData) ? (
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



  return (
    <div className="fetus-wrapper">
      {!get(props, 'hidePrintBtn') && (
        <Space className="btn-wrapper">
          <ReactToPrint
            trigger={() => (
              <Button type="primary" size="small">
                <MyIcon value='PrinterOutlined' />
                打印
              </Button>
            )}
            content={() => printCanvas('fetus-canvas')}
          />
          {!isAllPregnancies && (

            <FetuGrowsEdit value={formData} onSubmit={getFetusData} />

          )}
        </Space>
      )}

      <canvas id="fetus-canvas" className="fetus-canvas">
        您的浏览器不支持canvas，请更换浏览器.
      </canvas>
      {renderPointModal()}
    </div>
  );
}


// export default connect(null, mapDisPathchToProps)(Index);
