import './ItemStyle.css';

import React, { useEffect, useState } from 'react';
import { Item } from '../../../engine/Item';

interface ItemProps {
    item: Item
}

const ItemComponent = (props: ItemProps) => {
    const { item } = props;

    const [itemData, setItemData] = useState(item.asData());

    useEffect(() => {
        item.onChanged.add(setItemData);
        return () => {item.onChanged.remove(setItemData)};
    }, [item.onChanged]);

    const className = [
        'Item',
        ...(itemData.types || []),
        itemData.claims.length > 0 ? 'claimed' : ''
    ].filter(classNameSegment => classNameSegment.length > 0).join(' ');

    return <div
        className={className}
    >

    </div>
}

export default ItemComponent;
