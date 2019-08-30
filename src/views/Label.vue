<template>
  <div class="mt-3 mb-3" v-if="result">
     <h5>Label</h5>
      <div class="image-box mr-3">
        <img class="img" v-if="img && result" :src="img" />
      </div>
      <div class="labelAnnotations">
        <div class="mt-3">
            <div v-for="(labelA, index) in result.labelAnnotations" :key="index">
            <h5>{{labelA.description}} | {{Math.round(labelA.score * 1000) /10}}%</h5>
            <b-progress :value="labelA.score * 100" :precision="2" height="5px" class="mb-3"></b-progress>
        </div>
      </div>
   </div>
  </div>
</template>

<script>
export default {
  name: 'FaceAnnotation',
  props: ['result', 'img'],
}
</script>
<style scoped>

.labelAnnotations {
   height: 300px;
   width: 50%;
   overflow: auto;
   display: inline-block;
   vertical-align: middle;
}

.image-box {
   display: inline-block;
   max-height: 300px;
   vertical-align: middle;
}

.img {
   max-width: 300px;
   max-height: 300px;
}
</style>
