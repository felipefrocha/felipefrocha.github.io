import React from "react";
interface Props {
    side : string
    url : string
}
const Coin = (coin: Props) => <img className='Flipper'
                                   alt={coin.side}
                                   src={coin.url}/>;

export { Props as ICoin}
export default Coin