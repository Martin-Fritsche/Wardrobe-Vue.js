app.component('chosen', {
	props:['date', 'time', 'object'],
	template:`<div class="choice" >
				<button class="choice__close__btn" @click="closeHandler">x</button>
				<h2 class="choice__header">Selected Outfit</h2>
				<div class="choice__occassion">Occassion: {{value}}</div>
				<div class="choice__date">{{date}}</div>
				<div class="choice__time">{{time}}</div>
				<div class="choice__img__container"><img v-for="item in object" :src="item" class='choice__img'></div>
				<input type="text" class="choice__input" v-model='value'>
				<button class="choice__add__btn" @click="onAdded">Add</button>
			</div>`,
	data(){
		return {
			value:"Nothing Special"
		}
	},
	methods:{
		closeHandler(){
			this.updateOpen()
		},
		updateOpen(){
			this.$emit('close-chosen', {})
		},
		onAdded(){
			console.log('all', this.object, this.date, this.time, this.value);
			const values = {
				outfit: this.object,
				data: this.date,
				time: this.time,
				value: this.value
			}
			fetch('/added', {
				method: "POST",
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-type':'application/json'
				},
				body: JSON.stringify(values)
			}).then(res => res.json()).then(data => this.updateOpen()).catch(err => console.log(err));
		}
	}
});