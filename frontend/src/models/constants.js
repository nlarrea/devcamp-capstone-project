import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import welcomeSvg1 from '../static/images/welcomePage/welcomeSvg1.svg';
import welcomeSvg3 from '../static/images/welcomePage/welcomeSvg3.svg';
import welcomeSvg4 from '../static/images/welcomePage/welcomeSvg4.svg';


/**
 * The content that is going to be displayed in the app's home page's carousel.
 */
export const HOME_CONTENT = [
    {
        image: welcomeSvg1,
        text: 'You have 5 minutes to spare, you want to read something but you don\'t know what? You\'re where you need to be! The perfect place to disconnect from everything and read a lot of stories written by people from all over the world!',
    },
    {
        image: welcomeSvg4,
        text: 'Do you have a lot of stories you want to share with the world? Make a name for yourself on this platform and let people know about you.'
    },
    {
        image: welcomeSvg3,
        text: 'Are you tired of reading from your computer? Do you want to keep reading your favorite histories from any places? Try the web site not only from anywhere but from any device!'
    }
];


/**
 * Different ways to display buttons content.
 */
export const TYPES = {
    text: 'text',
    textIcon: 'textIcon',
    iconText: 'iconText',
    icon: 'icon'
};


/**
 * Gets the text and the icon to be displayed in a span and icon pair. The icon
 * is not mandatory.
 * @param {String} textToDisplay 
 * @param {String} iconName 
 * @returns Object with the different React component distribution.
 */
export const DISPLAY_TYPE = (textToDisplay, iconName='') => {
    return {
        textIcon: (
            <>
                <span>{textToDisplay}</span>
                <FontAwesomeIcon icon={iconName} fixedWidth />
            </>
        ),
        iconText: (
            <>
                <FontAwesomeIcon icon={iconName} fixedWidth />
                <span>{textToDisplay}</span>
            </>
        ),
        text: <>{textToDisplay}</>,
        icon: <FontAwesomeIcon icon={iconName} fixedWidth />
    }
}


/**
 * The amount of allowed chars for usernames and passwords.
 */
export const nChars = {
    username: {
        min: 6,
        max: 20
    },
    password: {
        min: 8,
        max: 30
    }
};


/**
 * The different types of loaders used in this app.
 */
export const LOADER_TYPES = {
    page: 'page-loader',
    content: 'content-loader'
};