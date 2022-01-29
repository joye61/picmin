import style from './App.module.scss';
import { ColBetween, RowBetween, RowStart } from './Flex';
import logo from '../../assets/icon.svg';
import { Button, Typography, Space } from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  ClearOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Content } from './Content';

export function App() {
  return (
    <ColBetween className={style.container}>
      {/* 头部 */}
      <RowBetween className={style.header}>
        {/* logo */}
        <Space>
          <RowStart className={style.logo}>
            <img alt="" src={logo} />
            <Typography.Title level={5}>免费且强大的图片压缩工具</Typography.Title>
          </RowStart>
        </Space>

        {/* 退出逻辑 */}
        <Space>
          <Typography.Link>最小化</Typography.Link>
          <Typography.Link>退出</Typography.Link>
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
        <Space>
          <Button icon={<ClearOutlined />}>清空列表</Button>
          <Button icon={<SettingOutlined />}>压缩选项</Button>
          <Button type="primary" icon={<SaveOutlined />}>
            打包下载
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            添加图片
          </Button>
        </Space>
      </RowBetween>
    </ColBetween>
  );
}
