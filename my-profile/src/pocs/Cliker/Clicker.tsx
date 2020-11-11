import React, {Component, ReactNode} from "react";


interface Props {
    maxNum: number
    winNum: number
}
interface State {
    clicked: boolean
    num:number
}
class Clicker extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            clicked: false,
            num: 1
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
        let rand = Math.floor(Math.random() * this.props.maxNum)
        this.setState({ num: rand })
    }
    render() {
        return (
            this.state.num === this.props.winNum
                ? <div>
                <h1>{"You WIN"}</h1>
            </div>
                : <div>
                <h1>{"The random number is: " + this.state.num}</h1>
                    <button onClick={this.handleClick}>Teste</button>

                </div>
        );
    }
}
export default Clicker