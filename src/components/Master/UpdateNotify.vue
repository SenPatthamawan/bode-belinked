<template>
  <main>
    <v-container>
      <br>
      <br>
      <v-card>
        <v-container>
          <v-card-text>
          <v-row justify="center">
              <h3 class="underline-01">ลงทะเบียนเข้าใช้งาน</h3>
          </v-row>
          <v-row justify="center">
            <h4>เพื่อรับการแจ้งเตือน</h4>
          </v-row>
          </v-card-text>
          <hr>
            <v-card-text>
           <v-row justify="center">
              <!-- <v-img :src="require('@/assets/LINE_ALBUM_220214_0.jpg')" max-width="150"></v-img> -->
           </v-row>
           </v-card-text>
           <hr>
        </v-container>
      </v-card>
    </v-container>
  </main>
</template>
<style scoped>
.underline-01 {
  background-image: linear-gradient(90deg, #e67399, #f2a640);
  background-position: bottom;
  background-size: 100% 10%;
  background-repeat: no-repeat;
}
</style>
<script>
import axios from 'axios' // api
// import moment from 'moment-timezone'
export default {
  data () {
    return {
      shopId: '',
      type: '',
      flowId: ''
    }
  },
  async mounted () {
    console.log('shopId', this.$route.query.shopId)
    console.log('state', this.$route.query.state)
    console.log('code', this.$route.query.code)
    await this.getAccessToken()
  },
  methods: {
    async getAccessToken () {
      var data = {
        'code': this.$route.query.code,
        'redirect_uri': 'https://betask-linked-admin.web.app/UpdateNotify?shopId=' + this.$route.query.shopId,
        'shopId': this.$route.query.shopId
      }
      console.log('params', data)
      console.log('params', JSON.stringify(data))
      await axios.post(this.DNS_IP + '/lineNotifySetUp/getAccesstoken', data)
        .then(async response => {
          console.log('response', response)
          let rs = response.data
          if (!rs.status) {
            if (response.data.message === 'errorAccessToken') {
              this.$swal('ผิดหลาด!', 'กรุณาลองใหม่อีกครั้ง', 'error')
            }
            if (response.data.message === 'errorShop') {
              this.$swal('ผิดหลาด!', 'ร้านค้าไม่ถูกต้อง', 'error')
            }
            if (response.data.message === 'errorDupToken') {
              await axios
                .post(this.DNS_IP + '/lineNotifySetUp/deleteBynotifyId/' + response.data.notifyId)
                .then(async (responses) => {})
              this.$session.clear()
              this.$session.start()
              this.$session.set('data', response.data.dataSession)
              this.$router.push('/Master/SettingLineNotify')
              this.$swal('ผิดหลาด!', 'Line Group นี้มาการแจ้งเตือนอยู่แล้ว', 'error')
            }
          } else {
            this.$session.clear()
            this.$session.start()
            this.$session.set('data', response.data.dataSession)
            this.$router.push('/Master/SettingLineNotify')
          }
        })
    }
    // async getDataChk () {
    //   if (this.profile.userId) {
    //     await axios.get(this.DNS_IP + '/member/get?shopId=' + this.$route.query.shopId + '&liffUserId=' + this.profile.userId).then(async result => {
    //       var lineUserIds = ''
    //       var liffUserIds = ''
    //       if (typeof result.data.status === 'undefined') {
    //         lineUserIds = result.data[0].lineUserId || ''
    //         liffUserIds = result.data[0].liffUserId || ''
    //       }
    //       if (result.data.status === false) {
    //         await this.onSubmit()
    //       } else if (lineUserIds === '' && liffUserIds !== '') {
    //         await this.onUpdate(result.data[0].memberId)
    //       } else if (lineUserIds !== '' && liffUserIds !== '') {
    //         this.$swal(
    //           'ผิดหลาด!',
    //           'คุณได้ทำรายการนี้ไปแล้ว',
    //           'error'
    //         )
    //         this.$liff.sendMessages([
    //           {
    //             type: 'text',
    //             text: 'คุณได้ทำรายการนี้ไปแล้ว'
    //           }
    //         ])
    //           .then(() => {
    //             console.log('message sent')
    //             this.$liff.closeWindow()
    //           })
    //           .catch((err) => {
    //             console.log('error', err)
    //           })
    //       }
    //     })
    //   } else {
    //     this.$swal(
    //       'ผิดหลาด!',
    //       'กรุณาทำรายการใหม่',
    //       'error'
    //     )
    //   }
    // }
  }
}
</script>
