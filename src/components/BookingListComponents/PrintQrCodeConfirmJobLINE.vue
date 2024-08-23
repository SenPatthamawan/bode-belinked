<template>
  <div>
    <!-- <v-container >
      <v-row >
        <v-col cols="12">
          <v-btn
            small
            dark
            color="#14AE5C"
          ><v-icon left>mdi-printer</v-icon>Print QR</v-btn>
        </v-col>
      </v-row>
    </v-container> -->
  </div>
</template>
<script>
import axios from 'axios'
import pdfMake from 'pdfmake'
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
// import moment from 'moment-timezone'
import printJS from 'print-js'
export default {
  components: {
  },
  data () {
    return {
      checkLoad: false,
      shopName: '',
      shopImg: ''
    }
  },
  // eslint-disable-next-line space-before-function-paren
  async mounted() {
    // this.getServiceType()
    await this.getShop()
  },
  methods: {
    async getShop () {
      let shopImg = ''
      await axios
        .get(this.DNS_IP + '/sys_shop/get?shopId=' + this.$session.getAll().data.shopId)
        .then(async response => {
          let rs = response.data
          if (rs.length > 0) {
            this.shopName = rs[0].shopName
            shopImg = rs[0].imageBase64 || ''
          } else {
            this.shopName = ''
            this.shopImg = ''
            shopImg = ''
          }
          if (shopImg !== '') {
            this.shopImg = shopImg
          } else {
            this.shopImg = ''
          }
        })
    },
    async printQrcodeBK (value, jobitem, dataGetJob) {
      console.log(value, jobitem, dataGetJob)
    },
    async printQrcode (value, jobitem, item, valueStep) {
      console.log(value, jobitem)
      let docDefinition = {}
      let valueName = {}
      let valuePhone = {}
      if (jobitem.filter(el => { return el.name === 'ชื่อ' }).length > 0) {
        valueName = {
          text: 'ชื่อ : ' + jobitem.filter(el => { return el.name === 'ชื่อ' })[0].value,
          // text: '*ทางโรงพยาบาลขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
          fontSize: 15,
          alignment: 'center'
        }
      } else {
        valueName = {
          text: '   ',
          fontSize: 1,
          widths: ['*']
        }
      }
      if (jobitem.filter(el => { return el.name === 'เบอร์โทร' }).length > 0) {
        valuePhone = {
          text: 'เบอร์โทร : ' + jobitem.filter(el => { return el.name === 'เบอร์โทร' })[0].value,
          // text: '*ทางโรงพยาบาลขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
          fontSize: 15,
          alignment: 'center'
        }
      } else {
        valuePhone = {
          text: '   ',
          fontSize: 1,
          widths: ['*']
        }
      }
      if (this.shopImg === '') {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              alignment: 'center',
              text: item.flowName,
              fontSize: 30,
              widths: ['*']
            },
            // {
            //   text: [
            //     {alignment: 'center', text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
            //     {alignment: 'center', text: item.storeFrontQueue, fontSize: 120, color: 'black'}
            //   ]
            // // alignment: 'center',
            // // style: 'tableExample',
            // // table: {
            // //   heights: [50],
            // //   widths: ['*'],
            // //   body: [
            // //     [
            // //       {
            // //         text: [
            // //           {text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
            // //           {text: item.storeFrontQueue, fontSize: 120, color: 'black'}
            // //         ],
            // //         border: [false, false, false, false]
            // //         // fillColor: '#092C4C'
            // //       }
            // //     ]
            // //   ]
            // // }
            // },
            {
              text: 'QR Code สำหรับรับการแจ้งเตือน',
              fontSize: 25,
              alignment: 'center'
            },
            { qr: value, fit: '200', alignment: 'center' },
            {
              text: '   ',
              fontSize: 5,
              widths: ['*']
            },
            valueName,
            valuePhone,
            {
              text: '   ',
              fontSize: 5,
              widths: ['*']
            },
            {
              columns: [
                {
                  fontSize: 15,
                  alignment: 'center',
                  text: 'วันที่ ' + item.dueDateText.split(' ')[0]
                }
              ]
            },
            {
              text: '................................................',
              style: 'subheader',
              widths: ['*'],
              alignment: 'center'
            },
            {
              text: 'QR Code สำหรับเจ้าหน้าที่',
              fontSize: 25,
              alignment: 'center'
            },
            { qr: valueStep, fit: '200', alignment: 'center' }
          ],
          styles: {
            header: {
              fontSize: 30,
              bold: true
            },
            subheader: {
              fontSize: 29,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      } else {
        docDefinition = {
          pageSize: 'A4',
          content: [
            {
              text: this.shopName,
              style: 'header',
              alignment: 'center'
            },
            {
              image: 'mySuperImage',
              width: 150,
              alignment: 'center'
            },
            // {
            //   text: '   ',
            //   style: 'header',
            //   widths: ['*']
            // },
            // {
            //   text: '   ',
            //   style: 'subheader',
            //   widths: ['*']
            // },
            // {
            //   columns: [
            //     {
            //       style: 'subheader',
            //       text: 'รับคิวเวลา'
            //     },
            //     {
            //       style: 'subheader',
            //       text: item.timeText,
            //       alignment: 'right'
            //     }
            //   ]
            // },
            {
              alignment: 'center',
              text: item.flowName,
              fontSize: 30,
              widths: ['*']
            },
            // {
            //   text: [
            //     {alignment: 'center', text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
            //     {alignment: 'center', text: item.storeFrontQueue, fontSize: 120, color: 'black'}
            //   ]
            //   // alignment: 'center',
            //   // style: 'tableExample',
            //   // table: {
            //   //   heights: [50],
            //   //   widths: ['*'],
            //   //   body: [
            //   //     [
            //   //       {
            //   //         text: [
            //   //           {text: 'หมายเลขคิวของคุณ\n', fontSize: 20, color: 'black'},
            //   //           {text: item.storeFrontQueue, fontSize: 120, color: 'black'}
            //   //         ],
            //   //         border: [false, false, false, false]
            //   //         // fillColor: '#092C4C'
            //   //       }
            //   //     ]
            //   //   ]
            //   // }
            // },
            {
              text: 'QR Code สำหรับรับการแจ้งเตือน',
              fontSize: 15,
              alignment: 'center'
            },
            { qr: value, fit: '200', alignment: 'center' },
            {
              text: '   ',
              fontSize: 5,
              widths: ['*']
            },
            valueName,
            valuePhone,
            {
              text: '   ',
              fontSize: 5,
              widths: ['*']
            },
            // {
            //   text: '*ทางบริษัทขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
            //   // text: '*ทางโรงพยาบาลขอสงวนสิทธิ์ในการข้ามคิว กรณีลูกค้าไม่แสดงตน',
            //   fontSize: 15,
            //   alignment: 'center'
            // },
            // {
            //   text: '   ',
            //   fontSize: 25,
            //   widths: ['*']
            // },
            {
              columns: [
                {
                  fontSize: 15,
                  alignment: 'center',
                  text: 'วันที่ ' + item.dueDateText.split(' ')[0]
                }
              ]
            },
            {
              text: '................................................',
              style: 'subheader',
              widths: ['*'],
              alignment: 'center'
            },
            {
              text: 'QR Code สำหรับเจ้าหน้าที่',
              fontSize: 25,
              alignment: 'center'
            },
            { qr: valueStep, fit: '200', alignment: 'center' }
          ],
          images: {
            mySuperImage: this.shopImg

            // in browser is supported loading images via url (https or http protocol) (minimal version: 0.1.67)
            // snow: this.shopImg

            // is supported loading images via url with custom headers (minimal version: 0.2.5)
            // strawberries: {
            //   url: 'https://picsum.photos/id/1080/367/267',
            //   headers: {
            //     myheader: '123',
            //     myotherheader: 'abc',
            //   }
            // }
          },
          styles: {
            header: {
              fontSize: 30,
              bold: true
            },
            subheader: {
              fontSize: 29,
              bold: true
            },
            quote: {
              italics: true
            },
            small: {
              fontSize: 8
            },
            defaultStyle: {
              columnGap: 20
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            }
          },
          defaultStyle: { // 4. default style 'KANIT' font to test
            font: 'Kanit'
          }
        }
      }
      pdfMake.vfs = pdfFonts.pdfMake.vfs // 2. set vfs pdf font
      pdfMake.fonts = {
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
        // Kanit Font
        Kanit: { // 3. set Kanit font
          normal: 'Kanit-Regular.ttf',
          bold: 'Kanit-Medium.ttf',
          italics: 'Kanit-Italic.ttf',
          bolditalics: 'Kanit-MediumItalic.ttf'
        }
      }
      // pdfMake.createPdf(docDefinition).open({}, window)
      // pdfMake.createPdf(docDefinition).print({}, window)

      // pdfMake.createPdf(docDefinition).print()
      // this.$scope.generatePdf = function () {
      // create the window before the callback
      // win.close()
      // }

      pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
        // document.getElementById('pdfV').src = outDoc
        let dataReplate = outDoc.replace('data:application/pdf;base64,', '')
        printJS({printable: dataReplate, type: 'pdf', base64: true})
      })
      this.overlay = true
      // var pdfFrame = window.frames['pdfV']
      // pdfFrame.print()
      // this.dialogPrint = true
    }
  }
}
</script>
