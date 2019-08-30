<template>
  <div class='container'>
    <h1>Vision API デモ</h1>
    <b-alert show variant="danger" v-if="errMsg">エラー: {{errMsg}}</b-alert>
    <input type="file" accept="image/*" @change="onFileChange">
    <div class="mt-3">
      <img class="img" v-if="uploadedImage" :src="uploadedImage" />
    </div>
    <div class="mt-3">
      <b-button variant="primary" @click="analyze" v-if="uploadedImage && !result">分析</b-button>
    </div>
    <div class="mt-3">
      <b-spinner variant="primary" type="grow" label="Spinning" v-if="loading"></b-spinner>
      <b-button-group v-else-if="!loading && result">
        <b-button variant="success" v-if="isFaceExists" @click="moveTo('face')">Face</b-button>
        <b-button variant="success" v-if="isLabelExists" @click="moveTo('label')">Label</b-button>
        <b-button variant="success" v-if="isObjectExists" @click="moveTo('object')">Object</b-button>
      </b-button-group>
    </div>
    <router-view :result="result" :img="uploadedImage"></router-view>
  </div>
  
  
</template>

<script>

// Your GCP API_KEY
const API_KEY = ""


import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Vision',
  data () {
    return {
      uploadedImage: null,
      result: null,
      loading: false,
      isFaceExists: false,
      isLabelExists: false,
      isObjectExists: false,
      errMsg: '',
      request: {
        "requests":[
          {
            "image":{
              "content": null
            },
            "features":[
              {
                "type":"FACE_DETECTION",
                "maxResults": 50
              },
              {
                "type": "LABEL_DETECTION",
                "maxResults": 50
              },
              {
                "maxResults": 50,
                "type": "OBJECT_LOCALIZATION"
              },
            ]
          }
        ]
      }
    }
  },
  methods:{
    onFileChange(e){
      this.result = null
      this.uploadedImage = null
      this.isFaceExists = null
      this.isLabelExists = null
      this.isObjectExists = null

      let files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
    },
    createImage(file){
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
      }
      reader.readAsDataURL(file);
    },
    analyze(){
      this.loading = true
      this.errMsg = ""
      const img = _.cloneDeep(this.uploadedImage)

      // base64の最初のdata:以下を削除
      const startIndex = img.indexOf(",")
      this.request.requests[0].image.content = img.slice(startIndex + 1)

      axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, this.request).then(response => {
        this.result = response.data.responses[0]
        
        if(this.result.faceAnnotations){
          this.isFaceExists = true
        }
        if (this.result.labelAnnotations) {
          this.isLabelExists = true
        }
        if (this.result.localizedObjectAnnotations) {
          this.isObjectExists = true
        }
        this.loading = false

        if(this.isFaceExists){
          this.$router.push('face')
        }else if(this.isLabelExists){
          this.$router.push('label')
        }else if(this.isObjectExists){
          this.$router.push('object')          
        }else{
          this.errMsg = "エラーが発生しました"
        }

      }).catch(error => {
        this.errMsg = error
        console.log('error', error);
      })
    },
    moveTo(to){
      this.$router.push(to)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.img {
  max-width: 300px;
  max-height: 300px;

}
</style>

