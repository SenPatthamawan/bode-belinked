<template>
  <div class="text-center">
    <div class="col-md-12 ml-sm-auto col-lg-12 px-4 ">
      <v-btn class="text-white" style="background-color:#1B437C;" @click="generatePDF">
        <v-icon center>mdi-printer</v-icon>
      </v-btn>
    </div>
    <v-dialog
      v-model="dialogLoading"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          กำลังทำการดาวน์โหลดไฟล์ กรุณารอสักครู่...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import Vue from 'vue'
import { jsPDF } from 'jspdf'
import axios from 'axios'
import moment from 'moment'

// import thFont from '../assets/font/Sarabun-Bold-normal.js';
import '@/components/PdfForm/asset/font/THSarabunNew Bold-normal.js'
import '@/components/PdfForm/asset/font/THSarabunNew BoldItalic-normal.js'
import '@/components/PdfForm/asset/font/THSarabunNew Italic-normal.js'
import '@/components/PdfForm/asset/font/THSarabunNew-normal.js'
import image0 from '@/components/PdfForm/asset/images/0.jpg'
import image1 from '@/components/PdfForm/asset/images/1.jpg'

// Vue.use(VueSignaturePad)
export default {
  components: {},
  props: ['BookNo', 'TypePDF', 'NameFiles', 'getImgSignature', 'Item'],
  data () {
    return {
      Base64: null,
      preview: null,
      Sigs: null,
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)'
      },
      disabled: false,
      dataUrl: '',
      ImageBeforeafter: {
        'beforeImage': [],
        'afterImage': []
      },
      getstartdate: '',
      dialogLoading: false
    }
  },

  async mounted () {
    this.getStartDate()
    // this.getmultiimage()
  },
  methods: {
    logData (x) {
      console.log('xxxxx : ', x.data)
    },
    chkSizeImg (url) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = () => {
          console.log(image.width, image.height) // Corrected typo: image.height
          if (image.width > image.height) {
            resolve([50, 37.5])
          } else {
            resolve([50, 75])
          }
        }
        image.onerror = () => {
          reject(new Error('Failed to load image')) // Handle error if image fails to load
        }
        image.src = url
      })
    },
    getImage (url) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(url)
          const imageData = await res.blob()

          const img = new Image()
          img.onload = () => {
            resolve(img)
          }
          img.onerror = error => {
            reject(error)
          }

          img.src = URL.createObjectURL(imageData)
        } catch (error) {
          reject(error)
        }
      })
    },
    async loadFontData (fontPath) {
      try {
        const response = await fetch(fontPath)
        if (!response.ok) {
          throw new Error('Font file not found or could not be loaded.')
        }
        const fontData = await response.arrayBuffer()
        return fontData
      } catch (error) {
        console.error('Error loading font data:', error)
        return null
      }
    },
    centerFn (doc, text, setX, w, fontSize) {
      const pageWidth = w
      const textWidth =
        (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor
      const x = (pageWidth - textWidth) / 2 + setX
      return x
    },
    formatDate (dateString) {
      // Regex เพื่อดึงวันที่, เดือน, ปี และเวลาออกมา
      const dateRegex = /(\d+)\s(\S+)\s(\d+)\sเวลา\s(\d{2}:\d{2})/
      const months = {
        'มกราคม': '01',
        'กุมภาพันธ์': '02',
        'มีนาคม': '03',
        'เมษายน': '04',
        'พฤษภาคม': '05',
        'มิถุนายน': '06',
        'กรกฎาคม': '07',
        'สิงหาคม': '08',
        'กันยายน': '09',
        'ตุลาคม': '10',
        'พฤศจิกายน': '11',
        'ธันวาคม': '12'
      }

      const match = dateRegex.exec(dateString)
      if (match) {
        const day = match[1].padStart(2, '0')
        const month = months[match[2]]
        const year = match[3]
        const time = match[4]

        return `${day}/${month}/${year} ${time}`
      } else {
        return 'รูปแบบวันที่ไม่ถูกต้อง'
      }
    },
    async getmultiimage () {
      console.log('jodId By image => ', this.Item.jobId)
      try {
        const res = await axios.get(this.DNS_IP + '/formpdf/getmultiimage?jobId=' + this.Item.jobId)
        console.log('data image ', res.data.data)

        if (res.data.data && res.data.data.length > 0) {
          for (const i of res.data.data) {
            // console.log('i : ', i)
            if (i.typeUpload !== undefined && i.typeUpload !== null) {
              this.ImageBeforeafter[i.typeUpload].push(i.beforeafter)
            }
          }
          console.log('imgs ', this.ImageBeforeafter)
        } else {
          console.log('No images found')
          return []
        }
      } catch (error) {
        console.error('Error fetching images:', error)
        return []
      }
    },
    async getStartDate () {
      console.log('this.Item ', this.Item)
      try {
        const res = await axios.get(`${this.DNS_IP}/formpdf/getstartdate?jobId=${this.Item.jobId}&shopId=${this.Item.shopId}`)
        console.log('res ', res.data.data)

        if (res.data.data && res.data.data.length > 0) {
          // ฟอร์แมตวันที่โดยใช้ Moment.js
          const date = res.data.data[0].create_date

          // แปลงวันที่เป็น Buddhist calendar
          const formattedDate = moment.utc(date).add(543, 'years').format('DD/MM/YYYY HH:mm')

          this.getstartdate = formattedDate
          console.log('this.getstartdate ', this.getstartdate)
        }
      } catch (error) {
        console.error('Error fetching start date:', error)
      }
    },
    async getImgs (url) {
      try {
        const data = await axios.get(`${this.DNS_IP}/formpdf/urlimg?url=` + url)
        return data
      } catch (errs) {
        console.log('errs : ', errs)
        return ''
      }
    },
    generatePDF (base64Sign) {
      this.dialogLoading = true
      return new Promise(async (resolve, reject) => {
        const imageUrl =
          'https://static.wixstatic.com/media/f1e130_3e23d06d15e645089337ba2c33870aaf~mv2.jpg/v1/fit/w_2500,h_1330,al_c/f1e130_3e23d06d15e645089337ba2c33870aaf~mv2.jpg'
        try {
          const defaultPage = {
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true
          }
          const doc = jsPDF(defaultPage)
          let objData
          await this.getmultiimage()
          console.log('xzczxczxczxcxzcz : ', this.Item)
          console.log('getstartdate : ', this.getstartdate)
          console.log('รูป : ', this.ImageBeforeafter)
          objData = {
            RefNo: this.Item.receiptNo,
            DateCreate: this.formatDate(this.Item.CREATE_DATE),
            DateStart: this.getstartdate,
            DateEnd: this.formatDate(this.Item.DATE_LAST),
            CreateFullname: this.Item.CustomFieldName,
            CreateMobile: this.Item.CustomFieldTel,
            ContractFullname: this.Item.CustomFieldName,
            ContractAddress: this.Item.address,
            ContractMobile: this.Item.CustomFieldTel,
            DetialTxt1: this.Item.flowName,
            DetialTxt2: '-',
            RemarkTxt1: this.Item.remark,
            DetialTxt3: this.Item.jobRemark
          }
          console.log('>>>>>>>>', objData)

          const imgs = {
            '0': image0,
            '1': image1
          }
          console.log('img2 ', imgs)

          let st = []
          //   let msg = ''

          const BoldFontData = await this.loadFontData(
            '../assets/font/THSarabunNewBold.ttf'
          ) // Load font data
          if (!BoldFontData) {
            throw new Error('Font data not loaded.')
          }

          const img = await this.getImage(imageUrl)
          if (img) {
            doc.addImage(img, 'PNG', 115, 0, 70, 70)
          }

          doc.setFont('THSarabunNew Bold', 'normal')
          doc.setFontSize(14)
          st = [100, 60, 65, 6]
          doc.text('เลขที่ใบงาน / No', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.RefNo, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [100, st[1] + st[3], 65, 6]
          doc.text('วันจอง / Date issue', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.DateCreate, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [100, st[1] + st[3], 65, 6]
          doc.text('วันที่เริ่มงาน / Start Date', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.DateStart, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [100, st[1] + st[3], 65, 6]
          doc.text('วันที่เสร็จงาน / Complete Date', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.DateEnd, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.text('รายละเอียดผู้จองบริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          st = [25, st[1] + st[3] + 4, 60, 6]
          doc.text('ชื่อผู้จอง / Name', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.CreateFullname, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3], 60, 6]
          doc.text('เบอร์ติดต่อ / Contract number', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.CreateMobile, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.text('รายละเอียดผู้ใช้บริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          st = [25, st[1] + st[3] + 4, 60, 6]
          doc.text('ชื่อผู้ติดต่อ / Contract ', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.ContractFullname, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3], 60, 6]
          doc.text('ที่อยู่สำหรับให้บริการ / \nService address', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          let newTxt = objData.ContractAddress
          doc.text(newTxt, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          // console.log(">>>>>", this.chkLine(doc, newTxt, st[2]))
          // console.log(">>>>>", st)

          let getY = this.chkLine(doc, newTxt, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 60, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 60, 6]
          }

          // console.log(">>>>>", st)
          doc.setFont('THSarabunNew Bold', 'normal')
          doc.text('เบอร์ติดต่อ / Contract number', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')
          st = [st[0] + st[2], st[1], 80, 6]
          doc.text(objData.ContractMobile, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
          doc.text('ข้อมูลบริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3] + 6, 50, 6]
          doc.text('ล้างแอร์', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')

          let defaultX = st[0] - 5
          let defaultY = st[1] - 8.5
          st = [st[0] + st[2], st[1], 90, 6]
          let newTxt2 = objData.DetialTxt1
          doc.text(newTxt2, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, newTxt2, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 50, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 50, 6]
          }

          doc.rect(defaultX, defaultY, st[2], st[3] + st[3] * getY[0], 'S')
          doc.rect(
            st[0] - 5 + st[2],
            defaultY,
            st[2] + 70,
            st[3] + st[3] * getY[0],
            'S'
          )

          //   const chkAddPage = defaultY + st[3] + (st[3] * getY[0])
          doc.addPage(defaultPage)
          st = [20, 10, 170, 6]

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
          doc.text('รายละเอียดเพิ่มเติม', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          let newTxt3 = objData.DetialTxt2

          doc.setFont('THSarabunNew', 'normal')
          st = [25, st[1] + st[3] + 6, 150, 6]
          defaultX = st[0] - 5
          defaultY = st[1] - 8.5

          doc.text(newTxt3, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, newTxt2, st[2])
          st = [25, st[1] + st[3] * getY[0], 170, 6]

          doc.rect(st[0] - 5, defaultY, st[2], st[3] + st[3] * getY[0], 'S')

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3], 50, 6]
          doc.text('หมายเหตุถึงผู้ให้บริการ', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')

          defaultX = st[0] - 5
          defaultY = st[1] - 8.5
          st = [st[0] + st[2], st[1], 90, 6]
          let newTxt4 = objData.RemarkTxt1
          doc.text(newTxt4, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, newTxt4, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 50, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 50, 6]
          }

          doc.rect(defaultX, defaultY, st[2], st[3] + st[3] * getY[0], 'S')
          doc.rect(
            st[0] - 5 + st[2],
            defaultY,
            st[2] + 70,
            st[3] + st[3] * getY[0],
            'S'
          )

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3], 50, 6]
          doc.text('รายละเอียดเพิ่มเติม', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')

          defaultX = st[0] - 5
          defaultY = st[1] - 8.5
          st = [st[0] + st[2], st[1], 90, 6]
          let newTxt5 = objData.DetialTxt3
          doc.text(newTxt5, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, newTxt5, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 50, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 50, 6]
          }

          doc.rect(defaultX, defaultY, st[2], st[3] + st[3] * getY[0], 'S')
          doc.rect(
            st[0] - 5 + st[2],
            defaultY,
            st[2] + 70,
            st[3] + st[3] * getY[0],
            'S'
          )

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
          doc.text('รายละเอียดงานจากผู้ให้บริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3] + 6, 50, 6]
          doc.text('เช็คอุณหภูมิก่อนล้าง', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')

          defaultX = st[0] - 5
          defaultY = st[1] - 8.5
          st = [st[0] + st[2], st[1], 90, 6]
          let beforeAir = this.Item.beforeAir
          doc.text(beforeAir, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, beforeAir, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 50, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 50, 6]
          }

          doc.rect(defaultX, defaultY, st[2], st[3] + st[3] * getY[0], 'S')
          doc.rect(
            st[0] - 5 + st[2],
            defaultY,
            st[2] + 70,
            st[3] + st[3] * getY[0],
            'S'
          )

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [25, st[1] + st[3], 50, 6]
          doc.text('เช็คอุณหภูมิหลังล้าง', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          doc.setFont('THSarabunNew', 'normal')

          defaultX = st[0] - 5
          defaultY = st[1] - 8.5
          st = [st[0] + st[2], st[1], 90, 6]
          let afterAir = this.Item.afterAir
          doc.text(afterAir, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, afterAir, st[2])
          if (getY[0] <= 2) {
            // console.log("CASE 1")
            st = [25, st[1] + st[3] * 2, 50, 6]
          } else {
            // console.log("CASE 2")
            st = [25, st[1] + st[3] * getY[0], 50, 6]
          }

          doc.rect(defaultX, defaultY, st[2], st[3] + st[3] * getY[0], 'S')
          doc.rect(
            st[0] - 5 + st[2],
            defaultY,
            st[2] + 70,
            st[3] + st[3] * getY[0],
            'S'
          )

          doc.addPage(defaultPage)
          st = [20, 10, 170, 6]

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
          doc.text('รายละเอียดงานจากผู้ให้บริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          let newTxt7 = 'รูปถ่ายก่อนล้าง'

          st = [25, st[1] + st[3] + 6, 150, 6]
          defaultX = st[0] - 5
          defaultY = st[1] - 8.5

          doc.text(newTxt7, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, newTxt7, st[2])

          st = [25, st[1] + st[3] * getY[0], 170, 6]
          doc.rect(st[0] - 5, defaultY, st[2], 260, 'S')

          let chkCountImg = 1

          console.log('this.ImageBeforeafter.beforeImage ', this.ImageBeforeafter.beforeImage)
          let i = 0
          for (const before of this.ImageBeforeafter.beforeImage) {
            if (i % 3 === 0) {
              // console.log("xxxxxxx", chkCountImg)
              if (chkCountImg === 8) {
                // console.log("zzzzzzz")
                doc.addPage(defaultPage)
                st = [20, 10, 170, 6]

                doc.setFont('THSarabunNew Bold', 'normal')
                st = [20, st[1] + st[3] + 6, 170, 6]
                doc.setFillColor(235, 235, 235)
                doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
                doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
                doc.text('รายละเอียดงานจากผู้ให้บริการ', st[0] + 5, st[1], {
                  align: 'left',
                  charSpace: 0.1,
                  maxWidth: st[2]
                })

                newTxt7 = 'รูปถ่ายก่อนล้าง(เพิ่มเติม)'

                st = [25, st[1] + st[3] + 6, 150, 6]
                defaultX = st[0] - 5
                defaultY = st[1] - 8.5

                doc.text(newTxt7, st[0], st[1], {
                  align: 'left',
                  charSpace: 0.1,
                  maxWidth: st[2]
                })
                getY = []
                getY = this.chkLine(doc, newTxt7, st[2])

                st = [25, st[1] + st[3] * getY[0], 170, 6]
                doc.rect(st[0] - 5, defaultY, st[2], 260, 'S')

                st = [25, 40, 50, 75]
              } else {
                if (i === 0) {
                  st = [25, 40, 50, 75]
                } else {
                  st = [25, st[1] + st[3] + 5, 50, 75]
                }
              }
            } else {
              st = [st[0] + st[2] + 5, st[1], 50, 75]
            }
            // doc.rect(st[0], st[1], st[2], st[3], 'S')
            // console.log('before ', before)
            // console.log('i ', i)
            const stNew = await this.chkSizeImg(before)
            // console.log('stNew ', stNew)
            // console.log('st[0] ', st[0])
            // console.log('st[1] ', st[1])
            doc.addImage(before, 'JPG', st[0], st[1], stNew[0], stNew[1])
            chkCountImg++
            if (i % 9 === 0) {
              chkCountImg = 0
            }
            i++
            // console.log(">>>>>>", chkCountImg, " i : ", i % 3)
          }
          doc.addPage(defaultPage)
          st = [20, 10, 170, 6]

          doc.setFont('THSarabunNew Bold', 'normal')
          st = [20, st[1] + st[3] + 6, 170, 6]
          doc.setFillColor(235, 235, 235)
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
          doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
          doc.text('รายละเอียดงานจากผู้ให้บริการ', st[0] + 5, st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          let afterImg = 'รูปถ่ายหลังล้าง'

          st = [25, st[1] + st[3] + 6, 150, 6]
          defaultX = st[0] - 5
          defaultY = st[1] - 8.5

          doc.text(afterImg, st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })
          getY = []
          getY = this.chkLine(doc, afterImg, st[2])

          st = [25, st[1] + st[3] * getY[0], 170, 6]
          doc.rect(st[0] - 5, defaultY, st[2], 260, 'S')

          let chkCountAfterImg = 1

          let j = 0
          for (const after of this.ImageBeforeafter.afterImage) {
            // console.log(">>>>",i%2)
            if (j % 3 === 0) {
              // console.log("xxxxxxx", chkCountAfterImg)
              if (chkCountAfterImg === 8) {
                // console.log("zzzzzzz")
                doc.addPage(defaultPage)
                st = [20, 10, 170, 6]

                doc.setFont('THSarabunNew Bold', 'normal')
                st = [20, st[1] + st[3] + 6, 170, 6]
                doc.setFillColor(235, 235, 235)
                doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'F')
                doc.rect(st[0], st[1] - 6.5, st[2], st[3] + 4, 'S')
                doc.text('รายละเอียดงานจากผู้ให้บริการ', st[0] + 5, st[1], {
                  align: 'left',
                  charSpace: 0.1,
                  maxWidth: st[2]
                })

                newTxt7 = 'รูปถ่ายหลังล้าง(เพิ่มเติม)'

                st = [25, st[1] + st[3] + 6, 150, 6]
                defaultX = st[0] - 5
                defaultY = st[1] - 8.5

                doc.text(newTxt7, st[0], st[1], {
                  align: 'left',
                  charSpace: 0.1,
                  maxWidth: st[2]
                })
                getY = []
                getY = this.chkLine(doc, newTxt7, st[2])

                st = [25, st[1] + st[3] * getY[0], 170, 6]
                doc.rect(st[0] - 5, defaultY, st[2], 260, 'S')

                st = [25, 40, 50, 75]
              } else {
                if (j === 0) {
                  st = [25, 40, 50, 75]
                } else {
                  st = [25, st[1] + st[3] + 5, 50, 75]
                }
              }
            } else {
              st = [st[0] + st[2] + 5, st[1], 50, 75]
            }
            const stNew = await this.chkSizeImg(after)
            // console.log('stNew ', stNew)
            doc.addImage(after, 'JPG', st[0], st[1], stNew[0], stNew[1])
            chkCountAfterImg++
            if (j % 9 === 0) {
              chkCountAfterImg = 0
            }
            j++
            // console.log(">>>>>>", chkCountAfterImg, " i : ", i % 3)
          }

          doc.addPage(defaultPage)
          st = [20, 10, 170, 6]

          doc.setFont('THSarabunNew Bold', 'normal')
          doc.setFontSize(18)
          st = [20, 20, 65, 6]
          doc.text('ลายเซ็น', st[0], st[1], {
            align: 'left',
            charSpace: 0.1,
            maxWidth: st[2]
          })

          const rectX = 20 // ตำแหน่ง X ของกรอบ
          const rectY = 30 // ตำแหน่ง Y ของกรอบ
          const rectWidth = 170 // ความกว้างของกรอบ
          const rectHeight = 50 // ความสูงของกรอบ

          const imgWidth = rectWidth * 0.99 // ขนาดความกว้างของลายเซ็น (99% ของขนาดกรอบ)
          const imgHeight = rectHeight * 0.99 // ขนาดความสูงของลายเซ็น (99% ของขนาดกรอบ)

          const imgX = rectX + (rectWidth - imgWidth) / 2 // คำนวณตำแหน่ง X ของลายเซ็นให้อยู่กลางกรอบ
          const imgY = rectY + (rectHeight - imgHeight) / 2 // คำนวณตำแหน่ง Y ของลายเซ็นให้อยู่กลางกรอบ

          doc.rect(rectX, rectY, rectWidth, rectHeight, 'S') // วาดกรอบสี่เหลี่ยม

          if (this.Item.signatureURL) {
            const signatureURL = await this.getImgs(this.Item.signatureURL)
            // console.log('signatureURL', signatureURL.data)
            doc.addImage('data:image/png;base64,' + signatureURL.data, 'png', imgX, imgY, imgWidth, imgHeight) // วางลายเซ็นในตำแหน่งและขนาดที่คำนวณ
          } else {
            console.error('No signature image found')
          }

          const arrSign = [
            'ผู้อนุมัติ / Approve by',
            'ผู้ให้บริการ / Service by',
            'ผู้รับบริการ / Received by'
          ]

          st = [25, 95, 50, 6]

          doc.setFontSize(14)
          for (const s of arrSign) {
            // doc.rect(st[0], st[1], st[2], st[3], 'S')

            doc.text(s, this.centerFn(doc, s, st[0], st[2], 14), st[1], {
              align: 'left',
              charSpace: 0.1,
              maxWidth: st[2]
            })

            doc
              .setLineDash([0.5, 0.5], 0)
              .line(st[0], st[1] + 15.5, st[0] + st[2], st[1] + 15.5, 'S')
            doc.text(
              'ลายเช็น / Signature',
              this.centerFn(doc, 'ลายเช็น / Signature', st[0], st[2], 14),
              st[1] + 25,
              { align: 'left', charSpace: 0.1, maxWidth: st[2] }
            )

            doc
              .setLineDash([0.5, 0.5], 0)
              .line(st[0], st[1] + 45.5, st[0] + st[2], st[1] + 45.5, 'S')
            doc.text(
              'ลงชื่อ / Name',
              this.centerFn(doc, 'ลงชื่อ / Name', st[0], st[2], 14),
              st[1] + 55,
              { align: 'left', charSpace: 0.1, maxWidth: st[2] }
            )

            doc.text(
              '            /            /            ',
              this.centerFn(
                doc,
                '            /            /            ',
                st[0],
                st[2],
                14
              ),
              st[1] + 75,
              { align: 'left', charSpace: 0.1, maxWidth: st[2] }
            )

            doc
              .setLineDash([0.5, 0.5], 0)
              .line(st[0], st[1] + 75.5, st[0] + st[2], st[1] + 75.5, 'S')
            doc.text(
              'วันที่ / Date',
              this.centerFn(doc, 'วันที่ / Date', st[0], st[2], 14),
              st[1] + 85,
              { align: 'left', charSpace: 0.1, maxWidth: st[2] }
            )

            st[0] += 55
          }

          let pdfBase64 = null
          if (this.TypePDF === 'base64') {
            pdfBase64 = doc.output('datauristring')
          } else if (this.TypePDF === 'preview') {
            pdfBase64 = doc.output('pdfobjectnewwindow')
          } else {
            let fileNames = 'Airmate.pdf'
            console.log('this.NameFiles : ', this.NameFiles)
            if (this.NameFiles !== undefined) {
              fileNames = this.NameFiles + '.pdf'
            }
            pdfBase64 = doc.save(fileNames)
          }
          resolve(pdfBase64)
        } catch (error) {
          console.error('ERROR : ', error)
          reject(error)
        } finally {
          this.ImageBeforeafter.beforeImage = []
          this.ImageBeforeafter.afterImage = []
          this.dialogLoading = false // ปิดสถานะการโหลดของ dialog
        }
      })
    },

    chkLine (doc, text, w) {
      var lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor
      var splittedText = doc.splitTextToSize(text, w)
      var lines = splittedText.length // splitted text is a string array
      var blockHeight = lines * lineHeight

      return [splittedText.length, blockHeight]
    }
  }
}
</script>

<style>
/* Your component-specific styles here */
</style>
