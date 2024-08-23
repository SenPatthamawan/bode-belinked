<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpenCompleted"
      persistent
      max-width="800"
    >
      <v-card>
        <div class="d-flex flex-column flex-sm-row justify-content-between">
          <div class="col-12 d-flex flex-column">
            <div class="text-center mb-3">
              <span class="font-title">Great news, you’re all setup!</span>
            </div>
            <div class="text-center">
              <span class="font-detail">เริ่มใช้งานร้าน {{ shopName }} ของท่านได้เลย</span>
            </div>
            <div class="text-center mb-2">
              <span class="font-detail">สามารถสแกน Qr Code หรือ Copy Link ได้ด้านล่างที่นี้</span>
            </div>
            <div class="text-center mb-2">
             <qrcode-vue :value="url" :size="150" level="H" foreground="#000000" />
            </div>
            <div class="text-center">
              <v-text-field
               v-model="url"
               label="URL"
               outlined
               prepend-inner-icon="mdi-paperclip"
               :append-icon="isCopied ? 'mdi-check' : 'mdi-content-copy'"
               @click:append="copyLink()"
             >
         </v-text-field>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-center">
           <div class="col-12 col-sm-3">
             <v-btn class="mb-3 w-100 btn-continue" @click="closeCompleted">Continue</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
export default {
  components: {
    QrcodeVue
  },
  data () {
    return {
      qrValue: 'test',
      isCopied: false
    }
  },
  props: {
    isOpenCompleted: {type: Boolean, default: false},
    closeCompleted: Function,
    shopName: {type: String, default: ''},
    url: {type: String, default: ''}
  },
  methods: {
    async copyLink () {
      await navigator.clipboard.writeText(this.url)
      this.isCopied = true
    }
  }
}
</script>
<style scoped>
.font-title {
  font-weight: 600;
  font-size: 1.5rem;
}
.font-detail {
  font-size: 0.90rem;
}
.font-title, .font-detail{
  color: #1B437C;
}
.btn-continue {
  color: #fff;
}
</style>
