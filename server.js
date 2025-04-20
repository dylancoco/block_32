const express = require('express')
const pg = require('pg')
const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'block_32'
})
const app = express()
app.use(express.json())
const port = 3000

app.get('/api/flavors', async (req, res) => {
    const data = await client.query('SELECT * FROM flavor')
    console.log(data.rows)
    res.json(data.rows)
})

app.get('/api/flavors/:id', async (req, res) =>{
    const { id } = req.params
    const data = await client.query('SELECT * FROM flavor WHERE id = $1', [id])
    res.json(data.rows)
})

app.post('/api/flavors', async (req, res) =>{
    const {name, favorite} = req.body
    await client.query(`INSERT INTO flavor (flavor_name, is_favorite) VALUES ($1, $2)`, [name, favorite])
    const data = await client.query('SELECT * FROM flavor WHERE flavor_name = $1', [name]) 
    res.json(data.rows)
})


app.delete('/api/flavors/:id', async (req, res) =>{
    const { id } = req.params
    await client.query(`DELETE FROM flavor WHERE id = $1`, [id])
})

app.put('/api/flavors/:id', async (req, res) => {
    const { id } = req.params
    const { favoirte } = req.body
    await client.query('UPDATE flavor SET is_favorite = $1 WHERE id = $2', [favoirte, id])
    const data = await client.query('SELECT * FROM flavor WHERE id = $1', [id])
    res.json(data.rows)
})

app.listen(port, async () => {
    await client.connect()
    console.log(`This port is on ${port}`)
})