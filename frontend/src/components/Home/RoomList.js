import { react, useState } from 'react';

function RoomList(props) {
    //i want to create a room list component which shocasw the list of all the rooms which ahs the following strutur:
    //     room: Array(1)
    // 0: {_id: "654b0e96d4a56f7192067ad6", name: "room123", description: "this is am room", code: "this is edit↵this is another edit", owner: "654b0e62d4a56f7192067ad1", …}

    return (
        <div className="RoomList">
            {/* <ul>
                {props.rooms.map((room) => {
                    return (
                        <div key={room._id}>
                            <h4><a href={`/room/${room.id._id}`}>{room.id.name}</a></h4>
                            <p>{room.id.description}</p>
                        <div>
                    )
                }
                )}
            </ul> */}
            {props.rooms.length === 0 ? <p>No Rooms</p> :
                <div className="room-list">
                    {console.log(props.rooms)}
                    {props.rooms.map((room, index) => {
                        return (
                            <div key={index} className='room-item'>
                                <b>{room.id.name}</b>
                                <p>{room.id.description}</p>
                                <button onClick={() => window.location.href = '/room/' + room.id._id} className='btn btn-primary'>
                                    Visit
                                </button>
                            </div>
                        );
                    })}
                </div>            
            }
        </div>
    )
}
 
export default RoomList;