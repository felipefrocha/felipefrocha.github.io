import React, {Component} from "react";
import './Flipper-style.css'
import {choice} from "./Flipper.service";
import Coin, {ICoin} from "./Coin";

interface Props {
    coins: ICoin[]
}

interface State {
    heads: number
    tails: number
    coin: ICoin
    total: number

}

class Flipper extends Component<Props, State> {
    static defaultProps: Props = {
        coins: [
            {
    side: 'head',
    url: 'https://tinyurl.com/react-coin-heads-jpg'
},
    {
    side: 'tail',
        url: 'https://tinyurl.com/react-coin-tails-jpg'

}
        ]
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            heads: 0,
            tails: 0,
            coin: this.props.coins[0],
            total: 0
        }
        this.handleClick = this.handleClick.bind(this)
    }

    flipCoin() {
        const coin = choice<ICoin>(this.props.coins)
        this.setState(curState => {
            let newState = {
                ...curState,
                coin,
                total: curState.total + 1,
                heads: curState.heads + (coin.side === 'head'? 1 : 0),
                tails: curState.tails + (coin.side === 'tail'? 1 : 0)
            }
            return newState
        });
    }

    handleClick() {
        this.flipCoin()
    }

    render() {
        return (
            <section>
                <header>
                    <h1>
                        {'Lets flip a coin'}
                    </h1>
                </header>
                <article>
                    < Coin side={this.state.coin.side} url={this.state.coin.url}/>
                    <button onClick={this.handleClick}>Flip a Coin</button>
                </article>
                <footer>
                    <p>{`Out of ${this.state.total}, there have been ${this.state.heads} and ${this.state.tails} tails.`}</p>
                </footer>
            </section>
        )
    }

}

export default Flipper