<template>
<div>
  <vue-c3 :handler="handler"></vue-c3>
</div>
</template>
<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'

export default {
  props: ['chartData'],
  components: {
    VueC3
  },
  created () {
    setInterval(this.getNowGlobal, 1000)
  },
  data () {
    return {
      session: this.$session.getAll(),
      handler: new Vue()
    }
  },
  async mounted () {
    this.chartData.padding = { bottom: 20 }
    this.handler.$emit('init', this.chartData)
  },
  methods: {
  }
}
</script>
