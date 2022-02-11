import "./index.less";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { configure } from "mobx";
import { getSysPath } from "./util";
import { __g } from "./state";

(async () => {
  // 配置mobx
  configure({
    enforceActions: "never",
    useProxies: "always",
  });

  // 读取系统目录
  const tempPath = await getSysPath();
  const appPath = await getSysPath("app");
  __g.tempPath = tempPath;
  __g.appPath = appPath;

  // 渲染界面
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>,
    document.getElementById("root")
  );
})();
