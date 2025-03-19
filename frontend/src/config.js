module.exports = {
    backend: {
        // url: 'http://localhost:4000'
        // url:'https://collaborative-code-editor-bdy7.onrender.com'
        // url:'https://collaborative-code-editor-backend-code.onrender.com'
        url:'https://collaborative-code-editor-backend.vercel.app'
        // url:'https://collaborative-code-editor-backend-drp2ddex1.vercel.app'
        // url:'https://collaborative-code-editor-backend-78m1vad2p.vercel.app'
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
