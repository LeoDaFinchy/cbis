import './ZoningButtonStyle.css';

import React from 'react';
import { UIModeTypes } from '../../../engine/UIManager';

interface ZoningButtonProps {
    onClick: Function,
    uiMode: UIModeTypes
}

const ZoningButtonComponent = (props: ZoningButtonProps) => {
    const { onClick, uiMode } = props;

    const clickHandler = (event: any) => {
        onClick();
        event.nativeEvent.stopImmediatePropagation();
    }

    const className = [
        'ZoningButton',
        uiMode === UIModeTypes.ZoningUIMode ? 'activeMode' : 'inactiveMode'
    ].join(' ')

    return (
        <div className={className}>
            <button
                onClick={clickHandler}
            >
                Zoning
            </button>
        </div>
    )
}

export default ZoningButtonComponent
