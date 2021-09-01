// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) =>{
    Posts.find(req.query)
    .then(post =>{
        res.status(200).json(post)
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({message: 'The posts information could not be retrieved'})
    })
})

router.get('/:id', (req, res) =>{
    Posts.findById(req.params.id)
    .then(post =>{
        if (post){
            res.status(200).json(post)
        }else {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        }
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({message: 'The post information could not be retrieved'})
    })
})

router.post('/', async (req, res) =>{
    const { title, contents} = req.body
    if(!title || !contents) {
    res.status(400).json({message: 'Please provide title and contents for the post'})
    }
    else {
        Posts.insert({title, contents})
        .then( ({id}) => {
           return Posts.findById(id)
        })
        .then(newPost =>{
            res.status(201).json(newPost)
        })
        .catch(err => {
           res.status(500).jason(err.message) 
        })
        
    }
})

router.put('/:id', (req, res) =>{
    const info = req.body
    if(!info.title || !info.contents){
        res.status(400).json({ message: 'Please provide title and contents for the post'})
    } else {
        Posts.findById(req.params.id)
        .then(post =>{
            if(!post) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist',
                })
            } else{
                return Posts.update(req.params.id, info)
            }
        })
        .then(data =>{
            if(data) {
                return Posts.findById(req.params.id)
            }
        })
        .then(post =>{
            res.json(post)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The posts information could not be retrieved',
                err: err.message,
            })
        })
    }
   
})

router.delete('/:id', async (req, res) => {
    try {
    const idN = await Posts.findById(req.params.id)
    if (!idN) {
       res.status(404).json({
           message: 'The post with specified ID does not exist'
       }) 
    } else {
        await Posts.remove(req.params.id)
        res.status(200).json(idN)
    }
    }
    catch (err) {
        res.status(500).json({
            message: "The post could not be removed"
        })

    }
})


router.get('/:id/comments',  async (req, res) =>{
    try {
            const post = await Posts.findById(req.params.id)
            if(!post) {
                    res.status(404).json({
                        message: 'The post with the specified ID does not exist',
                         })
             } else {
                    const data = await Posts.findPostComments(req.params.id)
                    res.json(data)
                 }
        
        }  catch (err) {
                    res.status(500).json({
                    message: "The post could not be removed"
                    })
            }         
})
module.exports = router