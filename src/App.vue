<template>
 <v-app>
   <Sidebar v-if="$router.currentRoute.name !== 'Login' && $router.currentRoute.name !== 'BookingMobile' && $router.currentRoute.name !== 'BookingMobileConfirmJob' && $router.currentRoute.name !== 'BookingMobileEmp' && $router.currentRoute.name !==  'CheckBookingEmpList'  && $router.currentRoute.name !==  'CheckBookingList' && $router.currentRoute.name !== 'BillingPlan' && $router.currentRoute.name !== 'LoginAdmin' && $router.currentRoute.name !== 'ShopList' && $router.currentRoute.name !== 'UpdateStatusPayment' && $router.currentRoute.name !== 'BookingListQueueMonitoringVideo' && $router.currentRoute.name !== 'InstallWizard' && $router.currentRoute.name !== 'QrcodeBoot' && $router.currentRoute.name !== 'GoogleCalendar' && $router.currentRoute.name !== 'AdminStampStep' && $router.currentRoute.name !== 'BookingListQueueMonitoringVideoOhrich' && $router.currentRoute.name !== 'BookingListQueueMonitoringVideoEventCat' && $router.currentRoute.name !== 'BookingListQueueMonitoringVideoEvent'"/>
   <router-view/>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
export default {
  name: 'App',
  components: {
    Sidebar
  },
  beforeMount () {
    if (JSON.parse(localStorage.getItem('sessionData')) !== null) {
      this.$session.start()
      this.$session.set('data', JSON.parse(localStorage.getItem('sessionData')))
      localStorage.clear()
      localStorage.setItem('sessionData', JSON.stringify(this.$session.getAll().data))
    }
  }

}
</script>

<style>
/* @import "../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
@import "../node_modules/@syncfusion/ej2-lists/styles/material.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/material.css"; */
/* @import "../node_modules/@syncfusion/ej2-navigations/styles/material.css"; */
/* @import "../node_modules/@syncfusion/ej2-grids/styles/material.css";
@import "../node_modules/@syncfusion/ej2-pivotview/styles/material.css"; */

@import url('https://fonts.googleapis.com/css2?family=Kanit&display=swap');
/* @font-face {
  font-family: 'Kanit', sans-serif;
  src: url('/static/fonts/Kittithada/PSL242pro.ttf');
}
@font-face {
  font-family: KittithadaBold;
  src: url('/static/fonts/Kittithada/PSL245pro.ttf');
} */
*, .v-application {
  font-family: 'Kanit', sans-serif;
  /* font-size: 18px !important; */
}
html, body {
  margin:0;
  padding:0;
  height: 100%;
  overflow-x: hidden !important;
  }
:root {
  --nav-bg: #1B437C;
  --nav-text: #ffffff;
  --nav-text-active: #173053;
  --panel-bg: #173053;
  --panel-text: #ffffff;
  --table-head-bg: #173053;
  --table-head-text: #ffffff;
  --table-body-row-even: #B1C9EA;
  --table-body-row-odd: #ffffff;
  --table-body-text: #1B437C;
  --btn-general-color: #ffffff;
  --date-picker-head: #B1C9EA;
  --date-picker-footer: #173053;
  --date-picker-table-head: #5C99DB;
  --date-picker-table-body: #1B437C;
}
.KittithadaBold {
  /* font-family: KittithadaBold !important; */
  font-family: 'Kanit', sans-serif;
  font-weight: 400;
}
.nav-bg {
  background-color: var(--nav-bg) !important;
}
h1 {
  font-size: 2.5rem !important;
}
h2 {
  font-size: 2rem !important;
}
h3 {
  font-family: 'Kanit', sans-serif;
  font-size: 1.55rem !important;
}
.h3-Bold {
  font-family: 'Kanit', sans-serif;
  font-weight: 400;
  font-size: 1.65rem !important;
}
h4 {
  font-family: 'Kanit', sans-serif;
  font-size: 1.15rem !important;
}
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  height: auto;
  padding-bottom: 39%;
  vertical-align: top;
  overflow: hidden;
}
.svg-content {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
.chart-text-up {
  color: #09B66D !important;
}
.chart-text-down {
  color: #FF3D57 !important;
}
.svg-container > svg text {
  fill: #617087;
  font-size: 15px !important;
  text-anchor: center;
}
.bar {
  fill: var(--nav-bg);
}
.grid {
  fill: none;
  stroke: #444;
  stroke-width: 1.5px;
}
.chartHead {
  font-size: 1.65rem!important;
  font-weight: 400;
  letter-spacing: .0125em!important;
}
.v-navigation-drawer .v-list {
    padding: 0px !important;
}
.nav-text-active {
  color: var(--nav-text-active) !important;
}
.nav-text {
  color: var(--nav-text) !important;
}
.v-card--link:focus::before {
opacity: 0;
}
/* table tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
table tr:first-child th:last-child {
  border-top-right-radius: 10px;
}
table tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
table tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
} */
.v-application a {
  color: var(--nav-bg) !important;
}
.v-toolbar__content {
  justify-content: space-around;
}
/*
.theme--light.v-btn {
  color: var(--nav-text);
};
*/
.theme--light.v-btn.v-btn--has-bg {
  background-color: var(--nav-bg) ;
}
.v-navigation-drawer__content {
  background-color: var(--nav-bg);
}
.v-application--is-ltr .v-list-group--no-action>.v-list-group__items>.v-list-item {
  padding-left: 45px !important;
}
.v-application--is-ltr .v-list-item__action:first-child, .v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 15px !important;
}
/* .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) */

