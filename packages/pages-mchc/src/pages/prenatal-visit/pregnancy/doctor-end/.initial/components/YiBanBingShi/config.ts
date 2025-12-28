import { get_check_invert_values } from "@lm_fe/components_m";

import { IMchc_FormDescriptions_Field_Nullable } from '@lm_fe/service';
// import { 既往史_pack } from '../../../../nurse-end/archival-information/form/既往史';
// import { 既往史_pack_建瓯 } from "../../../../../../prenatal-visit/pregnancy/nurse-end/archival-information/form_new/建瓯";
import { mchcEnv } from "@lm_fe/env";

async function check_config() {
  if (mchcEnv.is('建瓯')) {
    let 既往史_pack_建瓯 = (await import('../../../../../../prenatal-visit/pregnancy/nurse-end/archival-information/form_new/建瓯')).既往史_pack_建瓯
    return 既往史_pack_建瓯(true, true)
  }
  let 既往史_pack = (await import('../../../../nurse-end/archival-information/form/既往史')).既往史_pack
  return 既往史_pack(true, true)
}

async function getConfig() {
  const config: IMchc_FormDescriptions_Field_Nullable[] = [
    // { name: '', key: '', label: '疾病史', header_label: true, just_header: true, inputType: '' },
    { name: 'id', form_hidden: true },
    ...await check_config(),

    {
      "key": "既往史一键勾选",
      "label": "一键勾选",
      "inputType": "check_invert_button",
      inputPropsFn() {
        return {
          check_invert_values: {
            ...get_check_invert_values(config),
          }
        }
      },
      layout: '1/3',
    },
  ];
  return config
}

export default getConfig;
