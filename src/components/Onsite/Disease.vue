<template>
   <div>
     <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
     <v-main>
       <v-dialog
       v-model="dialogMain"
     >
       <v-card style="border-radius: 0px;">
         <v-card-title style="display: flex;justify-content: space-between;" class="pt-10">
            <h2 class="text-center">บันทึกข้อมูลการรักษา</h2>
            <v-btn
               class="mx-2"
               icon
               color="black"
               @click="dialogMain = false"
             >
               <v-icon dark large>
                 mdi-close-circle
               </v-icon>
             </v-btn>
         </v-card-title>
         <v-container>
            <v-row v-if="diseases" no-gutters>
              <v-col cols="12" v-for="(disease, index) in diseases" v-bind:key="index">
                <template v-if="disease.dId !== '8ac526ca-50ed-4df4-8481-73d6ccc17658'">
                  <b>{{ disease.thaiName }}</b>
                  <v-row no-gutters class="pt-2">
                    <v-col cols="6" v-for="item in disease.diseaseAttibute" v-bind:key="item.daId" no-gutters>
                      <v-text-field
                        v-if="item.type !== 'IMAGE'"
                        v-model="updateData[item.daId]"
                        :label="item.thaiName"
                        placeholder=""
                        outlined
                        dense
                        class="mb-0 pb-0 mr-3"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </template>
              </v-col>
              <!-- "e376be6f-7be8-4c2b-89d2-9ee2055edcd5" -->
              <v-col cols="12">
                <v-textarea
                  v-model="updateData['e376be6f-7be8-4c2b-89d2-9ee2055edcd5']"
                  label="ข้อมูลเพิ่มเติม"
                  placeholder=""
                  outlined
                  dense
                  class="mb-0 pb-0 mr-3"
                ></v-textarea>
              </v-col>
            </v-row>
         </v-container>
         <v-row>
          <v-col cols="6" class="text-center">
            <v-btn
              x-large
              rounded
              class="btnCL mx-auto mt-8"
              color="primary"
              @click="submitData"
              >บันทึก
            </v-btn>
          </v-col>
          <v-col cols="6" class="text-center">
            <v-btn
              x-large
              rounded
              class="btnCL mx-auto mt-8"
              color="warning"
              @click="closeDialog"
              >ปิด
            </v-btn>
          </v-col>
         </v-row>
       </v-card>
     </v-dialog>
     </v-main>
   </div>
 </template>
<script>
import axios from 'axios' // api

