import SwordSlash from './sword-slash.png';
import React from 'react';

import './sword.scss';


class Sword extends React.Component {
    render() {
        return  (
            <div className='sword__slash' style={{
                left: this.props.left,
                backgroundImage: `url('${SwordSlash}')`
            }} />
        ); 
    }
}

export default Sword;
