<template>
  <Layout>
    <!-- <PageHeader :title="title" :items="items"></PageHeader> -->
    <!-- <template v-if="this.$route.name == 'add-case'">
      <PageHeader :title="title1" :items="items"></PageHeader>
    </template>
     <template v-else>
      <PageHeader :title="title2" :items="items"></PageHeader>
    </template> -->
    <b-tabs>
      <b-tab title="English">
        <div class="row" id="case-carousel">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <!-- <h4 class="card-title">Add Case Item</h4> -->
                <form-wizard
                  @on-complete="submitData"
                  color="#556ee6"
                  enctype="multipart/form-data"
                  ref="case"
                  :finishButtonText="this.$route.name == 'add-case' ? 'Save Data' : 'Update Data'"
                  back-button-text="Go Back!" 
                  next-button-text="Go Next!"
                >
                  <!-- <tab-content title="Case Details" icon="mdi mdi-comment" :before-change="() => validateFormOne()"> -->
                  <tab-content title="Case Details" icon="mdi mdi-comment">
                    <div class="row">
                      <div class="col-12">                    
                        <b-form ref="step1">
                          <b-form-group id="input-group-1" :class="{
                                'form-group--error': $v.form.title.$error,
                              }">
                            <label for="case_title">Case Title <span style="color: red;">*</span></label>
                            <b-form-input id="case_title" v-model="form.title" placeholder="Enter Case Title"                    @input="delayTouch($v.form.title)"
                              :class="{ 'is-invalid': submitted && $v.form.title.$invalid }">
                            </b-form-input>
                            <div v-if="submitted && !$v.form.title.required" class="invalid-feedback">Case Title is required.</div>
                            <div
                              class="error"
                              v-if="!$v.form.title.maxLength"
                            >
                              Must have maximum
                              {{ $v.form.title.$params.maxLength.max }}
                              characters.
                            </div>
                          </b-form-group>
                          <b-form-group id="input-group-2">
                            <label for="case_desc">Tell Us More About The Case <span style="color: red;">*</span></label>
                            <ckeditor id="case_desc" :editor="editor" v-model="form.description"
                              :class="{
                                'is-invalid': submitted && $v.form.description.$invalid,
                              }">
                            </ckeditor>
                            <div v-if="submitted && !$v.form.description.required" class="invalid-feedback">Description is required.</div>
                          </b-form-group>
                          <b-form-group>
                            <label for="case_ques_type">Case Question Type <span style="color: red;">*</span></label>
                            <b-form-select id="case_ques_type" @input="questionType" v-model="form.question_type"
                              value-field="value" text-field="text" :options="case_question_options"
                              :class="{'is-invalid': submitted && $v.form.question_type.$invalid}"
                            >
                            </b-form-select>
                            <div v-if="submitted && !$v.form.question_type.required" class="invalid-feedback">Type is required.</div>
                          </b-form-group>
                          <template v-if="form.question_type == 'mcq'">
                            <b-form-group>
                              <b-button variant="success" class="float-right" @click.prevent="addmore">Add More</b-button>
                            </b-form-group>
                            <b-carousel :interval="interval" ref="myCarousel" id="carousel-1" v-model="slide" @setSlide="setSlide" indicators>
                              <b-carousel-slide v-for="(addmore, key) in form.addMore" :key="key">
                                <!-- <b-form-group id="input-group-type">
                                  <label>Type <span style="color: red">*</span></label>
                                  <b-form-select
                                    id="in-type"
                                    v-model="addmore.type"
                                    value-field="value"
                                    text-field="text"
                                    :options="question_options"
                                    :class="{'is-invalid': submitted && $v.form.addMore.$each[key].type.$invalid}">
                                  </b-form-select>
                                  <div v-if="submitted && !$v.form.addMore.$each[key].type.required" class="invalid-feedback">Type is required.</div>
                                </b-form-group> -->
                                <b-form-group id="input-group-2">
                                  <label>Question <span style="color: red;">*</span></label>
                                  <b-form-input
                                    id="enter_case_ques"
                                    v-model="addmore.question"
                                    placeholder="Enter Question"
                                    :class="{'is-invalid': submitted && $v.form.addMore.$each[key].question.$invalid}">
                                  </b-form-input>
                                  <div v-if="submitted && !$v.form.addMore.$each[key].question.required" class="invalid-feedback">Question is required.</div>
                                </b-form-group>
                                <div class="row" v-for="(val, index) in addmore.option" :key="index">
                                  <div class="col-md-6">
                                    <b-form-group id="input-group-1">
                                      <label for="case_add_more">Option {{index + 1}} <span style="color: red;">*</span></label>
                                      <b-form-input 
                                        id="case_add_more" 
                                        v-model="val.value" 
                                        :key="val.key" 
                                        placeholder="Enter Option" 
                                        @keydown.space="preventLeadingSpace">
                                      </b-form-input>
                                    </b-form-group>
                                  </div>
                                  <div class="col-md-4" style="margin-top: 30px; text-align: start">
                                    <b-button
                                      variant="success"
                                      class="mr-3"
                                      @click.prevent="addOption(key)"
                                      :disabled ="val.value.length == 0"
                                      >Add Option</b-button
                                    >
                                    <b-button
                                      variant="danger"
                                      @click.prevent="removeOption(index, key)"
                                      >Remove Option</b-button
                                    >
                                  </div>
                                </div>
                                <b-form-group>
                              <label for="case_correct_option">Select Correct Option <span style="color: red;">*</span></label>
                              <b-form-select
                                id="case_correct_option"
                                v-model="addmore.correct_option"
                                :options="addmore.option"
                                value-field="key"
                                text-field="value"
                                :class="{
                                  'is-invalid': submitted && $v.form.addMore.$each[key].correct_option.$invalid,
                                }"
                              >
                              </b-form-select>
                              <div
                                v-if="submitted && !$v.form.addMore.$each[key].correct_option.required"
                                class="invalid-feedback"
                              >
                              Correct Option is required.
                            </div>
                                </b-form-group>
                                <b-form-group
                              id="input-group-2"
                              label="Describe the Correct Answer"
                              label-for="case_desc"
                            >
                              <ckeditor
                                id="case_desc"
                                class="ck-editor"
                                :editor="editor"
                                v-model="addmore.answer_details"
                              ></ckeditor>
                                </b-form-group>
                                <template v-if="addmore.type == 'discussion_forum'">
                                  <b-form-group id="example-date" label="Show Answer At" label-for="date">
                                    <b-form-input
                                      id="date"
                                      type="datetime-local"
                                      v-model="addmore.show_answer_at"
                                      :min="disabledDates()">
                                    </b-form-input>
                                    <!-- <div v-if="submitted && !$v.form.addMore.show_answer_at.required" class="invalid-feedback">Show answer at is required when type is Discussion Forum. </div> -->
                                  </b-form-group>
                                </template>
                              </b-carousel-slide>
                            </b-carousel>
                          </template>
                          <b-form-group class="case-img">
                            <div class="d-flex justify-content-between">
                              <label for="case_image">Item Image [Multiple Selection allowed] [Upload Max File Size : 2MB]</label>
                              <template v-if="$route.name == 'edit-case' && images.length > 0">
                                <a href="javascript:void(0);" @click="downloadZip()">
                                  <i class="fa fa-download"></i> Download Images
                                </a>
                              </template>
                            </div>
                          <b-form-file
                            id="case_image"
                            ref="case_item_image"
                            accept="image/*"
                            multiple="multiple"
                            placeholder="Choose a file or drop it here..."
                            @change="readFile($event, 'image')">
                          </b-form-file>
                          <template v-if="$route.name == 'edit-case' && images">
                            <img
                              v-for="image in images"
                              :key="image.id"
                              :src="image.image"
                              width="128px"
                              height="128px"
                            />
                          </template>
                          <template v-if="$route.name == 'add-case'">
                            <img
                              v-for="image in images"
                              :key="image.id"
                              :src="image.image"
                              width="128px"
                              height="128px"
                            />
                          </template>
                        </b-form-group>
                        </b-form>
                      </div>
                    </div>
                  </tab-content>
                  <!-- <tab-content title="Add Tags" icon="mdi mdi-file-image" :before-change="() => validateFormTwo()"> -->
                    <tab-content title="Add Tags" icon="mdi mdi-file-image">
                    <div class="row">
                      <b-form-group class="col-6">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <label for="comm" class="mb-0">Community <span style="color: red;">*</span></label>
                          <b-form-checkbox v-model="status" button button-variant="info" size="sm">
                            <template v-if="status">Unselect All</template>
                            <template v-else>Select All</template>
                          </b-form-checkbox>
                        </div>
                        <multiselect
                          @search-change="fetchCommunity"
                          id="comm"
                          v-model="form.community_selected"
                          :options="community"
                          :multiple="true"
                          track-by="id"
                          label="title"
                          placeholder="Type here to search"
                          :class="{'is-invalid': store && $v.form.community_selected.$invalid}">
                          <span slot="noOptions">
                              Type here to search
                          </span>
                        </multiselect>
                        <div v-if="store && !$v.form.community_selected.required" class="invalid-feedback">Community is required.</div>
                      </b-form-group>
                      <b-form-group class="col-6" label="Country" label-for="input-multi">
                        <multiselect
                          @search-change="fetchAllCountry"
                          id="input-multi"
                          v-model="form.country"
                          :options="allCountry"
                          :multiple="true"
                          track-by="name"
                          label="name"
                          placeholder="Type here to search">
                        </multiselect>
                        <span slot="noOptions">
                            Type here to search
                        </span>
                      </b-form-group>
                      <b-form-group label="Sub Speciality" label-for="video_sub_spec" class="col-6">
                        <multiselect
                          id="video_sub_spec"
                          v-model="form.sub_specialities"
                          :options="subspecialities"
                          :multiple="true"
                          track-by="id"
                          label="name"
                          placeholder="Type here to search">
                          <span slot="noOptions">
                              Type here to search
                          </span>
                        </multiselect>
                      </b-form-group>
                      <b-form-group class="col-6" label="Knowledge Category" label-for="video_knowledge">
                        <multiselect
                          id="video_knowledge"
                          v-model="form.knowledge_category"
                          :options="knowledgeCategories"
                          :multiple="true"
                          track-by="id"
                          label="display_name"
                          placeholder="Type here to search">
                          <span slot="noOptions">
                              Type here to search
                          </span>
                        </multiselect>
                      </b-form-group>
                      <b-form-group label="Forum" label-for="in-forum" class="col-6">
                    <b-form-select
                      id="in-forum"
                      v-model="form.partner_division_id"
                      :options="forum"
                      value-field="id"
                      text-field="title"
                    >
                    </b-form-select>
                    <!-- <div v-if="store && !$v.form.partner_division_id.required" class="invalid-feedback">The Partner Division Field is required when Expert is empty.</div> -->
                      </b-form-group>
                      <b-form-group label="Enter Free tags" label-for="tags-separators" class="col-12">
                        <b-form-tags
                          input-id="tags-separators"
                          v-model="form.tags"
                          tag-variant="primary"
                          tag-pills
                          separator=" "
                          placeholder="Enter new tags separated by space and enter">
                        </b-form-tags>
                      </b-form-group>
                      <b-form-group label="Expert" label-for="exp" class="col-6">
                        <b-form-select
                          id="exp"
                          v-model="form.expert_id"
                          :options="expert"
                          value-field="id"
                          text-field="name"
                        >
                        </b-form-select>
                        <!-- <div v-if="store && !$v.form.expert_id.required" class="invalid-feedback">The Expert Field is required when Partner Division is empty.</div> -->
                      </b-form-group>
                      <b-form-group  label="View Multiplication Factor" label-for="view_multi_factor" class="col-6">
                        <b-form-input
                          id="view_multi_factor"
                          type="number"
                          placeholder="Enter View Multiplication Factor"
                          v-model="form.view_multiplication_factor">
                        </b-form-input>
                      </b-form-group>
                      <b-form-group
                        class="col-6"
                        label="Meta Title"
                        label-for="input-2"
                          :class="{
                            'form-group--error': $v.form.meta_title.$error,
                          }"
                      >
                        <b-form-input
                          id="input-2"
                          v-model="form.meta_title"
                          placeholder="Enter Meta Title"
                          @input="delayTouch($v.form.meta_title)"
                        ></b-form-input>
                          <div class="error" v-if="!$v.form.meta_title.maxLength">
                            Must have maximum
                            {{ $v.form.meta_title.$params.maxLength.max }}
                            characters.
                          </div>
                      </b-form-group>
                      <b-form-group class="col-6" id="input-group-7" label="Meta Keywords" label-for="input-4"   :class="{
                            'form-group--error': $v.form.meta_keywords.$error,
                          }">
                        <b-form-input
                          id="input-4"
                          v-model="form.meta_keywords"
                          @input="delayTouch($v.form.meta_keywords)"
                          placeholder="Enter Meta Keywords"
                        ></b-form-input>
                          <div class="error" v-if="!$v.form.meta_keywords.maxLength">
                            Must have maximum
                            {{ $v.form.meta_keywords.$params.maxLength.max }}
                            characters.
                          </div>
                      </b-form-group>
                      
                    </div>
                    <b-form-group
                        id="input-group-3"
                        label="Meta Description"
                        label-for="input-3"
                          :class="{
                          'form-group--error': $v.form.meta_desc.$error,
                        }"
                      >
                        <ckeditor
                          id="input-3"
                          v-model="form.meta_desc"
                          @input="delayTouch($v.form.meta_desc)"
                          :editor="editor"
                        ></ckeditor>
                          <div class="error" v-if="!$v.form.meta_desc.maxLength">
                            Must have maximum
                            {{ $v.form.meta_desc.$params.maxLength.max }}
                            characters.
                          </div>
                      </b-form-group>
                  </tab-content>
                  <tab-content title="Preview" icon="dripicons-preview">
                  <!-- <tab-content title="Preview" icon="dripicons-preview"> -->
                    <div class="preview">
                      <div class="thumbnail-preview">
                        <h5>Thumbnail View</h5>
                        <div class="thumbnail-card grid-case p-2">
                          <div class="case">
                            <template v-if="form.expert_id != '' && form.expert_id != null">
                              <div class="case-expert-img"><img :src="getExpertImg(form.expert_id)" alt=""></div>
                              <div class="case-expert-name">{{getExpertName(form.expert_id)}}</div>
                            </template>
                            <template v-else>
                              <div class="case-expert-img"><img src="../../../../public/placeholder/placeholder-profile_image.png" alt=""></div>
                              <div class="case-expert-name">Not Expert Name Selected</div>
                            </template>
                            <!-- <div>
                              <img src="../../../../public/cases/icon_doc_location.svg" width="30" alt="">
                              <div>Pune</div>
                            </div> -->
                          </div>
                          <div class="case-desc" v-html="this.form.description"></div>
                          <div class="case-actions">
                            <div class="actions-grid">
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/mind-icon-grey.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Insightful</div>
                                </div>
                              </div> 
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/like-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Like</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/share-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Share</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="web-preview">
                        <h5>Web View</h5>
                        <div class="web-case-card">
                          <div class="case-grid">
                            <template v-if="form.expert_id != '' && form.expert_id != null">
                              <div class="case-expert-img"><img :src="getExpertImg(form.expert_id)" alt="No Image Selected"></div>
                              <div class="case-expert-name">{{getExpertName(form.expert_id)}}</div>
                            </template>
                            <template v-else>
                              <div class="case-expert-img"><img src="../../../../public/placeholder/placeholder-profile_image.png" alt=""></div>
                              <div class="case-expert-name">Not Expert Name Selected</div>
                            </template>
                          </div>
                          <div class="images-preview-grid">
                            <template v-for="(image, index) in images" >
                              <viewer :images="images" :key="image.id"  class="preview-img">
                                <img :src="images[index]" >
                              </viewer>
                            </template>
                          </div>
                          
                          <div style="grid-column:2;grid-row:2;align-self: end;margin-top: 20px;">
                            <div class="actions-grid">
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/mind-icon-grey.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Insightful</div>
                                </div>
                              </div> 
                              <div class="video-img-text">
                                <div class="img-icon">
                                  <img src="../../../../public/like-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Like</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/share-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text">Share</div>
                                </div>
                              </div>
                              <div class="video-img-text">
                                <div class="img-icon"><img src="../../../../public/bookmark-heart-fill-grey-icon.svg" class="article-action-icon"> 
                                  <div class="article-action-text"> Bookmark</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="case-desc mt-2" v-html="this.form.description"></div>
                          <hr>
                          <div class="questions-answers">
                            <template v-for="question in form.addMore" >
                              <h5 class="question" :key="question.id">Q. {{question.question}}</h5>
                              <template v-for="(option, index) in question.option" >
                                <div class="answers" :key="option.key"><span>{{optionsValue[index]}} - </span>{{option.value}}</div>
                              </template>
                            </template>
                          </div>
                          <!-- <div class="questions-answers">
                            <template v-for="question in form.addMore" >
                              <h5 class="question" :key="question.id">Q. {{question.question}}</h5>
                            </template>
                            <div style="
    display: grid;
    grid-template-columns: 1fr 1fr;