export default {
  name: 'Disease',
  components: {
  },
  watch: {
  },
  data () {
    return {
      APIURL: 'https://api-uat.doctorasa.co/api/data/graphql',
      jobData: null,
      valid: true,
      dialogMain: false,
      selected: [],
      typeMain: '',
      accessToken: null,
      diseases: null,
      diseasesType: [],
      updateData: [],
      name: null,
      tel: null,
      patientUser: null,
      newUser: false,
      joyRidePatient: null,
      joyRideDisease: []
    }
  },
  async mounted () {
  },
  methods: {
    initUpdateData () {
      this.updateData = []
      this.diseases.forEach((row) => {
        row.diseaseAttibute.forEach((row2) => {
          let oldData = this.joyRideDisease.filter((r) => { return r.daId === row2.daId })
          this.updateData[row2.daId] = (oldData.length > 0) ? oldData[0].value : ''
          this.diseasesType[row2.daId] = row2.type
          console.log('newUser', this.newUser)
        })
      })
    },
    async addListDisease () {
      this.diseases.forEach(async (row) => {
        row.diseaseAttibute.forEach(async (row2) => {
          await this.addJoyRideDisease(row2.daId)
        })
      })
    },
    async openDialog (item, data) {
      this.jobData = item
      if (data.filter(el => { return el.fieldId === '1215' }).length > 0) {
        this.name = data.filter(el => { return el.fieldId === '1215' })[0].fieldValue
      }
      if (data.filter(el => { return el.fieldId === '1216' }).length > 0) {
        this.tel = data.filter(el => { return el.fieldId === '1216' })[0].fieldValue
      }
      await this.getToken()
      await this.getDisease()
      await this.checkPhoneExist()
      await this.getJoyRidePatient()
      if (!this.patientUser.phoneExist || this.patientUser.phoneExist === null) {
        this.newUser = true
        await this.registerPatient()
      }
      if (this.joyRidePatient.status === false) {
        await this.addJoyRidePatient()
        await this.addListDisease()
      }
      await this.getJoyRideDisease()
      await this.initUpdateData()
      this.clearFormAdd()
      this.dialogMain = true
    },
    async getJoyRideDisease () {
      try {
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_disease/get?jobNo=${this.jobData['jobNo']}`
        }
        await axios.request(config).then((response) => {
          console.log(response.data.status || response.data.status === false)
          if (response.data.status || response.data.status === false) {
            this.joyRideDisease = []
          } else {
            this.joyRideDisease = response.data
          }
          console.log('this.joyRideDisease', this.joyRideDisease)
        }).catch((error) => {
          console.log(error)
        })
      } catch (err) {
        console.log('getJoyRideDisease', err)
      }
    },
    async getJoyRidePatient () {
      try {
        this.joyRidePatient = null
        let config = {
          method: 'get',
          url: `${this.DNS_IP}/joyride_patient/get?jobNo=${this.jobData['jobNo']}`
        }
        await axios.request(config).then((response) => {
          this.joyRidePatient = response.data
        }).catch((error) => {
          console.log(error)
        })
      } catch (err) {
        console.log('getJoyRidePatient', err)
      }
    },
    async closeDialog (item) {
      this.clearFormAdd()
      this.jobData = item
      this.dialogMain = false
    },
    async getToken () {
      let data = JSON.stringify({
        query: `mutation loginPartner ($data: UsersLoginPartnerInput!) {
    loginPartner (data: $data) {
        refreshToken
        accessToken
    }
}`,
        variables: {'data': {'identifyId': 'joyride', 'password': '111111'}}
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIURL,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      await axios.request(config)
        .then((response) => {
          this.accessToken = response.data.data.loginPartner.accessToken
          console.log(this.accessToken)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async checkPhoneExist () {
      let data = JSON.stringify({
        query: `query phoneExist ($where: UserWhereInput!) {
    phoneExist (where: $where) {
        hnId
        prefix
        uId
        firstname
        lastname
    }
}`,
        variables: {'where': {'UserAuth': {'is': {'phoneNumber': {'equals': this.tel}}}}}
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIURL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        data: data
      }

      await axios.request(config)
        .then((response) => {
          this.patientUser = response.data.data
          console.log(this.patientUser)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async registerPatient () {
      let data = JSON.stringify({
        query: `mutation createPatientApi ($data: UserCreateInput!) {
    createPatientApi (data: $data) {
        uId
    }
}`,
        variables: {
          'data': {
            'prefix': 'คุณ', // บังคับกรอก
            'firstname': this.name, // บังคับกรอก
            'lastname': '.', // บังคับกรอก
            'ercId': '456eec80-8f5f-418c-9fd4-8c2101a43ea6', // อันนี้ไม่ต้องเปลี่ยนนะครับ
            'role': {
              'connect': {
                'urId': ''
              }
            },
            'UserAuth': {
              'create': {
                'phoneNumber': this.tel, // บังคับกรอก
                'identifyId': '3101201361561', // บังคับกรอก เลขบัตรประจำตัวประชาชน 13 หลัก
                'email': '',
                'password': 'joyride123qweasdzxc' // บังคับกรอก
              }
            },
            'UserMedicalDemograhicData': {
              'create': {
                'birthdate': '2024-04-09T09:54:33Z', // บังคับกรอก
                'gender': 'ชาย', // บังคับกรอก
                'district': 'พระนคร', // บังคับกรอก
                'province': 'กรุงเทพ' // บังคับกรอก
              }
            }
          }
        }
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIURL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        data: data
      }

      await axios.request(config)
        .then(async (response) => {
          await this.checkPhoneExist()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getDisease () {
      let data = JSON.stringify({
        query: `query getDiseases($where: DiseaseWhereInput){
  getDiseases(where: $where) {
    dId
    engName
    thaiName
    diseaseAttibute {
        daId
        type
        engName
        thaiName
        medName
        minValuePos
        maxValuePos
        condition
    }
    type
  }
}`,
        variables: {'where': {'type': {'equals': 'SPECIFIC'}}}
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIURL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        data: data
      }

      await axios.request(config)
        .then((response) => {
          this.diseases = response.data.data.getDiseases
          console.log(this.diseases)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async clearFormAdd () {
    },
    async submitData () {
      this.$swal({
        title: 'ยืนยันการบันทึกข้อมูล?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#b3b1ab',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then(async response => {
        let dataSend = []
        for (const key in this.updateData) {
          let value = this.updateData[key]
          await this.updateJoyRideDisease(key, this.updateData[key])
          console.log(this.diseasesType[key])
          if (this.diseasesType[key] === 'FLOAT') {
            value = parseInt(value)
          }
          if (value) {
            dataSend.push({'daId': key, 'value': value})
          }
        }
        await this.sendData(dataSend)
        this.closeDialog()
      })
    },
    async sendData (dataSend) {
      console.log('dataSend', dataSend)
      let data = JSON.stringify({
        query: `mutation createMedicalDataApi($data: UserMedicalDataCreateInput!) {
  createMedicalDataApi(data: $data) {
    umdId
  }
}`,
        variables: {
          'data': {
            'patientUser': {
              'connect': {'uId': this.patientUser.phoneExist.uId}
            },
            'submitUser': {
              'connect': {'uId': ''}
            },
            'dataInputFlag': true,
            'userMedTrasaction': {
              'createMany': {
                'data': dataSend
              }
            }
          }
        }
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: this.APIURL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        data: data
      }

      axios.request(config)
        .then((response) => {
          console.log('createMedicalDataApi', JSON.stringify(response.data))
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async addJoyRidePatient () {
      try {
        const params = {
          jobNo: this.jobData['jobNo'],
          lineUserId: this.jobData['userId'],
          patientUserId: this.patientUser.phoneExist.uId,
          patientTel: this.tel,
          patientName: this.name
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_patient/add`,
          data: params
        }
        await axios.request(config)
      } catch (err) {
        console.log('addJoyRidePatient', err)
      }
    },
    async updateJoyRideDisease (daId, value) {
      try {
        const params = {
          value: value
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_disease/edit/${daId}`,
          data: params
        }
        await axios.request(config)
      } catch (err) {
        console.log('joyride_disease/edit', err)
      }
    },
    async addJoyRideDisease (daId) {
      try {
        const params = {
          jobNo: this.jobData['jobNo'],
          lineUserId: this.jobData['userId'],
          patientUserId: this.patientUser.phoneExist.uId,
          daId: daId,
          value: ''
        }
        let config = {
          method: 'post',
          url: `${this.DNS_IP}/joyride_disease/add`,
          data: params
        }
        await axios.request(config)
      } catch (err) {
        console.log('joyride_disease', err)
      }
    }
  }
}
</script>
 <style scoped>
 .v-select__slot {
   white-space: normal;
   word-break: break-all;
 }
 .btnCenter{
   display: flex;
   justify-content: center;
 }
 .btnCL{
   width: 50%;
 }
 .textTitle {
   color:black;
 }
 </style>
