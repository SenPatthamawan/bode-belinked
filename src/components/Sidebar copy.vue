<template>
  <div>
    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" fixed app>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <!-- <v-img src='./assets/logo_vgroup.png' /> -->
            <v-img :src="require('@/assets/logo.png')"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              session.data.displayName
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list>
          <v-list-group :value="true" prepend-icon="mdi-account-circle">
            <template v-slot:activator>
              <v-list-item-title>Admin</v-list-item-title>
            </template>
            <!-- ข้อมูลหลัก -->
            <v-list-group :value="true" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>ข้อมูลหลัก</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(item, i) in Master" :key="i" :to="item.to">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <!-- System -->
            <v-list-group :value="true" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>ระบบ</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(item, i) in System" :key="i" :to="item.to">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <!-- System -->

            <!-- System Log-->
            <v-list-group :value="true" no-action sub-group>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Log</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item v-for="(item, i) in Logs" :key="i" :to="item.to">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <!-- System -->
          </v-list-group>
        </v-list>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn dark color="red" block href="/Core/Login">
            <v-icon>mdi-location-exit</v-icon> Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Core Vue',
      drawer: true,
      mini: false,
      session: this.$session.getAll(),
      admins: [
        ['Management', 'mdi-account-multiple-outline'],
        ['Settings', 'mdi-cog-outline']
      ],
      cruds: [
        ['Create', 'mdi-plus-outline'],
        ['Read', 'mdi-file-outline'],
        ['Update', 'mdi-update'],
        ['Delete', 'mdi-delete']
      ],
      Master: [
        {
          icon: 'mdi-account-multiple-outline',
          title: 'ช่องทางรับสมัคร',
          to: '/Master/Channel'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'ระดับการศึกษา',
          to: '/Master/EducationLevel'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'ข้อมูลอาชีพ',
          to: '/Master/Occupation'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'คำนำหน้าชื่อ',
          to: '/Master/Title'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'สัญชาติ',
          to: '/Master/Nationality'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'ข้อมูลชื่อระบบ',
          to: '/Master/Application'
        }
      ],
      System: [
        {
          icon: 'mdi-account-multiple-outline',
          title: 'จัดการ Account',
          to: '/System/User'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'กลุ่มผู้ใช้งาน',
          to: '/System/UserTypeGroup'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'เมนู',
          to: '/System/Menu'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'Privacy',
          to: '/System/Privacy'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'PrivacyCheck',
          to: '/System/PrivacyCheck'
        }
      ],
      Logs: [
        {
          icon: 'mdi-account-multiple-outline',
          title: 'จัดการข้อมูล',
          to: '/Logs/CRUD'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'เข้าระบบ',
          to: '/Logs/Auth'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'ส่งเมลล์',
          to: '/System/User'
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'การแจ้งเตือน',
          to: '/System/User'
        }
      ],
      items: [
        // {
        //   icon: 'mdi-home',
        //   title: 'Home',
        //   to: '/Core/Home'
        // }
      ]
    }
  },
  computed: {},
  mounted () {},
  methods: {}
}
</script>

<style lang="css" scoped></style>
