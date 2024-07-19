module.exports = {
    backend: {
        // url: 'http://localhost:4000/'
        url:'https://collaborative-code-editor-bdy7.onrender.com/'
    },
    user: {
        name: {
            length: 5
        },
        password: {
            saltRounds: 10,
            length: 8
        }
    },
    room: {
        name: {
            length: 5
        },
        description: {
            length: 5
        }
    },
    port: 3000
}