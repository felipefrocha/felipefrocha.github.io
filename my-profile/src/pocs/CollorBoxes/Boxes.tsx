import React, {Component} from "react";
import 'Box-style.css';
import Box from "./Box";

interface Props {

}
interface State {
    color: "green"
}
class Boxes extends Component<Props, State>{
    constructor(props:Props) {
        super(props);
        this.state = {
            color: 'green'
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){

    }
    render() {
        return <Box handleClick={this.handleClick} color={this.state.color || 'green'}/>;
    }
}


export default Boxes