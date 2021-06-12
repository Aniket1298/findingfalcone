import React from 'react'
import { Menu, Dropdown, Button, message, Space, Tooltip ,Radio, Input,} from 'antd'
import {CaretDownOutlined} from '@ant-design/icons'
import './home.css'
import { triggerFocus } from 'antd/lib/input/Input'

class Destination extends React.Component{
    constructor(props){
        super(props)
        this.state={
            dropkey:null,
            radiokey:null,
            index:this.props.index
        }
        
        this.menu=this.menu.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }
    menu(){
        var i=0
        return(
            <Menu onClick={(e)=>this.props.handleDropdown(e.key,this.state.index)}>
                    {this.props.planets.map((planet)=> <Menu.Item key={i++}>{planet.name}</Menu.Item>)}
            </Menu> 
        )
    }
    handleClick(e){
        this.setState({radiokey:e.target.value})
        this.props.addVehicle(this.props.index,e.target.value)
    }
     
    reset(){
        this.setState({
            dropkey:null,
            radiokey:null,
            index:this.props.index
        })
        
    };
    render(){
        var index = this.state.index
        var i=0;
       
        return(
            <div className="destination">
                <h2>Destination {index+1}</h2>
                <Dropdown overlay={() => this.menu()}   placement="bottomLeft" arrow>
                    <Button>{this.props.destination[index].planet?this.props.destination[index].planet.name:"Select"} <CaretDownOutlined /></Button>
                </Dropdown>
                {this.props.destination[index].planet ? <div className="vehicle">
                <Radio.Group onChange={this.handleClick} value={this.state.radiokey}>
                    <Space direction="vertical">
                        {this.props.vehicles.map((vehicle)=><Radio value={i++} disabled={ vehicle.max_distance<this.props.destination[this.props.index].planet.distance  ||(vehicle.total_no==0 && this.props.destination[this.props.index].vehicle!=vehicle) ?true:false}>{vehicle.name+"("+vehicle.total_no+")"}</Radio>)}
                    </Space>
                </Radio.Group>
                </div>:null}
            </div>

        )
    }
}
export default class Home extends React.Component{
    constructor(){
        super()
        this.child = React.createRef();
        this.state={
            
            vehicles:[],
            time:0, 
            vehicleCount:0,
            loading:false,
            planets:[],
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
        this.addVehicle=this.addVehicle.bind(this)
        this.handleDropdown=this.handleDropdown.bind(this)
        this.set=this.set.bind(this)
    }
    set(){
        this.setState({reset:true})
    }
    getData(){
        this.setState({loading:true})
        fetch('https://findfalcone.herokuapp.com/planets' ,{method: "GET"}).then((response)=> response.json().then((data) => this.setState({planets:data}) ))
        
        fetch('https://findfalcone.herokuapp.com/vehicles' ,{method: "GET"}).then((response)=> response.json().then((data) => this.setState({vehicles:data}) ))
        
        this.setState({loading:false})
        
    }
    componentDidMount(){
        this.getData()
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
        var time=0
        var vehicleCount =0
        this.state.destination.forEach((destination)=>{
            if(destination.vehicle){
                time += destination.planet.distance/destination.vehicle.speed
                vehicleCount++
            }
        })
        this.setState({time:time,vehicleCount:vehicleCount})

    }
    reset(){
        
        this.child.current.reset()
        this.setState({
            
            vehicles:[],
            time:0, 
            vehicleCount:0,
            loading:false,
            planets:[],
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
        })
        this.componentDidMount()
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

    render(){
        return(
            <>
            {this.state.loading? <h2>Loading...</h2>:
            <div className="home">
                <div className="header">
                    <a onClick={()=>this.reset()}>
                        <h4>Reset</h4>
                    </a>
                    <a>
                    </a>
                </div>
            <h1>
                Finding Falcone!
            </h1>
            
            <div className="destinations">
                {[0,1,2,3].map((index)=> <Destination ref={this.child} key={index} set ={this.set} reset={this.state.reset} addVehicle={this.addVehicle} handleDropdown={this.handleDropdown} index = {index} planets={this.state.planets} vehicles={this.state.vehicles} destination={this.state.destination}/>
                )}
                <h2>
                    Time Taken: {this.state.time}
                </h2>

            </div>
            <div className="finding">
            {this.state.vehicleCount===this.state.destination.length?<Button type="primary">Find Falcone!</Button>:<Button type="primary" disabled>
      Find Falcone!
    </Button>}
            </div>
            
        </div>
            }
            </>
            
        )
    }
}