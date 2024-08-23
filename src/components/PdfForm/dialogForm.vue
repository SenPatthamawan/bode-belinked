<template>
    <div>
    <v-dialog v-model="dialogShowForm" :max-width="dialogwidth" persistent>
      <v-form ref="form" lazy-validation class='white-bg'>
        <v-container>
          <v-row>
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="d-flex align-center"
              >
              <span class="font-head ml-2">รายงานการทำงาน</span>
            </v-col>
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="d-flex justify-end"
              >
              <v-btn
                class="mx-2"
                fab
                small
                dark
                color="white"
                :style="styleCloseBt"
                @click="closeDialog()"
                >
                  X
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <MultiUpload
            ref="multiUploadBefore"
            :TitleTxt="'BEFORE'"
            :TypeKey="'beforeImage'"
            :defaultArray="imageDataValSrc['beforeImage']"
            :defaultInputArray="imageDataVal['beforeImage']"
            @ReturnURL="getUrl"
            :checkError='imageDataVal.beforeImage.length'
            ></MultiUpload>
          </v-row>
          <v-row>
            <MultiUpload
            ref="multiUploadAfter"
            :TitleTxt="'AFTER'"
            :TypeKey="'afterImage'"
            :defaultArray="imageDataValSrc['afterImage']"
            :defaultInputArray="imageDataVal['afterImage']"
            @ReturnURL="getUrl"
            :checkError='imageDataVal.afterImage.length'
            ></MultiUpload>
          </v-row>
          <v-row class="pb-0">
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="pr-1"
            >
              <div class='mb-2 font-sub-head'>อุณหภูมิก่อนล้าง</div>
                <v-text-field
                  v-model="detailsForm.beforeAir"
                  outlined
                  dense
                  class="custom-outlined-textfield"
                  color="black"
                  :rules="rules.required"
                  type="number"
                  step="any"
                ></v-text-field>
            </v-col>
            <v-col
              cols="6"
              sm="6"
              md="6"
              class="pl-1"
            >
              <div class='mb-2 font-sub-head'>อุณหภูมิหลังล้าง</div>
                <v-text-field
                  v-model="detailsForm.afterAir"
                  outlined
                  dense
                  class="custom-outlined-textfield"
                  color="black"
                  :rules="rules.required"
                  type="number"
                  step="any"
                ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pb-0">
            <v-col
            cols="12"
            sm="12"
            md="12"
          >
            <div class="mb-2 font-sub-head">รายละเอียดเพิ่มเติม</div>
            <v-textarea
              v-model="detailsForm.remark"
              name="input-details"
              value=""
              placeholder="กรอกรายละเอียดเพิ่มเติม"
              outlined
              hide-details="auto"
              class="custom-outlined-textarea small-placeholder"
              color="black"
              :rules="rules.required"
            ></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="detailsForm.signatureURL" class='d-flex justify-space-between'>
              <v-col class="pa-0 d-flex align-center">
                <span class='font-sub-head'>ลายเซ็น</span>
              </v-col>
              <v-btn
                  @click="editSign()"
                  outlined
                  style="border-color: #8A8D93; color: #8A8D93; text-transform: none;"
                  class="font-sub-btn"
                >
                  แก้ไขลายเซ็น</v-btn
                >
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="detailsForm.signatureURL" class="d-flex justify-center">
              <img :src="detailsForm.signatureURL" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </v-col>
                  <SignaturePad
                  v-else
                  ShowBtnSave="true"
                  ref="signaturePad"
                  :TitleTxt="'ลายเซ็น'"
                  @ReturnImgBase64="saveSign"
                  ></SignaturePad>
          </v-row>
          <v-row cols="12">
            <v-col
            cols="5"
            sm="5"
            md="5"
            class="pr-1"
            >
              <v-btn
                class="font-btn-cancel"
                elevation="2"
                block
                color="#D2D1D3"
                dark
                @click="closeDialog()"
              >ยกเลิก</v-btn>
            </v-col>
            <v-col
            cols="7"
            sm="7"
            md="7"
            class="pl-1"
            >
              <v-btn
                class="font-btn"
                elevation="2"
                block
                color="#1B437C"
                dark
                @click="addDataForm"
              >บันทึก</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-overlay :value="loadingAdd">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-form>
  </v-dialog>
    </div>
</template>

