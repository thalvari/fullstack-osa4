const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes([helper.initialBlogs[0]])
        expect(result).toBe(7)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(helper.initialBlogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('of empty list is null', () => {
        const result = listHelper.faroriteBlog([])
        expect(result).toBeNull()
    })

    test('when list has only one blog equals to be that blog', () => {
        const result = listHelper.faroriteBlog([helper.initialBlogs[0]])
        expect(result).toEqual(helper.initialBlogs[0])
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.faroriteBlog(helper.initialBlogs)
        expect(result).toEqual(helper.initialBlogs[2])
    })
})

describe('author with most blogs', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBeNull()
    })

    test('when list has only one blog equals to be that blog\'s author', () => {
        const result = listHelper.mostBlogs([helper.initialBlogs[0]])
        expect(result).toEqual({author: helper.initialBlogs[0].author, blogs: 1})
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.mostBlogs(helper.initialBlogs)
        expect(result).toEqual({author: 'Robert C. Martin', blogs: 3})
    })
})

describe('author with most likes', () => {
    test('of empty list is null', () => {
        const result = listHelper.mostLikes([])
        expect(result).toBeNull()
    })

    test('when list has only one blog equals to be that blog\'s author', () => {
        const result = listHelper.mostLikes([helper.initialBlogs[0]])
        expect(result).toEqual({author: helper.initialBlogs[0].author, likes: 7})
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.mostLikes(helper.initialBlogs)
        expect(result).toEqual({author: 'Edsger W. Dijkstra', likes: 17})
    })
})
