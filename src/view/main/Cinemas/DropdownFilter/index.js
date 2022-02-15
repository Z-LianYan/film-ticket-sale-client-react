import React, { Component, useEffect, useRef, useState } from "react";
import "./index.scss";
import CinemaListItem from "@/components/CinemaListItem/index";
import { SearchOutline, DownOutline, LeftOutline } from "antd-mobile-icons";
import {
  InfiniteScroll,
  PullToRefresh,
  NavBar,
  Dropdown,
  Grid,
  Tabs,
  CheckList,
} from "antd-mobile";
import { GroupCommons } from "@/modules/group";
import { get_cinema_list, get_film_in_schedule_dates } from "@/api/cinema";
import { get_film_detail } from "@/api/film";
import { get_city_district_list } from "@/api/citys";
import InfiniteScrollContent from "@/components/InfiniteScrollContent/index";
import Cookies from "js-cookie";
import dayjs from "dayjs";
export default ({ userInfo, props, fetchOptions,districtChange,onCheckListChange }) => {
  const ref = useRef(null)
  let [city_district_list, set_city_district_list] = useState([]);
  let [checkListDefaultValue, setCheckListDefaultValue] = useState([""]);
  let [checkListDefaultLabel, setCheckListDefaultLabel] = useState("全部");
  let [checkList, setCheckList] = useState([
    { label: "全部", value: "" },
    { label: "最近去过", value: "zjqg" },
  ]);
  useEffect(() => {
    if (!city_district_list.length) {
      getDistrictList();
    }

  })
  return <Dropdown ref={ref}>
    <Dropdown.Item
      key="all-city"
      title={onDistrictName()}
      closeOnContentClick={true}
      closeOnMaskClick={true}
    >
      <Grid
        columns={4}
        gap={10}
        style={{
          padding: "0.1rem",
          "--gap-vertical": "0.15rem",
        }}
      >
        {city_district_list.map((item, index) => {
          return (
            <Grid.Item
              key={index}
              onClick={() => {
                districtChange && districtChange(item.id);
                var _a;
                (_a = ref.current) === null || _a === void 0 ? void 0 : _a.close();
              }}
            >
              <div
                className={[
                  `area-wrapper ${fetchOptions.district_id == item.id
                    ? "active"
                    : ""
                  }`,
                ]}
              >
                {item.name}
              </div>
            </Grid.Item>
          );
        })}
      </Grid>
    </Dropdown.Item>
    {userInfo ? (
      <Dropdown.Item
        key="recently"
        title={checkListDefaultLabel}
        closeOnContentClick={true}
        closeOnMaskClick={true}
      >
        <CheckList
          defaultValue={checkListDefaultValue}
          onChange={(res) => {
            checkList.map((item) => {
              if (item.value == res[0]) {
                setCheckListDefaultLabel(item.label);
                return;
              }
            });
            onCheckListChange && onCheckListChange(res[0]);
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.close();
          }}
        >
          {checkList.map((item, index) => {
            return (
              <CheckList.Item key={index} value={item.value}>
                {item.label}
              </CheckList.Item>
            );
          })}
        </CheckList>
      </Dropdown.Item>
    ) : null}
  </Dropdown>

  async function getDistrictList() {
    let { city_id } = props.locationInfo;
    let _cookies = Cookies.get("locationInfo");
    let _cookiesInfo = null;
    if (_cookies) {
      _cookiesInfo = JSON.parse(_cookies);
    }
    let result = await get_city_district_list({
      city_id:
        _cookiesInfo && _cookiesInfo.city_id ? _cookiesInfo.city_id : city_id,
    });
    result.rows.unshift({
      first_letter: null,
      id: "",
      is_hot: null,
      module_id: "",
      name: "全城",
      pinyin: "quanbu",
    });
    set_city_district_list(result.rows);
  }
  function onDistrictName() {
    if (!fetchOptions.district_id) return "全城";
    return city_district_list.map((item) => {
      if (item.id == fetchOptions.district_id) {
        return item.name;
      }
    });
  }
};


