// 角色选择
import { ICommonOption, mchcLogger } from '@lm_fe/env'
import { IMchc_Group } from '@lm_fe/service'
import { PartialAll, request, safe_json_parse_arr } from '@lm_fe/utils'
import React, { useEffect, useState } from 'react'
import MyCheckbox from '../../../GeneralComponents/CheckboxWithInput_gold'

type IFuck_Group = (PartialAll<IMchc_Group> & { groupRankList: PartialAll<IMchc_Group['groupRanks']> })


interface IRolesPickerProps {
    value: IFuck_Group[] //  ICommonOption[]
    onChange?(v: IFuck_Group[]): void
}
let cache: IMchc_Group[]
export function RolesPicker(props: IRolesPickerProps) {
    mchcLogger.log('RolesPicker', { props })
    const { onChange, value = [] } = props
    const [groups, setGroups] = useState<IMchc_Group[]>(cache ?? [])
    useEffect(() => {
        cache || request.get<IMchc_Group[]>('/api/groups')
            .then(r => {
                setGroups(cache = r.data);
            })

        return () => {

        }
    }, [])

    return <MyCheckbox vertical value={value.map(g => ({ value: g.id, text: g.groupRankList?.map?.(r => ({ value: r.id })) }))} marshal={2} type='multiple'
        options={groups.map(g => {
            const groupRanks = (g.groupRanks ?? [])
            const sub_options = groupRanks.length > 0 ? groupRanks.map(r => ({ value: r.id, label: r.name })) : []
            return ({ value: g.id, label: g.nickname, parentheses: !!sub_options.length, inputType: 'MC', props: { options: sub_options, type: 'multiple', marshal: 2 } })
        })}
        onChange={(v?: any) => {
            const arr: ICommonOption[] = v ?? []
            onChange?.(arr.map(o => {
                return { id: o.value, groupRankList: safe_json_parse_arr(o.text).map((sub_o: ICommonOption) => ({ id: sub_o.value })) }
            }))
        }}
    />
}