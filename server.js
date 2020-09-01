const express = require ('express')

const server = express();

const port = 8000;

server.use(express.json());

server.get('/', (req,res)=> {
    res.status(200).json({message: "Success"})
})

server.listen({port}, () => {
    console.log(`\n*** Server running on http://localhost:${port} ***\n`)
})