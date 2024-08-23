<template>
  <div>
    <v-dialog v-model="dialogDeposit" persistent max-width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">คืนเงินมัดจำ</span>
        </v-card-title>
        <v-card-text v-if="pictureUrlPreviewDeposit === ''">
          <v-alert dense border="left" type="warning">
            <strong>ไม่มี รูปหลักฐานการมัดจำ</strong>
          </v-alert>
          <v-file-input
            required
            :rules="[rules.resizeImag]"
            counter
            show-size
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="รูปหลักฐานการคืนมัดจำ"
            @change="selectImgDeposit"
            v-model="filesDeposit"
          ></v-file-input>
        </v-card-text>
        <v-card-text v-else>
          <v-container>
            <v-form ref="form_deposit" v-model="valid_deposit" lazy-validation>
              <v-row justify="center">
                <v-col cols="12" class="text-center">
                  <v-img
                    aspect-ratio="6"
                    height="500"
                    contain
                    @click="gotoPicture(pictureUrlPreviewDeposit)"
                    :src="pictureUrlPreviewDeposit"
                  ></v-img>
                  <br />
                  <v-file-input
                    required
                    :rules="[rules.resizeImag]"
                    counter
                    show-size
                    accept="image/png, image/jpeg, image/bmp"
                    prepend-icon="mdi-camera"
                    label="รูปหลักฐานการมัดจำ"
                    @change="selectImgDeposit"
                    v-model="filesDeposit"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            elevation="2"
            x-large
            color="red darken-1"
            text
            @click="(dialogDeposit = false), (pictureUrlPreviewDeposit = null)"
            :loading="loadingDeposit"
            :disabled="loadingDeposit"
          >
            <v-icon left> mdi-cancel</v-icon>
            ปิด
          </v-btn>
          <v-btn
            elevation="2"
            x-large
            color="success"
            text
            @click="editStatusDeposit()"
            :loading="loadingDeposit"
            :disabled="loadingDeposit"
          >
            <v-icon left>mdi-checkbox-marked-circle</v-icon>
            อัพเดท
          </v-btn>
          <v-btn
            v-if="statusDeposit === true"
            elevation="2"
            x-large
            color="error"
            text
            @click="cancelStatusDeposit()"
            :loading="loadingDeposit"
            :disabled="loadingDeposit"
          >
            <v-icon left>mdi-checkbox-marked-circle</v-icon>
            ยกเลิกสถานะคืนเงินมัดจำ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios' // api
export default {
  components: {
  },
  data () {
    return {
      BookingDataList: [],
      loadingDeposit: false,
      statusDeposit: false,
      dialogDeposit: false,
      pictureUrlDeposit: null,
      pictureUrlPreviewDeposit: null,
      filesDeposit: null,
      valid_deposit: true,
      bookNo: '',
      rules: {
        numberRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        counterTel: value => value.length <= 10 || 'Max 10 characters',
        IDcardRules: value =>
          (!isNaN(parseFloat(value)) && value >= 0 && value <= 9999999999999) ||
          'กรุณากรอกตัวเลข 0 ถึง 9',
        required: value => !!value || 'กรุณากรอก.',
        resizeImag: value =>
          !value ||
          value.size < 2000000 ||
          'Avatar size should be less than 2 MB!',
        counterIDcard: value => value.length <= 13 || 'Max 13 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  async mounted () {
  },
  methods: {
    setData (item) {
      console.log('setData', item)
      if (item.depositReturnImge !== '') {
        this.statusDeposit = true
      } else {
        this.statusDeposit = false
      }
      this.pictureUrlPreviewDeposit = item.depositReturnImge
      this.bookNo = item.bookNo
      this.dialogDeposit = true
    },
    gotoPicture (Linkitem) {
      window.open(Linkitem, '_blank')
    },
    async editStatusDeposit () {
      this.loadingDeposit = true
      if (this.filesDeposit) {
        const _this = this
        let configDepositUpload = {
          headers: {
            'bookNo': this.bookNo
          }
        }
        let params = new FormData()
        params.append('file', this.filesDeposit)
        await axios
          .post(this.DNS_IP + `/file/upload/depositReturn`, params, configDepositUpload)
          .then(function (response) {
            _this.pictureUrlDeposit = response.data
            console.log('url Pic', response.data)
          })
      } else {
        this.pictureUrlDeposit = this.pictureUrlPreviewDeposit
      }
      let dt = {
        depositStatus: 'False',
        depositReturnImge: this.pictureUrlDeposit,
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'อัพเดทหลักฐานเงินมัดจำเรียบร้อย', 'success')
          this.pushMsgCustomer(this.bookNo)
          this.$root.$emit('dataReturn', this.bookNo)
          this.dialogDeposit = false
          this.pictureUrlDeposit = null
          this.filesDeposit = null
          this.loadingDeposit = false
          this.pictureUrlPreviewDeposit = null
        })
    },
    async cancelStatusDeposit () {
      this.loadingDeposit = true
      console.log('bookNo', this.bookNo)
      let dt = {
        depositStatus: 'True',
        depositReturnImge: 'is null',
        LAST_USER: this.$session.getAll().data.userName
      }
      await axios
        .post(
          // eslint-disable-next-line quotes
          this.DNS_IP + "/Booking/edit/" + this.bookNo,
          dt
        )
        .then(async response => {
          this.$swal('เรียบร้อย', 'อัพเดทหลักฐานเงินมัดจำเรียบร้อย', 'success')
          this.pictureUrlDeposit = null
          this.filesDeposit = null
          this.loadingDeposit = false
          this.dialogDeposit = false
          this.statusDeposit = false
          this.pictureUrlPreviewDeposit = null
        })
    },
    pushMsgCustomer (bookNo) {
      axios
        .post(
          this.DNS_IP + '/Booking/pushMsgCustomerReturnDeposit/' + bookNo
        )
        .catch(error => {
          console.log('error function addData : ', error)
        })
    },
    selectImgDeposit () {
      if (this.filesDeposit) {
        this.pictureUrlPreviewDeposit = URL.createObjectURL(this.filesDeposit)
      } else {
        this.pictureUrlPreviewDeposit = ''
      }
      // console.log(event)
    }
  }
}
</script>
