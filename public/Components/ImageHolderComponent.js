app.component('image-holder', {
	props:['article'],
	template:
	`<div class="article__wrapper">
		<div class='article__container'>
			<h2 class="article__title">{{product}}</h2>
			<div class="image__container" :style="{ left: leftValue, width: widthValue }">
				<img v-for='url in stuff' :src='url.image' class="img">
			</div>
			<i class="fas fa-chevron-circle-left left" @click="slideLeft"></i>
			<i class="fas fa-chevron-circle-right right" @click="slideRight"></i>
		</div>
		<button class="article__delete__btn" @click="deleteArticle">x</button>
	</div>`,
	data(){
		return {
			product: this.article,
			stuff: [],
			value: 250,
			leftValue: '0px',
			widthValue: this.value + 'px',
			width: 0,
			leftLimit: 0,
			rightLimit: '0px',
			leftLocation: 0,
			element: 0
		}
	},
	methods:{
		slideLeft(){
			if(this.leftValue !== this.rightLimit){
				this.leftLocation += this.value;
				this.leftValue = this.leftLocation + 'px';
				this.element--;
				this.updateObject(this.article, this.stuff[this.element]);
			}
		},
		slideRight(){
			if(this.leftValue !== this.leftLimit){
				this.leftLocation -= this.value;
				this.leftValue = this.leftLocation + 'px';
				this.element++;
				this.updateObject(this.article, this.stuff[this.element]);
			}
		},
		updateObject(article, url){
			this.$emit('update-object', {article: article, url: url})
		},
		deleteArticle(){
			const id = this.stuff[this.element].id;
			fetch(`/delete_article/${this.article}/${id}`, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json, text/plain, */*',
                	'Content-type': 'application/json'
				}
			}).then(res => res.json()).then((data) =>{console.log(data)});
			this.stuff.splice(this.element, 1);
			this.width = this.stuff.length * this.value;
			this.widthValue = this.width + 'px';
			this.leftLimit = -(this.width - this.value) + 'px';
		}
	},
	mounted(){
		fetch(`/wardrobe/${this.article}`).then((res) => res.json()).then((data) =>{
			console.log(data)
			this.stuff = data;
			this.width = data.length * this.value;
			this.widthValue = this.width + 'px';
			this.leftLimit = -(this.width - this.value) + 'px';
			this.updateObject(this.article, data[this.element]);
		}).catch(err => console.log('err', err))
	}
});