const Joi = require("joi")
const express = require("express")
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000

const genres = [
    { "id": 1, "name": "uMaskandi" },
    { "id": 2, "name": "Gospel" }
]

// Get all genres
app.get('/api/genres', (req, res) => {
    res.send(genres)
})

// Find single genre by ID
app.get('/api/genres/:id', (req, res) =>{
    const genre = genres.find(g => g.id == parseInt(req.params.id))

    if (!genre) return res.status(404).send("Genre with the given ID not found!")
    res.send(genre)
})

// Validation function
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema)
}

// Post Genre
app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = {
        id: genres.length +1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

// Update
app.put('/api/genres/:id', (req, res) => {
    // Look up the genre
    const genre = genres.find(g => g.id == parseInt(req.params.id))
    // If not existing, return 404
    if (!genre) return res.status(404).send("Genre with the given ID not found!")
    // Validate
    const { error } = validateGenre(req.body)
    // If invalid, return 400 - bad request
    if (error) return res.status(400).send(error.details[0].message)
    // Update genre
    genre.name = req.body.name
    // Return the update genre
    res.send(genre)
})

// Delete
app.delete('/api/genres/:id', (req, res) => {
    // Look up the genre
    const genre = genres.find(g => g.id == parseInt(req.params.id))
    // Not existing, return 404
    if (!genre) return res.status(404).send("The genre with the given ID not found!")
    // Delete
    const index = genres.indexOf(genre)
    genres.splice(index, 1)
    // Return the same genre
    res.send(genre)
})

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}...`))