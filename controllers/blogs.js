const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const _ = require('lodash')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({error: 'token missing or invalid'})
        }
        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id,
        })
        let savedBlog = await blog.save()
        savedBlog = await Blog.findById(savedBlog.id).populate('user', {username: 1, name: 1, id: 1})
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!request.token || !decodedToken.id) {
            return response.status(401).json({error: 'token missing or invalid'})
        }
        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById(request.params.id)
        if (blog.user.toString() !== user._id.toString()) {
            return response.status(403).json({error: 'forbidden'})
        }
        await blog.remove()
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }
    try {
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id, blog, {new: true})
            .populate('user', {username: 1, name: 1, id: 1})
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

// blogsRouter.get('/:id', async (request, response, next) => {
//     try {
//         const note = await Note.findById(request.params.id)
//         if (note) {
//             response.json(note.toJSON())
//         } else {
//             response.status(404).end()
//         }
//     } catch (exception) {
//         next(exception)
//     }
// })
//

module.exports = blogsRouter
