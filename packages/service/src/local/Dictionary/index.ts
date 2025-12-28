import { mchcStore, mchcUtils } from "@lm_fe/env"
import { IMchc_Dictionaries } from "../../mchc"





export type ILocal_Dic = {
  [x: string]: IMchc_Dictionaries,
} & { initDictionaries: IMchc_Dictionaries[] }



export const SLocal_Dictionary = {
  getDictionaries() {
    const store = mchcStore.state
    const { dictionaries = {} } = store
    return dictionaries as ILocal_Dic
  },

  /**
   *
   * @param value 枚举值value
   * @param type string 字典类型
   */
  getDictionariesEnumerations(type: string) {
    const dictionaries = this.getDictionaries()
    dictionaries
    const object = dictionaries?.[type];
    if (!object) {
      console.warn(`字典${type}不存在!`);
      return []
    }
    const enumerations = object?.enumerations ?? [];
    return enumerations;
  },

  /**
   *
   * @param value 枚举值value
   * @param type string 字典类型
   */
  getDictionaryLabel(type: string, value: string | number,) {
    const enumerations = this.getDictionariesEnumerations(type)

    const item = enumerations.find((_) => _.value === +value);
    if (!item) {
      return null;
    }
    return item.label;
  },
  /**
   *
   * @param label 枚举值value
   * @param type string 字典类型
   */
  getDictionaryValue(type: string, label: string,) {
    const enumerations = this.getDictionariesEnumerations(type)

    const item = enumerations.find((_) => _.label === label);
    if (!item) {
      return null;
    }
    return item.value;
  },

}