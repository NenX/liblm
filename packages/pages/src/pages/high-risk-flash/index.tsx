import { isEmpty, isNil, request, size } from '@lm_fe/utils';
import { get, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import './index.less';
import { TIdTypeCompatible } from '@lm_fe/service';
import { Empty } from 'antd';
interface Iprops {
    id: TIdTypeCompatible;
}
/**高危快讯弹窗模块 */
export function HighRiskFlash({ id, ...prps }: Iprops) {
    const [highriskData, setHighriskData] = useState(null);
    useEffect(() => {
        async function initData() {
            if (!id) return;
            const data = await request.get('/api/doctor/getRiskNewsFlash?id=' + id);
            setHighriskData(data.data);
        }
        initData();
    }, [id]);

    if (isNil(highriskData) || isEmpty(highriskData))

        return <Empty style={{ padding: 24 }} />


    return (
        <div>
            {map(highriskData, (item, index) => {
                return (
                    <div className="mian-content">
                        <div className="col-name">{get(item, `colName`)}</div>
                        <div className="news-content">
                            {map(get(item, `news`), (newsItem, ind) => {
                                return (
                                    <div className="item-content">
                                        <div className="item-title">{get(newsItem, `title`)}</div>
                                        <div className="data-content">
                                            {map(get(newsItem, `contents`), (contentsItem, i) => {
                                                return (
                                                    <div className="item-event">
                                                        <span className="event">{get(contentsItem, `event`)}</span>
                                                        {get(contentsItem, `date`) && <span className="date">({get(contentsItem, `date`)})</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
