const express = require ('express')

//pullling data source of posts
const Posts = require('./data/db.js');

// declaring that routes are specified for posts here
const postsRouter = require('./posts/posts-router.js');

const server = express();

// define port used
const port = 8000;

//json stringyfier
server.use(express.json());

server.use('/api/posts', postsRouter) // router to extract posts routes from resources


server.get('/', (req,res)=> {
    res.status(200).json({message: "NODE API PROJECT 2"})
});



server.listen({port}, () => {
    console.log(`\n*** Server running on http://localhost:${port} ***\n`)
})