import React from 'react';
import { Logo } from './components/logo';
import { LowerThird } from './components/lower-third';
import { useLowerThirds } from './hooks/lower-thirds';

const App: React.FC = () => {
    const lowerThirds = useLowerThirds();
    return (
        <div className="App">
            <Logo/>
            { lowerThirds.map(lowerThird =>
                <LowerThird key={ lowerThird.id } data={ lowerThird }/>,
            ) }
        </div>
    );
};

export default App;
