const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
    {
        id: "1",
        name: "Muumipeikko",
        number: "044563253"
    },
    {
        id: "2",
        name: "Niiskuneiti",
        number: "123456"
    },
    {
        id: "3",
        name: "Nipsu",
        number: "0447583290"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    person ? (response.json(person)) : (response.status(404).end())
})

const generateInfo = () => {
    const row1 = `<p>Phonebook has info for ${persons.length} people</p>`
    const now = new Date()
    const row2 = `<p>${now}</p>`
    const info = row1 + row2
    return (info)
}

app.get('/info', (request, response) => {
    response.send(generateInfo())
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    console.log('id:', id)
    return id
}

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!person.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(listPerson => listPerson.name === person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const id = generateId()
    person.id = `${id}`
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)