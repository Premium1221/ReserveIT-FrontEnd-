
import PropTypes from 'prop-types';
import './SliderHeader.css';

const SliderHeader = ({ title, link }) => {
    return (
        <div className="slider-header">
            <h2>{title}</h2>
            {link && <a href={link} className="see-all">See all</a>}
        </div>
    );
};

SliderHeader.propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
};

export default SliderHeader;
