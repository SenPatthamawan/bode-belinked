<template>
    <div class="col-md-12 ml-sm-auto col-lg-12 px-4 ">
      <v-card>
        <v-container>
          <v-row no-gutters>
            <v-col class="pa-0">
              <span class='font-sub-head'>{{TitleTxt}}</span>
            </v-col>
            <v-col class='d-flex justify-end pt-0'>
              <v-btn
                v-if="ShowsBtnClear"
                @click="undoSignature"
                outlined
                style="border-color: #8A8D93; color: #8A8D93; text-transform: none;"
                class="font-sub-btn"
              >
                {{ TxtsBtnClear }}</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col
              class="pt-0"
              style="justify-content: center;display: flex;"
            >
              <vueSignature
                ref="signature"
                w="100%"
                h="300px"
                :sigOption="option"
                style="border: solid 1px; border-radius: 8px; border-color:rgba(46, 38, 61, 0.12); background-color: #FAFAFA;"
              ></vueSignature>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
</template>

<script>
import vueSignature from 'vue-signature'

export default {
  components: {
    vueSignature
  },
  props: [
    'ShowBtnSave',
    'ShowBtnClear',
    'TxtBtnSave',
    'TxtBtnClear',
    'ColorBtnSave',
    'ColorBtnClear',
    'imgType',
    'TitleTxt'
  ],
  data () {
    return {
      ShowsBtnSave: this.ShowBtnSave !== undefined ? this.ShowBtnSave : true,
      ShowsBtnClear: this.ShowBtnClear !== undefined ? this.ShowBtnClear : true,
      TxtsBtnSave: this.TxtBtnSave !== undefined ? this.TxtBtnSave : 'Save',
      TxtsBtnClear: this.TxtBtnClear !== undefined ? this.TxtBtnClear : 'Clear',
      ColorsBtnSave:
        this.ColorBtnSave !== undefined ? this.ColorBtnSave : 'pimary',
      ColorsBtnClear:
        this.ColorBtnClear !== undefined ? this.ColorBtnClear : 'warning',
      ImgTypes: this.imgType !== undefined ? this.imgType : 'png',
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(250,250,250)'
      },
      disabled: false,
      dataUrl: ''
    }
  },
  async mounted () {
    // console.log('this.ShowBtnSave', this.ShowBtnSave)
  },
  methods: {
    // emitEvent () {
    //   this.$emit('child-event', 'Data to send to parent')
    // },
    async saveSignature () {
      console.log('saveSignature', this.$refs.signature)
      if (!this.$refs.signature.isEmpty()) {
        let typeImg
        if (this.ImgTypes === 'jpeg') {
          typeImg = this.$refs.signature.save('image/jpeg')
        } else {
          typeImg = this.$refs.signature.save()
        }
        try {
          const image = await this.convBase64(typeImg)
          const filename = 'test.png'
          // แยกส่วนของ MIME type และ Base64 data
          const [metadata, base64String] = image.data.src.split(';base64,')
          const mime = metadata.split(':')[1] // MIME type เช่น 'image/png'

          // แปลง Base64 data เป็น Binary
          const binary = atob(base64String)
          const array = []
          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i))
          }
          const uint8Array = new Uint8Array(array)

          // สร้าง Blob จาก Binary data และ MIME type
          const blob = new Blob([uint8Array], { type: mime })

          // สร้าง File จาก Blob
          const imgBase64 = new File([blob], filename, { type: mime })

          console.log('imgBase64 sign', imgBase64)
          this.$emit('ReturnImgBase64', imgBase64)
        } catch (errs) {
          this.$emit('ReturnImgBase64', false)
        }
      } else {
        this.$emit('ReturnImgBase64', false)
        console.log('saveSignature false')
      }
    },
    async convBase64 (png) {
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = () => {
          resolve({ data: image, message: true })
        }
        image.onerror = () => {
          reject(new Error(false)) // Handle error if image fails to load
        }
        image.src = png
      })
    },
    undoSignature () {
      this.$refs.signature.clear()
    }
  }
}
</script>

<style>
.font-sub-head{
  font-size: 16px;
  font-weight: 600;
}
.font-sub-btn{
  font-size: 14px;
}
</style>
