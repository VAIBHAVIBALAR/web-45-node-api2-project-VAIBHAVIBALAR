// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) =>{
    Posts.find()
    .then(post =>{
        res.status(200).json(post)
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({message: 'The posts information could not be retrieved'})
    })
})
module.exports = router