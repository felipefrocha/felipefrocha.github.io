import React, {Component} from "react";
import './LottoBall-style.css'
interface Props {
    num:number
}
interface State {

}
class LottoBall extends Component<Props, State>{
    render(){
        return (
            <div className='LottoBall'>
                <p>{this.props.num}</p>
            </div>
        );
    }
}

export default LottoBall