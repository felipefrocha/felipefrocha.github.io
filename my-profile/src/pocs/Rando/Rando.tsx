import React, {Component} from "react";

interface Props {
 maxNum:number
}
interface State {
    num: number
}


class Rando extends Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            num: 0
        }
    }
    makeTimer(){
        setInterval(()=> {
            let rand = Math.floor(Math.random() * this.props.maxNum)
            this.setState({ num: rand })
        },1000)
    }
    componentDidMount() {
        this.makeTimer()
    }

    render(){
        return <h1>{this.state.num}</h1>
    }

}
export default Rando