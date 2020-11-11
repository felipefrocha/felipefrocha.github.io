import React from "react";
import 'Box-style.css'

interface Props {
    handleClick: () => void
    color: string
}

interface State {

}

const Box = (props: Props) => {
    return <button className='Box' style={{color: `${props.color}`}} onClick={() => props.handleClick()}/>
}
export default Box