.v-list-item__title{
  color: var(--nav-text) !important;
  /* font-family: KittithadaBold;
  font-size: 22px !important; */
  font-family: 'Kanit', sans-serif;
  font-weight: 400;
}
/* .v-list-item {
  background-color: var(--nav-bg) !important;
} */
.v-select-list {
  background-color: var(--nav-bg) !important;
}
.v-simple-checkbox .v-icon {
    cursor: pointer !important;
    color: rgb(255, 255, 255) !important;
}
.v-input--selection-controls__input>.v-icon {
  color: var(--nav-bg) ;
}
/* .v-picker {
  background-color: var(--date-picker-footer) !important;
}
.v-date-picker-header {
  background-color: var(--date-picker-head)
}
.v-date-picker-table {
  background-color: var(--date-picker-head);
}
.v-date-picker-table > table > thead {
  background-color: var(--date-picker-table-head);
}
.v-date-picker-table > table > tbody {
  background-color: var(--date-picker-table-body);
} */

.v-list-group__header {
  background-color: var(--nav-bg) !important;
}
.menu-head {
  color: var(--nav-text);
  /* font-family: KittithadaBold;
  font-size: 26px !important; */
  font-family: 'Kanit', sans-serif;
  font-weight: 400;
}
.v-list-item--active {
  background-color: var(--nav-text-active);
}
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: var(--nav-bg) !important;
}
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: var(--nav-bg) !important;
  color: var(--nav-text) !important;
}
.v-expansion-panel-header {
  /* background-color: var(--panel-bg) !important; */
  /* color: var(--panel-text); */
  font-weight: bold;
}
.v-expansion-panel--active>.v-expansion-panel-header {
  min-height: 48px;
}
.new-background-color{
  background-color: #f2f7ff;
  min-height: 100vh;
}
.v-breadcrumbs {
  font-weight: bold;
}
.v-data-table__wrapper{
  min-height: 300px !important;
}
/* .v-data-table-header {
  background-color: var(--table-head-bg) !important;
}
.theme--light.v-data-table>.v-data-table__wrapper>table>thead>tr>th {
  color: white!important;
  font-size: 12px !important;
} */
.v-data-table-header {
    border-bottom: 3px solid #E9ECFF;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
}
.theme--light.v-data-table>.v-data-table__wrapper>table>thead>tr>th {
  font-size: 15px !important;
  color: black!important;
}
.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  padding: 15px 15px 15px 15px;
}
/* .v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(even) {background: var(--table-body-row-even)}
.v-data-table>.v-data-table__wrapper>table>tbody>tr:nth-child(odd) {background: var(--table-body-row-odd)}
.table_detail_2>.v-data-table__wrapper>table>tbody>tr:nth-child(even) {background: #eeeeee}
.table_detail_2>.v-data-table__wrapper>table>tbody>tr:nth-child(odd) {background: #ffffff} */
/* .v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  color: var(--table-body-text) !important;
} */
.custom_table_class thead th:first-child {
  border-radius: 10px 0 0 0;
}
.custom_table_class thead th:last-child {
  border-radius: 0 10px 0 0;
}
/* .theme--light.v-data-table .v-data-table-header th.sortable.active, .theme--light.v-data-table .v-data-table-header th.sortable.active .v-data-table-header__icon, .theme--light.v-data-table .v-data-table-header th.sortable:hover {
  color: var(--table-head-text) !important;
} */
/* .theme--light.v-data-table .v-data-table-header th.sortable .v-data-table-header__icon {
  color: var(--table-head-text) !important;
} */
.btn {
  color: var(--btn-general-color);
}
/* .v-date-picker-table .v-btn {
   color: #eeeeee !important;
} */
.nav-button {
  color: var(--nav-text);
  background-color: var(--nav-bg);
}
.nav-button-dark {
  color: var(--nav-text);
  background-color: #173053;
}
.v-navigation-drawer__append {
  background-color: #173053;
}
.shopname {
  font-size: 26px !important;
  font-weight: bold;
}
.theme--light.v-card {
  border-radius: 11px;
}
.v-card__subtitle, .v-card__text, .v-card__title {
  padding: 0px;
}
.v-text-field {
  padding: 16px;
}
.v-card_color {
  background-color: var(--nav-text-active);
  width: 350px;
  height: 600px;
}
.v-margit_button {
  margin-top: 15px;
}
.v-margit_button_right {
  margin-top: -8px;
}
.v-margit_img {
  margin-top:150px;
}
.v-margit_img_reward {
  margin-top:20px;
}
.v-margit_text_add {
  margin-top:10px;
}
.v_text_add {
  color: var(--nav-text-active);
  Width: 170px;
  Height: 50px;
}
.v_text_edit {
  Width: 255px;
  Height: 52px;
}
.v-img-margit {
  Width: 128.19px;
  Height: 84px;
}
.v-img-D {
  size: 26px !important;
  Width: 100px;
  Height: 60px;
}
.v-img-next {
  height: 100px;
  width: 135px;
}
.v-img-rental {
  height: 160px;
  width: 104px;
}
.v_text_new {
  height: 43px;
  width: 174px;
}
.underline-06 {
  background-image: linear-gradient(90deg, #e67399, #f2a640);
  background-position: bottom;
  background-size: 100% 10%;
  background-repeat: no-repeat;
}
.c3-axis-y-label, .c3-axis-x-label, .c3-chart-arcs-gauge-min, .c3-chart-arcs-gauge-max {
  font-size: 17px !important;
}
.theme--light.v-calendar-weekly .v-calendar-weekly__day {
    /* border-right: 2px solid #555 !important;
    border-bottom: 2px solid #555 !important;
    color: #000 !important; */
}
.v-label{
  margin-bottom: 0;
  /* color:#1B437C !important; */
  font-weight: bold;
}
.v-text-field{
  border-radius:10px;
}
.pac-container {
  position:relative !important;
  top:-1px !important;
}
</style>
