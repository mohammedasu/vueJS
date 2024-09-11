<template>
  <Layout>
    <template v-if="this.$route.name == 'add-role'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
    <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-form
              enctype="multipart/form-data"
              ref="role"
              @submit.prevent="
                $route.name == 'edit-role'
                  ? updateData($route.params.id)
                  : $route.name == 'add-role'
                  ? submitData
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
              >
               <label for="input-2">Role Name <span style="color: red;">*</span></label>
                <b-form-input
                  id="input-2"
                  v-model="form.name"
                  placeholder="Enter Role Name"
                  :class="{
                    'is-invalid': submitted && $v.form.name.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.name.required"
                  class="invalid-feedback"
                >
                 Role Name is required.
                </div>
              </b-form-group>
              <b-form-group>
               <label for="input-2">Permission <span style="color: red;">*</span></label>
                <div class="role_permission">
                  <div class="" v-for="p in permission" :key="p.id">
                    <!-- <div class=""> -->
                      <b-card style="box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;">
                        <!-- <b-form-group>
                          <template #label>
                            <b>Choose your flavours:</b><br>
                            <b-form-checkbox
                              v-model="form.permission"
                              :options="p.name"
                              :indeterminate="indeterminate"
                              aria-describedby="flavours"
                              aria-controls="flavours"
                              ref="{{sub_menu.id}}" 
                              @change="check(p.id)"
                            >
                              {{ allSelected ? 'Un-select All' : 'Select All' }}
                            </b-form-checkbox>
                          </template>

                          <template v-slot="{ ariaDescribedby }" v-if="p.sub_menu.length > 0">
                            <div v-for="sub_menu in p.sub_menu" :key="sub_menu.id">
                              <b-form-checkbox-group
                                id="flavors"
                                v-model="form.permission"
                                :options="sub_menu.name"
                                :aria-describedby="ariaDescribedby"
                                name="flavors"
                                class="ml-4"
                                aria-label="Individual flavours"
                                stacked
                              ></b-form-checkbox-group>
                            </div>
                          </template>
                        </b-form-group> -->
                        <div class="d-flex align-items-start">
                          <input class="mt-1 mr-1" type="checkbox" @input="checkAll($event,p.id)" v-model="form.permission" :value="p.id">
                          {{ p.name }}
                        </div>
                        <div v-if="p.sub_menu.length > 0">
                          <div v-for="sub_menu in p.sub_menu" :key="sub_menu.id" class="ml-2 d-flex align-items-start">
                            <input class="mt-1 mr-1" type="checkbox" @input="subMenuCheck(sub_menu.id,sub_menu.parent)" v-model="form.permission" :value="sub_menu.id"> {{ sub_menu.name }} 
                          </div>
                        </div>
                      </b-card>
                    <!-- </div> -->
                  </div>
                </div>
                <!-- <b-form-checkbox-group
                  class="mb-1 role_permission"
                  v-model="form.permission"
                  :options="permission"
                  value-field="id"
                  text-field="name"
                  :key="permission.id"
                  ></b-form-checkbox-group
                >
                 <b-form-checkbox-group
                  class="mb-1 role_permission"
                  v-model="form.permission"
                  :options="sub_meu"
                  value-field="id"
                  text-field="name"
                  :key="permission.id"
                  ></b-form-checkbox-group
                > -->
                <!-- <multiselect
                  id="per"
                  v-model="form.permission"
                  :options="permission"
                  :multiple="true"
                  track-by="id"
                  label="name"
                  :preselect-first="true"
                  :class="{
                    'is-invalid': submitted && $v.form.permission.$error,
                  }"
                >
                </multiselect> -->

                <!-- <div
                  v-if="submitted && !$v.form.permission.required"
                  class="invalid-feedback"
                >
                  Permission is required.
                </div> -->
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-role'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-role'"
                @click.prevent="submitData"
                >Save Data</b-button
              >
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import roleMixin from "../../../mixins/ModuleJs/role";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [MixinRequest, roleMixin],
  data() {
    return {
      submitted: false,
      title1: "Add Role",
      title2: "Edit Role",
      items: [
        {
          text: "Back",
          href: "/role",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  components: {
    Layout,
    PageHeader,
  },
  validations: {
    form: {
      name: { required },
      // permission: { required },
    },
  },
  methods: {
    check(val,type = '') {
      if(type == 'sub_menu') {
        let length = this.$refs.sub_menu+''+val.length;
        console.log(length);
      } else {
        let length = this.$refs.sub_menu+''+val.length;
        console.log(length);
      }
    }
  },
};
</script>
