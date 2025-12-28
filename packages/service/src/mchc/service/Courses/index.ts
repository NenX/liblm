import { request } from "@lm_fe/utils"
import { TIdTypeCompatible } from "src/types"
import { ModelService } from "../../../ModelService"

export interface IMchc_Courses_Item {
    "createdBy": "admin",
    "createdDate": "2025-02-18 11:28:58",
    "lastModifiedBy": "admin",
    "lastModifiedDate": "2025-02-18 11:28:58",
    "remark": null,
    "id": 12,
    "name": "标题",
    "intro": "简述",
    "poster": null,
    "teacher": "主讲人",
    "position": "主讲人职位",
    "editor": null,
    "courseDate": "2025-02-23",
    "period": "11:28 - 11:34",
    "limitNum": 99,
    "reserveNum": 0,
    "signinNum": null,
    "location": "地点",
    "fee": 11.0,
    "status": true,
    "deleteFlag": false
}
export interface IMchc_Courses_Reserve {
    "type": null,
    "pregnancyId": null,
    "courseId": 11,
    "companionNum": null,
    "name": null,
    "outpatientNO": null,
    "mobile": null,
    "reserveTime": null,
    "courseName": "tee1",
    "courseIntro": "ee",
    "coursePoster": "ee",
    "courseTeacher": "ee",
    "courseTeacherPosition": "ee",
    "courseTime": "2025-02-20 04:00 - 08:00",
    "courseLocation": "444",
    "courseReserveNum": 66,
    "reserveStatus": 2,
    "fee": 66.0

}



export const SMchc_Courses = new
    (class extends ModelService<IMchc_Courses_Item> {
        // 我的课程列表
        async my_courses_list(
            pregnancyId: number,
            type: '全部' | '我的',
            courseType: '孕妇学校' | '助产士',
            release: '已发布' | '未发布',
            sort: '创建时间降序' | '开课时间升序' | '开课时间降序' = '开课时间升序'
        ) {
            const res = await request.get<IMchc_Courses_Reserve[]>('/api/reservable-courses', {
                params: {
                    pregnancyId,
                    'release.equals': release === '已发布',
                    'type.equals': type === '我的' ? 1 : 2,
                    'courseType.equals': courseType === '孕妇学校' ? 1 : 2,
                    sort: sort === '创建时间降序'
                        ? 'createdDate,period,desc'
                        : sort === '开课时间升序'
                            ? 'courseDate,period,asc'
                            : 'courseDate,period,desc'
                }
            })


            return res.data
        }
        // 预约
        async reserve(params: { pregnancyId: number, courseId: number, companionNum: number, reserveDate?: string, reserveTime?: string, name?: string, mobile?: string }) {
            const res = await request.get('/api/courses/reserve', {
                params
            })


            return res.data
        }
        // 预约取消
        async cancel_reserve(pregnancyId: number, courseId: number,) {
            const res = await request.get('/api/courses/cancel-reservation', {
                params: {
                    pregnancyId,
                    courseId,
                }
            })
            return res.data
        }
        // 签到
        async sign(courseId: TIdTypeCompatible, id: TIdTypeCompatible) {
            const res = await request.get('/api/courses/sign', {
                params: {
                    id,
                    courseId,
                }
            })
            return res.data
        }
        // 取消签到
        async cancel_sign(courseId: TIdTypeCompatible, id: TIdTypeCompatible) {
            const res = await request.get('/api/courses/cancel/sign', {
                params: {
                    id,
                    courseId,
                }
            })
            return res.data
        }

    })
    ({
        n: '/courses',
    })
