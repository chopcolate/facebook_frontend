
import './Popup.scss';

function Popup( { children } ) {
    return ( 
        <div className="popup" onClick={(e) => e.stopPropagation()}>
            {
                children.map((item, index) => {
                    return (
                        <p className="noti-item" key={index}>{item}</p>
                    )
                })
            }
        </div>
     );
}

export default Popup;