

import React, { Component } from 'react'
import './index.scss'

import { get_film_hot } from '../../../api/film';


class Home extends Component{
	constructor(props){
		super(props)
		this.state = {
			
		}
	}

	componentDidMount(){
		get_film_hot({}).then(res=>{
			console.log('666',res);
		})
	}
	
	render(){
		return (
			<div className='app-home'>
				app-home
			</div>
		)
	}
	
}

export default Home