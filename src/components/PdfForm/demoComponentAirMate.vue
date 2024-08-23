<template>
  <v-main>
    <div class="col-md-12 ml-sm-auto col-lg-12 px-4 ">
      <v-card>
        <v-row>
          <v-col col-md="12">multiUpload</v-col>
        </v-row>
        <v-row>
          <v-col col-md="12">
            <multiUpload
              TitleTxt="BEFORE"
              TypeKey="beforeImage"
              @ReturnURL="getUrl"
            ></multiUpload>
          </v-col>
        </v-row>
        <v-row>
          <v-col col-md="12">
            <multiUpload
              TitleTxt="AFTER"
              TypeKey="afterImage"
              @ReturnURL="getUrl"
            ></multiUpload>
          </v-col>
        </v-row>

        <v-row>
          <v-col col="12">
            <h2>test Multiupload</h2>
          </v-col>
          <v-col col="12">
            <v-btn color="Success" class="text-white" @click="saves">
              <v-icon center>mdi-printer</v-icon>
              testSendMultidata
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col col-md="12"><h2>ตัวอย่าง Download PDF</h2></v-col>
        </v-row>
        <v-row>
          <v-col col="12" class="text-center">
            <PdfAirMate
              DetialData="null"
              TypePDF="download"
              NameFiles="test_file_name"
              :getImgSignature="imgSignature"
            ></PdfAirMate>
          </v-col>
        </v-row>
        <v-row>
          <v-col col-md="12"><h2>ตัวอย่าง ลายเช็น</h2></v-col>
        </v-row>
        <v-row>
          <SignaturePad
            ShowBtnSave="true"
            @ReturnImgBase64="getImgSignature"
          ></SignaturePad>
        </v-row>
        <v-row>
          <v-col col="12">
            <h2>test Send Signature</h2>
          </v-col>
          <v-col col="12">
            <v-file-input
              v-show="true"
              v-model="imageBase64"
              :id="`imageBase64`"
              v-bind:src="imgSignature"
              hide-input
              style="display: none"
              accept="image/*"
            >
            </v-file-input>
          </v-col>
          <v-col col="12">
            <v-btn
              color="Success"
              class="text-white"
              @click="sendSignatureTest"
            >
              <v-icon center>mdi-printer</v-icon>
              testSendMultidata
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-main>
</template>

<script>
// import Vue from 'vue'
import SignaturePad from '../SignaturePad/SignaturePad.vue'
import PdfAirMate from './PdfAirMate.vue'
import multiUpload from './multiUpload.vue'
import axios from 'axios' // api

