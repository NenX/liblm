import { mchcConfig } from '@lm_fe/env';
import { IMchc_Doctor_BuildExamTimeAxis, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { Empty, Timeline } from 'antd';
import classnames from 'classnames';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
interface IProps {
    pregnancyId: TIdTypeCompatible
}
type TGroup = IMchc_Doctor_BuildExamTimeAxis['groups'][0]
export default function GestationalWeekProjectTree(props: IProps) {
    if (mchcConfig.get('医生端_检验检查时间轴隐藏'))
        return <Empty />
    const { pregnancyId } = props

    const [itemData, setItemData] = useState<IMchc_Doctor_BuildExamTimeAxis[]>([]);
    const [showAbnormal, setShowAbnormal] = useState(false);
    const [showCenter, setShowCenter] = useState(false);

    useEffect(() => {
        pregnancyId && getItemData();
    }, [pregnancyId]);

    const getItemData = async () => {
        const itemData = await SMchc_Doctor.buildExamTimeAxisByType(pregnancyId, 0);
        setItemData(itemData);
    };

    const handleClickAbnormal = async () => {
        setShowAbnormal(!showAbnormal);
        if (!showAbnormal) {
            const itemData = await SMchc_Doctor.buildExamTimeAxisByType(pregnancyId, 2);
            setItemData(itemData);
        } else {
            const itemData = await SMchc_Doctor.buildExamTimeAxisByType(pregnancyId, 0);
            setItemData(itemData);
        }
    };

    const handleClickCenter = () => {
        // setShowCenter(!showCenter);
        setShowCenter(true);
        setTimeout(() => {
            setShowCenter(false);
        }, 500);
    };

    // 获取正常报告名称reportTitle，用'、'拼起来
    const reportsNormal = (group: TGroup) => {
        const reportsNormalItems = group.reports.filter(

            (report, reportIndex) => !report.itemInfosAbnormal,
        );
        const getReportTitles = reportsNormalItems.map((report, reportIndex) => report.reportTitle);
        return getReportTitles.join('、');
    };

    // 获取异常报告名称reportTitle，用'、'拼起来，指标用空格分隔
    const reportsAbnormal = (group: TGroup) => {
        const reportsAbnormalItems = group.reports.filter((report, reportIndex) =>
            report.itemInfosAbnormal,
        );
        const getReportDatas = reportsAbnormalItems.map((report, reportIndex) => {
            const reportTitle = report.reportTitle + ':';
            const reportAbnormalitemInfos = report.itemInfos.filter(
                (itemInfo, itemInfoIndex) => itemInfo.abnormal == '2',
            );
            const descriptions = reportAbnormalitemInfos.map((itemInfo, itemInfoIndex) => itemInfo.description);
            return reportTitle + ' ' + descriptions.join('\xa0\xa0');
        });
        return getReportDatas.join('、');
    };

    return (
        <div className={styles["gestational-week-project-tree"]}>
            <div className={styles["gestational-week-project-tree-btns"]}>
                <a
                    className={classnames(styles['center-button'], {
                        [styles['background-grey']]: !showCenter,
                        [styles['background-blue']]: showCenter,
                    })}
                    onClick={handleClickCenter}
                    href="#current"
                >
                    <svg
                        t="1651803967667"
                        className="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="8411"
                        width="18"
                        height="18"
                    >
                        <path
                            d="M513.024 65.536q93.184 0 175.616 35.84t143.872 97.28 97.28 143.872 35.84 175.616q0 94.208-35.84 176.64t-97.28 143.872-143.872 97.28-175.616 35.84q-94.208 0-176.64-35.84t-143.872-97.28-97.28-143.872-35.84-176.64q0-93.184 35.84-175.616t97.28-143.872 143.872-97.28 176.64-35.84zM513.024 909.312q80.896 0 152.064-30.72t124.416-83.968 83.968-124.416 30.72-152.064-30.72-152.064-83.968-124.416-124.416-83.968-152.064-30.72q-81.92 0-153.088 30.72t-124.416 83.968-83.968 124.416-30.72 152.064 30.72 152.064 83.968 124.416 124.416 83.968 153.088 30.72zM513.024 190.464q66.56 0 124.928 25.088t102.4 69.12 69.12 102.4 25.088 124.928-25.088 125.44-69.12 102.912-102.4 69.12-124.928 25.088-125.44-25.088-102.912-69.12-69.12-102.912-25.088-125.44 25.088-124.928 69.12-102.4 102.912-69.12 125.44-25.088z"
                            p-id="8412"
                            fill={showCenter ? '#fff' : '#A9A9A9'}
                        ></path>
                    </svg>
                </a>
                <span
                    className={classnames({
                        [styles['background-grey']]: !showAbnormal,
                        [styles['color-grey']]: !showAbnormal,
                        [styles['background-blue']]: showAbnormal,
                        [styles['color-white']]: showAbnormal,
                    })}
                    onClick={handleClickAbnormal}
                >
                    异
                </span>
            </div>
            <Timeline mode="left">
                {map(itemData, (item, itemIndex) => (
                    <Timeline.Item
                        className={classnames({
                            [styles['arrived-current']]: item.inCurrentGestationalWeek,
                        })}
                        key={itemIndex}
                        color={item.arrived ? '#007AFF' : '#f0f0f0'}
                        label={`${item.gestationalWeekStart}-${item.gestationalWeekEnd}周`}
                    >
                        <div id={item.inCurrentGestationalWeek ? 'current' : ''}>
                            {!!item.lackReports.length ? (
                                item.arrived ? (
                                    <div className={styles["color-orange"]}>
                                        <span>未见报告：</span>
                                        <span className={styles["make-bold"]}> {item.lackReports.join('、')}</span>
                                    </div>
                                ) : (
                                    <div className={styles["color-grey"]}>
                                        <span>未见报告：</span>
                                        <span className={styles["make-bold"]}> {item.lackReports.join('、')}</span>
                                    </div>
                                )
                            ) : (
                                '无必查'
                            )}

                            {!!item.groups.length
                                ? item.groups.map((group, groupIndex) => {
                                    return (
                                        <div className={styles["detail-item"]} key={groupIndex}>
                                            <span className={styles["detail-item-date"]}>{group.groupDate}</span>

                                            <div>
                                                {reportsNormal(group) && (
                                                    <div className={styles["detail-item-reports-normal"]}>{reportsNormal(group)}</div>
                                                )}
                                                {reportsAbnormal(group) && (
                                                    <div
                                                        className={styles["detail-item-reports-abnormal"]}
                                                        style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
                                                    >
                                                        {reportsAbnormal(group)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                                : null}
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </div>
    );
}
