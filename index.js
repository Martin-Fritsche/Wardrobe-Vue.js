'use strict'
const express = require('express');
const body_parser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const {Pool, Client} = require('pg');
// const client = new Client({
// 	user: 'lyte',
// 	password: '',
// 	host: 'localhost',
// 	port: 5432,
// 	database: 'wardrobe'
// });

const pool = new Pool({
	user: 'lyte',
	password: '',
	host: 'localhost',
	port: 5432,
	database: 'wardrobe',
	max: 20,
	connectionTimeoutMillis: 0,
	idleTimeoutMillis: 0
});


//client.connect()
//.then((res) =>{
//	console.log('Connected, Son', res)
//})
// .then(() => client.query('INSERT INTO name values ($1, $2, $3, $4, $5)', [3, 'Dante', 'Alexander', 'Fritsche', '2025-02-25']))
// .then(() => client.query('SELECT * from name'))
// .then(res => console.table(res.rows))
//.catch(e => console.log(e.code))
//.finally(() => client.end());


async function start(){
	try{
		await connect();
		const result = await readClothen();
		console.log('we got', result)
	}catch(e){
		exec('createdbjs wardrobe --user=lyte', (err, stdout, stderr) =>{
			if(err){
				console.log(`error: ${err.message}`);
				return;
			}
			if(stderr){
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		});

	}finally{

	}
}

async function connect(){
	try{
		await client.connect();
	}
	catch(e){
		console.log('Not good');
	}
}

// async function readClothen(){
// 	try{
// 		const results = await client.query('SELECT * from clothen');;
// 		return results.rows;
// 	}
// 	catch(e){
// 		return [];
// 	}
// }

async function createClothen(article){
	try{
		await client.query('INSERT INTO clothen values ($1, $2, $3)', article);
		return true;
	}
	catch(e){
		return false;
	}
}

const app = express();


const path = require('path');

const path_str = __dirname + '/public/';
const port = process.env.PORT || 9000;



app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.urlencoded({limit: '200mb', extended:true, parameterLimit: 1000000}));
app.use(body_parser.json({limit: '200mb'}));

async function readClothen(entry){
	let results = null;
	try{
		await client.connect();
		const result = await client.query(`SELECT * from ${entry}`);
		results = result.rows;
		client.end();
		console.log('how it is', results);
	}catch(e){
		results = [];
		console.log('this work', e);

	}finally{
		return results;
	}
}

// exec('createdbjs test-db2 --user=lyte', (err, stdout, stderr) =>{
// 	if(err){
// 			console.log(`error: ${err.message}`);
// 			return;
// 		}

// 		if(stderr){
// 			console.log(`stderr: ${stderr}`);
// 			return;
// 		}

// 		console.log(`stdout: ${stdout}`)
// });



app.get('/', (req, res) =>{/*get method works*/
	// exec('brew services start postgresql', (err, stdout, stderr) =>{
	// 	if(err){
	// 		console.log(`error: ${err.message}`);
	// 		return;
	// 	}

	// 	if(stderr){
	// 		console.log(`stderr: ${stderr}`);
	// 		return;
	// 	}

	// 	console.log(`stdout: ${stdout}`)
	// });
		res.redirect('vue.html');
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
	//res.json(db[req.params.article]);
	pool.query(`SELECT * from ${req.params.article}`, (err, results) =>{
		if(err) console.log('like always', err);
		console.log('how', results.rows);
		res.json(results.rows);
	});

});

app.post('/enter_article/:article', (req, res) =>{
	console.log('down', req.params.article);
	const image = req.body.img;
	const image_name = new Date().getTime();
	const reg = new RegExp(/\/(\w+);/);
	const extension = image.slice(0, 22).match(reg)[1];
	const data = image.slice(22);
	const db_address = `./assets/images/${req.params.article}/${image_name}.${extension}`;
	const address = `${path_str}/assets/images/${req.params.article}/${image_name}.${extension}`;
	fs.writeFile(address, data, 'base64', err =>{
		if(err) throw err;
		pool.query(`INSERT INTO ${req.params.article}(image, brand, description, size)
			VALUES('${db_address}', '${req.body.brand}', '${req.body.description}', '')`, (err, result) =>{
			if(err) console.log(err);
			console.log('gucci')
			res.json(true);
		});
	});
});

app.get('/outfit/:seletion', (req, res) =>{
	pool.query(`SELECT * FROM outfit WHERE id = ${req.params.seletion}`, (err, results) =>{
		if(err) console.log('up', err);
		if(results.rowCount === 0){
			res.json(false);
		}else{
			res.json(results.rows);
		}
	});
});

app.post('/added', (req, res) =>{
	const hat_image = req.body.outfit.hats.image;
	const shirt_image = req.body.outfit.shirts.image;
	const pants_image = req.body.outfit.pants.image;
	const shoes_image = req.body.outfit.shoes.image;
	const date = req.body.date;
	const time = req.body.time;
	const occassion = req.body.value;

	pool.query(`INSERT INTO outfit(hat_image, shirt_image, pants_image, shoes_image, date, time, occassion)
	 VALUES('${hat_image}', '${shirt_image}', '${pants_image}', '${shoes_image}', '${date}', '${time}', '${occassion}')`, (err, result) =>{
	 	if(err) console.log('this is the error:', err);
			console.log('done');
			res.json(true);
		});
});

app.delete('/delete_article/:article/:id', (req, res) =>{
	console.log('new', req.params.id, req.params.article);
	pool.query(`DELETE FROM ${req.params.article} WHERE id = ${req.params.id}`, (err, result) =>{
		if(err) console.log(err);
		console.log('nice day', result)
		res.json(true);
	})
})

app.listen(port, () => console.log('listen:', port));


/*TODO
Update the array when an image is uploaded
remove image from file system*/