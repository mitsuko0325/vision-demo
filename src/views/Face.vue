<template>
  <div class="mt-3 mb-3" v-if="result">
	  <h5>Face</h5>
   	<div class="image-box mr-3">
      	<img class="img" v-if="img && result" :src="img" />
   	</div>
   	<div class="faceAnnotations">
    		<div class="mt-3">
				<div v-for="(faceA, index) in result.faceAnnotations" :key="index">
					<h5 class="mb-3">{{`Face ${index}`}} | {{Math.round(faceA.detectionConfidence * 1000) / 10}} %</h5>
					<p>怒り:{{faceA.angerLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.angerLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>嬉しさ:{{faceA.joyLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.joyLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>悲しさ:{{faceA.sorrowLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.sorrowLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
					<p>驚き:{{faceA.surpriseLikelihood}}</p>
					<b-progress :value="changeLikeHoodTextToNumber(faceA.surpriseLikelihood)" :precision="2" height="5px" class="mb-3"></b-progress>
				</div>
    		</div>
  		</div>
  </div>
</template>

<script>
export default {
  name: 'FaceAnnotation',
  props: ['result', 'img'],
  methods: {
	  changeLikeHoodTextToNumber(text){
		  if (text==="VERY_UNLIKELY") {
			  return 0
		  }else if (text==="UNLIKELY") {
			  return 25
		  }else if (text==="LIKELY") {
			  return 50
		  }
		  else if (text==="VERY_LIKELY") {
			  return 100
		  }
	  }
  },
}
</script>

<style scoped>

.faceAnnotations {
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
