<template>
  <div class='container'>
    <h1>Vision APIのデモ</h1>
    <p>とりあえずjpegのみ対応。</p>
    <input type="file" @change="onFileChange">
    <div class="mt-3">
      <img v-show="uploadedImage" :src="uploadedImage" />
    </div>
    <div class="mt-3">
      <b-button variant="primary" @click="analyze">分析</b-button>
    </div>
    <div class="mt-3" v-if="labelResult">
      <h4>ラベル</h4>
      <p v-for="lr in labelResult" :key="lr.description">
        {{lr.description}}
      </p>
    </div>
    <div class="mt-3" v-if="faceResult">
      <h4>感情</h4>
      <p>怒り:{{faceResult.angerLikelihood}}</p>
      <p>嬉しさ:{{faceResult.joyLikelihood}}</p>
      <p>悲しさ:{{faceResult.sorrowLikelihood}}</p>
      <p>驚き:{{faceResult.surpriseLikelihood}}</p>
      <h4>確度:{{faceResult.detectionConfidence * 100 }} %</h4>
    </div>
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
      faceResult : null,
      labelResult: null,
      faceRequest: {
        "requests":[
          {
            "image":{
              "content": null
            },
            "features":[
              {
                "type":"FACE_DETECTION",
                "maxResults":1
              }
            ]
          }
        ]
      },
      labelRequest: {
        "requests": [
          {
            "image": {
              "content": null
            },
            "features": [
              {
                "type": "LABEL_DETECTION"
              }
            ]
          }
        ]
      }

    }
  },
  methods:{
    onFileChange(e){
      let files = e.target.files || e.dataTransfer.files;
      this.createImage(files[0]);
    },
    async createImage(file){
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
      }
      reader.readAsDataURL(file);
    },
    analyze(){
      // ここの文字列のreplaceで詰まった。
      let img = _.cloneDeep(this.uploadedImage)
      // TODO:jpeg以外にも対応
      let replacedImage;
      replacedImage = img.replace("data:image/jpeg;base64,", "");
      this.faceRequest.requests[0].image.content = replacedImage
      this.labelRequest.requests[0].image.content = replacedImage

      // 顔認識リクエスト
      axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, this.faceRequest).then(response => {
        this.faceResult = response.data.responses[0].faceAnnotations[0]
      }).catch(error => {
        console.log('error', error);
      })

      // ラベル認識リクエスト
      axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, this.labelRequest).then(response => {
        this.labelResult = response.data.responses[0].labelAnnotations
      }).catch(error => {
        console.log('error', error);
      })
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

yoko {
  float: left;
}
</style>

