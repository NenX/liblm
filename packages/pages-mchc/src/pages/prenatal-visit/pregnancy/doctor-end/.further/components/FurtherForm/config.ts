import { isEmpty, keyBy, values, set, get, cloneDeep } from 'lodash';
import { IMchc_Doctor_Diagnoses } from '@lm_fe/service';
import { safe_json_parse } from '@lm_fe/utils';
import { FormConfig } from '@lm_fe/components_m';
import { otherOptions } from '@lm_fe/env';
interface IPreDiagKeyword { diagKeyword: string[], }
/*关联表单关键词*/
export const diag_filter_map: { [x: string]: IPreDiagKeyword } = {
  diabetes: {
    diagKeyword: ['糖尿病', 'GDM', 'gdm'], //   诊断关键词

  },
  ultrasounds: {
    diagKeyword: ['双胎', '三胎', '多胎', '胎妊娠', '胎儿发育迟缓', '胎儿生长缓慢', '胎儿生长发育迟缓'],
  },
  hypertension: {
    diagKeyword: ['高血压', '子痫', '肾炎', '肾脏', '肾病', '红斑狼疮', '免疫系统疾病', 'SLE', 'sle', '风湿性关节炎', '类风湿性关节炎', '硬皮病',],

  },
  coronary: {
    diagKeyword: ['心脏', '心肌', '心包', '心血管', '血管', '冠心病', '心力衰竭'],
  },
  ICP: {
    diagKeyword: ['ICP', 'icp', '肝内胆汁淤积'],
  },
  hypothyroidism: {
    diagKeyword: ['甲减', '甲状腺机能减退', '甲状腺功能减退'],
  },
  fetalGrowth: {
    diagKeyword: ['胎儿发育迟缓', '胎儿生长缓慢', '胎儿生长发育迟缓'],
  },
};

export const checkAssociatedForm = (list: IMchc_Doctor_Diagnoses<"mchc">[] = [], searchObj?: IPreDiagKeyword) => {
  if (!searchObj?.diagKeyword) return false
  let diagItem = list
    ?.filter(l => l.diagnosis)
    ?.map(l => l.diagnosis) ?? [];

  // let searchObj = diag_search_param[type];

  const is_coronary = searchObj.diagKeyword.includes('心脏')
  const refreshFrom = () => {
    let is_hidden = true;

    for (let user_diag of diagItem) {
      for (let pre_diag of searchObj['diagKeyword']) {


        if (user_diag.includes(pre_diag)) {

          if (!is_coronary) {
            return false
          }
          if (is_coronary && user_diag.includes('胎')) {

            return false
          }
        }
      }

    }




    return is_hidden;
  };

  return refreshFrom();
};



export const getDynamicFormConfig = (config: any, list: IMchc_Doctor_Diagnoses<"mchc">[]) => {
  const cloneConfig = cloneDeep(config);
  if (isEmpty(cloneConfig)) return [];
  const configObj = keyBy(cloneConfig, 'key');

  /* 设置动态表单 胎儿超声表单 */
  if (get(configObj, ['childUltrasounds'])) {
    set(configObj, ['childUltrasounds', 'hidden'], checkAssociatedForm(list, diag_filter_map.ultrasounds));

    if (checkAssociatedForm(list, diag_filter_map.fetalGrowth)) {
      const inputProps = safe_json_parse(get(configObj, ['childUltrasounds', 'inputProps']));
      set(inputProps, 'config.1.hidden', true);
      set(configObj, ['childUltrasounds', 'inputProps'], inputProps);
    }
  }
  /* 妊娠糖尿病表单 */
  if (get(configObj, ['gdm.fbg'])) {
    set(configObj, ['gdm.fbg', 'hidden'], checkAssociatedForm(list, diag_filter_map.diabetes));
  }
  if (get(configObj, ['gdm.pbg2'])) {
    set(configObj, ['gdm.pbg2', 'hidden'], checkAssociatedForm(list, diag_filter_map.diabetes));
  }
  if (get(configObj, ['gdm.hbalc'])) {
    set(configObj, ['gdm.hbalc', 'hidden'], checkAssociatedForm(list, diag_filter_map.diabetes));
  }
  if (get(configObj, ['gdm.inslname'])) {
    set(configObj, ['gdm.inslname', 'hidden'], checkAssociatedForm(list, diag_filter_map.diabetes));
  }
  /* 妊娠高血压表单 */
  if (get(configObj, ['pih.quality'])) {
    set(configObj, ['pih.quality', 'hidden'], checkAssociatedForm(list, diag_filter_map.hypertension));
  }
  if (get(configObj, ['pih.quantity'])) {
    set(configObj, ['pih.quantity', 'hidden'], checkAssociatedForm(list, diag_filter_map.hypertension));
  }
  if (get(configObj, ['pih.medication'])) {
    set(configObj, ['pih.medication', 'hidden'], checkAssociatedForm(list, diag_filter_map.hypertension));
  }
  /* 心脏病表单 */
  if (get(configObj, ['cardiacDisease.heartrate'])) {
    set(configObj, ['cardiacDisease.heartrate', 'hidden'], checkAssociatedForm(list, diag_filter_map.coronary));
  }
  if (get(configObj, ['cardiacDisease.medication'])) {
    set(configObj, ['cardiacDisease.medication', 'hidden'], checkAssociatedForm(list, diag_filter_map.coronary));
  }
  /* ICP表单 */
  if (get(configObj, ['icp.tba'])) {
    set(configObj, ['icp.tba', 'hidden'], checkAssociatedForm(list, diag_filter_map.ICP));
  }
  if (get(configObj, ['icp.alt'])) {
    set(configObj, ['icp.alt', 'hidden'], checkAssociatedForm(list, diag_filter_map.ICP));
  }
  if (get(configObj, ['icp.ast'])) {
    set(configObj, ['icp.ast', 'hidden'], checkAssociatedForm(list, diag_filter_map.ICP));
  }
  /* 甲减表单 */
  if (get(configObj, ['hypothyroidism.tsh'])) {
    set(configObj, ['hypothyroidism.tsh', 'hidden'], checkAssociatedForm(list, diag_filter_map.hypothyroidism));
  }
  if (get(configObj, ['hypothyroidism.t4'])) {
    set(configObj, ['hypothyroidism.t4', 'hidden'], checkAssociatedForm(list, diag_filter_map.hypothyroidism));
  }

  return values(configObj);
};

