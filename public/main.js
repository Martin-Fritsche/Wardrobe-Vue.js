const app = Vue.createApp({
	data(){
		return {
			header: 'Wardrobe',
			object:{hats:'', shirts:'', pants:'', shoes:''},
			choiceObject: {},
			date:null,
			time:null,
			open:false,
			left: '100%',
			outfit: {},
			selection: 1
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
		},
		backPagination(){
			if(this.selection === 1) return;
			this.selection--;
			this.fetchSelection(this.selection);
		},
		forwardPagination(){
			this.selection++;
			this.fetchSelection(this.selection);
		},
		fetchSelection(selection){
			fetch(`/outfit/${selection}`).then((res) => res.json()).then((data) =>{
			data === false ? this.selection-- : this.outfit = data[0];
			}).catch(err => console.log(err));
		}
	},
	mounted(){
		this.fetchSelection(this.selection, this.outfit);
	}
});


