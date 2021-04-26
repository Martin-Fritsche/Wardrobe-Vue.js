app.component('upload-form', {
	props:[],
	template:`<form action="" @submit.prevent="onSubmit" @click="removeWarning" class="form__modal" enctype="multipart/form-data">
					<ul class="form__nav">
						<li id="hats" class="nav__item nav__item--selected" @click="changeTab"><span>Hats</span></li>
						<li id="shirts" class="nav__item" @click="changeTab"><span>Shirts</span></li>
						<li id="pants" class="nav__item" @click="changeTab"><span>Pants</span></li>
						<li id="shoes" class="nav__item" @click="changeTab"><span>Shoes</span></li>
						<div class="close__modal" @click="closeModal"><span>x</span></div>
					</ul>
					<div class="form__body">
						<div class="form__inputs">
							<label for="brand" class="form__label">Brand:</label><br />
							<input type="text" name=brand class="form__input" placeholder="enter brand" v-model="brand">
						</div>
						<div class="form__inputs">
							<label for="description" class="form__label">Description:</label><br />
							<input type="description" name="description" class="form__input" placeholder="enter a description" v-model="description">
						</div>
						<div class='form__image__wrapper'>
					    		<img class='form__image' src='' ref="img">
					    	</div>
					    	<div class="load__btn" @click="openFile"><span>Load</span></div>
					    	<input type='file' name='file' class="hidden__file" @change="onChange" ref='file'>
					    </div>
					<button class="form__save__btn">Save</button>
					<button v-if="warning" class="image__error__msg" disabled=true>Image is required</button>
			  </form>`,
	data(){
		return {
			article:'hats',
			brand:'',
			description:'',
			img_string: null,
			warning: false
		}
	},
	methods:{
		onSubmit(e){
			console.log('in it')
			if(this.img_string === null){
				this.warning = true;
				return;
			}

			const values = {
				brand : this.brand,
				description : this.description,
				img : this.img_string
			}

			fetch('/enter_article/' + this.article, {
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
                	'Content-type': 'application/json'
				},
				body: JSON.stringify(values)
			}).then(res => res.json()).then(data => this.clearFormData()).catch(err => console.log(err));
		},
		removeWarning(){
			this.warning = false;
		},
		closeModal(){
			this.formEventEmmitter();
			this.clearFormData();
		},
		formEventEmmitter(){
			this.$emit('close-form', {})
		},
		changeTab(e){
			document.querySelector('.nav__item--selected').classList.remove('nav__item--selected');
			const selected = e.target.nodeName == 'SPAN' ? e.target.parentNode : e.target;
			selected.classList.add('nav__item--selected');
			this.article = selected.id; 
		},
		openFile(){
			this.$refs.file.click();
		},
		onChange(e){
			const file = this.$refs.file.files[0];
			if(!file.type.startsWith('image')) return;
		
			const reader = new FileReader();
	        reader.onload = () =>{ 
	        	this.$refs.img.style.display = 'inline';
	        	this.img_string = this.$refs.img.src = reader.result;
	        }
			reader.readAsDataURL(file);
		},
		clearFormData(){
			this.brand = '';
			this.description = '';
			this.img_string = null;
			this.$refs.img.style.display = 'none';

		}
	}
});