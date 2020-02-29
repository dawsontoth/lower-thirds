import React from 'react';
import { Cards } from './components/cards';
import { Footer } from './components/footer';
import { Header } from './components/header';

export function App() {
    return (
        <div className="App">
            <Header/>
            <Cards/>
            <Footer/>
        </div>
    );
}
