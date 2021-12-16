<template>
  <div>
    <v-container class="my-sm-8">
      <v-row>
        <v-col cols="12" md="6" class="pr-md-8" style="border-right: 1px solid #d6d4d5">
          <h1>Create Company</h1>

          <v-form ref="companyform" v-model="companyFormIsValid" lazy-validation @submit.prevent="createCompany">
            <YInput
              id="name"
              v-model="companyForm.name"
              placeholder="Name"
              label="Name"
              class="mt-4"
              :rules="formRules('required-bussines-name')"
            />

            <div class="mb-1 text-truncate mt-4">
              <label for="input-street-address" class="subtitle-1 font-weight-bold text--secondary"> Address </label>
            </div>
            <v-textarea
              id="input-street-address"
              v-model="companyForm.address"
              placeholder="Address"
              :rows="1"
              auto-grow
              outlined
              hide-details="auto"
              :rules="formRules('required')"
            ></v-textarea>

            <YInput
              id="revenue"
              v-model="companyForm.revenue"
              placeholder="revenue"
              label="Revenue"
              type="number"
              class="mt-4"
              :rules="[(v) => (!!v && v >= 0) || 'Invalid Format.']"
            />

            <div class="mt-4 mb-1 text-truncate">
              <label for="input-phone-number" class="subtitle-1 font-weight-bold text--secondary"> Phone No: </label>
            </div>

            <v-row no-gutters>
              <v-col cols="2" class="pr-2">
                <YInput
                  id="input-code"
                  v-model="companyForm.phone.code"
                  placeholder="code"
                  type="number"
                  :rules="[(v) => (!!v && v >= 0) || 'Invalid Format.']"
                />
              </v-col>
              <v-col cols="10">
                <YInput
                  id="input-phone-number"
                  v-model="companyForm.phone.number"
                  placeholder="number"
                  type="number"
                  :rules="[(v) => (!!v && v >= 0) || 'Invalid Format.']"
                />
              </v-col>
            </v-row>

            <v-btn large depressed block color="primary" type="submit" :disabled="!companyFormIsValid" class="mt-6">
              Create
            </v-btn>
          </v-form>
        </v-col>

        <v-col cols="12" md="6" class="pl-md-8">
          <h1>Create Office</h1>

          <v-form ref="officeform" v-model="officeFormIsValid" lazy-validation @submit.prevent="createOffice">
            <YInput
              id="name"
              v-model="officeForm.name"
              placeholder="Name"
              label="Name"
              class="mt-4"
              :rules="formRules('required-bussines-name')"
            />

            <div class="mt-4 mb-1 text-truncate">
              <label class="subtitle-1 font-weight-bold text--secondary"> Location: </label>
            </div>

            <v-row no-gutters>
              <v-col cols="6" class="pr-2">
                <YInput
                  id="input-latitude"
                  v-model="officeForm.location.latitude"
                  placeholder="latitude"
                  type="number"
                  :rules="[(v) => (!!v && v >= 0) || 'Invalid Format.']"
                />
              </v-col>
              <v-col cols="6" class="pl-2">
                <YInput
                  id="input-longitude"
                  v-model="officeForm.location.longitude"
                  placeholder="longitude"
                  type="number"
                  :rules="[(v) => (!!v && v >= 0) || 'Invalid Format.']"
                />
              </v-col>
            </v-row>

            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <div>
                  <div class="mt-4 mb-1 text-truncate">
                    <label for="input-date" class="subtitle-1 font-weight-bold text--secondary">
                      Office Start Date:
                    </label>
                  </div>

                  <v-text-field
                    id="input-date"
                    v-model="officeForm.date"
                    outlined
                    readonly
                    v-bind="attrs"
                    placeholder="date"
                    hide-details="auto"
                    :rules="formRules('required')"
                    v-on="on"
                  ></v-text-field>
                </div>
              </template>
              <v-date-picker
                v-model="officeForm.date"
                :active-picker.sync="activePicker"
                :max="new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>

            <div class="mt-4 mb-1 text-truncate">
              <label class="subtitle-1 font-weight-bold text--secondary"> Company: </label>
            </div>

            <v-select
              v-model="tempCompany"
              :items="companies"
              item-text="name"
              outlined
              placeholder="select company"
              return-object
              hide-details="auto"
              :rules="formRules('required')"
            ></v-select>

            <v-btn large depressed block color="primary" type="submit" :disabled="!officeFormIsValid" class="mt-6">
              Create
            </v-btn>
          </v-form>
        </v-col>
      </v-row>

      <v-divider class="my-8"></v-divider>

      <h1 class="mb-6">Companies</h1>
      <v-row>
        <v-col v-for="(company, i) in companies" :key="'company' + i" cols="12" sm="6">
          <v-card class="rounded-8 shadow-card-sm" @click="toOfficePage(company)">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="h6">{{ company.name }}</div>
              <div>
                <v-btn small icon @click.stop="openDeleteDialog(i)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-divider class=""></v-divider>
            <v-card-text class="text--primary">
              <div class="subtitle-2 font-weight-bold text--secondary">Address:</div>
              <div>{{ company.address }}</div>

              <div class="subtitle-2 font-weight-bold text--secondary mt-2">Revenue:</div>
              <div>{{ company.revenue }}</div>

              <div class="subtitle-2 font-weight-bold text--secondary mt-2">Phone No:</div>
              <div>({{ company.phone.code }}) {{ company.phone.number }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5"> Delete Confirmation </v-card-title>
        <v-card-text v-if="companies[deleteTempCompany]">
          Are you sure to delete {{ companies[deleteTempCompany].name }} company data?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn color="green darken-1" text @click="deleteCompany"> Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showAlert" color="rgba(19, 21, 21, 0.9)" centered timeout="5000">
      {{ messageAlert }}
    </v-snackbar>

    <div id="bottom"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      companies: [],
      companyFormIsValid: false,
      companyForm: {
        name: null,
        revenue: null,
        phone: {
          code: null,
          number: null
        }
      },
      officeFormIsValid: false,
      officeForm: {
        name: null,
        date: null,
        location: {
          latitude: null,
          longitude: null
        }
      },
      tempCompany: null,
      activePicker: null,
      menu: false,
      deleteTempCompany: null,
      deleteDialog: false,
      showAlert: false,
      messageAlert: null
    }
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },

  mounted() {
    // console.log('this.$store: ', this.$store)
    if (Array.isArray(this.$store.getters['company/getCompanies'])) {
      this.companies = JSON.parse(JSON.stringify(this.$store.getters['company/getCompanies']))
    } else {
      this.companies = [...this.$store.getters['company/getCompanies']]
    }
    console.log('this.companies: ', this.companies)
  },

  methods: {
    formRules(rule) {
      switch (rule) {
        case 'required-name':
          return [
            (v) => !!v || 'Name is required!',
            (v) => (typeof v === 'string' && v.trim().length > 0) || 'Invalid',
            (v) => /^[A-Za-z/\s.'-]+$/.test(v) || 'Invalid Format.'
          ]
        case 'required-bussines-name':
          return [
            (v) => !!v || 'harus diisi.',
            (v) => (typeof v === 'string' && v.trim().length > 0) || 'Tidak Valid',
            (v) => /^[A-Za-z/\s.()<>*=#%+'@!&0-9_-]+$/.test(v) || 'Format tidak valid.'
          ]
        case 'required':
          return [(v) => !!v || 'Must be filled.']
        case 'name':
          return [(v) => /^[A-Za-z/\s.'-]+$/.test(v) || v === '' || 'Invalid Format.']
        case 'password':
          return [
            (v) => !!v || 'Kata sandi harus diisi.',
            (v) => (typeof v === 'string' && v.trim().length > 0) || 'Invalid',
            (v) => /^.{6,}$/.test(v) || 'Minimal 6 Karakter.'
          ]
        case 'new-password':
          return [
            (v) => !!v || 'Kata sandi baru harus diisi.',
            (v) => (typeof v === 'string' && v.trim().length > 0) || 'Invalid',
            (v) => /^.{6,}$/.test(v) || 'Minimal 6 Karakter.'
          ]
        case 'link':
          return [(v) => !!v || 'Link harus diisi.']
        case 'email':
          return [(v) => !!v || 'Email harus diisi', (v) => /.+@.+\..+/.test(v) || 'Format email Invalid']
        case 'optional-email':
          return [(v) => v === '' || v === null || /.+@.+\..+/.test(v) || 'Format email Invalid']
        case 'phone':
          return [
            (v) => !!v || 'No. Hp harus diisi',
            (v) => /^[8][0-9]{8,12}$/.test(v) || `${v} tidak sesuai dengan format '8xxxxxxxxx' (9-13 digit angka)`
          ]
        case 'optional-phone':
          return [
            (v) =>
              v === null ||
              v === '' ||
              /^[8][0-9]{8,12}$/.test(v) ||
              `${v} tidak sesuai dengan format '8xxxxxxxxx' (9-13 digit angka)`
          ]
        default:
          return []
      }
    },

    createCompany() {
      if (this.$refs.companyform.validate()) {
        this.companies.push(JSON.parse(JSON.stringify(this.companyForm)))
        this.$store.commit('company/SET_COMPANIES', JSON.parse(JSON.stringify(this.companies)))

        this.messageAlert = 'Success create ' + this.companyForm.name + ' company data.'
        this.showAlert = true

        this.scrollTo('bottom')
      }
    },

    save(date) {
      this.$refs.menu.save(date)
    },

    createOffice() {
      if (this.$refs.officeform.validate()) {
        // const office = []

        if (this.tempCompany.office) {
          this.tempCompany.office.push(JSON.parse(JSON.stringify(this.officeForm)))
        } else {
          this.tempCompany.office = [JSON.parse(JSON.stringify(this.officeForm))]
        }

        this.$store.commit('company/SET_COMPANIES', JSON.parse(JSON.stringify(this.companies)))

        this.messageAlert = 'Success create ' + this.officeForm.name + ' office data.'
        this.showAlert = true

        this.scrollTo('bottom')
      }
    },

    scrollTo(id) {
      this.isOpen = false
      setTimeout(() => {
        const element = document.getElementById(id)
        const y = element.getBoundingClientRect().top + window.pageYOffset

        window.scrollTo({ top: y, behavior: 'smooth' })
      }, 10)
    },

    toOfficePage(company) {
      const route = company.name.replace(/ /g, '-')
      this.$router.push(route)
    },

    openDeleteDialog(index) {
      this.deleteTempCompany = index
      this.deleteDialog = true
    },

    deleteCompany() {
      this.messageAlert = this.companies[this.deleteTempCompany].name + ' company data deleted.'
      this.showAlert = true

      this.companies.splice(this.deleteTempCompany, 1)
      this.$store.commit('company/SET_COMPANIES', JSON.parse(JSON.stringify(this.companies)))

      this.deleteDialog = false
    }
  }
}
</script>

<style>
.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense) textarea {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