">
                              <template v-for="question in form.addMore">
                                <template v-for="option in question.option">
                                  <div :key="option.key">{{option.value}}</div>
                                </template>
                              </template>
                            </div>
                          </div> -->
                          <!-- <div class="article-info">
                            <div class="article-date-header">
                              <span class="article-date">{{this.form.article_timestamp | moment}}</span>
                              <span class="mx-1" style="font-size: 25px;">|</span>
                              <span class="article-header"> {{this.form.header}}</span>
                            </div>
                            <div class="article-community mt-2"><span>#{{getCommunityTitle(form.community_id)}}</span></div>
                          </div>
                          <div class="article-small-desc">
                            <div class="small-desc">
                              {{form.small_description}}
                            </div>
                            <div class="article-journal">{{form.journal}}</div>
                          </div> -->
                          
                        </div>
                      </div>
                    </div>
                  </tab-content>
                  <!-- <tab-content title="Preview" icon="dripicons-preview">
                    <div class="d-flex justify-content-center">
                      <div class="card preview">
                        <div class="card-header bg-transparent">
                          <h5 class="text-center">Posted By {{getFormTitle(form.partner_division_id)}}</h5>
                          <VueSlickCarousel v-bind="settings" v-if="this.images.length > 0">
                            <div v-for="items in this.images" :key="items.id">
                              <img
                                :src="`${items.image}`"
                                alt="Thumbnail"
                                class="preview-img"
                              />
                            </div>
                          </VueSlickCarousel>
                        </div>
                        <div class="card-body pt-0">
                          <h6 class="text-center">{{ form.title }}</h6>
                          <div class="text-center" v-html="form.description"></div>
                          <div
                            class="text-center"
                            style="
                              border-radius: 5px;
                            "
                          >
                            <b-button class="preview-tags btn-sm" variant="outline-primary" v-for="(c,ci) in form.community_selected.map(c => c.title)" :key="ci">#{{c}}</b-button>
                          </div>
                        </div>
                        <div class="card-footer">
                          <div class="like-share-comment">
                            <div class="like-share-comment-inner">
                              <i class="mdi mdi-thumb-up"></i>
                              <span>Like</span>
                            </div>
                            <div class="like-share-comment-inner">
                              <i class="fa fa-share"></i>
                              <span>Share</span>
                            </div>
                            <div class="like-share-comment-inner">
                              <i class="mdi mdi-comment"></i>
                              <span>Comment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </tab-content> -->
                  <!-- <tab-content icon="mdi mdi-content-copy" v-if="formwizard" :before-change="() => validadeFormThree()"> -->
                  <!-- <tab-content icon="mdi mdi-content-copy" v-if="formwizard">
                    <div class="row">
                      <div class="col-12">
                        <b-form-group>
                          <b-button
                            variant="success"
                            class="float-right"
                            @click.prevent="addmore"
                            >Add More</b-button
                          >
                        </b-form-group>
                        <b-carousel
                          :interval="interval"
                          ref="myCarousel"
                          id="carousel-1"
                          v-model="slide"
                          @setSlide="setSlide"
                          indicators
                        >
                          <b-carousel-slide
                            v-for="(addmore, key) in form.addMore"
                            :key="key"
                          >
                            <b-form-group
                              id="input-group-type"
                              label="Type"
                              label-for="in-type"
                            >
                              <b-form-select
                                id="in-type"
                                v-model="addmore.type"
                                value-field="value"
                                text-field="text"
                                :options="question_options"
                                :class="{
                                  'is-invalid': store && $v.form.addMore.$each[key].type.$invalid,
                                }"
                              >
                              </b-form-select>
                              <div
                                v-if="store && !$v.form.addMore.$each[key].type.required"
                                class="invalid-feedback"
                              >
                              Type is required.
                            </div>
                            </b-form-group>
                            <b-form-group
                              id="input-group-2"
                              label="Question"
                              label-for="enter_case_ques"
                            >
                              <b-form-input
                                id="enter_case_ques"
                                v-model="addmore.question"
                                placeholder="Enter Question"
                                :class="{
                                  'is-invalid': store && $v.form.addMore.$each[key].question.$invalid,
                                }"
                              ></b-form-input>
                              <div
                                v-if="store && !$v.form.addMore.$each[key].question.required"
                                class="invalid-feedback"
                              >
                              Question is required.
                            </div>
                            </b-form-group>

                            <div class="row" v-for="(val, index) in addmore.option" :key="index">
                              <div class="col-md-6">
                                <b-form-group id="input-group-1">
                                  <label for="case_add_more">Option {{index + 1}} <span style="color: red;">*</span></label>
                                  <b-form-input id="case_add_more" v-model="val.value" :key="val.key" placeholder="Enter Option" @keydown.space="preventLeadingSpace"></b-form-input>
                                </b-form-group>
                              </div>
                              <div class="col-md-4" style="margin-top: 30px; text-align: start">
                                <b-button
                                  variant="success"
                                  class="mr-3"
                                  @click.prevent="addOption(key)"
                                  :disabled ="val.value.length == 0"
                                  >Add Option</b-button
                                >
                                <b-button
                                  variant="danger"
                                  @click.prevent="removeOption(index, key)"
                                  >Remove Option</b-button
                                >
                              </div>
                            </div>

                            <b-form-group>
                            <label for="case_correct_option">Select Correct Option <span style="color: red;">*</span></label>
                              <b-form-select
                                id="case_correct_option"
                                v-model="addmore.correct_option"
                                :options="addmore.option"
                                value-field="key"
                                text-field="value"
                                :class="{
                                  'is-invalid': store && $v.form.addMore.$each[key].correct_option.$invalid,
                                }"
                              >
                              </b-form-select>
                              <div
                                v-if="store && !$v.form.addMore.$each[key].correct_option.required"
                                class="invalid-feedback"
                              >
                              Correct Option is required.
                            </div>
                            </b-form-group>

                            <b-form-group
                              id="input-group-2"
                              label="Description"
                              label-for="case_desc"
                            >
                              <ckeditor
                                id="case_desc"
                                class="ck-editor"
                                :editor="editor"
                                v-model="addmore.answer_details"
                              ></ckeditor>
                            </b-form-group>
                            <b-form-group
                              id="example-date"
                              label="Show Answer At - Applicable when type is Discussion Forum"
                              label-for="date"
                            >
                              <b-form-input
                                id="date"
                                type="datetime-local"
                                v-model="addmore.show_answer_at"
                                :min="disabledDates()"
                              ></b-form-input>
                            </b-form-group>
                          </b-carousel-slide>
                        </b-carousel>
                      </div>
                    </div>
                  </tab-content> -->
                </form-wizard>
              </div>
            </div>
          </div>
      </div>
      </b-tab>
      <b-tab title="Indonesia">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <b-form-group id="input-group-1">
                  <label for="case_title">Case Title</label>
                  <b-form-input id="case_title" v-model="form.translation.indonesia.title" placeholder="Enter Case Title"></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2">
                  <label for="case_desc">Tell Us More About The Case</label>
                  <ckeditor id="case_desc" :editor="editor" v-model="form.translation.indonesia.description"></ckeditor>
                </b-form-group>
                <b-form-group
                  class="case-img"
                  id="input-group-2"
                  label="Item Image [Multiple Selection allowed] [Upload Max File Size : 2MB]"
                  label-for="case_image1"
                >
                  <b-form-file
                    id="case_image1"
                    ref="indonesia_item_image"
                    accept="image/*"
                    multiple="multiple"
                    placeholder="Choose a file or drop it here..."
                    @change="readFile($event, 'indonesia_image')"
                  ></b-form-file>
                  <template v-if="$route.name == 'edit-case' && image_name_indonesia.length > 0">
                    <img
                      v-for="(image, index) in image_name_indonesia"
                      :key="index"
                      :src="image"
                      width="128px"
                      height="128px"
                    />
                  </template>
                  <template v-if="$route.name == 'add-case'">
                    <img
                      v-for="image in image_name_indonesia"
                      :key="image.id"
                      :src="image.image"
                      width="128px"
                      height="128px"
                    />
                  </template>
                </b-form-group>
                <div class="row">
                  <b-form-group
                  class="col-6"
                  label="Meta Title"
                  label-for="input-2"
                >
                  <b-form-input
                    id="input-2"
                    v-model="form.translation.indonesia.meta_title"
                    placeholder="Enter Meta Title"
                  ></b-form-input>
                </b-form-group>
                <b-form-group class="col-6" id="input-group-7" label="Meta Keywords" label-for="input-4">
                  <b-form-input
                    id="input-4"
                    v-model="form.translation.indonesia.meta_keywords"
                    placeholder="Enter Meta Keywords"
                  ></b-form-input>
                </b-form-group>
                </div>
                <b-form-group
                  id="input-group-3"
                  label="Meta Description"
                  label-for="input-3"
                >
                  <ckeditor
                    id="input-3"
                    v-model="form.translation.indonesia.meta_desc"
                    :editor="editor"
                  ></ckeditor>
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </Layout>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import Vue from 'vue'
Vue.use(VueViewer)
import Layout from "../../layouts/main";
// import PageHeader from "@/components/page-header";
import MixinRequest from "../../../mixins/request";
import caseMixin from "../../../mixins/ModuleJs/case";
import { FormWizard, TabContent } from "vue-form-wizard";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Multiselect from "vue-multiselect";

