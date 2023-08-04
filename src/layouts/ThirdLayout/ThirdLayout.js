import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Header } from '../../components/'

import './ThirdLayout.scss';

function ThirdLayout( {children} ) {
    const authenticated = useSelector(state => state.user);
    if (!authenticated) {
        Navigate({to: "/auth/login"});
        return;
    }
    return ( 
        <>
            <Header />
            <div className="wrapper-noMargin">
                { children }
            </div>
        </>
    );
}

export default ThirdLayout;