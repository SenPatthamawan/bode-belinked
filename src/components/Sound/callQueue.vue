
<template>
  <div>
    <v-main>
      <v-row>
        <v-col>
          <audio id="playerPrefix" controls="controls">>
            <source src="https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121937822124.wav">
            Your browser does not support the audio format.
          </audio>
          <audio id="playerQueue" controls="controls">>
            <source :src="audio">
            Your browser does not support the audio format.
          </audio>
          <audio id="playerSuffix" controls="controls">>
            <source :src="tableTarget">
            Your browser does not support the audio format.
          </audio>
        </v-col>
        <v-col>
          {{history}}
        </v-col>
      </v-row>
    </v-main>
  </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
import axios from 'axios' // api
export default {
  name: 'callQueue',
  components: {
    'left-menu-admin': adminLeftMenu
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'เรียกคิว',
          disabled: false,
          href: '/callQueue'
        }
      ],
      menu1: false,
      dateEvent: '',
      session: this.$session.getAll(),
      sound: 'ขอเชิญ คิว A delay{0.2} 001 ที่ช่อง 2 ค่ะ',
      audio: null,
      timeCount: 0,
      repeatRound: 2,
      speakerId: 6,
      history: [],
      objInterval: null,
      tableAudioList: [
        '',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120046666444.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120158161147.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120231537428.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023115032683346.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120304592930.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120337912717.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120406621341.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120427470623.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023120459907348.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121655129073.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121626517745.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121553931522.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121527636170.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121455515025.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121426284650.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121358432993.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121332299216.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121227729691.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121148128912.wav',
        'https://botnoi-dictionary.s3.amazonaws.com:443/e94bf12b0abf0ec0335775cd1a906ca1fcfeeff3c24a3ebe5bc9fe3dde5014c1_02102023121045192931.wav'
      ],
      tableTarget: 0,
      tableId: 0
    }
  },
  async mounted () {
    this.getMessage()
  },
  methods: {
    async getMessage () {
      try {
        await axios
          .get(
            `${this.DNS_IP}/callQueues/get?statusNotify=False`
          ).then(async (response) => {
            if (response.data.length > 0 && typeof response.data.status === 'undefined') {
              clearInterval(this.objInterval)
              let result = await this.generateSound(response.data[0])
              await this.updateMessage(response.data[0].id, result)
              setTimeout(this.getMessage, 12000)
            } else {
              setTimeout(this.getMessage, 5000)
            }
          })
      } catch (e) {
        console.log(e)
        setTimeout(this.getMessage, 10000)
      }
    },
    updateMessage (id, result) {
      const params = {
        statusNotify: 'True',
        audioFile: result.audio_url
      }
      axios.post(`${this.DNS_IP}/callQueues/edit/${id}`, params)
    },
    async generateSound (item) {
      this.tableId = item.servicePoint.replace('โต๊ะ ', '')
      console.log('tableId', this.tableId)
      let result
      // let text = this.convertItemtoText(item)
      if (!item.audioFile) {
        var params = {
          text: item.storeFrontQueue,
          text_delay: item.storeFrontQueue,
          speaker: this.speakerId,
          volume: 1,
          speed: 1,
          type_media: 'wav'
        }
        await axios
          .post(
            'https://api-voice.botnoi.ai/api/service/generate_audio',
            params,
            { headers: { 'Botnoi-Token': 'bb16e727e89afe8b24cb08041e78d70cf01efb3b8bd96a004ee2020020f86976' } }
          ).then((res) => {
            this.playSound(res.data)
            result = res.data
          })
      } else {
        let res = { text: item.storeFrontQueue, audio_url: item.audioFile }
        this.playSound(res)
        result = res
      }
      return result
    },
    convertItemtoText (item) {
      let { dock, regNo, storeFrontQueue } = item
      console.log(dock, regNo, storeFrontQueue)
      dock = dock.replace('Dock ', '')
      storeFrontQueue = storeFrontQueue.split('')
      storeFrontQueue[0] = storeFrontQueue[0] + ' delay{0.2} '
      storeFrontQueue = storeFrontQueue.join(' ')
      let text = `ขอเชิญ คิว ${storeFrontQueue} ที่ช่อง ${dock} ค่ะ`
      return text
    },
    playSound (res) {
      console.log(res)
      this.audio = res.audio_url
      this.tableTarget = this.tableAudioList[this.tableId]
      this.timeCount = 1
      let playerPrefix = document.getElementById('playerPrefix')
      let playerQueue = document.getElementById('playerQueue')
      let playerSuffix = document.getElementById('playerSuffix')
      playerPrefix.play()
      playerPrefix.onended = (event) => {
        playerQueue.load()
        playerQueue.play()
        playerQueue.onended = (event) => {
          playerSuffix.load()
          playerSuffix.play()
          playerSuffix.onended = (event) => {
            if (this.timeCount < this.repeatRound) {
              this.timeCount++
              playerPrefix.play()
              playerPrefix.onended = (event) => {
                playerQueue.play()
                playerQueue.onended = (event) => {
                  playerSuffix.play()
                }
              }
            }
          }
        }
      }

      // this.audio = res.audio_url
      // let player = document.getElementById('player')
      // player.load()
      // player.play()
      // this.timeCount = 1
      // player.onended = (event) => {
      //   if (this.timeCount < this.repeatRound) {
      //     player.play()
      //     this.timeCount++
      //   }
      // }
    }
  }
}
</script>
<style scope>
.main{
  background-color: #F5F5F5;
  border-radius: 1rem;
}
.content{
  padding: 1rem;
}
</style>
