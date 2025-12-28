/*
 * @Descripttion: 项目描述
 * @Author: cjl
 * @Date: 2021-11-08 15:48:41
 * @LastEditTime: 2021-12-03 19:25:47
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button, Input, message } from 'antd';
import './index.less';
import { get, map, isString, set, size, cloneDeep, forEach } from 'lodash';
import { filter } from '@antv/util';
import { itemIntersectByLine } from '@antv/g6/lib/util/math';
import requestMethods from '@/pages/prenatal-visit/pregnancy/doctor-end/further/methods/request';
import request from '@/lib/request';
interface IProps {
  headerInfo: any;
  diagnosesTemplate: any;
  handelProcess: Function; // 把漏诊提醒标为已经处置
  diagId: any;

  diagnosesList?: any[]
  page?: any
  saveHeaderInfo?(v: any): void
  setDiagnosesList?(v: any[]): void
  changeTolac?(v: boolean): void
  changeSyphilis?(v: boolean): void
  changeScreening?(v: boolean): void
  changePreeclampsia?(v: boolean): void

}
export default function AddDiagnoses({ handelProcess, diagId, diagnosesTemplate, saveHeaderInfo, ...props }: IProps) {

  const {
    headerInfo,
    diagnosesList = [],
    setDiagnosesList,
    changeSyphilis,
    changeScreening,
    changeTolac,
    page,
    changePreeclampsia,
  } = props;

  const timer: any = useRef();
  const [template, setTemplate] = useState(diagnosesTemplate); // 模板

  useEffect(() => {
    setTemplate(diagnosesTemplate);
  }, [diagnosesTemplate]);
  function findMaxSort() {
    let max: any = 0;
    map(diagnosesTemplate, (item) => {
      const sort = get(item, `sort`);
      if (sort > max) {
        max = sort;
      }
    });
    return max + 1;
  }

  function handleSure(item: any) {
    let postdata: any = {
      diagnosis: '',
      diagnosisCode: '',
      highrisk: false,
      note: '',
      sort: findMaxSort(),
      outEmrId: get(props.headerInfo, `id`),
      clear: true,
      // createDate: formatTimeToStandard(new Date()),
    };
    if (item) {
      if (!isString(item) && size(item.children) > 0) return;
      if (isString(item)) {
        // addDiag({ diagnosis: item });
        set(postdata, `diagnosis`, item);
      } else {
        // set(item, 'diagnosis', get(item, 'val'));
        // addDiag(omit(item, ['id']));
        set(postdata, 'diagnosis', get(item, 'val'));
        set(postdata, 'diagnosisCode', get(item, 'code')); //diagnosisCode
      }
      addDiag && addDiag(postdata);
    }
  }
  function handleChange(e: any) {
    if (timer.current) clearTimeout(timer.current);
    let value = e.target.value;
    console.log({ value });
    timer.current = setTimeout(() => {
      if (value == '') {
        setTemplate(diagnosesTemplate);
      } else {
        let newTemplate = filter(diagnosesTemplate, (item: any) => {
          let str = get(item, 'val');
          return str.search(value) != -1;
        });
        setTemplate(newTemplate);
      }
    }, 500);
  }

  async function addDiag(diagnosisObj: any) {
    function hasKeyword(val: string, arr: any[]) {
      let bool = false;
      forEach(arr, (item) => {
        if (
          (isString(item) && val.indexOf(item) !== -1) ||
          (!isString(item) && val.indexOf(item.hasWord) !== -1 && val.indexOf(item.withoutWord) === -1)
        ) {
          bool = true;
        }
      });
      return bool;
    }
    async function changeHeaderInfo() {
      const res = await request.get('/api/doctor/getOutpatientHeaderInfo?id=' + get(headerInfo, `id`));
      saveHeaderInfo?.(res);
    }

    const diag = get(diagnosisObj, 'diagnosis');
    if (diagnosesList.filter((item: any) => item.diagnosis === diag).length === 0) {
      const res = await requestMethods.newAddDiagnosis(diagnosisObj);
      message.success('添加成功！');
      handelProcess(diagId);
      const newList = cloneDeep(diagnosesList);
      const data = res || diagnosisObj;
      setDiagnosesList?.([...newList, data]);
      changeHeaderInfo();
      // setTimeout(() => {

      // }, 5 * 1000);

      /**诊断对应的专案管理弹窗*/
      if (diag === '瘢痕子宫' || diag === '疤痕子宫') {
        const currentGestationalWeek = parseInt(get(headerInfo, 'gesweek'));
        if (currentGestationalWeek >= 32) changeTolac?.(true);
      }
      const screeningArr = ['血栓', 'VTE', '梗', '静脉曲张'];
      if (hasKeyword(diag, screeningArr) || diag === '妊娠子痫前期' || diag === '多胎妊娠') {
        changeScreening?.(true);
      }
      if (diag.indexOf('梅毒') > -1) changeSyphilis?.(true);
      const preeclampsiaArr = [
        '双胎',
        '多胎',
        '胎妊娠',
        '慢性高血压',
        '型糖尿病',
        { hasWord: '尿毒症', withoutWord: '胎' },
        { hasWord: '肾炎', withoutWord: '胎' },
        { hasWord: '肾衰竭', withoutWord: '胎' },
        { hasWord: '肾病', withoutWord: '胎' },
        { hasWord: '肾积水', withoutWord: '胎' },
        { hasWord: '肾盂积水', withoutWord: '胎' },
        { hasWord: '肾小管', withoutWord: '胎' },
        { hasWord: '肾硬化', withoutWord: '胎' },
        '红斑狼疮',
        '抗磷脂综合征',
      ];
      if (page === 'return' && hasKeyword(diag, preeclampsiaArr)) {
        changePreeclampsia?.(true);
      }
    } else {
      message.warning('添加诊断重复！');
    }
  }
  return (
    <div className="diagnones-container">
      <Input
        className="diag-ipt"
        placeholder="请输入筛选过滤诊断信息"
        // enterButton="查询"
        //   defaultValue={diagnosesWord}
        onChange={handleChange}
      //   onSearch={this.handleSearch}
      />
      <div className="diagnoses-content">
        {map(template, (item, index) => {
          return (
            <p className="diag-tiem">
              <span onClick={() => handleSure(item)}>
                {get(item, 'code') ? '（icd）' : null}
                {get(item, 'val')}
              </span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
