import style from './App.module.scss';
import { RowBetween, RowCenter, RowStart } from './Flex';
import logo from '../../assets/icon.svg';
import { Button, Typography, Space, Dropdown, Menu } from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  ClearOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Content } from './Content';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { saveMenus, SaveType, state } from './state';

export const App = observer(() => {
  return (
    <div className={style.container}>
      {/* 头部 */}
      <RowBetween className={style.header}>
        {/* logo */}
        <Space>
          <RowStart className={style.logo}>
            <img alt="" src={logo} />
            <Typography.Title level={5}>
              免费且强大的图片压缩工具
            </Typography.Title>
          </RowStart>
        </Space>

        {/* 退出逻辑 */}
        <Space className={clsx(style.action, style.noDrag)}>
          <RowCenter
            className={style.mini}
            onClick={() => {
              window.TxxCompressApp.minimizeApp();
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19,13H5V11H19V13Z" />
            </svg>
          </RowCenter>
          <RowCenter
            className={style.close}
            onClick={() => {
              window.TxxCompressApp.closeApp();
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </RowCenter>
        </Space>
      </RowBetween>

      {/* 内容区 */}
      <div className={style.content}>
        <Content />
      </div>

      {/* 底部 */}
      <RowBetween className={style.footer}>
        {/* 信息展示 */}
        <Typography.Text type="secondary">
          共<Typography.Text type="warning">21</Typography.Text>
          张图片，压缩前<Typography.Text type="warning">3.2M</Typography.Text>
          ，压缩后<Typography.Text type="warning">1.2M</Typography.Text>，压缩率
          <Typography.Text type="warning">75%</Typography.Text>
        </Typography.Text>

        {/* 操作按钮 */}
        <Space className={style.noDrag}>
          <Button icon={<ClearOutlined />}>清空列表</Button>
          <Button icon={<SettingOutlined />}>压缩选项</Button>
          <Dropdown.Button
            type="primary"
            icon={<SaveOutlined />}
            overlay={
              <Menu
                onClick={({ key }) => {
                  state.saveType = key as SaveType;
                }}
              >
                {saveMenus.map((menu) => {
                  return <Menu.Item key={menu.value}>{menu.name}</Menu.Item>;
                })}
              </Menu>
            }
          >
            {saveMenus.find((menu) => menu.value === state.saveType)?.name}
          </Dropdown.Button>
          <Button type="primary" icon={<PlusOutlined />}>
            添加图片
          </Button>
        </Space>
      </RowBetween>
    </div>
  );
});
