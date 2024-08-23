<template>
  <v-main>
    <div class="col-md-12 ml-sm-auto col-lg-12 px-4 d-flex">
      <div class="container d-flex">
        <div class="col-md-7 col-sm-12">
          <form>
            <v-select
              style="padding: 3px 0 !important;"
              dense
              hide-details
              class="pa-0"
              v-model="formAdd.masBranchID"
              :items="branchItem"
              label="สาขา"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules="[rules.required]"
              @change="getData(), getDataflow()"
            ></v-select>
            <v-select
              dense
              hide-details
              style="padding: 3px 0 !important;"
              class="pa-0"
              v-model="formAdd.flowId"
              :items="flowItem"
              label="บริการ"
              outlined
              required
              attach
              :menu-props="{ bottom: true, offsetY: true }"
              :rules="[rules.required]"
              @change="getData"
            ></v-select>
            <div class="card" style="padding: 20px">
              <b>กำหนดระดับความพึงพอใจ</b>
              <div>
                <!-- <v-text-field
                  v-model="ratingIntDefault"
                  value="5"
                  number
                  max="6"
                  min="5"
                ></v-text-field> -->
                <div style="display:flex ;">
                <v-slider
                  v-model="ratingIntDefault"
                  class="align-center col-10"
                  :max="max"
                  :min="min"
                  hide-details
                  ticks="always"
                  tick-size="5"
                  color="rgb(255, 180, 97)"
                  track-color="rgb(255, 180, 97)"
                >
                <template v-slot:thumb-label="{ value }" >
                  <span>
                    <img src="../../assets/star.png" width="20">
                  </span>
                </template>
                </v-slider>
                <v-text-field
                  v-model="ratingIntDefault"
                  class="mt-0 pt-0 col-2"
                  hide-details
                  single-line
                  type="number"
                  style="width: auto"
                  disabled
                ></v-text-field>
              </div>
              <div style="padding: 0px 4px;" align="right">
                <v-btn
                  dense
                  hide-details
                  :loading="loadingSlider"
                  color="#1B437C"
                  class="ma-2 white--text"
                  @click="confirmSlider"
                  large
                  style="width: -webkit-fill-available;border-radius: 16px;font-weight: bold;"
                >
                  เปลี่ยนแปลงระดับความพึงพอใจ
                  <!-- <v-icon right dark> mdi-playlist-plus </v-icon> -->
                </v-btn>
              </div>
              </div>
            </div>
            <div class="card" style="padding: 20px">
              <b>สร้างแบบสอบถามความพึงพอใจ</b>
              <v-col cols="12" md="12">
                <v-textarea
                  dense
                  filled
                  background-color="grey lighten-2"
                  v-model="formAdd.inputText"
                  :rows="2"
                  hidden-detail
                  placeholder="กรอก แบบสอบถาม"
                ></v-textarea>
              </v-col>
              <div style="padding: 0px 4px;" align="right">
                <v-btn
                  hide-details
                  dense
                  :loading="loading"
                  :disabled="(formAdd.inputText.length < 1, loading)"
                  color="#1B437C"
                  class="ma-2 white--text"
                  @click="confirm"
                  large
                  style="width: -webkit-fill-available;border-radius: 16px;margin-top: -20px !important;font-weight: bold;"
                >
                  เพิ่มรายการ
                  <!-- <v-icon right dark> mdi-playlist-plus </v-icon> -->
                </v-btn>
              </div>
            </div>
          </form>
          <div class="card" style="padding: 20px">
            <b>รายการ</b>
            <table>
              <tbody v-if="formData.message !== 'No data found'">
                <draggable
                  hide-details
                  dense
                  :list="formData"
                  :disabled="!enabled"
                  class="list-group"
                  ghost-class="ghost"
                  :move="checkMove"
                  @start="dragging = true"
                  @end="updateOrder"
                >
                  <div
                    style="display: flex; justify-content: space-between; "
                    class="list-group-item"
                    v-for="(element, index) in formData"
                    :key="index"
                  >
                    <div>
                      <v-icon>mdi-drag-variant</v-icon>
                      {{ index + 1 }}
                      {{ element.answer }}
                    </div>
                    <v-btn
                      hide-details
                      dense
                      :loading="loading3"
                      :disabled="loading3"
                      class="ma-2 white--text"
                      small
                      elevation="0"
                      @click="deleteRating(element.id)"
                    >
                      <v-icon align="right" dark color="#ffbaba">
                        mdi-delete-forever
                      </v-icon>
                    </v-btn>
                  </div>
                </draggable>
              </tbody>
              <tbody v-else>
                ยังไม่มีการเพิ่มแบบสอบถาม
              </tbody>
            </table>
          </div>
        </div>

        <!-- //ตัวโมบาย -->
        <div class="col-md-5 col-sm-12">
          <div class="respons_mobie">
            <div class="body_mobie">
              <div class="screen_mobye">
                <!-- <div class="camera"></div> -->
                <div
                  style="display: flex; justify-content: center;flex-wrap: wrap;align-items: baseline;"
                >
                  <!-- <div>ประเมินการบริการ</div> -->
                  <img
                    src="../../assets/iPhone X (or newer).png"
                    width="100%"
                  />
                  <img
                    src="../../assets/Navigation Bar.png"
                    width="100%"
                    style="position: relative;padding: 10px 28px !important;"
                  />
                  <div style="margin-top: -35px;">
                    <div
                      class="col-sm-12 col-md-12"
                      style="width: 347px !important"
                    >
                      <img src="../../assets/review-01.jpg" width="100%" />
                      <div v-if="formData.length > 0">
                        <div v-for="(data, index) in formData" :key="index">
                          <p class="padding-left" v-if="formData.length > 1">
                            {{ index + 1 }}. {{ data.answer }}
                          </p>
                          <p class="padding-left" v-if="formData.length === 1">
                            {{ data.answer }}
                          </p>
                          <div class="rating-margin">
                            <v-rating
                              v-model="ratingD"
                              color="#FFB461"
                              background-color="#EAEAEF"
                              empty-icon="$ratingFull"
                              :full-icon="starBoldIcon"
                              :length="ratingIntDefault"
                              :size="100"
                              hover
                              large
                              fab
                              rounded
                            >
                            </v-rating>
                            <br />
                          </div>
                        </div>
                      </div>
                      <div class="padding-left" v-else>
                        <br />
                        <div>
                          <div class="rating-margin text-center">
                            <v-rating
                              v-model="ratingD"
                              color="#FFB461"
                              background-color="#EAEAEF"
                              empty-icon="$ratingFull"
                              :full-icon="starBoldIcon"
                              length="5"
                              :size="100"
                              hover
                              large
                              fab
                              rounded
                              disabled
                            >
                            </v-rating>
                            <p class="padding-left text-center">
                              ขอบคุณที่เข้ารับบริการกับเรา
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- <hr class="style-hr" /> -->
                      <v-col cols="12" md="12">
                        <label class="text-bold">ข้อเสนอแนะ</label>
                        <v-textarea
                          outlined
                          flat
                          name="input-7-4"
                          clear-icon="mdi-close-circle"
                          class=""
                        >
                        </v-textarea>
                      </v-col>
                      <v-checkbox
                        v-model="checkbox"
                        color="success"
                        label="ฉันยอมรับให้ พนักงานติดต่อกลับ"
                        :on-icon="'mdi-check-circle'"
                        :off-icon="'mdi-checkbox-blank-circle-outline'"
                        class="padding-left"
                        style="border-radius: 100%;margin: -30px 0 -15px 0;"
                      >
                        <template v-slot:label>
                          <div>ต้องการให้เจ้าหน้าที่ติดต่อกลับ</div>
                        </template>
                      </v-checkbox>
                      <div
                        class="padding-left"
                        align="center"
                        style="padding: 12px 0 0 12px;"
                      >
                        <v-btn
                          :loading="loading2"
                          :disabled="loading2"
                          color="#1B437C"
                          class="white--text"
                          x-large
                          style="width: -webkit-fill-available;border-radius: 16px;font-weight: bold;"
                        >
                          ส่งแบบประเมิน
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-main>
</template>
<script>
import axios from 'axios'
import draggable from 'vuedraggable'
// axios.defaults.baseURL = "http://localhost:5004/"
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
export default {
  data () {
    return {
      min: 3,
      max: 6,
      DNS_IP: 'http://localhost:5004',
      rating: 5,
      ratingIntDefault: 5,
      ratingD: this.starBoldIcon,
      starBoldIcon: 'mdi-star',
      checkbox: false,
      loader: null,
      loading: false,
      loadingSlider: false,
      loading2: false,
      loading3: false,
      inputText: '',
      formData: [],
      branchItem: [],
      flowItem: [],
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
      },
      disabled: true,
      enabled: true,
      dragging: false,
      dragOptions: {
        animation: 150
      },
      formAdd: {
        inputText: '',
        masBranchID: '',
        flowId: '',
        rating: 5
      },
      swasuccess: {
        title: 'สำเร็จ',
        text: 'เพิ่มคำถามเรียบร้อยแล้ว',
        type: 'success',
        icon: 'success'
      },
      nonswasuccess: {
        title: 'ไม่กรอกข้อมูล',
        text: 'โปรดเพิ่มคำถามก่อนบันทึก',
        type: 'info',
        icon: 'info'
      },
      swasuccessrate: {
        title: 'สำเร็จ',
        text: 'เปลี่ยนแปลงระดับความพึงพอใจเรียบร้อยแล้ว',
        type: 'success',
        icon: 'success'
      },
      alert: {
        title: 'แจ้งเตือน',
        text: 'หากเปลี่ยนแปลงระดับความพึงพอใจ, จะมีผลต่อค่าเฉลี่ยในอดีตที่ประเมินไปแล้ว',
        showCancelButton: true,
        type: 'info'
      }
    }
  },
  components: {
    draggable
  },
  async mounted () {
    await this.getDataBranch()
    await this.getDataflow()
  },
  methods: {
    checkMove (e) {
      // console.log('Future index:', e.draggedContext.futureIndex)
      this.formData.splice(
        e.draggedContext.futureIndex,
        0,
        this.formData.splice(e.draggedContext.index, 1)[0]
      )
      this.formData.forEach((item, index) => {
        item.sort = index + 1
      })
    },
    // updateOrder () {
    //   // console.log('Updated order:', this.formData)

    //   const updatedFormData = this.formData.map((element, index) => {
    //     return Object.assign({}, element, { sort: index + 1 })
    //   })

    //   axios
    //     .post(this.DNS_IP + '/ratingformat/setindex', updatedFormData)
    //     .then(response => {
    //       // console.log('Update successful', response)
    //       this.getData()
    //     })
    //     .catch(error => {
    //       console.error('Update failed:', error)
    //     })
    // },
    updateOrder () {
      console.log('Updated order:', this.formData)
      axios
        .post(this.DNS_IP + '/ratingformat/setindex', this.formData)
        .then(response => {
          console.log('Update successful', response)
          this.getData()
        })
        .catch(error => {
          console.error('Update failed:', error)
        })
    },
    async getData () {
      this.formData = []
      try {
        axios
          .get(
            this.DNS_IP +
              '/ratingformat/get?shopId=' +
              this.$session.getAll().data.shopId +
              '&branchIn=' +
              this.formAdd.masBranchID +
              (this.formAdd.flowId !== 'All' ? '&flowId=' + this.formAdd.flowId : '')
          )
          .then(respone => {
            // this.formData = respone.dat
            let rs = respone.data
            if (rs.status !== false) {
              this.formData = rs
              this.ratingIntDefault = rs[0].rating
            }
            // console.log('formData__GET()()()', this.formData)
          })
      } catch (error) {
        console.log(error)
      }
    },
    deleteRating (id) {
      try {
        const payload = {
          LAST_USER: this.$session.getAll().data.userName
        }
        this.$swal({
          title: 'ลบคำถาม?',
          text: 'คุณต้องการลบคำถาม!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ใช่, ต้องการลบ'
        }).then(result => {
          if (id) {
            axios
              .post(this.DNS_IP + '/ratingAnswer/delete/' + id, payload)
              .then(response => {
                this.getData()
                this.$swal('ลบสำเร็จ!', 'คุณได้ลบคำถามแล้ว', 'success')
              })
              .catch(error => {
                console.log(error)
              })
          } else if (result.dismiss === 'cancel') {
            this.$swal('ยกเลิก', 'คุณยกเลิกการลบคำถาม', 'error')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    confirm () {
      try {
        const payload = {
          answer: this.formAdd.inputText,
          rating: this.ratingIntDefault,
          sort: 0,
          shopId: this.$session.getAll().data.shopId,
          LAST_USER: this.$session.getAll().data.userName,
          CREATE_USER: this.$session.getAll().data.userName,
          masBranchID: this.formAdd.masBranchID,
          flowId: this.formAdd.flowId
        }
        if (this.formAdd.inputText.length > 0) {
          this.loading = true
          this.updateOrder()
          axios.post(this.DNS_IP + '/ratingformat/add', payload).then(respone => {
            this.$swal(this.swasuccess)
            this.loading = false
            // console.log(respone)
            this.getData()
            this.formAdd.inputText = ''
          })
        } else {
          this.$swal(this.nonswasuccess)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    confirmSlider () {
      try {
        this.$swal(this.alert)
          .then(async result => {
            if (result) {
              const payload = {
                shopId: this.$session.getAll().data.shopId,
                LAST_USER: this.$session.getAll().data.userName,
                masBranchID: this.formAdd.masBranchID
              }
              this.loadingSlider = true
              axios.post(this.DNS_IP + '/ratingdefault/edit/' + this.ratingIntDefault, payload).then(respone => {
                this.$swal(this.swasuccessrate)
                this.loadingSlider = false
                this.getData()
                this.formAdd.inputText = ''
                console.log('responerespone', respone)
              })
            } else {
              this.loadingSlider = false
            }
            // setTimeout(() => (this.loadingSlider = false), 1000)
          })
      } catch (error) {
        console.error(error)
      }
    },
    async getDataBranch () {
      this.branchItem = []
      await axios
        .get(
          this.DNS_IP +
            '/master_branch/get?shopId=' +
            this.$session.getAll().data.shopId
        )
        .then(response => {
          let rs = response.data
          console.log('rsss', rs)
          console.log('shopId=', this.$session.getAll().data.shopId)
          if (rs.status !== false) {
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (
                this.$session.getAll().data.masBranchID === '' ||
                this.$session.getAll().data.masBranchID === null
              ) {
                let s = {}
                s.text = d.masBranchName
                s.value = d.masBranchID.toString()
                this.branchItem.push(s)
              } else {
                if (d.masBranchID === this.masBranchID) {
                  let s = {}
                  s.text = d.masBranchName
                  s.value = d.masBranchID.toString()
                  this.branchItem.push(s)
                }
              }
              console.log('dtdtdtdt', this.branch)
            }
          }
          if (this.branchItem.length > 0) {
            this.formAdd.masBranchID = this.branchItem[0].value
          }
        })
      await this.getDataflow()
      console.log('branch', this.branch)
    },
    async getDataflow () {
      this.flowItem = []
      await axios
        .get(
          this.DNS_IP + '/flow/get?shopId=' + this.$session.getAll().data.shopId + '&masBranchIDAll=' + this.formAdd.masBranchID
        )
        .then(async response => {
          await this.getData()
          let rs = response.data
          console.log('rsss', rs)
          console.log('shopId=', this.$session.getAll().data.shopId)
          if (rs.status !== false) {
            let a = {}
            a.text = 'All'
            a.value = 'All'
            this.flowItem.push(a)
            for (var i = 0; i < rs.length; i++) {
              let d = rs[i]
              if (
                this.$session.getAll().data.flowId === '' ||
                this.$session.getAll().data.flowId === null
              ) {
                let s = {}
                s.text = d.flowName
                s.value = d.flowId.toString()
                this.flowItem.push(s)
              } else {
                if (d.flowId === this.flowId) {
                  let s = {}
                  s.text = d.flowName
                  s.value = d.flowId.toString()
                  this.flowItem.push(s)
                }
              }
              console.log('dtdtdtdt', this.flowId)
            }
          }
          if (this.flowItem.length > 0) {
            this.formAdd.flowId = this.flowItem[0].value
          }
        })
      console.log('flowId', this.flowId)
    }
  }
}
</script>
<style scoped>
p {
  color: #77808d;
}
.v-rating .v-icon {
  padding: 0rem !important;
  padding-right: 4px !important;
}
.theme--light.v-btn.v-btn--has-bg {
  background-color: #ffffff00;
}
.v-application--is-ltr .v-text-field .v-label {
  left: 13px !important;
}
.v-select.v-text-field--outlined:not(.v-text-field--single-line)
  .v-select__selections {
  padding: 8px !important;
}
.v-application--is-ltr
  .v-textarea.v-text-field--enclosed
  .v-text-field__slot
  textarea {
  padding: 0 12px;
}
.v-application--is-ltr .v-textarea.v-text-field--enclosed .v-text-field__slot {
  margin-right: 0px;
}
.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: #eaeaef;
}
.v-text-field.v-text-field--enclosed .v-text-field__details,
.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  > .v-input__control
  > .v-input__slot {
  padding: 0 0;
}
.theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
  background: #ffffff00;
}
.padding-left {
  padding: 12px 15px;
}
.text-bold {
  font-weight: bold;
}
.card {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 5px;
}
@media screen and (min-width: 768px) {
  .respons_mobie {
    display: flex;
    justify-content: center;
    position: fixed;
  }
}
.respons_mobie {
  display: flex;
  justify-content: center;
}
.body_mobie {
  border-radius: 16px;
  background: #fff;
  /* box-shadow: 0px 4px 20px -2px rgba(50, 50, 71, 0.04), 0px 0px 1px 0px rgba(12, 26, 75, 0.03); */
  box-shadow: 0px 4px 20px -2px rgba(50, 50, 71, 0.04),
    0px 0px 1px 0px rgba(12, 26, 75, 0.03);
}
.screen_mobye {
  width: 367px;
  height: 730px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  overflow: scroll;
  /* background-image: url(https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?cs=srgb&dl=pexels-matheus-bertelli-799443.jpg&fm=jpg); */
}

.card-title {
  padding-top: 40px;
  border-radius: 25px;
  background-color: #797979;
  display: flex;
  align-items: center;
  background: #000000;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3.4px);
  -webkit-backdrop-filter: blur(3.4px);
}
.title-1 {
  font-weight: bold !important;
  color: #fff;
  filter: drop-shadow(0px 1px 2px #828282);
  font-size: 20px;
}
.style-hr {
  background-color: #ffffff00;
  border-top: 2px dotted #8c8b8b;
  margin: 15px;
}
.draggable-item {
  background-color: lightgray;
  padding: 10px;
  margin-bottom: 10px;
}
.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}
.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 10s infinite ease-in;
}
.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}
.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 7s;
  animation-delay: 2s;
}
.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 11s;
  animation-delay: 0s;
}
.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}
.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}
.bubble:nth-child(7) {
  width: 90px;
  height: 90px;
  left: 70%;
  animation-duration: 12s;
  animation-delay: 2s;
}
.bubble:nth-child(8) {
  width: 25px;
  height: 25px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 2s;
}
.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(10) {
  width: 90px;
  height: 90px;
  left: 25%;
  animation-duration: 10s;
  animation-delay: 4s;
}
.rating-margin {
  margin: -20px 0px -30px 12px;
}
@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
