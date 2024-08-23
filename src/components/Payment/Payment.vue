<template>
  <div>
    <v-text-field
      label="อีเมล์สำหรับรับข้อความยืนยันการชำระเงิน"
      v-model="email"
    ></v-text-field>
    <v-text-field
      label="ข้อความถึงผู้ให้บริการ"
      v-model="message"
    ></v-text-field>
    <v-btn
      v-if="!createCard"
      elevation="2"
      x-large
      color="success"
      text
      @click="openCardForm">ระบุช่องทางชำระเงิน
    </v-btn>
    <span v-if="createCard">เพิ่มช่องทางการชำระเงินเรียบร้อยแล้ว</span><br>
    {{omiseToken}}
  </div>
</template>
<script>
export default {
  components: {
  },
  computed: {
  },
  data () {
    return {
      email: null,
      message: null,
      omiseToken: null,
      omiseSource: null,
      createCard: false
    }
  },
  async mounted () {
    this.$OmiseCard.configure({
      publicKey: this.$omise_public_key
    })
  },
  methods: {
    openCardForm () {
      this.$OmiseCard.open({
        amount: 2000,
        currency: 'THB',
        defaultPaymentMethod: 'credit_card',
        onCreateTokenSuccess: (nonce) => {
          this.createCard = true
          if (nonce.startsWith('tokn_')) {
            this.omiseToken = nonce
          } else {
            this.omiseSource = nonce
          }
          // form.submit()
        }
      })
    }
  }
}
</script>
