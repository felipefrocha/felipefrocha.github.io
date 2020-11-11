import React, {Component} from "react";
import LottoBall from "./LottoBall";
import './Lotto-style.css'

interface Props {
    title: string
    numBalls: number
    maxNum: number
}

interface State {
    lottoBalls: number[]
}

class Lotto extends Component<Props, State> {
    static defaultProps: Props = {
        title: 'Lotto',
        numBalls: 4,
        maxNum: 9999
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            lottoBalls: Array.from({length: this.props.numBalls})
        }
        this.handleClick = this.handleClick.bind(this)
    }

    generateLotto() {
        this.setState(curState => ({
                lottoBalls: curState.lottoBalls.map(
                    x => Math.floor(Math.random() * this.props.maxNum) + 1
                )
            })
        )
    }

    handleClick() {
        this.generateLotto()
    }

    render() {
        return (
            <section className='Lotto'>
                <h1>
                    {this.props.title}
                </h1>
                <div>
                    {this.state.lottoBalls.map(x => <LottoBall num={x}/>)}
                </div>
                <button onClick={this.handleClick}>Generate Loto</button>
            </section>
        );
    }
}

export default Lotto