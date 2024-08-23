<template>
  <v-main>
    <v-row no-gutters>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="3"
        xl="3"
      >

      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="3"
        xl="3"
      >
        <v-data-iterator
          :search="search"
          disable-pagination
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
            background-color="#f6f6f9"
            label="Search"
            class="custom-label-color"
          >
            <template v-slot:prepend-inner>
              <img :src="'/Search.png'" />
            </template>
          </v-text-field>
          <div>
            <span>All</span>
            <span>Personal</span>
            <span>Tag</span>
          </div>
        </template>

        </v-data-iterator>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="3"
        xl="3"
      >
        <button>New Chat</button>
      </v-col>
    </v-row>
  </v-main>
</template>
<script>
export default {
  data: () => ({
    search: ''
  }),
  mounted () {

  },
  methods: {

  }
}
</script>
<style>
.custom-label-color .v-label {
  color: #c1c5de;
  opacity: 1;
}

.custom-label-color  input{
  color: #000000 !important;

}
</style>
