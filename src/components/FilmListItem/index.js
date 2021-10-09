import React, { Component } from "react";
import "./index.scss";

// import { NavLink } from "react-router-dom";

class FilmListItem extends Component {
  
  render() {
    return <div className="film-list-item">
        <img src="https://pic.maizuo.com/usr/movie/602506deba12aa489ffc30184dca1b08.jpg?x-oss-process=image/quality,Q_70"/>
      </div>;
  }

}
export default FilmListItem;
