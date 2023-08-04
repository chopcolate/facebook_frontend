import './MainLayout.scss';
import { Header } from '../../components';
import { Sidebar } from '../../features';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function MainLayout( {children} ) {
    const authenticated = useSelector(state => state.user);
    if (!authenticated) {
        Navigate({to: "/auth/login"});
        return;
    }
    return ( 
        <>
            <Header />
            <div className="wrapper">
                <Sidebar />
                {children}
            </div>
        </>
     );
}

export default MainLayout;