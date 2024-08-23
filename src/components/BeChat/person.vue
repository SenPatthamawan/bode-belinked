<template>
  <div>
    <v-main style="background-color: #f6f6f9;height:100vh;">
      <v-col
        v-bind:class="
          this.$vuetify.breakpoint.name != 'lg' &&
          this.$vuetify.breakpoint.name != 'xl'
            ? 'Box_right_mobile'
            : 'Box_right'
        "
      >
        <template v-if="log[0] != 'none'">
          <div
            style="position: sticky; top:0; z-index:1 ;background-color: #f6f6f9;"
          >
            <v-row class="top text-h6 font-weight-bold ma-2 d-flex">
              <v-col
                v-if="
                  this.$vuetify.breakpoint.name != 'lg' &&
                    this.$vuetify.breakpoint.name != 'xl'
                "
                cols="2"
              >
                <v-icon class="back_button" @click="go_back"
                  >mdi-arrow-left</v-icon
                >
              </v-col>
              <v-col cols="6" style="overflow: hidden; white-space: nowrap;">
                <v-avatar><img :src="img"/></v-avatar>
                <span class="ml-4">{{ name }}</span>
              </v-col>

              <v-col class="tool">
                <img class="tool_circle" src="../../assets/Calling.png" />
                <span class="tool_search">
                  <img
                    style="width: 20px;
                        height: 20px;
                        "
                    src="../../assets/Search.png"
                    v-if="
                      this.$vuetify.breakpoint.name == 'lg' ||
                        this.$vuetify.breakpoint.name == 'xl'
                    "
                  />
                </span>
              </v-col>
            </v-row>
            <v-divider></v-divider>
          </div>

          <div
            id="Box"
            @scroll="check_scroll"
            v-bind:class="{
              ScrollBar:
                this.$vuetify.breakpoint.name == 'lg' ||
                this.$vuetify.breakpoint.name == 'xl'
            }"
            class="ma-5 mb-16"
          >
            <template v-for="(item, index) in log">
              <v-row
                :key="'D' + index"
                class="ma-5 text-subtitle-2  justify-center"
                style="color: #989fc9"
                v-if="index == 0"
              >
                {{ fulldate(item.CREATE_DATE) }}
              </v-row>
              <v-row
                :key="'D' + index "
                class="ma-5 text-subtitle-2 justify-center"
                style="color: #989fc9"
                v-else-if="
                  index != 0 &&
                    !comparemomentDay(item.CREATE_DATE, log[index - 1].CREATE_DATE)
                "
              >
                {{ fulldate(item.CREATE_DATE) }}
              </v-row>

              <v-row
                :key="index"
                v-if="item.method === 'push'"
                class="row_right my-6"
              >
                <span class="time mr-4">
                  {{ timedate(item.CREATE_DATE) }}
                </span>

                <span
                  v-if="item.typeMessage === 'image' || item.typeMessage === 'Upload'"
                  class="content_img "
                >
                  <v-img
                    :src="item.content"
                    :max-width="imgWidth"
                    @click.stop="
                      dialogImage = true
                      imageStatus = item.content
                    "
                  ></v-img>
                </span>
                <span v-else-if="item.typeMessage === 'sticker'">
                  Sticker ไม่สามารถเปิดได้
                </span>
                <span
                  v-else-if="item.typeMessage === 'video'"
                  class="content-author my-6"
                >
                  ไฟล์วีดีโอไม่สามารถเปิดได้
                </span>
                <span
                  v-else-if="item.content.includes('<a href=')"
                  style="display: inline-flex;
                            text-align: left;
                            max-width: 30vh;"
                >
                  <span class="content-author " v-html="item.content"></span>
                </span>
                <span
                  v-else
                  style="display: inline-flex;
                            text-align: left;
                            max-width: 30vh;"
                >
                  <span class="content-author " >{{ item.content }}</span>
                </span>
              </v-row>

              <v-row :key="index " v-else class="row_left ">
                <v-avatar
                  style="dispkay: flex ;margin-top: 24px;"
                  >
                  <img :src="img"/>
                </v-avatar>

                <span
                  v-if="item.typeMessage === 'image' || item.typeMessage === 'Upload'"
                  class="content_img "
                >
                  <v-img
                    :src="item.content"
                    :max-width="imgWidth"
                    @click.stop="
                      dialogImage = true
                      imageStatus = item.content
                    "
                  >
                  </v-img>
                </span>
                <span
                  v-else-if="item.typeMessage === 'sticker'"
                  class="content-customer my-6"
                >
                  Sticker ไม่สามารถเปิดได้
                </span>
                <span
                  v-else-if="item.typeMessage === 'video'"
                  class="content-customer my-6"
                >
                  ไฟล์วีดีโอไม่สามารถเปิดได้
                </span>
                <span
                  v-else-if="item.content.includes('<a href=')"
                  style="display: inline-flex;
                            text-align: left;
                            max-width: 30vh;"
                >
                  <span class="content-customer my-6" v-html="item.content"></span>
                </span>
                <span
                  v-else
                  style="display: inline-flex;
                            text-align: left;
                            max-width: 30vh;"
                >
                  <span class="content-customer my-6" >{{ item.content }}</span>
                </span>
                <span class="time ml-4" v-if="index == 0">
                  {{ timedate(item.CREATE_DATE) }}
                </span>
                <span
                  class="time ml-4"
                  v-else-if="!comparemomentTime(item.CREATE_DATE, log[index - 1].CREATE_DATE)"
                >
                  {{ timedate(item.CREATE_DATE) }}
                </span>
              </v-row>
            </template>

            <v-icon
              v-if="scrollStatus"
              @click="
                Scroll_End()
                scrollStatus = false
              "
              class="Go_down"
              >mdi-chevron-down</v-icon
            >
          </div>
        </template>
        <template v-else>
          <v-row>
            <h4>No Data Found</h4>
          </v-row>
        </template>
        <!-- <v-row>
                <div v-if="this.url != null">
                    <v-btn
                        v-on:click="url = null"
                        class="mx-2"
                        fab
                        dark
                        small
                        color="red"
                    >
                        <v-icon dark> mdi-minus </v-icon>
                    </v-btn>
                    <v-img :src="url" :max-width="200" ></v-img>
                </div>
            </v-row> -->
        <v-row
          class="d-flex"
          style="position: fixed;
            bottom: 0;
            padding-bottom: 25px;
            width: -webkit-fill-available;"
        >
          <v-row
            v-bind:class="
              this.$vuetify.breakpoint.name != 'lg' &&
              this.$vuetify.breakpoint.name != 'xl'
                ? 'footer_mobile'
                : 'footer'
            "
          >
            <template>
              <!-- <v-icon class="delete "
                        >mdi-alpha-x</v-icon
                    > -->
              <img
                class="tool_close"
                src="./../../assets/Close.png"
                @click="clear_input"
              />
            </template>
            <v-file-input
              @change="CheckFile"
              v-model="image"
              id="fileInput"
              hide-input
              style="display: none"
              ref="trigger_file"
              accept="image/*"
              multiple
            >
            </v-file-input>
            <template>
              <!-- <v-icon class="file_image " @click="folder()"
                        >mdi-image-outline</v-icon
                    > -->
              <img
                src="./../../assets/Mic.png"
                @click="folder()"
                v-bind:class="
                  this.$vuetify.breakpoint.name != 'lg' &&
                  this.$vuetify.breakpoint.name != 'xl'
                    ? 'Icon_Mic_mobile'
                    : 'Icon_Mic'
                "
              />
            </template>
            <v-text-field
              placeholder="Type a message..."
              dense
              rounded
              flat
              v-model="chat"
              class="my-4 pt-2"
              style="width: min-content;
                height: 40px;
                margin-right: 33px;
                margin-left: 16px;
                background-color: #f6f6f9;"
              v-on:keyup.enter="Sent_chat()"
              elevation="2"
              :loading="loading"
            >
              <template v-slot:append>
                <img
                  src="./../../assets/Send.png"
                  @click="
                    loader = 'loading'
                    url = null
                    Sentfile()
                  "
                  style="width: 20px;
                    margin-top: 4px;"
                />
              </template>
            </v-text-field>
          </v-row>
        </v-row>
      </v-col>
      <v-dialog
        v-model="dialogImage"
        content-class="elevation-0 overflow-hidden"
      >
        <v-img
          v-bind:src="imageStatus"
          contain
          height="100vh"
          @click="dialogImage = false"
          style="overflow: hidden;"
        >
        </v-img>
      </v-dialog>
    </v-main>
  </div>
