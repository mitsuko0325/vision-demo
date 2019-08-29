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
    <div>
      <b-button-group>
        <b-button><router-link to="/faceAnnotation">faceAnnotation</router-link></b-button>
        <b-button><router-link to="/label">label</router-link></b-button>
        <b-button>Button 3</b-button>
      </b-button-group>
    </div>
    <!-- propsにわたす値をパスによって分岐しないと -->
    <router-view :result="result"></router-view>
    <!-- ラベルと顔は別タブになる -->
    <!-- <div class="mt-3" v-if="labelResult">
      <div v-for="(lr, index) in labelResult" :key="lr.description">
    </div>
      <h4>ラベル</h4>
      <p v-for="(lr, index) in labelResult" :key="lr.description">
        {{`Face ${index}`}}
        {{lr.description}}
      </p>
    </div> -->
  </div>
  
  
</template>

<script>

// Your GCP API_KEY

import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Vision',
  data () {
    return {
      uploadedImage: null,
      result: null,
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
      this.request.requests[0].image.content = replacedImage

      axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, this.request).then(response => {
        this.result = response.data.responses[0]
        console.log('レスポンス', response.data.responses[0])
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

