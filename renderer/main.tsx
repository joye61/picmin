import "./index.scss";
import ReactDOM from "react-dom";
import { configure } from "mobx";
import { App } from "@/components/App";

(async () => {
  configure({ enforceActions: "never" });
  ReactDOM.render(<App />, document.getElementById("root"));
})();
