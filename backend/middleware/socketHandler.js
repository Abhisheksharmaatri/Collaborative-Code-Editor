const socketIo = require('socket.io');
const config = require('../config');
module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: config.cors.origin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // WebSocket handling
    io.on('connection', socket => {
        console.log('A user connected to WebSocket');

        socket.on('message', msg => {
            console.log('message: ' + msg);
            io.emit('message', msg);
        });

        // Room Messages

        socket.on('room-created', async room => {
            console.log('room-created: ', {
                ...room
            });
            await io.emit('room-created', room);
        });

        socket.on('room-updated', async room => {
            console.log('room-updated: ', {
                ...room
            });
            await io.emit('room-updated', room);
        });

        socket.on('room-deleted', async room => {
            console.log('room-deleted: ', {
                ...room
            });
            await io.emit('room-deleted', room);
        });

        // Room User Messages

        // socket.on('user-added', async room => {
        //     console.log('user-added: ', {
        //         ...room
        //     });
        //     await io.emit('user-added', room);
        // });

        // socket.on('user-removed', async room => {
        //     console.log('user-removed: ', {
        //         ...room
        //     });
        //     await io.emit('user-removed', room);
        // });

        // Room Comment Messages

        socket.on('comment-added', async comment => {
            console.log('comment-added: ', {
                ...comment
            });
            await io.emit('comment-added', comment);
        })

        socket.on('comment-updated', async comment => {
            console.log('comment-updated: ', {
                ...comment
            });
            await io.emit('comment-updated', comment);
        })

        socket.on('comment-deleted', async comment => {
            console.log('comment-deleted: ', {
                ...comment
            });
            await io.emit('comment-deleted', comment);
        })
        socket.on('code-updated', async code => {
            await io.emit('code-updated', code);
        }) 
        socket.on('disconnect', () => {
            console.log('A user disconnected from WebSocket');
        });
    });
};