<template>
    <div
      class="col-md-12 ml-sm-auto col-lg-12 px-4 pt-6 pb-0">
          <v-row no-gutters>
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="pl-2 d-flex align-center">
              <span class='font-sub-head'>{{TitleTxt}}</span>
            </v-col>
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="d-flex align-center justify-end">
              <v-btn
                @click="clearAll()"
                outlined
                style="border-color: #8A8D93; color: #8A8D93;"
              >
                ลบทั้งหมด
                </v-btn
              >
            </v-col>
          </v-row>
          <v-divider class='m-divider'></v-divider>
            <v-row no-gutters>
              <v-col class="col-12">
                  <v-file-input
                    v-show="false"
                    @change="CheckFile"
                    v-model="imageBA"
                    :id="`fileInputimageBA${TypeKey}`"
                    hide-input
                    style="display: none"
                    :ref="`trigger_file${TypeKey}`"
                    accept="image/*"
                    multiple
                    required
                  >
                  </v-file-input>
                  <v-slide-group
                    v-model="model"
                    active-class="success"
                    show-arrows
                  >
                    <v-slide-item
                      v-for="(value, index) in showUploadImgItem"
                      :key="index"
                      v-slot="{ active, toggle }"
                    >
                      <v-card
                        v-if="index === 0"
                        color="#EFEEF0"
                        style="border: 1px dashed #C1BEC5; border-radius: 4px;"
                        class="ma-4"
                        height="100"
                        width="100"
                        @click="
                          toggle;
                          refUpload(TypeKey);
                        "
                      >
                        <v-row
                          class="fill-height"
                          style="margin-top: 2px;"
                          align="center"
                          justify="center"
                        >
                          <v-scale-transition>
                            <v-icon
                              style="color: black;"
                              size="30"
                              class="iconify"
                              data-icon="ps:plus"
                            >
                              mdi-plus
                            </v-icon>
                          </v-scale-transition>
                        </v-row>
                      </v-card>
                      <v-card v-else class="ma-4" height="100" width="100">
                        <v-badge
                          overlap
                          color="red"
                          icon="mdi-close"
                          @click.native="clearImg(index)"
                        >
                          <v-img
                            style="width: 100px;
                            height: 100px;
                            object-fit: cover;
                            border-radius: 4px;"
                            :src="value"
                          >
                          </v-img>
                        </v-badge>
                      </v-card>
                    </v-slide-item>
                  </v-slide-group>
              </v-col>
              <p v-if="checkErrors" type="error" class="required-img ml-4">{{ checkErrors }}</p>
            </v-row>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    TitleTxt: {type: String, required: true},
    TypeKey: {type: String, required: true},
    checkError: {type: Number, default: 0},
    defaultArray: {type: Array},
    defaultInputArray: {type: Array}
  },
  data () {
    return {
      model: null,
      BeforeAfterOverlay: true,
      imageBA: null,
      imageNew: [],
      arrReturnVal: [],
      // showUploadImgItem: this.returnData()
      showUploadImgItem: this.defaultArray
    }
  },
  computed: {
    returnData () {
      if (this.defaultArray.length > 1) {
        return this.defaultArray
      } else {
        return ['']
      }
    },
    checkErrors () {
      if (this.checkError === 0) {
        console.log('<RED>')
        return 'กรุณาแนบรูปภาพ'
      } else {
        console.log('<GREEN>')
        return 0
      }
    }
  },
  async mounted () {
    await this.firstPush()
    console.log('this.getUpload >>>> ', this.getUpload)
    console.log('this.defaultInputArray >>>> ', this.defaultInputArray)
  },
  methods: {
    firstPush () {
      for (const f of this.defaultInputArray) {
        this.arrReturnVal.push(f)
      }
    },
    clearAll () {
      let arrReturn = []
      this.showUploadImgItem = ['']
      console.log('clearAll', arrReturn)
      this.imageBA = []
      this.arrReturnVal = []
      this.$emit('ReturnURL', {data: arrReturn, key: this.TypeKey, vals: []})
    },
    clearImg (i) {
      let arrReturn = []
      this.showUploadImgItem.splice(i, 1)
      // this.imageBA.splice(parseInt(i) - 1, 1)
      this.arrReturnVal.splice(parseInt(i) - 1, 1)
      arrReturn = [...this.showUploadImgItem]
      // this.arrReturnVal = [...this.arrReturnVal]
      arrReturn.shift()

      console.log('this.imageBA : ', this.imageBA)
      console.log('this.showUploadImgItem : ', this.showUploadImgItem)
      this.$emit('ReturnURL', {data: arrReturn, key: this.TypeKey, vals: this.arrReturnVal})
    },
    refUpload () {
      let fileUpload = document.getElementById(`fileInputimageBA` + this.TypeKey)
      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    CheckFile () {
      console.log('CheckFile this.imageBA : ', this.imageBA)
      if (this.imageBA != null) {
        let SetImageUrl = ['']
        this.showUploadImgItem.shift()
        for (let i = 0; i < this.imageBA.length; i++) {
          SetImageUrl.push(URL.createObjectURL(this.imageBA[i]))
        }
        this.showUploadImgItem = SetImageUrl.concat(this.showUploadImgItem)
        let arrReturn = null
        arrReturn = [...this.showUploadImgItem]
        arrReturn.shift()
        for (const f of this.imageBA) {
          this.arrReturnVal.push(f)
          f['TypeImgs'] = this.TypeKey
        }
        console.log('this.imageNew >>> ', this.imageNew)
        this.$emit('ReturnURL', {data: arrReturn, key: this.TypeKey, vals: this.arrReturnVal, show: this.showUploadImgItem})
      }
    }
  }
}
</script>

<style>
.font-sub-head{
  font-size: 16px;
  font-weight: 600;
}
.m-divider{
  margin-top: 10px;
  margin-bottom: 10px;
}
.required-img{
  color: #ff5252;
  font-size: 12px;
}
</style>
