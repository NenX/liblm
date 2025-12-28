import { Button, Layout, Menu } from 'antd';
import { debounce, get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import {
  BulbOutlined,
  DownOutlined,
  EyeOutlined,
  FileOutlined,
  InsertRowLeftOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { OkButton } from '@lm_fe/components_m';
import { mchcLogger, mchcRouterContainer__ } from '@lm_fe/env';
import { getSearchParamsAll } from '@lm_fe/utils';
import { mchcModal__ } from '../../modals';
import styles from './sider.module.less';
import { findIdsByChildId } from './utils';

export const collapsedWidth = 50;
export const width = 232;

interface IProps {
  collapsed: boolean;
  user?: any;
  tabs?: any;
  onToggle?: (value: boolean) => void;
  menuTree?: any[]
  location?: any
  history?: any
  updateTabs?: any
  allMenuTree?: any
}
function FakeIcon(props: { icon: string }) {
  return <span style={{ width: 24, height: 24, display: 'inline-block' }}>{props.icon}</span>
}

export default function Layout_Sider_Inner(props: IProps) {
  const [activeKey, setActiveKey] = useState('')
  const [openKeys, setOpenKeys] = useState<any[]>([])

  const { allMenuTree, location: { pathname }, } = props
  const { menuTree, collapsed, onToggle } = props;
  const { history, updateTabs, location } = props;

  const node = useRef(generateMenus(menuTree))

  useEffect(() => {

    node.current = generateMenus(menuTree)
    mchcLogger.log('generateMenus')
    return () => {

    }
  }, [menuTree])


  useEffect(() => {


    const ids = findIdsByChildId(allMenuTree, pathname);
    setOpenKeys(ids)
    setActiveKey(pathname)

    return () => {

    }
  }, [pathname])

  async function handleMenuClick({ item, key, keyPath }: any) {
    if (key && key.indexOf('http') !== -1) {
      window.open(key);
      return;
    }
    const menu = item.props['data-item'];
    updateTabs({
      title: get(menu, 'name'),
      key: get(menu, 'key'),
      path: get(menu, 'key'),
      search: get(location, 'search'),
      closable: true,
    });
    history.push(menu.key);
    setOpenKeys(keyPath)
    setActiveKey(key)
    // (document.getElementById(get(menu, 'key')) as HTMLElement).scrollIntoView();
  };

  /**
   * 生成菜单树
   *
   */
  function generateMenus(data: any[] = []) {
    return data.map((item) => {
      const { key, icon, parentid, name, type, children, active } = item;
      if (type !== 'menu' || active === false) {
        return;
      }
      // 有父级菜单的需要父级是活动状态才显示
      if (active !== false && children) {
        let customIcon = icon ? '1' : <MenuOutlined />;
        if (parentid !== 0) {
          customIcon = '2';
        }
        return (
          <Menu.SubMenu icon={<InsertRowLeftOutlined />} key={key} title={name}>
            {generateMenus(children)}
          </Menu.SubMenu>
        );
      }
      const C = mchcRouterContainer__.get_addon_component(key)

      return (
        <Menu.Item
          title={name}
          className={styles['menu-item']}
          id={key}
          key={key}
          data-item={item}
          icon={<FileOutlined />}
        >
          {
            C && <OkButton
              type='text'
              icon={<EyeOutlined style={{ color: '#999' }} />}
              className={styles['preview-btn']} style={{ float: 'right', marginTop: 4 }} size='small' onClick={async (e) => {
                e.stopPropagation()
                // const happy_conf = getHappyConfig(key)
                // mchcEnv.setGlobalCache('happy_conf', happy_conf || { usr1: 'unset' })

                mchcModal__.open('modal_page', {
                  modal_data: {
                    // content: <C />
                    route_conf: { url: key, params: getSearchParamsAll() }
                  },
                  // onClose() {
                  //   mchcEnv.setGlobalCache('happy_conf', null)
                  // }
                })
              }}></OkButton>
          }
          {name}

        </Menu.Item>
      );
    });
  };

  function handleOpenChange(keys: string[]) {
    setOpenKeys(keys)
  };

  const handleSync = debounce((ps) => {
    ps.update();
  }, 600)


  return (
    <Layout.Sider
      collapsible
      theme="light"
      breakpoint="lg"
      collapsed={collapsed}
      trigger={null}
      // width={width}
      collapsedWidth={collapsedWidth}
      className={styles['layout-sider']}
      onBreakpoint={__DEV__ ? undefined : onToggle}
    >
      <>

        <PerfectScrollbar
          //  className="custom-scrollbar"
          options={{ suppressScrollX: true }} onSync={handleSync}>
          <Menu
            theme="light"
            mode="inline"
            inlineIndent={18}
            expandIcon={({ isSubMenu, isOpen }) => {
              if (collapsed) {
                return <></>;
              }
              return isOpen ? (
                <DownOutlined style={{ fontSize: 12 }} />
              ) : (
                <RightOutlined style={{ fontSize: 12 }} />

              );
            }}
            selectedKeys={[activeKey]}
            openKeys={openKeys}
            onClick={handleMenuClick}
            onOpenChange={handleOpenChange}
          >
            {node.current}
          </Menu>
        </PerfectScrollbar>
        <footer
        // className="sider-footer"
        >
          <div
          //  className="sider-footer-toggle"
          >
            <Button
              type="text"
              size="large"
              icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={() => onToggle?.(!collapsed)}
            ></Button>
          </div>


        </footer>
      </>
    </Layout.Sider>
  );
}

