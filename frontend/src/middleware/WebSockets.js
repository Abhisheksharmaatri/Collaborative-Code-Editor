// socketListeners.js
import { io } from 'socket.io-client';

const setupSocketListeners = (socket) => {
    socket.on('message', msg => {
        console.log('message: ' + msg);
    });

    // Room Messages

    socket.on('room-created', async room => {
        console.log('room-created: ', {
            ...room
        });
    });

    socket.on('room-updated', async room => {
        console.log('room-updated: ', {
            ...room
        });
    });

    socket.on('room-deleted', async room => {
        console.log('room-deleted: ', {
            ...room
        });
    });

    // Room User Messages

    socket.on('user-added', async room => {
        console.log('user-added: ', {
            ...room
        });
    });

    socket.on('user-removed', async room => {
        console.log('user-removed: ', {
            ...room
        });
    });

    // Room Comment Messages

    socket.on('comment-added', async comment => {
        console.log('comment-added: ', {
            ...comment
        });
    })

    socket.on('comment-updated', async comment => {
        console.log('comment-updated: ', {
            ...comment
        });
    })

    socket.on('comment-deleted', async comment => {
        console.log('comment-deleted: ', {
            ...comment
        });
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected from WebSocket');
    });
};

export default setupSocketListeners;
