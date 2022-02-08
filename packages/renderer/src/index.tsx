import './index.less';
import { render } from 'react-dom';
import { App } from './App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { configure } from 'mobx';
import React from 'react';

configure({
  enforceActions: 'never',
  useProxies: 'ifavailable',
});

render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);