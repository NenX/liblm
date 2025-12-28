
interface IEnumeration {
  id: number
  label: string
  note: string
  value: number
}

/**
 *
 * @param value 枚举值value
 * @param type string 字典类型
 */
export function getDictionariesEnumerations(type: string) {
  const store = window._store?.getState() || {}
  const { dictionaries } = store
  const object = dictionaries[type];
  if (!object) {
    console.warn(`字典${type}不存在!`);
    return []
  }
  const enumerations = object?.enumerations || [];
  return enumerations as IEnumeration[];
};