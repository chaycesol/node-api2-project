const express = require('express');
const Posts = require('../data/db');

const router = express.Router();



/** GET REQUESTS **/

// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    const query = req.query;
    console.log("req.query" + req.query)

    Posts.find(req.query)
    .then(posts => {
      res.status(200).json({query: req.query, data: posts});
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

// Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    const id = req.params.id
    try{
        Posts.findById(id)
        .then((post) =>{
            res.status(200).json(post);
        })
        .catch(() => {
            res.status(404).json({ message: 'The post with the specified ID does not exist.'});
        })
    } catch{
        res.status(500).json({ error: "The post information could not be retrieved." })
    }
});

// Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    try {
        Posts.findPostComments(id)
        .then((comments) => {
            console.log(comments);
            res.status(200).json(comments);
        })
        .catch((error) => {
            res.status(404).json({
            message: 'The post with the specified ID does not exist.',
            });
        });
    } catch (error) {
        res.status(500).json({
        error: 'The comments information could not be retrieved.',
        });
    }
});

/** POST REQUESTS **/

//Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
    try {
        if(req.body.title || req.body.contents) {
            Posts.insert(req.body)
            .then((post) => res.status(201).json(post))
            .catch((err) => console.log(error));
        } else {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
    } catch {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
});

// Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) =>{
    const id = req.params.id;
    try{
        if (id) {
            if (req.body.text) {
                req.body.post_id = id;

                Posts.insertComment(req.body)
                .then((comment) => {
                  Posts.findCommentById(comment.id).then((newComment) => {
                    res.status(201).json({ newComment });
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              res.status(400).json({
                errorMessage: 'Please provide text for the comment.',
              });
            }
          } else {
            res.status(404).json({
              error: 'The post with the specified ID does not exist.',
            });
          }
        } catch (error) {
          res.status(500).json({
            error:
              'There was an error while saving the comment to the database',
          });
        }
      });

/** PUT REQUESTS **/
// Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
    
        if (id) {
          if (req.body.title && req.body.contents) {
            Posts.update(id, req.body)
              .then((updatedPost) => {
                res.status(200).json(updatedPost);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            res.status(400).json({ error: 'Please provide title and contents for the post.' });
          }
        } else { 
            res.status(404).json({error: 'The post with the specified ID does not exist.' });
        }
      } catch {
        res.status(500).json({ error: 'The post information could not be modified.' });
      }
});


/** DELETE REQUESTS **/
router.delete('/:id', (req, res) =>{
    const id = req.params.id;
    try {
        Posts.remove(id)
        .then((post) => {
            res.status(200).json({ message: `delete a post ${post}` });
        })
        .catch((error) => {
            res.status(404).json({
            message: 'The post with the specified ID does not exist.',
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'The post could not be removed' });
    }
});





module.exports = router;