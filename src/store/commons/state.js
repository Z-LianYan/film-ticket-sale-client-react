const state = {
  locationInfo: {
    city_id: 440100, //默认城市编码
    lng: "",
    lat: "",
    city_name: "广州", //默认城市广州
    isInLocation: true, //判断是否在定位中
    realLocation: null, //浏览器真实定位信息
    isShowSwitchLocationModal: false, //首页（film页）banner ，定位成功显示切换模态框
  },

  seatSectionShowColor:{
    a: '#C213BF',
    b: '#1890FF',
    c: '#f2b507',
    d: '#1fffea',
  }
};

export default state;
