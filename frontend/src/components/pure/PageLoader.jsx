import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PageLoader = ({ icon='spinner',  text='Loading...'}) => {
    return (
        <div className="page-loader">
            <FontAwesomeIcon icon={icon} fixedWidth spin />
            <span>{text}</span>
        </div>
    );
};


export default PageLoader;