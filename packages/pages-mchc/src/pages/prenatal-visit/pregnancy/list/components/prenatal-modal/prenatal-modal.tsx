import { ArrowLeftOutlined, ArrowRightOutlined, CloseOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Checkbox, Spin } from 'antd';
import classnames from 'classnames';
import { cloneDeep, findIndex, get, includes, map, remove, size } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { PRENATALLIST, prenatalEnum, prenatalToResource, previewEnum, printapi } from './constant';
import { BmiCanvas, FetusCanvas, FetusCanvasNICHD, PDFPreview_View, Pregnogram } from '@lm_fe/components_m';
import { request, sleep } from '@lm_fe/utils';
import './index.less';
import { mchcLogger } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
interface IProps {
  [key: string]: any;
}
interface typea {
  [key: string]: string;
}
const CANVASCOUNT = 3;
export default function PrenatalModal({ ...props }: IProps) {
  const [selectPrenatal, setSelectPrenatal] = useState<Array<prenatalEnum>>([]); // 选择打印的数据
  const [preview, setPreview] = useState<previewEnum>(previewEnum.singleView); // 预览类型：单页or全部
  const [curentPreviw, setCurentPreview] = useState<prenatalEnum>(prenatalEnum.firstInSpection); // 当前选择预览的页面
  const [previewData, setPreviewData] = useState({}); // 缓存单页预览的数据
  const [allPreviewData, setAllPreviewData] = useState<string>(); // 全部预览的数据
  const [currentCount, setCurrentCount] = useState(0); // 记录单页时当前是第几个
  const [loading, setLoading] = useState<boolean>(false);
  const [canvasCount, setCanvasCount] = useState<number>(0); // 记录canvas是否加载，加载了多少个
  const [printUrl, setPrintUrl] = useState<string>(printapi.multipage); // 打印url
  // 打印按钮的是否可点击
  const [isPrint, setIsPrint] = useState<any>(true); // 打印请求的数据
  const fetusRef: any = useRef();
  const bmiRef: any = useRef();
  const pregnogramRef: any = useRef();
  //#region 初始化

  useEffect(() => {
    // console.log(1);

    getPreviewPDF(curentPreviw);
  }, [curentPreviw]);

  useEffect(() => {
    // console.log(2);

    console.log('abababab');
    if (canvasCount != 0) {
      getAllPreviewData();
    }
  }, [canvasCount]);
  //#endregion

  //#region 辅助方法
  /**根据类型单个预览 */
  async function getPreviewPDF(type: prenatalEnum) {
    const url = get(previewData, `${type}`);
    if (url) {
      return url;
    }
    const imageArr = [prenatalEnum.growthCurve, prenatalEnum.BMICurve, prenatalEnum.fundalImage];
    if (includes(imageArr, type)) {
      return;
    }
    const requestData = {
      resource: prenatalToResource[type],
      template: '',
      version: '',
      note: '',
      id: get(props, 'id'),
    };
    setLoading(true);
    try {
      const { pdfdata } = (await request.post('/api/pdf-preview', requestData,)).data;
      setPreviewData({ ...previewData, [type]: pdfdata });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }


  // 全部预览请求方法
  async function getAllPreviewData() {
    if (allPreviewData) return;
    const fetusImgBase64 = get(fetusRef.current, `imageRef.current`);
    const bmiImageBase64 = get(bmiRef.current, `imageRef.current`);
    const pregnogramImgBase64 = get(pregnogramRef.current, `imageRef.current`);
    if (!(fetusImgBase64 && bmiImageBase64 && pregnogramImgBase64)) {
      return;
    }
    const requestData = map(prenatalToResource, (item: string, key: prenatalEnum) => {
      const obj = {
        template: '',
        resource: item,
        id: get(props, 'id'),
      };
      if (key == prenatalEnum.growthCurve) {
        obj['img'] = fetusImgBase64;
      }
      if (key == prenatalEnum.BMICurve) {
        obj['img'] = bmiImageBase64;
      }
      if (key == prenatalEnum.fundalImage) {
        obj['img'] = pregnogramImgBase64;
      }
      return obj;
    });

    try {
      setLoading(true);
      const { pdfdata } = (await request.post('/api/pdf-preview-document', requestData)).data;
      setLoading(false);
      setAllPreviewData(pdfdata);
    } catch (error) {
      setLoading(false);
    }
  }

  //#endregion

  //#region 事件相关

  // 底部check
  function handleCheckPrenatal(type: prenatalEnum) {
    return (e: any) => {
      const check = e.target.checked;

      e.stopPropagation();
      const selectPrenatal_ = cloneDeep(selectPrenatal);
      if (!check) {

        remove(selectPrenatal_, (item) => item == type);
        setIsPrint(false)
      } else {
        selectPrenatal_.push(type);
      }
      setSelectPrenatal(selectPrenatal_);
      if (selectPrenatal_.length > 0) {

        setIsPrint(false)
      } else {
        setIsPrint(true)
      }
    };
  }
  // 选择单页预览还是全部预览
  function handlePreview(type: previewEnum) {
    return () => {
      setPreview(type);
    };
  }

  // 左右选择
  function handleIcon(type: string) {
    return async () => {
      let newCount = currentCount,
        newCurrentPreview;
      if (type == 'last') {
        newCount--;
      } else {
        newCount++;
      }
      newCurrentPreview = get(PRENATALLIST, `[${newCount}].type`);
      setLoading(true);
      await sleep(0.3)
      setCurentPreview(newCurrentPreview);
      setCurrentCount(newCount);
      setLoading(false);
    };
  }
  // 关闭浮层
  function handleClose() {
    props.onClose && props.onClose();
  }

  // 选择底部的展示
  function handleClickItem(type: prenatalEnum) {
    return async () => {
      const index = findIndex(PRENATALLIST, (item) => item.type == type);
      setLoading(true);
      await sleep(0.3)
      setCurrentCount(index);
      setCurentPreview(type);
      setLoading(false);
    };
  }

  // 打印事件
  function handlePrint() {
    const fetusImgBase64 = get(fetusRef.current, `imageRef.current`);
    const bmiImageBase64 = get(bmiRef.current, `imageRef.current`);
    const pregnogramImgBase64 = get(pregnogramRef.current, `imageRef.current`);
    const requestData = map(selectPrenatal, (item, index) => {
      const obj = {
        template: '',
        resource: get(prenatalToResource, `${item}`),
        id: get(props, 'id'),
      };
      if (item == prenatalEnum.growthCurve) {
        obj['img'] = fetusImgBase64;
      }
      if (item == prenatalEnum.BMICurve) {
        obj['img'] = bmiImageBase64;
      }
      if (item == prenatalEnum.fundalImage) {
        obj['img'] = pregnogramImgBase64;
      }
      return obj;
    });
    let printRequestData: any[]
    if (size(requestData) == 0) {
      const obj = {
        template: '',
        resource: get(prenatalToResource, `${curentPreviw}`),
        id: get(props, 'id'),
      };
      if (curentPreviw == prenatalEnum.growthCurve) {
        obj['img'] = fetusImgBase64;
      }
      if (curentPreviw == prenatalEnum.BMICurve) {
        obj['img'] = bmiImageBase64;
      }
      if (curentPreviw == prenatalEnum.fundalImage) {
        obj['img'] = pregnogramImgBase64;
      }
      printRequestData = [obj]
    } else {
      printRequestData = requestData

    }



    mchcModal__.open('print_modal', {
      modal_data: {
        requestConfig: {
          url: printUrl,
          data: printRequestData
        },
      }
    })
  }

  function canvasOnLoad() {
    const newconut = canvasCount + 1;
    setCanvasCount(newconut);
  }

  //#endregion

  //#region 渲染相收
  function showcanvas() {
    if (preview == previewEnum.fullView) {
      return true;
    }
    if (size(selectPrenatal) > 0) {
      return true;
    }
  }

  function renderPrenatalItem() {
    return map(PRENATALLIST, (item) => {
      return (
        <div className="bottom_item" onClick={handleClickItem(get(item, 'type'))}>
          <span>{get(item, 'title')}</span>
          <Checkbox
            className="checkbox-custom"
            checked={includes(selectPrenatal, get(item, 'type'))}
            onClick={handleCheckPrenatal(get(item, 'type'))}
          />
          {curentPreviw != get(item, `type`) && <div className="bottom_item-mask"></div>}
        </div>
      );
    });
  }
  function detailsShow() {
    // if (loading) {
    //   return <Spin className="spin" tip="文件加载中，请稍等..." />;
    // }
    if (preview == previewEnum.singleView) {
      if (curentPreviw == prenatalEnum.growthCurve) {
        const { system } = props;
        const Component =
          get(system, 'config.curveVersion') === 'nichd' ? (
            <FetusCanvasNICHD {...props} hidePrintBtn={true} />
          ) : (
            <FetusCanvas {...props} hidePrintBtn={true} />
          );
        return Component;
      } else if (curentPreviw == prenatalEnum.BMICurve) {
        return <BmiCanvas {...props} hidePrintBtn={true} />;
      } else if (curentPreviw == prenatalEnum.fundalImage) {
        return <Pregnogram {...props} hidePrintBtn={true} />;
      }
      return <PDFPreview_View data={get(previewData, `${curentPreviw}`)} />;
    } else {
      return (
        <>
          <PDFPreview_View data={allPreviewData} />
        </>
      );
    }
  }
  //#endregion

  return (
    <div className="prenatal-modal-container">
      <div className="prenatal-modal-container_mian">
        <ArrowLeftOutlined
          type="icon-backx"
          className={classnames('mian-icon mian-back', { 'icon-disabled': currentCount == 0 })}
          onClick={handleIcon('last')}
        />
        <ArrowRightOutlined
          type="icon-backx"
          className={classnames('mian-icon mian-last', { 'icon-disabled': currentCount == 7 })}
          onClick={handleIcon('next')}
        />
        <div className="prenatal-modal-container_mian-content">
          <div style={{ height: 40, padding: '12px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <span >首检病历</span> */}
            <div>
              {/* <Button
                type={preview == previewEnum.singleView ? 'primary' : 'default'}
                onClick={handlePreview(previewEnum.singleView)}
              >
                单页预览
              </Button> */}
              {/* <Button
                type={preview == previewEnum.fullView ? 'primary' : 'default'}
                onClick={handlePreview(previewEnum.fullView)}
              >
                全部预览
              </Button> */}
            </div>
            <CloseOutlined
              style={{ fontSize: 22 }}
              onClick={handleClose}
            />
          </div>
          <div className="mian-content-details" style={{ overflowY: 'scroll' }}>
            <div className="details_show">{detailsShow()}</div>
          </div>
          <div className="mian-content-footer">
            <Button type="primary" disabled={isPrint} onClick={handlePrint} icon={<PrinterOutlined type="icon-print" />}>
              打印
            </Button>
          </div>
        </div>
      </div>
      <div className="prenatal-modal-container_bottom">{renderPrenatalItem()}</div>
      {showcanvas() && (
        <div style={{ display: 'none' }}>
          {get(props.system, 'config.curveVersion') === 'nichd' ? (
            <FetusCanvasNICHD ref={fetusRef} {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
          ) : (
            <FetusCanvas ref={fetusRef} {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
          )}
          <BmiCanvas ref={bmiRef} {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
          <Pregnogram ref={pregnogramRef} {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
        </div>
      )}

    </div>
  );
}
