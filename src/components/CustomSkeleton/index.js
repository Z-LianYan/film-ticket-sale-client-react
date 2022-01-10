import React, { Component } from "react";
import "./index.scss";
class CustomSkeleton extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  }
  static defaultProps = {
    row:5,
    section:1,
  }
  render() {
    let { row,section } = this.props;
    let rows = [];
    let sections = [];
    for(let i=0;i<row;i++){
      rows.push(i);
    }
    for(let i=0;i<section;i++){
      sections.push(i);
    }
    
    return <section className="skeleton-container">

      {
        sections.map((it,idx)=>{
          return <div className="skeleton-content" key={idx+'section'}>
          <h3 className="skeleton__title"></h3>
          {
            rows.map((item,index)=>{
              return <div className="skeleton__row" key={index}></div>
            })
          }
        </div>
        })
      }
    </section>;
  }
}
export default CustomSkeleton;
