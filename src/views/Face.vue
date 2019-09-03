<template>
	<div class="mt-3 mb-3" v-if="result">
		<h5>Face</h5>
   	<div class="image-box mr-3">
			<canvas id="canvasInFace" class="img"></canvas>
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
	  },
	  	drawImageAndBorder(){
			if (!this.result || !this.uploadedImage) return
			const canvas = document.getElementById("canvasInFace")
			let ctx = canvas.getContext('2d')

			const data = this.result.faceAnnotations

			let rectData = []
			data.forEach(faceA => {
				//calculateRectはMixinにある。
				rectData.push(this.calculateRect(faceA.boundingPoly.vertices))
			});

			let image = new Image()
			image.src = this.uploadedImage

			image.onload = ()=>{
				// canvasにimgを描画
				canvas.width = image.width
				canvas.height = image.height
				ctx.drawImage(image, 0, 0)

				// canvasに四角形を描画
				// 起点となる左上の点は(minX,maxY)
				// widthはmaxX-minY heightはmaxY-minY
				ctx.strokeStyle = '#75ff4f'
				ctx.fillStyle = '#75ff4f'
				ctx.lineWidth = 3

				rectData.forEach((data, index)=>{
					// 四角い枠をつける
					ctx.strokeRect(data.minX, data.minY, data.maxX-data.minX, data.maxY-data.minY)
					// 文字をつける
					ctx.font = "18px serif";
					ctx.textAlign = 'center'
					console.log('HI', data)
					ctx.fillText(`Face:${index}`, (data.maxX + data.minX) / 2, data.maxY + 20 )
				})
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
