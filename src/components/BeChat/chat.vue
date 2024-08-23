<template>
  <div>
    <main>
    <v-row no-gutters>
      <template
      v-if="
        this.$vuetify.breakpoint.name == 'lg' ||
          this.$vuetify.breakpoint.name == 'xl'
      "
    >
      <v-col cols="3">
        <div class="pa-5 box_left">
          <v-data-iterator
            :items="listSort"
            :search="search"
            disable-pagination
            hide-default-footer
            :sort-desc.sync="sortDesc"
          >
            <!-- //https://stackoverflow.com/questions/63680088/make-vuetify-v-data-table-column-sort-first-in-descending-order-second-in-ascen -->
            <template v-slot:header>
              <v-text-field
                v-model="search"
                clearable
                hide-details
                solo-inverted
                flat
                color="#989fc9"
                background-color="#f6f6f9"
                label="Search"
                class="custom-label-color"
              >
                <template v-slot:prepend-inner>
                  <img src="../../assets/Search.png" class="Icon_search_bar" />
                </template>
              </v-text-field>

              <div class="Tab">
                <v-card-actions>
                  <span
                    @click="Default_sort()"
                    v-bind:style="'text-decoration: none;color:' + tabColor[0]"
                    >All</span
                  >
                </v-card-actions>
                <v-card-actions>
                  <span
                    @click="Sort_data()"
                    v-bind:style="'text-decoration: none;color:' + tabColor[1]"
                    >Personal</span
                  >
                </v-card-actions>
                <v-card-actions>
                  <span
                    @click="test_action"
                    v-bind:style="'text-decoration: none;color:' + tabColor[2]"
                    >Tag</span
                  >
                </v-card-actions>
              </div>
            </template>

            <template v-slot:default="props">
              <div v-bind:class="{ ScrollBar: true }">
                <v-row
                  v-for="item in props.items"
                  :key="item.displayName"
                  style="display: block"
                >
                  <v-col>
                    <v-list two-line>
                      <v-list-item
                        :key="item.userId + 'No' + item.id"
                        :ref="'color' + item.userId"
                        @click="click(item.userId, item.displayName)"
                        style="background-color: white"
                      >
                        <v-list-item-avatar
                          :key="item.userId + 'No' + item.id"
                        >
                          <img :src="item.pictureUrl" />
                        </v-list-item-avatar>

                        <v-list-item-content>
                          <v-list-item-title style="color: black !important;">{{
                            item.displayName
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            item.statusMessage
                          }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <div>
                          <div
                            class="New_message"
                            v-if="MessageStatus[`${item.userId}`] != 0"
                          >
                            {{ MessageStatus[`${item.userId}`] }}
                          </div>
                          <div class="New_message_time">
                            {{ lasttimeMassage[`${item.userId}`] }}
                          </div>
                        </div>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </div>
            </template>
          </v-data-iterator>

          <div class="New_Chat">
            <button class="Button_New_Chat">New Chat</button>
          </div>
        </div>
      </v-col>

      <v-col cols="9">
        <person
          ref="person"
          v-bind="test"
          @update_log="handle_log_update"
          @update_chat="chat"
          v-show="openPerson"
        >
        </person>
      </v-col>
    </template>
    <template v-else>
        <v-col v-if="openPerson == false">
        <div class="ma-4">
          <v-data-iterator
            :items="listSort"
            :search="search"
            hide-default-footer
          >
            <template v-slot:header>
              <v-text-field
                v-model="search"
                clearable
                hide-details
                solo-inverted
                flat
                color="#989fc9"
                label="Search"
                class="custom-label-color"
                background-color="#f6f6f9"
                id="search_bar"
              >
                <template v-slot:prepend-inner>
                  <img src="../../assets/Search.png" class="Icon_search_bar" />
                </template>
              </v-text-field>

              <div class="Tab">
                <v-card-actions>
                  <span
                    @click="Default_sort()"
                    v-bind:style="'text-decoration: none;color:' + tabColor[0]"
                    >All</span
                  >
                </v-card-actions>
                <v-card-actions>
                  <span
                    @click="Sort_data()"
                    v-bind:style="'text-decoration: none;color:' + tabColor[1]"
                    >Personal</span
                  >
                </v-card-actions>
                <v-card-actions>
                  <span
                    @click="test_action"
                    v-bind:style="'text-decoration: none;color:' + tabColor[2]"
                    >Tag</span
                  >
                </v-card-actions>
              </div>
            </template>

            <template v-slot:default="props">
              <v-col class="ScrollBar_mobile">
                <v-row
                  v-for="item in props.items"
                  :key="item.id"
                  style="display: block"
                >
                  <v-list two-line>
                    <v-list-item
                      :key="item.userId + 'No' + item.id"
                      :ref="'color' + item.userId"
                      @click="click(item.userId, item.displayName)"
                      style="background-color: white"
                    >
                      <v-list-item-avatar :key="item.userId + 'No' + item.id">
                        <img :src="item.pictureUrl" />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title style="color: black !important;font-size: 13px"
                          >{{ item.displayName }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.statusMessage }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <div class="">
                        <div
                          class="New_message"
                          v-if="MessageStatus[`${item.userId}`] != 0"
                        >
                          {{ MessageStatus[`${item.userId}`] }}
                        </div>
                        <div class="New_message_time">
                          {{ lasttimeMassage[`${item.userId}`] }}
                        </div>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-row>
              </v-col>
            </template>
          </v-data-iterator>
        </div>
      </v-col>

      <v-col v-else>
        <person
          ref="person"
          v-bind="test"
          @update_log="handle_log_update"
          @update_chat="chat"
          v-show="openPerson"
        ></person>
      </v-col>
    </template>
    </v-row>

    <!-- <v-col >
          <person
              ref="person"
              v-bind="test"
              @update_log="handle_log_update"
              @update_chat="chat"
              v-show="openPerson"
          ></person>
      </v-col> -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import person from './person.vue'
import moment from 'moment'
import adminLeftMenu from '../Sidebar.vue'

export default {
  data () {
    return {
      list: [],
      followers: [],
      overlay: false,
      test: {
        log: [],
        id: '',
        name: '',
        img: ''
      },
      loop: null,
      chatAll: [],
      status: true,
      old: [],
      MessageStatus: {},
      startValue: 0,
      search: '',
      openPerson: false,
      sortDesc: false,
      listSort: [],
      tabColor: ['black', '#989fc9', '#989fc9'],
      lasttimeMassage: {},
      lastMassage: {},
      oldFollower: [],
      listNoProfile: [],
      shopId: this.$session.getAll().data.shopId
    }
  },
  mounted () {
    this.check_member()
    this.start()
    this.get_log()
  },
  computed: {
    chatwidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '90%'
        case 'sm':
          return '70%'
        case 'md':
          return '50%'
        case 'lg':
          return '50%'
        case 'xl':
          return '50%'
        default:
          return '100%'
      }
    }
  },
  components: {
    person,
    'left-menu-admin': adminLeftMenu
  },
  methods: {
    async start () {
      var data = []
      var followers = []
      this.overlay = true
      // ? get userId where it's doenst have in followers table
      // data = this.listNoProfile
      data = {
        'data': this.listNoProfile,
        'shopId': this.shopId
      }
      // ? get profile and write to followers table
      console.log('data', data)
      await axios
        .post(this.DNS_IP + '/beChat/get_profile', data)
        .then(response => {
          console.log('/beChat/get_profile', response.data)
          followers = response.data
          console.log('13123123123123', followers)
        })
        .catch(error => {
          console.log(error)
        })

      // ? write database
      for (let i = 0; i < followers.length; i++) {
        // console.log('followers', followers)
        let input = followers[i]
        input.shopId = this.shopId
        // console.log('inputData!!!!!!!', input)
        await axios
          .post(this.DNS_IP + '/beChat/add_followers', input)
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error)
          })
      }

      await axios
        .get(this.DNS_IP + '/beChat/get_followers?shopId=' + this.shopId)
        .then(response => {
          this.list = response.data

          // console.log('/beChat/get_followers', response.data)

          for (let i = this.oldFollower.length; i < this.list.length; i++) {
            this.$set(this.MessageStatus, `${this.list[i].userId}`, 0)
            this.$set(this.lasttimeMassage, `${this.list[i].userId}`, 0)
            this.$set(this.lastMassage, `${this.list[i].userId}`, 0)
            // lastMassage
            this.list[i].statusMessage = '...'
          }
          this.overlay = false
        })
        .catch(error => {
          console.log(error)
        })

      this.listSort = this.list.slice(0)
      this.oldFollower = this.list.slice(0)
    },
    async check_member () {
      var data = []
      this.listNoProfile = []
      // console.log('empty' + this.listNoProfile)
      // console.log('sssss', this.DNS_IP + '/beChat/select_followers?shopId=' + this.shopId)
      await axios
        .get(this.DNS_IP + '/beChat/select_followers?shopId=' + this.shopId)
        .then(response => {
          // console.log('res', response.data)
          data = response.data
        })
        .catch(error => {
          console.log(error)
        })

      // console.log('data + ', data)
      for (let i = 0; i < data.length; i++) {
        if (data[i].displayName === null) {
          this.listNoProfile.push(data[i].userId)
          // console.log('data[i].userId', data[i].userId)
        }
      }

      // console.log(this.listNoProfile + ' = listNoProfile')
      if (this.listNoProfile.length !== 0) {
        // this.start()
      }
    },
    handle_log_update ({ Id, Name }) {
      this.click(Id, Name)
    },
    async click (userId, Name) {
      console.log('!!!!!', userId, Name)
      // this.overlay = true;
      // this.get_log(Id);
      // this.test.Log = ['none'];
      // console.log(this.$refs[`color${userId}`][0].$el.style.backgroundColor)

      for (let i = 0; i < this.list.length; i++) {
        if (userId === this.list[i].userId) {
          this.$refs[`color${userId}`][0].$el.style.backgroundColor = '#e9eaf1'
        } else {
          this.$refs[`color${this.list[i].userId}`][0].$el.style.backgroundColor = 'white'
        }
      }
      this.test.id = userId
      this.test.name = Name

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].userId === userId) {
          this.test.img = this.list[i].pictureUrl
        }
      }
      await this.sent()
      // console.log(this.list);
      // console.log(this.MessageStatus);
      this.MessageStatus[`${userId}`] = 0

      this.old = this.chatAll

      this.overlay = true
      await setTimeout(() => this.Scroll(), 300)

      this.openPerson = true
    },
    Scroll () {
      this.$refs.person.Scroll_End()
      this.overlay = false
    },
    sent () {
      if (this.test.id !== '') {
        const chatfilter = []
        // console.log('this.test.id', this.test.id)
        for (let i = 0; i < this.chatAll.length; i++) {
          if (this.chatAll[i].userId === this.test.id || this.chatAll[i].target === this.test.id) {
            if (this.chatAll[i].content.includes('storage')) {
              chatfilter.push(this.chatAll[i])
            } else {
              const urlRegex = /(https?:\/\/[^\s]+)/g
              const link = this.chatAll[i].content.replace(urlRegex, url => {
                return `<a href="${url}" target="_blank">${url}</a>`
              })
              let replaceNewline = link.replace(/\n/g, '<br>')

              this.chatAll[i].content = replaceNewline
              // console.log(chatfilter)
              chatfilter.push(this.chatAll[i])
            }
          }
        }

        this.test.log = chatfilter
        // console.log(this.test);
      }

      // console.log(this.test.Log);
    },
    async get_log () {
      // ?
      console.log('URL', this.DNS_IP + '/beChat/get_chat?shopId=' + this.shopId)
      await axios
        .get(this.DNS_IP + '/beChat/get_chat?shopId=' + this.shopId)
        .then(response => {
          // console.log('getLog', response.data)
          if (response.data.message === 'No data found') {
            this.overlay = false
            this.chatAll = ['none']
          } else {
            this.chatAll = response.data
            // console.log(this.chatAll)
            // for (let i = 0; i < response.data.length; i++) {
            //     this.chatAll[i].date = moment(
            //         response.data[i].date,
            //         "ddd, DD MMM YYYY HH:mm:ss Z"
            //     );
            // }

            if (this.overlay) {
              this.overlay = false
            }

            // console.log(this.chatAll.filter((item) =>
            // item.userId === "Ua541a3feb11a51d53ab1f00158a64fea"
            // ));
            // console.log(this.old , 'old');
            this.sent()

            if (this.startValue === 0) {
              this.old = this.chatAll
            }

            if (this.old !== this.chatAll) {
              for (let i = this.old.length; i < this.chatAll.length; i++) {
                if (this.test.id !== this.chatAll[i].userId) {
                  this.MessageStatus[`${this.chatAll[i].userId}`] += 1
                }
              }
            }

            let start = 0
            if (this.chatAll.length === this.old.length) {
              start = 0
            } else {
              start = this.old.length
            }

            for (let i = start; i < this.chatAll.length; i++) {
              this.lasttimeMassage[`${this.chatAll[i].userId}`] = moment(
                this.chatAll[i].CREATE_DATE,
                'ddd, DD MMM YYYY HH:mm:ss'
              ).format('HH:mm')
              this.lastMassage[`${this.chatAll[i].userId}`] = this.chatAll[i].content.replace(/<br>/g, ' ')
              // if (this.list[i].statusMessage != null && this.list[i].statusMessage.length > 20) {
              // var cut = this.list[i].statusMessage.slice(0,20)
              // this.list[i].statusMessage = cut + '...'
              // }
            }

            // console.log(Object.keys(this.lastMassage)[0]);
            // console.log(this.listSort[0].userId);
            for (let i = 0; i < Object.keys(this.lastMassage).length; i++) {
              for (let j = 0; j < this.listSort.length; j++) {
                if (
                  this.listSort[j].userId === Object.keys(this.lastMassage)[i]
                ) {
                  if (
                    String(
                      this.lastMassage[`${this.listSort[j].userId}`]
                    ).includes('data:image/jpeg;base64') ||
                    String(
                      this.lastMassage[`${this.listSort[j].userId}`]
                    ).includes('https://storage.google')
                  ) {
                    this.listSort[j].statusMessage = `${this.listSort[j].displayName} sent a photo`
                  } else {
                    if (
                      this.lastMassage[`${this.listSort[j].userId}`].length >
                      20
                    ) {
                      var cut = this.lastMassage[`${this.listSort[j].userId}`].slice(0, 20)
                      this.listSort[j].statusMessage = cut + '...'
                    } else {
                      this.listSort[j].statusMessage = this.lastMassage[`${this.listSort[j].userId}`]
                    }
                  }
                }
              }
            }
            // console.log(this.lasttimeMassage);
            this.old = this.chatAll
            this.startValue++
          }
        })
        .catch(error => {
          console.log(error)
        })
      await setTimeout(() => this.check_member(), 5000)
      await setTimeout(() => this.get_log(), 5000)
    },
    chat (value) {
      // console.log(value);
      this.openPerson = value
    },
    test_action () {
      // console.log(this.sortDesc)
    },
    Default_sort () {
      this.listSort = this.list.slice(0)
      this.tabColor[0] = 'black'
      this.tabColor[1] = this.tabColor[2] = '#989fc9'
      // console.log(this.list);
    },
    async Sort_data () {
      this.listSort.sort(this.compare)

      this.tabColor[1] = 'black'
      this.tabColor[0] = this.tabColor[2] = '#989fc9'
      // console.log(this.list);
    },
    compare (a, b) {
      let nameA = a.displayName.toLowerCase()
      let nameB = b.displayName.toLowerCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    }
  }
}
</script>
<!-- <style>
.box_left {
  background-color: #fefefe;
  height: 717px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
.Tab {
  display: flex;
  margin: 20px;
}
.custom-label-color .v-label {
  color: #c1c5de;
  opacity: 1;
}

.custom-label-color input {
  color: #000000 !important;
}

.New_Chat {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.Button_New_Chat {
  color: #989fc9;
  background-color: #e9eaf1;
  padding: 10px 15px;
  border-radius: 10px;
}

.New_message {
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #ffb6ba;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  margin-left: 2px;
  font-size: 10px;
}

.New_message_time {
  margin-top: 5px;
  color: #989fc9;
  font-size: 13px;
}

.Icon_search_bar {
  width: 20px;
  margin-right: 10px;
  margin-left: 25px;
}

.ScrollBar {
  overflow-y: auto;
  overflow-x: hidden;
  height: 75vh;
}

.ScrollBar_mobile {
  overflow-y: auto;
  overflow-x: hidden;
  height: 81vh;
}
/* width */
::-webkit-scrollbar {
  display: none;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  background-color: #ffffff !important;
}

.v-list-item--active {
  background-color: #ddd;
}

</style> -->
