import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import SectionTitle from '../Home/SectionTitle';
import ScreenshotModal from './ScreenshotModal';

const styles = makeStyles({
    container: {
        height: 300,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingLeft: 60,
        paddingRight: 60
    },

    screenshotImage: {
        maxHeight: '100%',
        minHeight: '100%',
        width: 'auto',
        backgroundColor: 'black',
        marginRight: 20,
        objectFit: 'contain',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0px 2px 3px 3px rgba(0,0,0,.2)',
        },
    },

    inline: {
        display: 'inline'
    },

    heading: {
        marginLeft: 60,
    },

    navigationArrowsContainer: {
        position: 'relative'
    },

    leftArrow: {
        left: 10,
        transform: 'rotate(180deg)'
    },

    rightArrow: {
        right: 10
    },

    navArrow: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,.6)',
        height: 80,
        width: 60,
        top: 100,
        fontSize: 40,
        color: 'black',
        margin: 0,
        padding: 0,
        lineHeight: 0,
        outline: 'none !important',
        backgroundImage: 'url(/imgs/scrollArrow.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '40px 40px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,.8)',
        }
    }

});


const GameDetailsScreenshots = (props) => {
    const classes = styles();
    let screenshotCards = null;
    const [showScreenshotModal, setShowScreenshotModal] = useState(false);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);



    useEffect(() => {
        CheckScrollChildren();
    },[])

    function CheckScrollChildren() {
        const scrollView = document.getElementById('screenshotScrollView');
        if (scrollView && scrollView.childElementCount > 0) {

            if (scrollView.scrollWidth > scrollView.offsetWidth) {
                setShowRightArrow(true);
                return;
            }

            for (let i = 0; i < scrollView.childElementCount; i++) {
                if (scrollView.children[i].offsetWidth <= 20) {
                    setTimeout(() => {
                        CheckScrollChildren()
                    }, 10);
                    return;
                }
            }
        } else {
            setTimeout(() => {
                CheckScrollChildren()
            },100);
        }
    }

    const handleClose = () => {
        setShowScreenshotModal(false);
    }

    function OnScroll() {
        const scrollView = document.getElementById('screenshotScrollView');
        if (scrollView.scrollLeft <= 70) {
            setShowLeftArrow(false);
        } else {
            setShowLeftArrow(true);
        }

        if (Math.round(scrollView.scrollWidth - scrollView.scrollLeft) <= scrollView.clientWidth + 70) {
            setShowRightArrow(false);
        } else {
            setShowRightArrow(true);
        }
    }

    const buildScreenshotCard = (data) => {
        data.url = data.url.replace('t_thumb', 't_720p');
        return (
            <div key={data.id} className={classes.inline} onClick={(e) => {
                setScreenshotUrl(data.url);
                setShowScreenshotModal(true);
            }}>
                <img className={classes.screenshotImage} src={data.url} alt='Screenshot' />
            </div>
        );
    };

    screenshotCards = props.data && props.data.map((e) => {
        return buildScreenshotCard(e);
    });

    return (
        <div>
            <div className={classes.heading}>
                <SectionTitle title='Screenshots' />
            </div>
            <div className={classes.navigationArrowsContainer}>

                <div id='screenshotScrollView' className={`${classes.container} noScrollbar`} onScroll={OnScroll}>
                    {screenshotCards}
                </div>
                <label for='left'></label>
                {showLeftArrow &&
                    <button id='left' className={`${classes.leftArrow} ${classes.navArrow}`} onClick={(e) => {
                        const scrollView = document.getElementById('screenshotScrollView');
                        scrollView.scrollTo({
                            top: 0,
                            left: scrollView.scrollLeft - 400,
                            behavior: 'smooth'
                        });
                    }}></button>
                }

                <label for='right'></label>
                {showRightArrow &&
                    <button id='right' className={`${classes.rightArrow} ${classes.navArrow}`} onClick={(e) => {
                        const scrollView = document.getElementById('screenshotScrollView');
                        scrollView.scrollTo({
                            top: 0,
                            left: scrollView.scrollLeft + 400,
                            behavior: 'smooth'
                        });
                    }}></button>
                }
            </div>

            {showScreenshotModal &&
                <ScreenshotModal
                    isOpen={showScreenshotModal}
                    handleClose={handleClose}
                    url={screenshotUrl} />}
        </div>
    )
}

export default GameDetailsScreenshots;