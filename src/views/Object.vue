<template>
	<div class="mt-3 mb-3" v-if="result">
   	<h5>Object</h5>
   	<div class="image-box mr-3">
			<canvas id="canvasInObject" class="img"></canvas>
   	</div>
   	<div class="localizedObjectAnnotations">
      	<div class="mt-3">
         	<div v-for="(objectA, index) in result.localizedObjectAnnotations" :key="index">  
         	<h5>{{objectA.name}} | {{Math.round(objectA.score * 1000) / 10}}%</h5>
         	<b-progress :value="objectA.score * 100" :precision="2" height="5px" class="mb-3"></b-progress>
      		</div>
      	</div>
   	</div>
	</div>
</template>

<script>

import Mixin from '@/mixins/mixin'

export default {
	name: 'FaceAnnotation',
	props: ['result', 'uploadedImage'],
	mixins: [ Mixin ],
	data(){
		return {

		}
	},
	methods: {
		drawImageAndBorder(){
			if (!this.result || !this.uploadedImage) return
			// drawImageAndBorder自体ををmixinにして外に出したかったが、getElementByIdが上手くいかなかった。
			const canvas = document.getElementById("canvasInObject")
			let ctx = canvas.getContext('2d')

			let image = new Image()
			image.src = this.uploadedImage

			image.onload = ()=>{
				// canvasにimgを描画
				canvas.width = image.width
				canvas.height = image.height
				ctx.drawImage(image, 0, 0)
			}
		}
	},
	mounted(){
		this.drawImageAndBorder()
	},
	updated(){
		this.drawImageAndBorder()
	}
}
</script>
<style scoped>

.localizedObjectAnnotations {
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
