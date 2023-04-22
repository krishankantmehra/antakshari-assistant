import React, { Component } from 'react'
import Login from './Login'
import Signup from './Signup'

class main extends Component {

    constructor(params) {
        super(params)

        this.state = {
            form : 0
        }
       
    }

    
    change = ()=>{
        
        var temp = this.state.form
        
        this.setState(
            
            {
                form: (temp + 1)%2
            }
        )
    }   

    render() {
        return (
            <div className='d-flex flex-row h-100 align-items-center justify-content-center'>
                
                <Signup show={this.state.form} change={this.change}/>
                <Login show={this.state.form} change={this.change} />
            </div>
        )
    }
}

export default main
