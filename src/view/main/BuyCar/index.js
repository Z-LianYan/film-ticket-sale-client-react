import React, { Component } from "react";
import "./index.less";

class BuyCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sousuoStyle: false,
    };
  }

  render() {
    return <div className="app-buycar">app-buycar</div>;
  }
}

export default BuyCar;
