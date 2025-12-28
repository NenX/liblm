import { cache_fetch, expect_array, request, sleep } from "@lm_fe/utils"


export interface IMchc_AddressItemType {
    "fatherCode": 310000000000,
    "fatherName": "上海市",
    "code": 310000000000,
    "name": "上海市",
    "downFlag": number,
    "downAddress": null

    label: string
    value: string
    isLeaf: boolean
    loading: boolean
    children: IMchc_AddressItemType[]
}
// let firstAddrCache: IMchc_AddressItemType[]
// let firstAddrCachePromise: Promise<IMchc_AddressItemType[]>
// let firstPcdAddrCache: IMchc_AddressItemType[]
// let firstPcdAddrCachePromise: Promise<IMchc_AddressItemType[]>

export const SMchc_Address = {


    async getAddressList(item?: IMchc_AddressItemType) {
        const res = await request.get<IMchc_AddressItemType[]>('/api/address/getAddressByCode', { params: { code: item?.code, downFlag: item?.downFlag }, unboxing: true })
        return expect_array(res.data)
    },
    async getAddressByDetail(addressDetail?: string) {
        try {
            await sleep(1)
            const res = await request.get<IMchc_AddressItemType[]>('/api/address/getAddressByDetail', { params: { addressDetail }, unboxing: true })
            return expect_array(res.data)
        } catch (error) {
            return []
        }
    },
    async getAddressFront() {
        return request.get<IMchc_AddressItemType[]>(`/api/address/front/getAddress`, { params: {}, unboxing: true })
            .then(res => expect_array(res.data))
    },
    async getAddressBack(item?: IMchc_AddressItemType, addressDetail?: string) {
        return request.get<IMchc_AddressItemType[]>(`/api/address/back/getAddress`, { params: { code: item?.code, addressDetail }, unboxing: true })
            .then(res => expect_array(res.data))
    },
    // async getAddressFirst() {
    //     if (firstPcdAddrCache) return firstPcdAddrCache
    //     if (firstPcdAddrCachePromise) return firstPcdAddrCachePromise
    //     firstPcdAddrCachePromise = SMchc_Address.getAddressFront().then(r => firstPcdAddrCache = expect_array(r))
    //     return firstPcdAddrCachePromise
    // },
    // async getAddressListFirst() {
    //     if (firstAddrCache) return firstAddrCache
    //     if (firstAddrCachePromise) return firstAddrCachePromise
    //     firstAddrCachePromise = SMchc_Address.getAddressList().then(r => firstAddrCache = expect_array(r))
    //     return firstAddrCachePromise
    // }
    async getAddressFirst() {
        try {
            await sleep(1)
            const res = await cache_fetch('getAddressFirst', () => SMchc_Address.getAddressFront());
            return expect_array(res)
        } catch (error) {
            return []
        }
    },
    async getAddressListFirst() {

        try {
            await sleep(1)
            const res = await cache_fetch('getAddressListFirst', () => SMchc_Address.getAddressList());
            return expect_array(res)
        } catch (error) {
            return []
        }

    }


}

