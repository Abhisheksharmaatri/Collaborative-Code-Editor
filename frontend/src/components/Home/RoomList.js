function RoomList(props) {

    return (
        <div className="RoomList">
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