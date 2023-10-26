import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { LOADER_TYPES } from "../../models/constants";

const Loader = ({ icon='spinner',  text='Loading...', type=LOADER_TYPES.page }) => {
    return (
        <div className={type}>
            <FontAwesomeIcon icon={icon} fixedWidth spin />
            <span>{text}</span>
        </div>
    );
};


export default Loader;