// Vue.use(VueSignaturePad)
export default {
  components: {
    SignaturePad,
    PdfAirMate,
    multiUpload
  },
  data () {
    return {
      imageBA: null,
      imgSignature: null,
      imageData: {
        beforeImage: [],
        afterImage: []
      },
      imageDataVal: {
        beforeImage: [],
        afterImage: []
      },
      imageBase64: null
    }
  },

  async mounted () {},
  methods: {
    async sendSignatureTest () {
      console.log('>>>>', this.imageBase64)
    },
    async testFn () {
      console.log('>>>>', this.imageBA) // ใช้ตัวนี้ในการส่งค่าไปยังหลังบ้าย เพื่ออัพโหลด //
    },
    async getImgSignature (x) {
      console.log('xxxxx : ', x)
      let params = new FormData()
      const headers = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      for (const i of [x]) { // [x] กรณี อัพโหลดแบบ ไม่ใช้ multi  หากกรณีที่ใช้ multiupload ไม่ต้องใส่ [] สามารถใส่ x ได้เลย
        params.append('files', i)
      }
      params.append('shopId', 'shopId123')
      params.append('bookNo', 'bookNo123')
      params.append('jobNo', 'jobNo123')
      params.append('CREATE_USER', 'CREATE_USER123')
      console.log('params : ', params)
      const resP = await axios.post(
        `http://localhost:5001/signature/upload`,
        params,
        headers
      )
      console.log(resP)
    },
    async getUrl (x) {
      this.imageData[x.key] = x.data
      this.imageDataVal[x.key] = x.vals // ใช้ตัวนี้ในการส่งค่าไปยังหลังบ้าย เพื่ออัพโหลด //
    },
    async saves () {
      let params = new FormData()
      const headers = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      for (const [ks, vs] of Object.entries(this.imageDataVal)) {
        if (vs.length > 0) {
          for (const i of vs) { // [x] กรณี อัพโหลดแบบ ไม่ใช้ multi  หากกรณีที่ใช้ multiupload ไม่ต้องใส่ [] สามารถใส่ x ได้เลย
            console.log('>>>>>>> ', i)
            params.append('files', i)
            params.append('typeFile', ks)
          }
        } else {
          alert('กรุณาแนวไฟล์', ks)
          return false
        }
      }
      const resP = await axios.post(
        `http://localhost:5001/file/upload/multifile`,
        params,
        headers
      )
      console.log(resP)
      let arrData = []
      if (resP.data.length) {
        for (const d of resP.data) {
          arrData.push({
            'jobId': '',
            'typeUpload': d.types,
            'beforeafter': d.url,
            'status': 'New', // default
            'CREATE_USER': '',
            'LAST_USER': ''
          })
        }
      }
      // console.log('arrData', arrData)
      await this.saveUrlBA(arrData)
    },
    async saveUrlBA (multiUrl) {
      await axios
        .post(this.DNS_IP + '/jobBeforeAfter/addMulti', multiUrl)
        .then(async response => {
          await this.checkEmpJob()
        })
    },

    async checkEmpJob () {
      this.itemJob = []
      let params = null
      if (this.selectFlow === 'All') {
        params = this.DNS_IP + '/job/getList?shopId=' + this.$session.getAll().data.shopId + '&empStep=' + this.$session.getAll().data.empId + '&checkOnsite=True'
      } else {
        params = this.DNS_IP + '/job/getList?shopId=' + this.$session.getAll().data.shopId + '&empStep=' + this.$session.getAll().data.empId + '&flowId=' + this.selectFlow
      }
      await axios
        .get(params)
        .then(async response => {
          let rs = response.data
          console.log('rs!!!!!!!!!', rs)
          if (rs.status === false) {
            this.itemJob = []
          } else {
            for (let i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (d.userId !== null) {
                if (d.sortNo >= 2) {
                  await axios
                    .get(
                      this.DNS_IP + '/jobBeforeAfter/get?jobId=' + d.jobId
                    )
                    .then(async responses => {
                      if (responses.data.status === false) {
                        d.dataBeforeAfter = [{'beforeImage': null, 'afterImage': null, 'filesBefore': null, 'filesAfter': null}]
                        let dajobBeforeAfter = {
                          jobId: d.jobId,
                          CREATE_USER: this.$session.getAll().data.userName,
                          LAST_USER: this.$session.getAll().data.userName
                        }
                        await axios
                          .post(this.DNS_IP + '/jobBeforeAfter/add', dajobBeforeAfter)
                          .then(async responses => {
                          })
                      } else {
                        d.dataBeforeAfter = responses.data.reverse()
                      }
                    })
                }
                d.dataShow = d.dueDateD + ' ' + this.monthNamesThai[parseInt(d.dueDateM)]
                this.itemJob.push(d)
              }
            }
            console.log('this.itemJob', this.itemJob)
            if (this.itemJob.filter((item) => item.sortNo >= 2).length === 1) {
            // console.log('???')
              this.jobLog_jobNo = this.itemJob.filter((item) => item.sortNo >= 2)[0].jobNo
            }
            console.log('checkIF!!!!!!!!!!!!Sort2', this.jobLog_jobNo)
          }
        })
    }
  }
}
</script>

<style>
/* Your component-specific styles here */
</style>
