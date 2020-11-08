import React, {Component} from "react";

interface Props {}
interface State {
    score: number
    gameOver: boolean
}


class Game extends Component<Props, State> {
    private constructor(props:Props) {
        super(props);
        this.state = {
            score : 0, gameOver: false
        }
    }


    render(){
        return(
            <div>
                <h1>Your Score Is: {this.state.score}</h1>
            </div>
        )
    }
}

export default Game