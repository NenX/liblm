import { SMchc_TemplateTrees } from "@lm_fe/service";
import { ITemplateType } from "./types";
import { MODAL_TEMPLATE_TYPES_个人模板 } from "@lm_fe/env";

export const DEFAULT_URL = '/api/template-trees';

export const needUserIDTypes = [2];


export const baseType: Partial<ITemplateType> = {
  getList({ item, user, pregnacy }) {
    const { depid, type } = item
    const userid = type === MODAL_TEMPLATE_TYPES_个人模板 ? (user?.id ?? undefined) : undefined
    return SMchc_TemplateTrees.getList({
      params: {
        'depid.equals': depid,
        'type.equals': type,
        'userid.equals': userid,
        size: 99999,
        page: 0,
      }
    })
  },
  async postItem({ item, user, pregnacy }) {
    const userid = item.type === MODAL_TEMPLATE_TYPES_个人模板 ? (user?.id ?? undefined) : undefined
    await SMchc_TemplateTrees.post({ ...item, userid })
  },
  async delItem({ item, user, pregnacy }) {
    await SMchc_TemplateTrees.del(item.id)
  },
  async putItem({ item, user, pregnacy }) {
    const userid = item.type === MODAL_TEMPLATE_TYPES_个人模板 ? (user?.id ?? undefined) : undefined
    await SMchc_TemplateTrees.put({ ...item, userid })
  },
}
