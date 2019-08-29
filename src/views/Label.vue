<template>
  <div class="labelAnnotations">
    <h1>This is a label annotation page</h1>
    <div class="mt-3" v-if="result">
      <div v-for="(lA, index) in result.labelAnnotations" :key="index">
        <p>{{lA.description}}</p>
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