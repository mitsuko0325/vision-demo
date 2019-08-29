<template>
  <div class="faceAnnotation">
    <h1>This is a face annotation page</h1>
    <div class="mt-3" v-if="result">
      <div v-for="(fA, index) in result.faceAnnotations" :key="index">
        <h4>{{`Face ${index}`}}</h4>
        <h5>感情</h5>
        <p>怒り:{{fA.angerLikelihood}}</p>
        <p>嬉しさ:{{fA.joyLikelihood}}</p>
        <p>悲しさ:{{fA.sorrowLikelihood}}</p>
        <p>驚き:{{fA.surpriseLikelihood}}</p>
        <h5>確度:{{fA.detectionConfidence * 100 }} %</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaceAnnotation',
  props: ['result'],
}
</script>