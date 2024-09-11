<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <template v-if="this.$route.name == 'add-question-bank'">
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
              ref="questionBank"
              @submit.prevent="
                $route.name == 'edit-question-bank'
                  ? updateData($route.params.id)
                  : ''
              "
            >
              <b-form-group
                id="input-group-1"
                :class="{
                  'form-group--error': $v.form.question.$error,
                }"
              >
                <label for="comm">Question <span style="color: red;">*</span></label>
                <b-form-input
                  id="comm"
                  v-model="form.question"
                  @input="delayTouch($v.form.question)"
                  placeholder="Enter Question"
                  :class="{
                    'is-invalid': submitted && $v.form.question.$error,
                  }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.form.question.required"
                  class="invalid-feedback"
                >
                  Question is required.
                </div>
                <div class="error" v-if="!$v.form.question.maxLength">
                  Must have maximum
                  {{ $v.form.question.$params.maxLength.max }}
                  characters.
                </div>
              </b-form-group>

              <b-form-group>
                <label for="question_type">Question Type <span style="color: red;">*</span></label>
                <b-form-select
                  id="question_type"
                  v-model="form.question_type"
                  :options="questionTypes"
                  value-field="value"
                  text-field="name"
                  :class="{
                    'is-invalid': submitted && $v.form.question_type.$error,
                  }"
                >
                </b-form-select>
                <div
                  v-if="submitted && !$v.form.question_type.required"
                  class="invalid-feedback"
                >
                  Question Type is required.
                </div>
              </b-form-group>

              <template v-if="form.question_type == 'mcq'">
                <div
                  class="row"
                  v-for="(val, index) in form.options"
                  :key="index"
                >
                  <div class="col-md-6">
                    <b-form-group
                      id="input-group-1"
                    >
                      <label for="input-1"
                          >Option {{index + 1}} <span style="color: red">*</span></label
                        >
                      <b-form-input
                        id="input-1"
                        v-model="val.value"
                        :key="val.key"
                        placeholder="Enter Title"
                        @keydown.space="preventLeadingSpace"
                        :class="{
                          'is-invalid': submitted && $v.form.options.$error,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.form.options.required"
                        class="invalid-feedback"
                      >
                        Option is required.
                      </div>
                    </b-form-group>
                  </div>
                  <div class="col-md-4" style="margin-top: 30px">
                    <b-button
                      variant="success"
                      class="mr-3"
                      @click.prevent="addOption(index)"
                      :disabled ="val.value.length == 0"
                      >Add Option</b-button
                    >
                    <b-button
                      variant="danger"
                      @click.prevent="removeOption(index)"
                      >Remove Option</b-button
                    >
                  </div>
                </div>
              </template>

              <template v-if="form.question_type == 'mcq'">
                <b-form-group>
                    <label for="corr"
                      >Select Correct Option <span style="color: red">*</span></label
                    >
                  <b-form-select
                    id="corr"
                    v-model="form.correct_option"
                    :options="form.options"
                    value-field="value"
                    text-field="value"
                  >
                  </b-form-select>
                </b-form-group>
              </template>

              <b-form-group>
                <b-form-checkbox v-model="form.is_mandatory"
                  >Is Mandatory ?</b-form-checkbox
                >
              </b-form-group>
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-if="$route.name == 'edit-question-bank'"
                @click.prevent="updateData($route.params.id)"
                >Update Data</b-button
              >
              <b-button
                type="submit"
                variant="primary"
                class="mr-2"
                v-else-if="$route.name == 'add-question-bank'"
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
import questionBankMixin from "../../../mixins/ModuleJs/question-bank";
import { required, maxLength } from "vuelidate/lib/validators";

const touchMap = new WeakMap();

export default {
  data() {
    return {
      questions: [""],
      submitted: false,
      title1: "Add Question Bank",
      title2: "Edit Question Bank",
      items: [
        {
          text: "Back",
          href: "/question-bank",
        },
        {
          text: "Data",
        },
      ],
    };
  },
  mixins: [MixinRequest, questionBankMixin],
  components: {
    Layout,
    PageHeader,
  },
  validations: {
    form: {
      question: { required, maxLength: maxLength(250) },
      question_type: { required },
      options: { required },
    },
  },
  methods: {
    preventLeadingSpace(e) {
      // only prevent the keypress if the value is blank
      if (!e.target.value) e.preventDefault();
      // otherwise, if the leading character is a space, remove all leading white-space
      else if (e.target.value[0]==' ') e.target.value = e.target.value.replace(/^\s*/, "");
    },
    delayTouch($v) {
      $v.$reset();
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },
  },
};
</script>
