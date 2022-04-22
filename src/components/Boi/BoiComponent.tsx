import './BoiStyle.css';

import React from 'react';
import Boi from '../../engine/Boi';

interface BoiProps {
    boi: Boi
}

const BoiComponent = (props: BoiProps) => {
    // const { } = props;
    
    // const [BoiData, setBoiData] = useState(Boi.asData());

    // useEffect(() => {
    //     Boi.onBoiUpdated.add(setBoiData);
    //     return () => {Boi.onBoiUpdated.remove(setBoiData)};
    // }, [Boi.onBoiUpdated]);

    return (
        <div
            className='Boi'
        >
        </div>
    );
}

export default BoiComponent;
