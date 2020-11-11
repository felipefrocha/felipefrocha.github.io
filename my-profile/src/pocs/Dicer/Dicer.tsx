import React, {Component} from "react";
import Dice from "./Dice";
import './dicer-style.css'


interface Props {
    maxNum: number
    winNum: number
}

interface State {
    clicked: boolean
    dice1: number
    dice2: number
}

class Dicer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            clicked: false,
            dice1: 1,
            dice2: 1
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.setState({clicked: true})
        setTimeout(() => {
            let rand = Math.floor(Math.random() * this.props.maxNum)
            let rand2 = Math.floor(Math.random() * this.props.maxNum)
            console.log(rand, rand2)
            this.setState({
                dice1: rand,
                dice2: rand2,
                clicked: false
            })
        }, 1000)
    }

    render() {
        return (
            <div className='Dicer'>
                <div className='Dicer-container'>
                    <Dice side={this.state.dice1} rolling={this.state.clicked}/>
                    <Dice side={this.state.dice2} rolling={this.state.clicked}/>
                </div>

                <button disabled={this.state.clicked} onClick={this.handleClick}>
                    {this.state.clicked ? "Rolling Dice..." : "Roll Dice"}</button>
            </div>
        );
    }
}

export default Dicer
