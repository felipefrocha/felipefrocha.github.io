import React, {ReactNode} from "react";

interface Props {
    children: ReactNode
}

const Layout = ({children}:Props) => {
    return(
        <div>
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