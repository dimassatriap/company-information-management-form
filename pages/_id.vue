<template>
  <div>
    <v-container class="my-8 mt-sm-8 mb-sm-16">
      <template v-if="!company.name">
        <div class="text-center">
          <h1>Company Profile Not Found</h1>

          <v-btn depressed class="mt-6" color="#D6D4D5" @click="$router.push('/')">
            <span style="color: #847f82">Back to Overview</span>
          </v-btn>
        </div>
      </template>

      <template v-else>
        <h1>{{ company.name }}</h1>

        <v-divider class="my-4 my-sm-8"></v-divider>

        <h2>Address:</h2>
        <div>{{ company.address }}</div>

        <h2 class="mt-3">Revenue:</h2>
        <div>{{ company.revenue }}</div>

        <h2 class="mt-3">Phone No:</h2>
        <div>
          ({{ company.phone.code }}) {{ company.phone.number }}

          <v-btn depressed class="float-right" color="#D6D4D5" @click="$router.push('/')">
            <span style="color: #847f82">Back to Overview</span>
          </v-btn>
        </div>

        <v-divider class="my-4 my-sm-8"></v-divider>

        <h1 class="font-weight-regular mb-8">Offices</h1>

        <h3 v-if="!company.office || company.office.length < 1" class="font-weight-medium text-center">
          There is No Office Created Yet
        </h3>

        <v-row v-else>
          <v-col v-for="(office, i) in company.office" :key="'office' + i" cols="12" sm="6">
            <v-card class="rounded-8 shadow-card-sm">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="h6">{{ office.name }}</div>
                <div>
                  <v-btn small icon @click.stop="openDeleteDialog(i)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
              <v-divider class=""></v-divider>
              <v-card-text class="text--primary">
                <div class="subtitle-2 font-weight-bold text--secondary">Location:</div>
                <div>latitude - {{ office.location.latitude }}</div>
                <div>longitude - {{ office.location.longitude }}</div>

                <div class="subtitle-2 font-weight-bold text--secondary mt-2">Office Start Date:</div>
                <div>{{ office.date }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Delete Confirmation </v-card-title>
        <v-card-text v-if="company.office && company.office[deleteTempOffice]">
          Are you sure to delete {{ company.office[deleteTempOffice].name }} office data?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn color="green darken-1" text @click="deleteOffice"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showAlert" color="rgba(19, 21, 21, 0.9)" centered timeout="5000">
      {{ messageAlert }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companies: [],
      company: {
        office: []
      },
      deleteTempOffice: null,
      deleteDialog: false,
      showAlert: false,
      messageAlert: null
    }
  },

  mounted() {
    this.initRoute()
  },

  methods: {
    initRoute() {
      const route = this.$route.params.id.replace(/-/g, ' ')
      this.companies = JSON.parse(JSON.stringify(this.$store.getters['company/getCompanies']))

      for (let i = 0; i < this.companies.length; i++) {
        const e = this.companies[i]
        if (e.name === route) {
          this.company = e
        }
      }
    },

    openDeleteDialog(index) {
      this.deleteTempOffice = index
      this.deleteDialog = true
    },

    deleteOffice() {
      this.messageAlert = this.company.office[this.deleteTempOffice].name + ' office data deleted.'
      this.showAlert = true

      this.company.office.splice(this.deleteTempOffice, 1)
      this.$store.commit('company/SET_COMPANIES', JSON.parse(JSON.stringify(this.companies)))

      this.deleteDialog = false
    }
  }
}
</script>

<style></style>
