const express = require('express')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('info_books', 'username', 'password', {
    dialect: "mysql",
    host: "localhost"
})

sequelize.authenticate().then(() => {
    console.log("Connected to database")
}).catch(() => {
    console.log("Unable to connect to database")
})
//construire tabela Books
const Books = sequelize.define('books', {
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    subject:Sequelize.STRING,
    description: Sequelize.TEXT
})


const app = express()
app.use('/',express.static('frontend'))
// testare conexiune
app.get('/welcome',(request,response)=>{
    response.status(200).json({hello:"everybody"})
})

app.get('/welcome1',(request,response)=>{
    response.status(200).json({title:"Silent Patient", author:"Alex Michaelides"})
})

app.get('/welcome2',(request,response)=>{
    response.status(200).json({Smartphone:"LenovoP70A",Price:"800 Ron" ,Guarantee:"1 year"})
})
app.get('/createdatabase', (request, response) => {
    sequelize.sync({force:true}).then(() => {
        response.status(200).send('the tables was created')
    }).catch((err) => {
        console.log(err)
        response.status(200).send('it could not create tables')
    })
})

app.use(express.json())
app.use(express.urlencoded())

//definire endpoint POST /books
app.post('/books', (request, response) => {
    Books.create(request.body).then((result) => {
        response.status(201).json(result)
    }).catch((err) => {
        response.status(500).send("resource not created")
    })
})

app.get('/books', (request, response) => {
    Books.findAll().then((results) => {
        response.status(200).json(results)
    })
})

app.get('/books/:id', (request, response) => {
    Books.findByPk(request.params.id).then((result) => {
        if(result) {
            response.status(200).json(result)
        } else {
            response.status(404).send('resource not found')
        }
    }).catch((err) => {
        console.log(err)
        response.status(500).send('database error')
    })
})
app.put('/books/:id', (request, response) => {
    Books.findByPk(request.params.id).then((book) => {
        if(book) {
            book.update(request.body).then((result) => {
                response.status(201).json(result)
            }).catch((err) => {
                console.log(err)
                response.status(500).send('database error')
            })
        } else {
            response.status(404).send('resource not found')
        }
    }).catch((err) => {
        console.log(err)
        response.status(500).send('database error')
    })
})
app.delete('/books/:id', (request, response) => {
   
   Books.findByPk(request.params.id).then((book) => {
        if(book) {
            book.destroy().then((result) => {
                response.status(204).send()
            }).catch((err) => {
                console.log(err)
                response.status(500).send('database error')
            })
        } else {
            response.status(404).send('resource not found')
        }
    }).catch((err) => {
        console.log(err)
        response.status(500).send('database error')
    })
})


app.listen(process.env.PORT||8080)