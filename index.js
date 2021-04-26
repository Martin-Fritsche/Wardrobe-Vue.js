'use strict'
const express = require('express');
const body_parser = require('body-parser');
const fs = require('fs');

const app = express();


const path = require('path');

const path_str = __dirname + '/public/';
const port = process.env.PORT || 9000;



app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.urlencoded({limit: '200mb', extended:true, parameterLimit: 1000000}));
app.use(body_parser.json({limit: '200mb'}));



app.get('/', (req, res) =>{/*get method works*/
	res.redirect('vue.html')
});

const shoes = ['./assets/images/shoes/air_max.jpg', './assets/images/shoes/downshifter.jpg', './assets/images/shoes/stan_smiths.jpg', './assets/images/shoes/timberland_black.jpg', './assets/images/shoes/timberland_pro.jpg', './assets/images/shoes/slippers.jpg']
const pants = ['./assets/images/pants/black_jeans.jpg', './assets/images/pants/dark_blue_jeans.jpg', './assets/images/pants/light_blue_jeans.jpg', './assets/images/pants/gray_sweats.jpg', './assets/images/pants/blue_sweats.jpg']
const shirts = ['./assets/images/shirts/aqua_shirt.jpg', './assets/images/shirts/black_shirt.jpg', './assets/images/shirts/gray_shirt.jpg', './assets/images/shirts/white_black_shirt.jpg', './assets/images/shirts/white_tee.jpg']
const hats = ['./assets/images/hats/yankee_fitted.jpg', './assets/images/hats/black_hat.jpg', './assets/images/hats/skully.jpg'];

const db = {
	hats: hats,
	shirts: shirts,
	pants: pants,
	shoes: shoes
}

app.get('/wardrobe/:article', (req, res) =>{
	console.log('how is it', req.params.article)
	res.json(db[req.params.article]);
});

app.post('/enter_article/:article', (req, res) =>{
	console.log('down', req.params.article);
	const image = req.body.img;
	const image_name = new Date().getTime();
	const reg = new RegExp(/\/(\w+);/);
	const extension = image.slice(0, 22).match(reg)[1];
	const data = image.slice(22);
	const address = `${path_str}/assets/images/${req.params.article}/${image_name}.${extension}`;
	console.log('where', address)
	//address, req.body.brand, and req.body.description goes in db
	fs.writeFile(address, data, 'base64', err =>{
		if(err) throw err;
		res.json(true);
	});
})

app.post('/added', (req, res) =>{
	console.log('db coming soon', req.body);
	res.json(true);
});

app.listen(port, () => console.log('listen:', port));