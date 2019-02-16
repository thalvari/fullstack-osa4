const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })
    try {
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
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
// blogsRouter.delete('/:id', async (request, response, next) => {
//     try {
//         await Note.findByIdAndRemove(request.params.id)
//         response.status(204).end()
//     } catch (exception) {
//         next(exception)
//     }
// })
//
// blogsRouter.put('/:id', (request, response, next) => {
//     const body = request.body
//
//     const note = {
//         content: body.content,
//         important: body.important,
//     }
//
//     Note.findByIdAndUpdate(request.params.id, note, {new: true})
//         .then(updatedNote => {
//             response.json(updatedNote.toJSON())
//         })
//         .catch(error => next(error))
// })

module.exports = blogsRouter
