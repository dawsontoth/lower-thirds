import React from 'react';
import { useLowerThirds } from '../hooks/lower-thirds';
import { cx } from '../utils/cx';
import './logo.scss';

export function Logo() {
    const lowerThirds = useLowerThirds();
    const logoIn = lowerThirds.find(l => !l.out);
    return <div className={ cx('logo', logoIn ? 'in' : 'out') }>TCC</div>;
}
