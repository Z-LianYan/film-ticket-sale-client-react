import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter as Router } from "react-router-dom";
import "antd-mobile/es/global"; // ant-mobile 按需加载样式

//rem
// import "./modules/rem.js";

import "./stylesheets/main.scss";

import { Provider } from "react-redux";
import store from "./store";

// import { createBrowserHistory, createHashHistory } from "history"; //组件外部能操作路由跳转
// let history = createBrowserHistory();
import { history } from "@/router/history";

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
