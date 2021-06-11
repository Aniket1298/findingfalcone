import React from 'react'
import { Menu, Dropdown, Button, message, Space, Tooltip ,Radio, Input,} from 'antd'
import {CaretDownOutlined} from '@ant-design/icons'
import './home.css'
class Vehicle extends React.Component{
    constructor(props){
        super(props)
        this.state={
            value:null
        }

        this.handleClick=this.handleClick.bind(this)
    }
    handleClick(e){
        this.setState({value:e.target.value})
        this.props.addVehicle(this.props.index,e.target.value)
    }
    
    render(){
        var i=0;
        console.log("in veh",this.props.index,this.props.vehicles)
        return(
            <Radio.Group onChange={this.handleClick} value={this.state.value}>
                <Space direction="vertical">
                    {this.props.vehicles.map((vehicle)=><Radio value={i++} disabled={ vehicle.max_distance<this.props.destination[this.props.index].planet.distance  ||(vehicle.total_no==0 && this.props.destination[this.props.index].vehicle.name!=vehicle.name) ?true:false}>{vehicle.name+"("+vehicle.total_no+")"}</Radio>)}
                </Space>
            </Radio.Group>
        )
    }
}
export default class Home extends React.Component{
    constructor(){
        super()
        this.state={
            vehicles:[],
            time:0,
            planets:[],
            test:"hello",
            destination:[{
                planet:null,
                vehicle:null
            },
            {
                planet:null,
                vehicle:null
            },
            {
                planet:null,
                vehicle:null
            },
            {
                planet:null,
                vehicle:null
            },
        ]
        }
        this.menu=this.menu.bind(this)
        this.addVehicle=this.addVehicle.bind(this)
    }
    getData(){
        fetch('https://findfalcone.herokuapp.com/planets' ,{method: "GET"}).then((response)=> response.json().then((data) => this.setState({planets:data}) ))
        //https://findfalcone.herokuapp.com/vehicles
        fetch('https://findfalcone.herokuapp.com/vehicles' ,{method: "GET"}).then((response)=> response.json().then((data) => this.setState({vehicles:data}) ))
        
    }
    componentDidMount(){
        this.getData()
    }
     destination(index) {
        return(
            <div>
                
            </div>
        )
        
    }
    addVehicle(index,key){
        var previous = this.state.destination[index].vehicle 
        var selected = this.state.vehicles[key]
        var vehicles = this.state.vehicles
        this.setState({time:0})
        for (var i=0;i<vehicles.length;i++){
            if (vehicles[i]==selected){
                vehicles[i].total_no-=1
            }
            else if (previous && vehicles[i]==previous){
                vehicles[i].total_no+=1
            }
        }
        var destination = this.state.destination
        destination[index].vehicle=selected
        this.setState({vehicles:vehicles,destination:destination})
        this.state.destination.forEach((destination)=>{
            console.log(destination.vehicle,destination.planet)
            if(destination.vehicle){
                this.setState({time:Math.max(this.state.time,destination.planet.distance/destination.vehicle.speed)})
            }
            
        })
        console.log("Add",this.state.vehicles)

    }
    handleDropdown(key,index){
        const selected = this.state.planets[key]
        const previous = this.state.destination[index].planet
        var planets =this.state.planets.filter(planet=> planet.name!=selected.name)
        if(previous){
            this.setState({planets:[previous,...planets]})
        }
        else{
            this.setState({planets:planets})
        }
        var destination=this.state.destination
        destination[index].planet=selected
        this.setState({destination:destination,vehicle:null})
    }
    menu(index){
        var i=0;
        return(
            <Menu onClick={(e)=>this.handleDropdown(e.key,index)}>
                {this.state.planets.map((planet)=> <Menu.Item key={i++}>{planet.name}</Menu.Item>)}

            </Menu>
        )
    }
    handleRadiobutton(key,index){

    }
    render(){
        return(
            <div className="home">
                <h1>
                    Finding Falcone!
                </h1>
                <this.destination/>
                <div className="destinations">
                    {[0,1,2,3].map((index)=>
                        <div className="destination">
                            <h2>Destination{index+1}</h2>
                            <Dropdown overlay={() => this.menu(index)}   placement="bottomLeft" arrow>
                                <Button>{this.state.destination[index].planet?this.state.destination[index].planet.name:"Select"} <CaretDownOutlined /></Button>
                            </Dropdown>
                            {this.state.destination[index].planet ? <div className="vehicle">
                                <Vehicle vehicles={this.state.vehicles} destination={this.state.destination} index={index} addVehicle={this.addVehicle}/>
                            </div>:null}
                        </div>
                    )}
                    <h2>
                        Time Taken: {this.state.time}
                    </h2>
                </div>
            </div>
        )
    }
}