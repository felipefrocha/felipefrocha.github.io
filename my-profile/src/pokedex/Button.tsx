import React, {Component, ReactNode} from "react";


interface Props {
}
interface State {
    clicked: boolean
}
class Button extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            clicked: false
        }
        this.clicked = this.clicked.bind(this)
    }
    clicked(){
        this.setState({clicked: !this.state.clicked})
    }
    render() {
        return (
            <div>
                <h1>{this.state.clicked? 'Clicked' : 'Not Clicked'}</h1>
                <button onClick={this.clicked}>Teste</button>
            </div>
        );
    }
}
export default Button