const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.remove({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', async () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('field id is defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const ids = response.body.map(blog => blog.id)
        expect(ids).toContain(helper.initialBlogs[0]._id)
    })
})

describe('addition of a new blog', async () => {
    test('succeeds with valid data', async () => {
        const newBlog = {title: 'test', author: 'test', url: 'test', likes: 0}
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blogs = await helper.blogsInDb()
        expect(blogs.length).toBe(helper.initialBlogs.length + 1)
        const titles = blogs.map(n => n.title)
        expect(titles).toContain('test')
    })

    test('field likes defaults to 0', async () => {
        const newBlog = {title: 'test', author: 'test', url: 'test'}
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blogs = await helper.blogsInDb()
        const blog = blogs.find(blog => blog.title === 'test')
        expect(blog.likes).toBe(0)
    })

    test('fails with status code 400 no title field', async () => {
        const newBlog = {author: 'test', url: 'test', likes: 0}
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        const blogs = await helper.blogsInDb()
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })

    test('fails with status code 400 no url field', async () => {
        const newBlog = {title: 'test', author: 'test', likes: 0}
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        const blogs = await helper.blogsInDb()
        expect(blogs.length).toBe(helper.initialBlogs.length)
    })
})

// describe('viewing a specifin note', async () => {
//     test('succeeds with a valid id', async () => {
//         const notesAtStart = await helper.notesInDb()
//
//         const noteToView = notesAtStart[0]
//
//         const resultNote = await api
//             .get(`/api/notes/${noteToView.id}`)
//             .expect(200)
//             .expect('Content-Type', /application\/json/)
//
//         expect(resultNote.body).toEqual(noteToView)
//     })
//
//     test('fails with statuscode 404 if note does not exist', async () => {
//         const validNonexistingId = await helper.nonExistingId()
//
//         console.log(validNonexistingId)
//
//         await api
//             .get(`/api/notes/${validNonexistingId}`)
//             .expect(404)
//     })
//
//     test('fails with statuscode 400 id is invalid invalid', async () => {
//         const invalidId = '5a3d5da59070081a82a3445'
//
//         await api
//             .get(`/api/notes/${invalidId}`)
//             .expect(400)
//     })
// })
//
// describe('deletion of a note', async () => {
//     test('succeeds with status code 200 if id is valid', async () => {
//         const notesAtStart = await helper.notesInDb()
//         const noteToDelete = notesAtStart[0]
//
//         await api
//             .delete(`/api/notes/${noteToDelete.id}`)
//             .expect(204)
//
//         const notesAtEnd = await helper.notesInDb()
//
//         expect(notesAtEnd.length).toBe(
//             helper.initialNotes.length - 1
//         )
//
//         const contents = notesAtEnd.map(r => r.content)
//
//         expect(contents).not.toContain(noteToDelete.content)
//     })
// })

afterAll(() => {
    mongoose.connection.close()
})