<script>
import SignaturePad from '../SignaturePad/SignaturePad.vue'
import MultiUpload from '../PdfForm/multiUpload.vue'
import axios from 'axios'
export default {
  components: {SignaturePad, MultiUpload},
  props: {
    dialogShowForm: {type: Boolean, required: true},
    dialogwidth: {type: String, required: true},
    getImgSignature: {type: Function},
    closeDialog: {type: Function},
    loadingAdd: {type: Boolean},
    jobId: {type: Number},
    detailsForm: {type: Object},
    getSaveURL: {type: Function}
  },
  data () {
    return {
      imageDataVal: {
        beforeImage: [],
        afterImage: []
      },
      imageDataValSrc: {
        beforeImage: [''],
        afterImage: ['']
      },
      imageBase64: null,
      rules: {
        required: [v => !!v || 'กรุณากรอกข้อมูล']
      }
    }
  },
  async mounted () {
    await this.getMultiImage()
    await this.getSaveURL()
  },
  methods: {
    saveSign (e) {
      console.log('e saveSign: ', e)
      this.dataSign = e
    },
    async getMultiImage () {
      try {
        await this.$emit('updateDialogLoading', true)
        // console.log('>>>>>>> URL <<<<<<<<<', 'http://localhost:5001/formpdf/getmultiimage?jobId=' + this.jobId)
        // eslint-disable-next-line no-unused-expressions
        // const getImg = await axios.get('http://localhost:5001/formpdf/getmultiimage?jobId=' + this.jobId)
        const getImg = await axios.get(this.DNS_IP + '/formpdf/getmultiimage?jobId=' + this.jobId)
        console.log('getImg : ', getImg.data.data)
        if (getImg.data.data.length) {
          for (const i of getImg.data.data) {
            if (i.beforeafter !== null) {
              this.imageDataValSrc[i.typeUpload].push(i.beforeafter)
              await this.convertBase64ToFile(i)
            }
          // this.imageDataValSrc[i.typeUpload].push(i.urlDomain)
          }
          this.$emit('updateDialogLoading', false)
        }
        this.$emit('updateDialogLoading', false)
      } catch (err) {
        console.log('>>>>>>> ERROR getMultiImage', err)
        this.$emit('updateDialogLoading', false)
      }
    },
    // convertBase64ToFile (imgBase64) {
    //   try {
    //     console.log('imgBase64 i', imgBase64)
    //     const data = 'data:image/jpeg;base64,' + imgBase64.urlDomain
    //     const [header, base64String] = data.split(',')
    //     const mime = header.match(/:(.*?);/)[1]
    //     const byteString = atob(base64String)
    //     const ab = new ArrayBuffer(byteString.length)
    //     const ia = new Uint8Array(ab)
    //     for (let i = 0; i < byteString.length; i++) {
    //       ia[i] = byteString.charCodeAt(i)
    //     }
    //     const blob = new Blob([ab], { type: mime })
    //     const file = new File([blob], 'image.png', { type: mime })
    //     // console.log(blob, blob);
    //     console.log('file', file)
    //     const dataTransfer = new DataTransfer()
    //     dataTransfer.items.add(file)
    //     this.imageBase64 = dataTransfer.files
    //     this.imageDataVal[imgBase64.typeUpload].push(file)
    //     console.log('this.imageDataVal : ', this.imageDataVal)
    //   } catch (err) {
    //     console.error('Invalid Base64 String:', err)
    //   }
    // },
    async convertBase64ToFile (imgUrl) {
      const response = await fetch(imgUrl.beforeafter, {mode: 'cors'})
      const blob = await response.blob()
      const mime = blob.type || 'image/png'
      const file = new File([blob], imgUrl.beforeafter.split('betask-linked/static/upload/BeforeAfter/')[1], { type: mime })
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      this.imageBase64 = dataTransfer.files
      this.imageDataVal[imgUrl.typeUpload].push(file)
    },
    async addDataForm (x) {
      console.log('this.dataSign addDataForm in dialogForm ->', this.dataSign)
      console.log('this.$refs.signaturePad addDataForm in dialogForm ->', this.$refs.signaturePad)

      // if -> ยังไม่เคยมีรูปภาพลายเซ็น (กรอกฟอร์ม/วาดลายเซ็นครั้งแรก)
      // this.$refs.signaturePad จะเก็บค่าการวาดลายเซ็นบน canvas แล้วส่งค่านี้ไป save เป็นรูปภาพที่ saveSignature function ของ component SignaturePad
      if (this.$refs.signaturePad !== undefined) {
        this.detailsForm.signatureURL = await this.$refs.signaturePad.saveSignature()
        // else -> มีรูปภาพลายเซ็นอยู่แล้ว
        // this.$refs.signaturePad = undefined เพราะไม่ได้มีการวาดลายเซ็นลง canvas
      } else {
        this.detailsForm.signatureURL = this.detailsForm.signatureURL
      }

      // เช็คว่าถ้าไม่มีรูปภาพลายเซ็นเดิม และ ไม่มีการวาดลายเซ็นใหม่ ตอนกดบันทึกฟอร์มจะขึ้นแจ้งเตือน
      if (!this.dataSign && !this.detailsForm.signatureURL) {
        this.$swal('คำเตือน', 'โปรดกรอกข้อมูลให้ครบถ้วน', 'warning')
      } else {
        this.imageDataVal[x.key] = x.vals // ใช้ตัวนี้ในการส่งค่าไปยังหลังบ้าน เพื่ออัพโหลด //
        this.$emit('ReturnURL', {'multiImg': this.imageDataVal, 'detailsForm': this.detailsForm, 'dataSign': this.dataSign})
        console.log('ok ReturnURL: ', {'multiImg': this.imageDataVal, 'detailsForm': this.detailsForm, 'dataSign': this.dataSign})
      }
    },
    async getUrl (x) {
      if (x.vals !== undefined) {
        this.imageDataVal[x.key] = x.vals // ใช้ตัวนี้ในการส่งค่าไปยังหลังบ้าย เพื่ออัพโหลด //
      } else {
        this.imageDataVal[x.key] = []
      }
    },
    editSign () {
      this.detailsForm.signatureURL = ''
    }
  }
}
</script>

<style>
.font-sub-head{
  font-size: 16px;
  font-weight: 600;
}
.white-bg{
  background-color: white
}
.font-head{
  font-size: 20px;
  font-weight: 600;
}
.custom-outlined-textarea.v-text-field--outlined >>> fieldset {
  border: solid 1px;
  border-radius: 8px;
  border-color: rgba(46, 38, 61, 0.12);
}
.small-placeholder ::placeholder {
  font-size: 12px;
}
.custom-outlined-textfield.v-text-field--outlined >>> fieldset {
  border: solid 1px;
  border-radius: 8px;
  border-color: rgba(46, 38, 61, 0.12);
}
.font-btn-cancel{
  font-size: 20px;
  font-weight: 600;
  color: #2E263D;
  opacity: 0.55;
}
.font-btn{
  font-size: 20px;
  font-weight: 600;
}
</style>
