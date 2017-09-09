const express = require('express')
const Sequelize = require('sequelize')
const app = express()
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/smallappdb')
const port = process.env.PORT || 3000
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({extended: true}))

var mystuff = db.define('stuff',{
	name: {
		type: Sequelize.STRING
	}
})

mystuff.sync({force: true})
.then( ()=> {
	Promise.all([
		mystuff.create({name: 'stuff1'}),
		mystuff.create({name: 'stuff2'}),
		mystuff.create({name: 'stuff3'})
	])
})

app.get('/',(req,res,next)=>{
		res.sendFile(__dirname + '/index.html')
})

app.get('/things',(req,res,next)=>{
	mystuff.findAll()
	.then(results =>{
		res.send(results)
	})
})

app.post('/',(req,res,next)=>{
	console.log(req.body)
	mystuff.create(req.body)
	.then(theStuff =>{
		res.send(theStuff)
	})
})

app.listen(port,()=>{
	console.log(`listening to ${port}`)
})

