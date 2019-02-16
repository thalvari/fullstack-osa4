const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const faroriteBlog = (blogs) => {
    const reducer = (current, blog) => {
        return current.likes < blog.likes ? blog : current
    }
    return blogs.length === 0 ? null : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    return blogs.length === 0 ? null :
        _(blogs).groupBy('author')
            .map((items, author) => ({author, blogs: items.length}))
            .sortBy('blogs')
            .last()
}

const mostLikes = (blogs) => {
    return blogs.length === 0 ? null :
        _(blogs).groupBy('author')
            .map((items, author) => ({author, likes: totalLikes(items)}))
            .sortBy('likes')
            .last()
}

module.exports = {
    dummy,
    totalLikes,
    faroriteBlog,
    mostBlogs,
    mostLikes,
}