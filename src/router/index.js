import Vue from 'vue'
import Router from 'vue-router'
import Core from '@/components/Core'
import System from '@/components/System'
import Master from '@/components/Master'
import Dashbord from '@/components/Dashbord'
import BroadCast from '@/components/BroadCast'
import Payment from '@/components/Payment'
import PrintPdf from '@/components/PrintPdf'
import Onsite from '@/components/Onsite'
import Mazda from '@/components/Mazda'
import ShopPayment from '@/components/ShopPayment'
import Sound from '@/components/Sound'
import Rating from '@/components/Rating'
import Pepsico from '@/components/Pepsico'
import Message from '@/components/StepMessage'
import BeChat from '@/components/BeChat'
import CalendarGrid from '@/components/CalendarGrid'
import Watersize from '@/components/FixWatersize'
import DemoAirmate from '@/components/PdfForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '*',
    name: 'Login',
    component: Core.Login
  },
  {
    path: '/Watersize',
    name: 'Watersize',
    component: Watersize.OverviewFlow
  },
  {
    path: '/Onsite/OnsiteCalendarGrid',
    name: 'OnsiteCalendarGrid',
    component: CalendarGrid.OnsiteCalendarGrid
  },
  {
    path: '/ShopList',
    name: 'ShopList',
    component: ShopPayment.ShopList
  },
  {
    path: '/UpdateStatusPayment',
    name: 'UpdateStatusPayment',
    component: ShopPayment.UpdateStatus
  },
  {
    path: '/Core/LoginFailed',
    name: 'LoginFailed',
    component: Core.LoginFailed
  },
  {
    path: '/BillingPlan',
    name: 'BillingPlan',
    component: Core.BillingPlan
  },
  {
    path: '/LoginAdmin',
    name: 'LoginAdmin',
    component: Core.LoginAdmin
  },
  {
    path: '/Core/Login',
    name: 'Login',
    component: Core.Login
  },
  {
    path: '/Core/Home',
    name: 'Home',
    component: Core.Home
  },
  {
    path: '/InstallWizard',
    name: 'InstallWizard',
    component: Core.InstallWizard
  },
  {
    path: '/GoogleCalendar',
    name: 'GoogleCalendar',
    component: Core.GoogleCalendar
  },
  {
    path: '/AdminStampStep',
    name: 'AdminStampStep',
    component: Master.AdminStampStep
  },
  {
    path: '/GoogleCalendarCmp',
    name: 'GoogleCalendarCmp',
    component: Core.GoogleCalendarCmp
  },
  {
    path: '/Master/BookingByUserEmp',
    name: 'BookingByUserEmp',
    component: Master.BookingByUserEmp
  },
  {
    path: '/Master/CustomField',
    name: 'CustomField',
    component: Master.CustomField
  },
  {
    path: '/Master/Flow',
    name: 'Flow',
    component: Master.Flow
  },
  {
    path: '/Master/FlowStep',
    name: 'FlowStep',
    component: Master.FlowStep
  },
  {
    path: '/Master/RegisterAdd',
    name: 'RegisterAdd',
    component: Master.RegisterAdd
  },
  {
    path: '/Master/JobQrCode',
    name: 'JobQrCode',
    component: Master.JobQrCode
  },
  {
    path: '/Master/WorkShop',
    name: 'WorkShop',
    component: Master.WorkShop
  },
  {
    path: '/Master/BookingField',
    name: 'BookingField',
    component: Master.BookingField
  },
  {
    path: '/Master/BookingLink',
    name: 'BookingLink',
    component: Master.BookingLink
  },
  {
    path: '/Master/BookingListQueue',
    name: 'BookingListQueue',
    component: Master.BookingListQueue
  },
  {
    path: '/Master/BookingListQueueByUser',
    name: 'BookingListQueueByUser',
    component: Master.BookingListQueueByUser
  },
  {
    path: '/Master/BookingListQueueByUserOhrich',
    name: 'BookingListQueueByUserOhrich',
    component: Master.BookingListQueueByUserOhrich
  },
  {
    path: '/Master/BookingListQueueByUserEventCat',
    name: 'BookingListQueueByUserEventCat',
    component: Master.BookingListQueueByUserEventCat
  },
  {
    path: '/Master/BookingListQueueMonitoring',
    name: 'BookingListQueueMonitoring',
    component: Master.BookingListQueueMonitoring
  },
  {
    path: '/Master/BookingListQueueMonitoringVideo',
    name: 'BookingListQueueMonitoringVideo',
    component: Master.BookingListQueueMonitoringVideo
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoNew',
    name: 'BookingListQueueMonitoringVideo',
    component: Master.BookingListQueueMonitoringVideoNew
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoNewCar',
    name: 'BookingListQueueMonitoringVideo',
    component: Master.BookingListQueueMonitoringVideoNewCar
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoOhrich',
    name: 'BookingListQueueMonitoringVideoOhrich',
    component: Master.BookingListQueueMonitoringVideoOhrich
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoEventCat',
    name: 'BookingListQueueMonitoringVideoEventCat',
    component: Master.BookingListQueueMonitoringVideoEventCat
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoEvent',
    name: 'BookingListQueueMonitoringVideoEvent',
    component: Master.BookingListQueueMonitoringVideoEvent
  },
  {
    path: '/Master/BookingListQueueByUserEvent',
    name: 'BookingListQueueByUserEvent',
    component: Master.BookingListQueueByUserEvent
  },
  {
    path: '/Master/BookingListQueueMonitoringVideoOhrichV1',
    name: 'BookingListQueueMonitoringVideoOhrichV1',
    component: Master.BookingListQueueMonitoringVideoOhrichV1
  },
  {
    path: '/Master/BookingListQueueTestPlaySound',
    name: 'BookingListQueueTestPlaySound',
    component: Master.BookingListQueueTestPlaySound
  },
  {
    path: '/Master/BookingList',
    name: 'BookingList',
    component: Master.BookingList
  },
  // {
  //   path: '/Master/BookingListOnsite',
  //   name: 'BookingListOnsite',
  //   component: Master.BookingListOnsite
  // },
  {
    path: '/Master/BookingListBeauty',
    name: 'BookingListBeauty',
    component: Master.BookingListBeauty
  },
  {
    path: '/Master/BookingJob',
    name: 'BookingJob',
    component: Master.BookingJob
  },
  // {
  //   path: '/Master/BookingListBeautyEmpTestRedis',
  //   name: 'BookingListBeautyEmpTestRedis',
  //   component: Master.BookingListBeautyEmpTestRedis
  // },
  // {
  //   path: '/Master/BookingListBeautyTestRedis',
  //   name: 'BookingListBeautyTestRedis',
  //   component: Master.BookingListBeautyTestRedis
  // },
  // {
  //   path: '/Master/CalendarBookingListTestRedis',
  //   name: 'CalendarBookingListTestRedis',
  //   component: Master.CalendarBookingListTestRedis
  // },
  {
    path: '/Master/BookingListBeautyEmp',
    name: 'BookingListBeautyEmp',
    component: Master.BookingListBeautyEmp
  },
  {
    path: '/Master/Rating',
    name: 'Rating',
    component: Master.Rating
  },
  {
    path: '/Master/SettingLineGroup',
    name: 'SettingLineGroup',
    component: Master.SettingLineGroup
  },
  {
    path: '/Master/Qrcodereader',
    name: 'Qrcodereader',
    component: Master.Qrcodereader
  },
  {
    path: '/Master/JobList',
    name: 'JobList',
    component: Master.JobList
  },
  {
    path: '/Master/CalendarBooking',
    name: 'CalendarBooking',
    component: Master.CalendarBooking
  },
  {
    path: '/Master/TableCheckQueue',
    name: 'TableCheckQueue',
    component: Master.TableCheckQueue
  },
  {
    path: '/System/User',
    name: 'User',
    component: System.User
  },
  {
    path: '/System/LINEConfigSendMessage',
    name: 'LINEConfigSendMessage',
    component: System.LINEConfigSendMessage
  },
  {
    path: '/System/UserTypeGroup',
    name: 'UserTypeGroup',
    component: System.UserTypeGroup
  },
  {
    path: '/System/Menu',
    name: 'Menu',
    component: System.Menu
  },
  {
    path: '/System/Privacy',
    name: 'Privacy',
    component: System.Privacy
  },
  {
    path: '/System/PrivacyCheck',
    name: 'PrivacyCheck',
    component: System.PrivacyCheck
  },
  {
    path: '/System/Running',
    name: 'Running',
    component: System.Running
  },
  {
    path: '/System/Token',
    name: 'Token',
    component: System.Token
  },
  {
    path: '/System/EditShop',
    name: 'EditShop',
    component: System.EditShop
  },
  {
    path: '/System/ListMember',
    name: 'ListMember',
    component: System.ListMember
  },
  {
    path: '/ConfirmPass',
    name: 'ConfirmPass',
    component: System.ConfirmPass
  },
  {
    path: '/Master/Employee',
    name: 'Employee',
    component: Master.Employee
  },
  {
    path: '/Master/Branch',
    name: 'Branch',
    component: Master.Branch
  },
  {
    path: '/Master/Company',
    name: 'Company',
    component: Master.Company
  },
  {
    path: '/Master/PaymentType',
    name: 'PaymentType',
    component: Master.PaymentType
  },
  {
    path: '/Master/BoardControl',
    name: 'BoardControl',
    component: Master.BoardControl
  },
  {
    path: '/Master/BoardControlBeauty',
    name: 'BoardControlBeauty',
    component: Master.BoardControlBeauty
  },
  {
    path: '/Master/BoardControlEmp',
    name: 'BoardControlEmp',
    component: Master.BoardControlEmp
  },
  {
    path: '/Master/BoardControlM',
    name: 'BoardControlM',
    component: Master.BoardControlM
  },
  {
    path: '/Master/BookingWalkinEmp',
    name: 'BookingWalkinEmp',
    component: Master.BookingWalkinEmp
  },
  {
    path: '/Master/BookingWalkin',
    name: 'BookingWalkin',
    component: Master.BookingWalkin
  },
  {
    path: '/Master/SettingLineNotify',
    name: 'SettingLineNotify',
    component: Master.SettingLineNotify
  },
  {
    path: '/Master/SettingTag',
    name: 'SettingTag',
    component: Master.SettingTag
  },
  {
    path: '/Master/ManageLink',
    name: 'ManageLink',
    component: Master.ManageLink
  },
  {
    path: '/Master/NoticeManagement',
    name: 'NoticeManagement',
    component: Master.NoticeManagement
  },
  {
    path: '/UpdateNotify',
    name: 'UpdateNotify',
    component: Master.UpdateNotify
  },
  {
    path: '/BookingMobile',
    name: 'BookingMobile',
    component: Master.BookingMobile
  },
  {
    path: '/BookingMobileEmp',
    name: 'BookingMobileEmp',
    component: Master.BookingMobileEmp
  },
  {
    path: '/CheckBookingEmpList',
    name: 'CheckBookingEmpList',
    component: Master.CheckBookingEmpList
  },
  {
    path: '/CheckBookingList',
    name: 'CheckBookingList',
    component: Master.CheckBookingList
  },
  {
    path: '/BookingMobileConfirmJob',
    name: 'BookingMobileConfirmJob',
    component: Master.BookingMobileConfirmJob
  },
  {
    path: '/Dashbord/DashBoardDepositPrice',
    name: 'DashBoardDepositPrice',
    component: Dashbord.DashBoardDepositPrice
  },
  {
    path: '/Dashbord/Report',
    name: 'Report',
    component: Dashbord.Report
  },
  {
    path: '/Dashbord/ReportEmpMain',
    name: 'ReportEmpMain',
    component: Dashbord.ReportEmpMain
  },
  {
    path: '/Dashbord/ReportFRT',
    name: 'ReportFRT',
    component: Dashbord.ReportFRT
  },
  {
    path: '/Dashbord/Report2',
    name: 'Report2',
    component: Dashbord.Report2
  },
  {
    path: '/Dashbord/ReportBooking',
    name: 'ReportBooking',
    component: Dashbord.ReportBooking
  },
  {
    path: '/Dashbord/C3Example',
    name: 'C3Example',
    component: Dashbord.C3Example
  },
  {
    path: '/Dashbord/Performance',
    name: 'Performance',
    component: Dashbord.Performance
  },
  {
    path: '/Dashbord/PerformanceBK',
    name: 'PerformanceBK',
    component: Dashbord.PerformanceBK
  },
  {
    path: '/Dashbord/PerformanceBK1',
    name: 'PerformanceBK1',
    component: Dashbord.PerformanceBK1
  },
  {
    path: '/BroadCast/Audience',
    name: 'Audience',
    component: BroadCast.Audience
  },
  {
    path: '/BroadCast/BroadCast',
    name: 'BroadCast',
    component: BroadCast.BroadCast
  },
  {
    path: '/System/ManageUser',
    name: 'ManageUser',
    component: System.ManageUser
  },
  {
    path: '/Payment',
    name: 'Payment',
    component: Payment.Payment
  },
  {
    path: '/LoyaltyPresent',
    name: 'LoyaltyPresent',
    component: Core.LoyaltyPresent
  },
  {
    path: '/PrintPdf/PrintInvoice',
    name: 'PrintInvoice',
    component: PrintPdf.PrintInvoice
  },
  {
    path: '/Onsite/JobList',
    name: 'JobListOnsite',
    component: Onsite.JobList
  },
  {
    path: '/mazda/report',
    name: 'MazdaReport',
    component: Mazda.Report
  },
  {
    path: '/Master/ServiceType',
    name: 'ServiceType',
    component: Master.ServiceType
  },
  {
    path: '/Sound/CallQueue',
    name: 'CallQueue',
    component: Sound.callQueue
  },
  {
    path: '/Core/QrcodeBoot',
    name: 'QrcodeBoot',
    component: Core.QrcodeBoot
  },
  {
    path: '/Rating/RatingAnswer',
    name: 'RatingAnswer',
    component: Rating.RatingAnswer
  },
  {
    path: '/Pepsico/ImportExcel',
    name: 'ImportExcel',
    component: Pepsico.ImportExcel
  },
  {
    path: '/Message/StepMessage',
    name: 'StepMessage',
    component: Message.StepMessage
  },
  {
    path: '/BeChat/Chat',
    name: 'BeChat',
    component: BeChat.Chat
  },
  {
    path: '/BillingPlanA1',
    name: 'BillingPlanCard',
    component: Core.BillingPlanCard
  },
  {
    path: '/PricingList',
    name: 'PricingList',
    component: ShopPayment.PricingList
  },
  {
    path: '/Master/BookingListQueuePanel',
    name: 'BookingListQueuePanel',
    component: Master.BookingListQueuePanel
  },
  {
    path: '/PdfForm/DemoAirmate',
    name: 'DemoAirmate',
    component: DemoAirmate.DemoAirmate
  },
  {
    path: '/Onsite/JobListAirmate',
    name: 'JobListAirmate',
    component: Onsite.JobListAirmate
  }
  ]
})
