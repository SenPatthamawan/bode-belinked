<template>
  <div>
    <!-- <left-menu-admin menuActive="0" :sessionData="session"></left-menu-admin> -->
    <v-main>
      <div class="col-md-12 ml-sm-auto col-lg-12 px-4">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <!-- {{session.data}} -->
      </div>
    </v-main>
  </div>
</template>
<script>
import adminLeftMenu from '../Sidebar.vue' // เมนู
// import moment from 'moment' // แปลง date

export default {
  // layout: 'Zoom',
  components: {
    'left-menu-admin': adminLeftMenu
  },
  created () {
    // setInterval(this.getNow, 1000)
  },
  data () {
    return {
      PK: '',
      dataReady: true,
      dateTime: '', // Generate DateTime
      code: '', // Generate Code
      // Dialog Config ADD EDIT DELETE IMPORT
      dialogAdd: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogImport: false,
      // END Dialog Config ADD EDIT DELETE
      panel: [],
      panel1: [],
      session: this.$session.getAll(),
      // Search All
      searchAll: '',
      // Search Advanced
      search: {
        carName: '',
        carColor: ''
      },
      // End Search Advanced

      // Config Import
      columnsImport: [
      ],
      dataItemImportChecKHide: true,
      dataItemImport: [],
      // End Config Import

      // Form Config ADD EDIT
      formAdd: {
        carName: '',
        carModel: '',
        carColor: '',
        carYear: '',
        carPrice: ''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      formUpdate: {
      },
      // End Form Config ADD EDIT
      // Menu Config
      breadcrumbs: [
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        },
        {
          text: 'Home',
          disabled: false,
          href: '/Core/Home'
        }
      ],
      // End Menu Config
      // Data Table Config
      columns: [],
      dataItem: [],
      // End Data Table Config
      // Export Config
      exportType: 'xls',
      exportFileName: 'Home.xls',
      exportWorksheet: 'WorkSheet',
      export_fields: {
        carID: 'carID',
        carName: 'carName',
        carColor: 'carColor'
      },
      export_data: [],
      json_meta: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ]
      // End Export Config
    }
  },
  async mounted () {
  },
  methods: {
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
