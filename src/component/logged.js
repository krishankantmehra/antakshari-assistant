import React, { Component } from 'react'
import {Navigate} from 'react-router-dom'
import Navbar from './navbar'
import {db} from '../firebase-config'
import { collection,query,where,addDoc,onSnapshot} from 'firebase/firestore'
import swal from 'sweetalert2'

class logged extends Component {
    state = {
        redirect: false,
        oRedirect : false,
        data:[],
        notification:[]
    }
     roomRef = collection(db,'rooms')
    


    createRoom = ()=>{
        var id = ''

        addDoc(this.roomRef , {'created_by':this.props.userName,'players':[]})
        .then(user => {
            id = user.id;

            document.getElementById('createRoomBtn').style.display = 'none'
            document.getElementById('roomLinkDiv').classList.remove('d-none');
            document.getElementById('roomLink').value = id
        })
        .catch((e) => {
            console.log(e);
        })

    }
    copyLink = ()=>{
        navigator.clipboard.writeText(document.getElementById('roomLink').value)
        swal.fire({
            position: 'bottom-end',
            text: 'Copied!',
            showConfirmButton: false,
            timer: 1000
          })
    }

    joinRoom = async() => {
        const {value:room} = await swal.fire({
            title:'Join Room',
            input:'text',
            inputLabel: 'Enter Room Code',
            inputPlaceholder: 'Room Code....',
            showCancelButton:true
        })

        if(room){
            const promise = new Promise(resolve => {
                
                var q = query(this.roomRef , where('__name__','==' , room))
                
                onSnapshot(q, snapshot => {
                    let rooms = []
                    snapshot.docs.forEach((doc) => {
                        rooms.push({...doc.data(),id:doc.id})
                    })
                    
                    
                   resolve(rooms)
                    
                })
            })

            promise.then(res => {
                if(res.length === 1){
                    
                    this.setState({
                        redirect:true,
                        data:res[0]
                    })
                }
                else{
                    console.log('Fail');
                    swal.fire({
                        title:'No such room',
                        text:'No room with this code exists.'
                    })
                }
            })
        }
        
    }

    joinOnlineRoom = ()=>{
        addDoc(this.roomRef , {'created_by':this.props.userName,'players':[]}).then(docref => {
     
            this.setState({
                oRedirect:true,
                data : {
                    id:docref.id
                }
            })
        })
        
    }
   
    toNotification = ()=>{
        window.location.href = window.location.origin + '/notifications'
    }

    render() {
        if(this.state.redirect)return <Navigate to={"./room?id="+this.state.data.id}/>
        else if(this.state.oRedirect)return <Navigate to={"./online?id="+this.state.data.id}/>
        else return (

            <div id="window" className=''>
            
                <Navbar userName={this.props.userName} />
                <div className='d-flex flex-column justify-contant-center align-items-center'>
                    <h1 className='p-3 text-dark'>Welcome {this.props.userName}</h1>
                    <button id='createRoomBtn' className='col-4 btn btn-danger shadow' onClick={this.createRoom}>Create a room</button>

                    <div id='roomLinkDiv' className='d-none d-flex flex-row col-8 justify-content-center align-items-center'>
                        <input type={'text'} id="roomLink" className='form-control col-8 me-3'/>
                        <button type='button' className='btn btn-primary shadow' onClick={()=>{this.copyLink()}} >Copy</button>
                    </div>
                    <div>
                        <button type='button' className='btn btn-danger mt-3 shadow' onClick={() => this.joinRoom()}>Join a room</button>
                    </div>
                    <div>
                        <button type='button' className='btn btn-danger mt-3 shadow' onClick={() => this.joinOnlineRoom()}>Play with online players</button>
                    </div>
                </div>
                <div className='fixed-bottom d-flex flex-row justify-content-end ' onClick={()=>{this.toNotification()}}>
                    <button className='btn btn-primary m-3 shadow' id='notify'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                      <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                    </svg>
                    </button>
                </div>
            </div>
        )
    }
}

export default logged
