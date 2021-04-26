const app = Vue.createApp({
	data(){
		return {
			header: 'Wardrobe',
			object:{hats:'', shirts:'', pants:'', shoes:''},
			choiceObject: {},
			date:null,
			time:null,
			open:false,
			left: '100%'
		}
	},
	methods:{
		selectHandler(){
			Object.assign(this.choiceObject, this.object);
			const date = new Date();
			this.date = date.toLocaleDateString();
			this.time = date.toLocaleTimeString();
			this.open = true;
		},
		objectHandler(obj){
			this.object[obj.article] = obj.url;
		},
		closeForm(){//method to close chosen form upload window
			this.left = '100%';
		},
		closeChoice(){//method to close chosen outfit window
			this.open = false;
		},
		uploadHandler(){
			this.left = '5%';
		}
	}
});