import { required, maxLength } from "vuelidate/lib/validators";
// import axios from 'axios';
// import VueSlickCarousel from 'vue-slick-carousel'
// import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// // optional style for arrows & dots
// import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

const touchMap = new WeakMap();

export default {
  data() {
    return {
      optionsValue: ['A', 'B', 'C', 'D'],
      settings: {
        autoplay: true,
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
      },
      finalModel: {},
      submitted: false,
      store: false,
      interval: 0,
      slide: 0,
      sliding: null,
      title1: "Add Case",
      title2: "Edit Case",
      items: [
        {
          text: "Back",
          href: "/case",
        },
        {
          text: "Data",
        },
      ],
      editor: ClassicEditor,
      image: [],
    };
  },
  validations: {
    form: {
      title: { required, maxLength: maxLength(250) },
      question_type: { required },
      community_selected: { required },
      description: { required },
      addMore:
      {
        // type: { required },
        // question: { required },
        value: { required },
        $each: {
          // type: { required },
          question: { required },
          correct_option: { required },
        },
        // show_answer_at: { required: requiredIf(form => form.type == "discussion_forum") },
      },
      meta_title: { maxLength: maxLength(250) }, 
      meta_desc: { maxLength: maxLength(250) },
      meta_keywords: { maxLength: maxLength(250) },
      // expert_id: { required: requiredIf(form => form.partner_division_id == "")  },
      // partner_division_id: { required: requiredIf(form => form.expert_id == "")  }
    },
  },
  mixins: [MixinRequest, caseMixin],
  components: {
    Layout,
    // PageHeader,
    ckeditor: CKEditor.component,
    Multiselect,
    FormWizard,
    TabContent,
    // VueSlickCarousel
  },
  methods: {
    forceFileDownload(response){
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.png') //or any other extension
      document.body.appendChild(link)
      link.click()
    },
    // downloadWithAxios(image_url){
    //   axios({
    //     method: 'get',
    //     url:image_url,
    //     responseType: 'arraybuffer'
    //   })
    //   .then(response => {
    //     this.forceFileDownload(response)
    //   })
    //   .catch((e) => console.log('error occured' + e))
    // },
    getFormTitle(id) {
      let res = this.forum.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].title;
      }
      return null;
    },
    getExpertImg(id) {
      let res = this.expert.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].image_name;
      }
      return null;
    },
    getExpertName(id) {
      let res = this.expert.filter(f => f.id == id);
      if(res.length > 0){
        return res[0].name;
      }
      return null;
    },
    disabledDates() {
      return new Date().toISOString().slice(0, 16); 
    },
    preventLeadingSpace(e) {
      // only prevent the keypress if the value is blank
      if (!e.target.value) e.preventDefault();
      // otherwise, if the leading character is a space, remove all leading white-space
      else if (e.target.value[0]==' ') e.target.value = e.target.value.replace(/^\s*/, "");
    },
    validateFormOne() {
      //let form1 = this.$refs.step1;
      this.submitted = true;
      let status = true;
      let correct_option = 0;
      if(this.form.question_type == 'mcq') {
        for (let index = 0; index < this.form.addMore.length; index++) {
          for (let i = 0; i < this.form.addMore[index].option.length; i++) {
            if(this.form.addMore[index].option[i].value == '') {
              correct_option++;
            }
          }
          if (this.$v.form.addMore.$each[index].question.$invalid === true) { status = false; }
          // if (this.$v.form.addMore.$each[index].type.$invalid === true) { status = false; }
          if (this.$v.form.addMore.$each[index].correct_option.$invalid === true) { status = false; }
        }
      }
      if(correct_option > 0 || this.$v.form.title.$invalid || this.$v.form.question_type.$invalid || this.$v.form.description.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
        return false;
      }
      return status;
    },
    validateFormTwo() {
        this.store = true;
        if (this.$v.form.community_selected.$invalid) {
        this.$store.commit("toast/updateStatus", {
          status: true,
          icon: "error",
          title: "Please Fill The Required Fields"
        });
      return false;
      }
      return true;
    },
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
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
<style>
  .wizard-icon-circle.checked{
    border: none !important;
  }
  .vue-form-wizard .wizard-icon-circle .wizard-icon-container{
    border-radius: 50% !important;
  }
  .case-images{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
  .case-images .images{
    display: block;
    text-align: center;
  }
</style>
