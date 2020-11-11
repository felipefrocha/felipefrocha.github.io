import React, {ReactNode} from "react";
import './Layout-style.css'
interface Props {
    children: ReactNode
}

const Layout = ({children}:Props) => {
    return(
        <div className='Layout-container'>
            <header>
                <h1>Teste Header</h1>
            </header>
            <nav>
                <ul><li>Teste</li></ul>
            </nav>
            {children}
            <footer>
                <h3>Teste Footer</h3>
            </footer>
        </div>
    )
}
export default Layout