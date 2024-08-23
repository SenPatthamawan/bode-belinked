<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-row class="no-gutters">
          <v-col cols="12" md="6" lg="6" class="text-left">
            <v-breadcrumbs :items="breadcrumbs" id="v-step-4"></v-breadcrumbs>
          </v-col>
        </v-row>
        <v-row >
          <v-col cols="6">
            <v-menu
              ref="menu"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="dateEvent"
                  label="วันที่ออกใบเสร็จ"
                  persistent-hint
                  dense
                  outlined
                  readonly
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
              </template>
              <v-date-picker
              v-model="dateEvent"
              no-title
              @input="menu1 = false, exportTest()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- <v-col cols="6">
            <v-btn
              class="ma-2"
              outlined
              color="indigo"
              @click="exportTest()"
            >
              Outlined Button
            </v-btn>
          </v-col> -->
        </v-row>
        <iframe id='pdfV' style="width:100%; height: 1200px"> </iframe>
      </div>
    </v-main>
  </div>
</template>
<script>
import pdfMake from 'pdfmake'
import adminLeftMenu from '../Sidebar.vue' // เมนู
import pdfFonts from '../../assets/custom-fonts.js' // 1. import custom fonts
import axios from 'axios' // api
export default {
  components: {
    'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'พิมพ์ใบเสร็จ',
          disabled: false,
          href: '/PrintPdf/PrintInvoice'
        }
      ],
      menu1: false,
      dateEvent: '',
      session: this.$session.getAll()
    }
  },
  async mounted () {
    if (!this.$session.exists()) {
      if (this.$route.query.dateEvent) {
        this.$router.push('/Core/Login?dateEvent=' + this.$route.query.dateEvent + '&type=printInvoice')
      } else {
        this.$router.push('/Core/Login')
      }
      // this.$router.push('/Core/Login?bookNo=' + this.$route.query.bookNo + '&shopId=' + this.$route.query.shopId)
    } else {
      if (this.$route.query.dateEvent) {
        this.dateEvent = this.$route.query.dateEvent
        this.exportTest()
      }
    }
  },
  methods: {
    async exportTest () {
      if (this.dateEvent !== '') {
        await axios
          .get(
            this.DNS_IP + '/system_shop_Payment/get?shopId=' + this.$session.getAll().data.shopId + '&paymentDate=' + this.dateEvent
          )
          .then(async response1 => {
            let rs = response1.data
            if (rs.status === false) {
              this.$swal('ผิดพลาด', 'ไม่มีข้อมูล', 'error')
            } else {
              let data = rs[0]
              const docDefinition = {
                pageSize: 'A4',
                content: [
                  {
                    columns: [
                      {
                        width: 100,
                        height: 100,
                        absolutePosition: {x: 30, y: 10},
                        image: 'data:image/jpeg;base64,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'
                      },
                      {
                        text: 'ใบเสร็จ',
                        style: 'header',
                        fontSize: 40,
                        color: 'black',
                        bold: true
                      },
                      {
                        text: 'บริษัท บีแทสก์ คอนซัลติ้ง จำกัด\nเลขที่ 345 หมู่ที่ 3 ตำบลบ้านใหม่ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120\n 02 584 7060 | 086-381-1111'
                      }
                    ]
                  },
                  {
                    text: '\nBill to',
                    style: 'header',
                    fontSize: 14,
                    color: 'black',
                    bold: true
                  },
                  {
                    text: this.$session.getAll().data.shopName,
                    fontSize: 14,
                    color: 'black'
                  },
                  {
                    text: this.$session.getAll().data.contactTel,
                    fontSize: 14,
                    color: 'black'
                  },
                  '\n',
                  {
                    style: 'tableExample',
                    table: {
                      widths: ['*', 'auto'],
                      body: [
                        [{text: 'Description', style: 'tableHeader'}, {text: 'Amount(THB)', style: 'tableHeader'}],
                        [data.packet,
                          {text: data.net, noWrap: true, alignment: 'right'}]
                      ]
                    },
                    layout: 'lightHorizontalLines'
                  },
                  {
                    columns: [
                      {},
                      {
                        style: 'tableExample',
                        table: {
                          widths: ['*', 'auto'],
                          body: [
                            ['Subtotal in THB',
                              {text: data.net, noWrap: true, alignment: 'right'}],
                            ['Fee Vat',
                              {text: parseFloat(data.feeVat) + parseFloat(data.fee), noWrap: true, alignment: 'right'}],
                            ['Total in THB',
                              {text: data.amount, noWrap: true, alignment: 'right'}]
                          ]
                        },
                        layout: 'lightHorizontalLines'
                      }
                    ]
                  }
                ],
                styles: {
                  header: {
                    fontSize: 18,
                    bold: true
                  },
                  bigger: {
                    fontSize: 15,
                    italics: true
                  },
                  nomal: {
                    fontSize: 15
                  },
                  tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                  }
                },
                defaultStyle: { // 4. default style 'KANIT' font to test
                  font: 'Kanit'
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
              pdfMake.createPdf(docDefinition).getDataUrl(function (outDoc) {
                document.getElementById('pdfV').src = outDoc
              })
            }
          })
      } else {
        this.$swal('ผิดพลาด', 'กรุณาเลือกวันที่', 'error')
      }
    }
  }
}
</script>
<style scope>
.main{
  background-color: #F5F5F5;
  border-radius: 1rem;
}
.content{
  padding: 1rem;
}
</style>
