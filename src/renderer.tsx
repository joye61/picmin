import "./index.less";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import { configure } from "mobx";
import { getAppPath, getBinPath, getNodeModulesPath } from "./renderer/util";
import { __g } from "./renderer/g";
import { getTempPath } from "./utils/temp";

(async () => {
  // 配置mobx
  configure({
    enforceActions: "never",
    useProxies: "always",
  });

  // 预读取系统目录
  __g.tempPath = getTempPath();
  __g.appPath = await getAppPath();
  __g.nodeModulesPath = await getNodeModulesPath();
  __g.binPath = await getBinPath();

  // 渲染界面
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>,
    document.getElementById("root")
  );
})();
