import React from "react";
import {Button } from 'antd'
export default class Result extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div className="result">
            {this.props.found?<div className="success">
            <h3>
                Success! Congratulations on finding Falcone King Shan is mighty pleased.
            </h3>
            <h3>
                Time taken:{this.props.time}
            </h3>
            <h3>
                Planet found: {this.props.found}
            </h3>
            </div>:<div className="false">
            <h3>
                Failed !!! 
            </h3>
            </div>
            }
            <Button type="primary" onClick={this.props.startagain}>
                Start Again
            </Button>
            
        </div>)
    }
}