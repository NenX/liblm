import { mchcStore } from "src/state"

interface IDictionary {
  id: number
  module: string
  type: number
  key: string
  name: string
  note: string
  enumerations: IEnumeration[]
}
interface IEnumeration {
  id: number
  label: string
  note: string
  value: number
}
type Fuck_Dic = {
  [x: string]: IDictionary,
} & { initDictionaries: IDictionary[] }

export function getDictionaries() {
  const store = mchcStore.state
  const { dictionaries = {} } = store
  return dictionaries as Fuck_Dic
};

/**
 *
 * @param value 枚举值value
 * @param type string 字典类型
 */
export function getDictionariesEnumerations(type: string) {
  const dictionaries = getDictionaries()
  const object = dictionaries?.[type];
  if (!object) {
    console.warn(`字典 ${type} 不存在!!`);
    return []
  }
  const enumerations = object?.enumerations ?? [];
  return enumerations;
};

/**
 *
 * @param value 枚举值value
 * @param type string 字典类型
 */
export function getDictionaryLabel(type: string, value: string | number,) {
  const enumerations = getDictionariesEnumerations(type)

  const item = enumerations.find((_) => _.value === +value);
  if (!item) {
    return null;
  }
  return item.label;
};
/**
 *
 * @param label 枚举值value
 * @param type string 字典类型
 */
export function getDictionaryValue(type: string, label: string,) {
  const enumerations = getDictionariesEnumerations(type)

  const item = enumerations.find((_) => _.label === label);
  if (!item) {
    return null;
  }
  return item.value;
};
