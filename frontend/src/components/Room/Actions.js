import {backend} from '../../config'
const Actions = (props) => {
    const deleteRoom = () => { 
        const url = backend.url + '/room/delete/' + props.roomId;
        fetch(url,{
            method:'DELETE',
            headers:{
                'content-Type':'application/json',
                'authorization':localStorage.getItem('token')
            }
        })
        .then(response=>{
            return response.json();
        })
        .then(data=>{
            console.log(data)
            if(data.success){
                props.setMessage('Room deleted');
                window.location.href = '/home';
            }else{
                // window.location.href = '/login';
                props.setMessage(data.message)
            }
        })
        .catch(error=>{
            props.setMessage(error.message);
            console.log('error')
        })
    };
    return (
        <div className='room__actions'>
            <button className="btn btn-danger" onClick={deleteRoom}>Delete</button>
            {/* //Scroll to select language */}
            <select className='select select-primary' onChange={(e) => props.setLanguage(e.target.value)}>
                {/* <option value="javascript">JavaScript</option> */}
                <option value="python">Python</option>
                <option value="cpp">C++</option>
            </select>
        </div>
    );
};

export default Actions;