</template>

<script>
import axios from 'axios'
// import pushImage from './pushImage'
import moment from 'moment'

// this.$session.getAll().data.shopId
export default {
  data () {
    return {
      x: null,
      url: null,
      image: null,
      res: null,
      loader: null,
      loading: false,
      overlay: false,
      chat: null,
      logChat: [],
      scrollLevel: 0,
      scrollStatus: false,
      imgWidth: 200,
      dialogImage: false,
      imageStatus: '',
      shopId: this.$session.getAll().data.shopId,
      session: this.$session.getAll()
    }
  },

  props: {
    log: Array,
    id: String,
    name: String,
    img: String
  },
  created () {
    window.addEventListener('scroll', this.window_scroll)
  },
  unmounted () {
    window.removeEventListener('scroll', this.window_scroll)
  },
  mounted () {
    this.update()
  },
  methods: {
    fulldate (date) {
      return moment(date, 'ddd, DD MMM YYYY HH:mm:ss').format(
        'ddd, DD MMM HH:mm'
      )
    },
    timedate (date) {
      return moment(date, 'ddd, DD MMM YYYY HH:mm:ss').format('HH:mm')
    },
    daydate (date) {
      return moment(date, 'ddd, DD MMM YYYY HH:mm:ss').format('dddd')
    },
    comparemomentDay (Nowdate, Pastdate) {
      return moment(Nowdate).isSame(Pastdate, 'day')
    },
    comparemomentTime (Nowdate, Pastdate) {
      return moment(Nowdate).isSame(Pastdate, 'minute')
    },
    window_scroll () {
      // console.log(window.scrollY);
      // console.log(document.body.scrollHeight);
      // const scroll = document.getElementById("Box")
      // console.log(scroll.scrollTop);
      // console.log(scroll.scrollHeight);
      this.scrollStatus = true
    },
    update () {
      this.logChat = this.Log
      console.log(this.logChat)
      if (
        this.$vuetify.breakpoint.name !== 'lg' &&
        this.$vuetify.breakpoint.name
      ) {
        this.imgWidth = 150
      }
    },
    check_scroll (event) {
      this.scrollLevel = event.currentTarget.scrollTop
      if (this.scrollLevel < event.currentTarget.scrollHeight - 600) {
        this.scrollStatus = true
      } else if (this.scrollLevel === event.currentTarget.scrollHeight - 500) {
        this.scrollStatus = false
      }
    },
    Scroll_End () {
      const scroll = document.getElementById('Box')
      scroll.scrollTop = scroll.scrollHeight
      this.scrollStatus = false

      if (document.body.scrollHeight > window.innerHeight) {
        window.scrollTo(0, document.body.scrollHeight)
        this.scrollStatus = false
      }
    },
    CheckFile () {
      if (this.image != null) {
        // console.log(this.image);

        var SetImageUrl = []
        for (let i = 0; i < this.image.length; i++) {
          SetImageUrl.push(URL.createObjectURL(this.image[i]))
        }

        this.url = SetImageUrl

        // console.log(this.url);

        this.Sentfile()
      }
    },
    async Sentfile () {
      this.url = null
      // console.log(this.image);
      var Id = this.id

      if (Id === 'none') {
        alert('Please Select chat')
      } else {
        if (this.image != null || this.chat != null) {
          this.loading = true
          if (this.image != null) {
            const formData = new FormData()

            for (let i = 0; i < this.image.length; i++) {
              await formData.append('files', this.image[i])
            }

            this.image = null

            // เหลือส่งหลายรูป
            await axios
              .post(this.DNS_IP + '/file/upload/Chat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              .then(response => {
                this.loading = false
                this.res = response.data
                console.log('res', this.res)
              })
              .catch(error => {
                console.log(error.response.status, error.response.statusText)
              })

            // var img = this.res

            // console.log(img);
            // this.pushImage(img, Id)
            await this.write_upload(Id)
            await this.Sent_Img(Id)
          } else {
            await this.Sent_chat()
          }
        } else {
          alert('please type some message or select some file')
        }
      }
    },
    async Sent_Img (Id) {
      // console.log(typeof this.chat);
      let dt = {
        'content': this.res,
        'userId': `${Id}`,
        'shopId': this.shopId
      }
      await axios
        .post(
          this.DNS_IP + '/beChat/sent_chat_img', dt)
        .then((response) => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    async write_upload (Id) {
      let dt = {
        'userId': this.session.data.userId,
        'shopId': this.shopId,
        'typeMessage': 'Upload',
        'content': this.res,
        'method': 'push',
        'target': `${Id}`,
        'CREATE_USER': this.session.data.userName,
        'LAST_USER': this.session.data.userName
      }
      await axios
        .post(this.DNS_IP + '/beChat/add_log_image', dt)
        .then((res) => {
          if (this.loading) {
            this.loading = false
          }
        })
        .catch(error => {
          console.log(error.response.status, error.response.statusText)
        })
    },
    async Sent_chat () {
      // console.log(typeof this.chat);
      var chat = this.chat
      this.chat = null
      var Id = this.id
      var Name = this.name
      await axios
        .post(
          this.DNS_IP + '/beChat/sent_chat',
          { data: chat, Id: Id, shopId: this.shopId }
        )
        .then(() => {
          this.write_message(chat, Id, Name)
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    async write_message (chat, Id, Name) {
      let dt = {
        userId: this.session.data.userId,
        shopId: this.shopId,
        typeMessage: 'text',
        content: `${chat}`,
        method: 'push',
        target: `${Id}`,
        CREATE_USER: this.session.data.userName,
        LAST_USER: this.session.data.userName
      }
      await axios
        .post(this.DNS_IP + '/beChat/add_log', dt)
        .then(() => {
          if (this.loading) {
            this.loading = false
          }
        })
        .catch(error => {
          console.log(error.response)
        })

      this.$emit('update_log', { Id: Id, Name: Name })
    },
    folder () {
      // console.log(document.getElementById("fileInput"));
      document.getElementById('fileInput').click()
    },
    go_back () {
      this.$emit('update_chat', false)
    },
    clear_input () {
      this.image = null
      this.res = null
      this.chat = null
    }
  }
}
</script>
<!-- <style scoped>
.Box_right {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.Box_right_mobile {
  display: flex;
  flex-direction: column;
  background-color: #f6f6f9;
}

.top {
  max-height: 80px;
  align-content: center;
}
.footer {
  display: flex;
  background-color: white;
  padding-left: 20px;
  /* height: 0px; */
  max-height: 100vh;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
}

.footer_mobile {
  display: flex;
  background-color: white;
  padding-left: 20px;
  align-items: center;
  position: sticky;
  bottom: 0;
}

.delete {
  border-radius: 50%;
  background-color: white;
  border: 2px solid #f6f6f9;
  padding: 15px;
  text-align: center;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
}
.file_image {
  border-radius: 50%;
  background-color: #f6f6f9;
  padding: 8px;
  margin-left: 10px;
}
.v-text-field {
  width: 500px;
}
.row_left {
  display: flex;
  margin: 1px;
  justify-content: start;
}
.row_right {
  display: flex;
  margin: 1px;
  justify-content: end;
}
.content-customer {
  font-size: 18px;
  color: black;
  background-color: white;
  border-radius: 15px 15px 15px 0px;
  padding: 13px;
  display: flex;
  margin-left: 15px;
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-word;
  flex-direction: column;
}

.Go_down {
  position: fixed;
  bottom: 102px;
  right: 47px;
  float: right;
  color: #ffb6ba;
  background-color: white;
  border-radius: 50%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  display: flex;
  z-index: 10;
}
.content-author {
  font-size: 18px;
  color: black;
  background-color: #e9eaf1;
  border-radius: 15px 15px 0px 15px;
  padding: 13px;
  margin-right: 15px;
  font-size: 13px;
}

.content_img {
  padding: 13px;
  border-radius: 0px 15px 15px;
  margin-left: 15px;
}
.time {
  font-size: 13px;
  display: flex;
  align-items: center;
  color: #989fc9;
}

.ScrollBar {
  overflow-y: auto;
  height: 100vh;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 20px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.back_button {
  margin-right: 15px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  display: flex;
  color: #989fc9;
  background-color: #e9eaf1;
  border-radius: 50%;
  padding: 10px;
}

.tool {
  display: flex;
  justify-content: flex-end;
}

.tool_circle {
  margin-right: 15px;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  display: flex;
  color: #989fc9;
  background-color: white;
  border-radius: 50%;
  padding: 7px;
}

.tool_close {
  margin-right: 15px;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  display: flex;
  border: 1px solid #eef0f7;
  background-color: white;
  border-radius: 50%;
  padding: 7px;
}

.Icon_Mic {
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #f6f6f9;
  display: flex;
  padding: 8px;
}

.Icon_Mic_mobile {
  width: 20px;
}

.v-text-field__slot {
  font-size: 12px;
}

.tool_search {
  background-color: white;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> -->
