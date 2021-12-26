import GridCell from './GridCell';
import Pulse from './Pulse';

export enum UIModeTypes {
    DefaultUIMode,
    ZoningUIMode
}

interface UIMode {
    modeType: UIModeTypes;
    receiveGridCellPress: (gridCell: GridCell) => void
    receiveGridCellEnter: (GridCell: GridCell) => void
    receiveGridCellRelease: (gridCell: GridCell) => void
}

class DefaultUIMode implements UIMode{
    modeType: UIModeTypes;
    callbacks: {}
    constructor(callbacks: {}){
        this.modeType = UIModeTypes.DefaultUIMode;
        this.callbacks = callbacks;
    }
    receiveGridCellPress(gridCell: GridCell){}
    receiveGridCellEnter(gridCell: GridCell){}
    receiveGridCellRelease(gridCell: GridCell){}
}

class ZoningUIMode implements UIMode{
    modeType: UIModeTypes;
    zoneStart: GridCell | null;
    callbacks: {
        onCreateZone: Pulse,
        onPreviewZone: Pulse,
        onPreviewZoneEnd: Pulse;
    }
    constructor(callbacks: {
        onCreateZone: Pulse,
        onPreviewZone: Pulse,
        onPreviewZoneEnd: Pulse
    }){
        this.modeType = UIModeTypes.ZoningUIMode;
        this.zoneStart = null;
        this.callbacks = callbacks;
    }
    receiveGridCellPress(gridCell: GridCell){
        this.zoneStart = gridCell;
        this.callbacks.onPreviewZone.send(this.zoneStart.position, this.zoneStart.position, this.zoneStart.grid);
    }
    receiveGridCellEnter(gridCell: GridCell){
        if(this.zoneStart?.grid === gridCell.grid){
            const [leftTop, rightBottom] = this.zoneStart.position.rearrangedToRectangleLTRB(gridCell.position)
            this.callbacks.onPreviewZone.send(leftTop, rightBottom, this.zoneStart.grid);
        }
    }
    receiveGridCellRelease(gridCell: GridCell){
        console.log('gridCell Released', gridCell.position.asArray())
        if(this.zoneStart?.grid === gridCell.grid){
            const [leftTop, rightBottom] = this.zoneStart.position.rearrangedToRectangleLTRB(gridCell.position)
            this.callbacks.onCreateZone.send(leftTop, rightBottom, this.zoneStart.grid);
            this.callbacks.onPreviewZoneEnd.send(this.zoneStart.grid);
        }
        this.zoneStart = null;
    }
}

const UIModeMap = {
    [UIModeTypes.DefaultUIMode]: DefaultUIMode,
    [UIModeTypes.ZoningUIMode]: ZoningUIMode
}

class UIManager {
    uiMode: UIMode;
    onUIModeChanged: Pulse;
    onPreviewZone: Pulse;
    onPreviewZoneEnd: Pulse;
    onCreateZone: Pulse;

    constructor(){
        this.uiMode = new DefaultUIMode({});
        this.onUIModeChanged = new Pulse();
        this.onPreviewZone = new Pulse();
        this.onPreviewZoneEnd = new Pulse();
        this.onCreateZone = new Pulse();
    }

    receiveGridCellPress(gridCell: GridCell){
        this.uiMode.receiveGridCellPress(gridCell);
    }
    receiveGridCellEnter(gridCell: GridCell){
        this.uiMode.receiveGridCellEnter(gridCell);
    }
    receiveGridCellRelease(gridCell: GridCell){
        this.uiMode.receiveGridCellRelease(gridCell);
    }

    switchUIMode(uiMode: UIModeTypes){
        console.log('switchUIMode');
        this.uiMode = new UIModeMap[uiMode](this.callbacks());
        this.onUIModeChanged.send(this.asData());
    }

    get currentModeType () {
        return this.uiMode.modeType
    }

    asData(){
        return {
            currentModeType: this.currentModeType
        }
    }

    callbacks(){
        return {
            onCreateZone: this.onCreateZone,
            onPreviewZone: this.onPreviewZone,
            onPreviewZoneEnd: this.onPreviewZoneEnd
        }
    }
}

export default UIManager;
