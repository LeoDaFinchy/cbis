import './ItemStyle.css';

import React from 'react';
import { Item } from '../../../engine/Item';

interface ItemProps {
    item: Item
}

const ItemComponent = (props: ItemProps) => {
    const { item } = props;

    const className = [
        'Item',
        ...(item.types || [])
    ].filter(classNameSegment => classNameSegment.length > 0).join(' ');

    return <div
        className={className}
    >

    </div>
}

export default ItemComponent;
