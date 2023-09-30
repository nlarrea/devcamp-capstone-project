import welcomeSvg1 from '../static/images/welcomePage/welcomeSvg1.svg';
import welcomeSvg2 from '../static/images/welcomePage/welcomeSvg2.svg';
import welcomeSvg3 from '../static/images/welcomePage/welcomeSvg3.svg';
import welcomeSvg4 from '../static/images/welcomePage/welcomeSvg4.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const HOME_CONTENT = [
    {
        image: welcomeSvg1,
        text: 'You have 5 minutes to spare, you want to read something but you don\'t know what? You\'re where you need to be! The perfect place to disconnect from everything and read a lot of stories written by people from all over the world!',
    },
    {
        image: welcomeSvg2,
        text: 'Do you have a lot of stories you want to share with the world? Make a name for yourself on this platform and let people know about you.'
    },
    {
        image: welcomeSvg3,
        text: 'Are you tired of reading from your computer? Do you want to keep reading your favorite histories from any places? Try the web site not only from anywhere but from any device!'
    },
    {
        image: welcomeSvg4,
        text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt minima cupiditate dolores voluptatem sed illum inventore ab autem blanditiis. Possimus ducimus nulla aliquid omnis aspernatur.'
    }
];

export const TYPES = {
    text: 'text',
    img: 'image'
};

export const DISPLAY_TYPE = (textToDisplay, iconName='') => {
    return {
        textIcon: (
            <>
                {textToDisplay}
                <FontAwesomeIcon icon={iconName} fixedWidth />
            </>
        ),
        iconText: (
            <>
                <FontAwesomeIcon icon={iconName} fixedWidth />
                {textToDisplay}
            </>
        ),
        text: <>{textToDisplay}</>,
        icon: <FontAwesomeIcon icon={iconName} fixedWidth />
    }
}