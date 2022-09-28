import './GameOverlayStyle.css';

import React, { useEffect, useState } from 'react';

import ZoningButtonComponent from '../ZoningButton/ZoningButtonComponent';
import UIManager, { UIModeTypes } from '../../../engine/UIManager';

interface GameOverlayProps {
    uiManager: UIManager
}

const GameOverlayComponent = (props: GameOverlayProps) => {
    const { uiManager } = props;

    const [uiManagerMode, setUIManagerMode] = useState(uiManager.currentModeType);

    useEffect(() => {
        const setMode = () => setUIManagerMode(uiManager.currentModeType);
        uiManager.onUIModeChanged.add(setMode);
        return () => {
            uiManager.onUIModeChanged.remove(setMode)
        }
    }, [uiManager.currentModeType, uiManager.onUIModeChanged]);

    // console.log('renderOverlay');

    return <div className='GameOverlay'>
        <ZoningButtonComponent uiMode={ uiManagerMode } onClick={() => uiManager.switchUIMode(UIModeTypes.ZoningUIMode)}/>
    </div>
}

export default GameOverlayComponent;
