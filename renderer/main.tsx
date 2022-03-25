import "./index.scss";
import ReactDOM from "react-dom";
import { configure } from "mobx";
import { App } from "@/components/App";
import { __g } from "./state";
import { getAppIsPacked, getCachePath, getSysPath } from "./utils";

(async () => {
  configure({ enforceActions: "never" });
  __g.appPath = await getSysPath();
  __g.cachePath = await getCachePath();
  __g.isPacked = await getAppIsPacked();
  ReactDOM.render(<App />, document.getElementById("root"));
})();
