import React from 'react';
import './App.css';
import Game from "./pokedex/Game";
import Layout from './pokedex/Layout';
import Rando from "./pokedex/Rando";
import Button from "./pokedex/Button";

function App() {
  return (
      <Layout>
          <Rando maxNum={10}/>
          <Button/>
      </Layout>
  );
}

export default App;
