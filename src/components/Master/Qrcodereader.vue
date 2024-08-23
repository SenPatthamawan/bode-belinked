<template>
  <div style="height: 100vh;">
    <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
      <v-row style="background-color:black;opacity: 0.5;">
        <v-col cols="6" style="padding-bottom: 0;">
          <button style="margin-top: 2px;" @click="goBack()">
            <v-avatar>
              <v-icon size="34px" style="color: white;"
                >mdi-chevron-left</v-icon
              >
            </v-avatar>
          </button>
        </v-col>
        <v-col cols="6" style="padding-bottom: 0;">
          <qrcode-capture @decode="onDecodeImge" style="margin-top: 2px;position:absolute;">
          </qrcode-capture>
          <button
            style="margin-top: 2px;position:absolute;right:30px;"
            @click="switchCamera"
          >
            <v-avatar>
              <v-icon size="34px" style="color: white;">mdi-cached</v-icon>
            </v-avatar>
          </button>
        </v-col>
      </v-row>
    </qrcode-stream>
  </div>
</template>
<script>
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader'
export default {
  components: { QrcodeStream, QrcodeCapture },

  data () {
    return {
      camera: 'rear',
      noRearCamera: false,
      noFrontCamera: false,
      result: null
    }
  },

  methods: {
    goBack () {
      window.history.back()
    },
    switchCamera () {
      switch (this.camera) {
        case 'front':
          this.camera = 'rear'
          break
        case 'rear':
          this.camera = 'front'
          break
      }
    },
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        const triedFrontCamera = this.camera === 'front'
        const triedRearCamera = this.camera === 'rear'

        const cameraMissingError = error.name === 'OverconstrainedError'

        if (triedRearCamera && cameraMissingError) {
          this.noRearCamera = true
        }

        if (triedFrontCamera && cameraMissingError) {
          this.noFrontCamera = true
        }

        console.error(error)
      }
    },
    async onDecode (content) {
      this.result = content
      if (content) {
        console.log(content)
        await this.pause(content)
        // await this.timeout(500)
        // await this.unpause()
      }
    },
    async onDecodeImge (content) {
      this.result = content
      if (content) {
        console.log(content)
        await this.pause(content)
        // await this.timeout(500)
        // await this.unpause()
      }
    },

    pause (content) {
      this.camera = 'off'
      this.timeout(500)
      // alert(content)
      window.location = content
      // this.$router.push(content)
      // location.reload()
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }
  }
}
</script>
