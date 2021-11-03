import React, { Component } from "react";
import "./index.scss";
import { SearchOutline } from 'antd-mobile-icons'
import { Search,Button } from "antd-mobile";

class CustomSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerList:[]
    };
  }
  static defaultProps = {
    border:true,
    placeholder:'',
    value:'',
    cancelText:'取消',
    clearable:true,
    maxLength:'',
    showCancelButton:true,
  }
  async componentDidMount() {
         
  }
  
  render() {
    let { bannerList } = this.state;
    let { 
      onChange,
      border,
      placeholder,
      value,
      onSearch,
      onFocus,
      onBlur,
      onClear,
      onCancel,
      cancelText,
      clearable,
      maxLength,
      style,
      showCancelButton
    } = this.props;
    return <div className="custom-search-wrapper" style={{
      borderBottom: border?'0.01rem solid #eee':'',
      padding: `0.1rem ${showCancelButton?'0':'0.15rem'} 0.15rem 0.15rem`
    }}>
      <Search 
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      clearable={clearable}
      cancelText={cancelText}
      onSearch={()=>{
        onSearch && onSearch()
      }}
      onFocus={(val)=>{
        onFocus && onFocus(val)
      }}
      onBlur={()=>{
        onBlur && onBlur()
      }}
      onClear={()=>{
        onClear && onClear()
      }}
      style={{
        "--background": "#f4f4f4",
        padding:0,
        ...style
      }}
      showCancelButton={false}
      onChange={(val) => {
        onChange && onChange(val);
      }}/>
      {showCancelButton?<Button color='default' size="small" fill='none'
      onClick={()=>{
        onCancel && onCancel()
      }}>取消</Button>:null}
    </div>
  }
}

export default CustomSearch;
