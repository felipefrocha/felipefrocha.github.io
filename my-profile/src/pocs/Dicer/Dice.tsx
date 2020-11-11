import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDiceFive, faDiceFour, faDiceOne, faDiceSix, faDiceThree, faDiceTwo} from '@fortawesome/free-solid-svg-icons'
import './dice-style.css'

interface Props {
    side: number
    rolling: boolean
}

const diceOptions = [faDiceFive, faDiceFour, faDiceOne, faDiceSix, faDiceThree, faDiceTwo]
const Dice = ({side, rolling}: Props) => <FontAwesomeIcon icon={diceOptions[side]} size={"6x"}
                                                          className={`Dice  ${rolling ? "rolling" : ""}`}/>
export default Dice

