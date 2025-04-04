import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "md" }) => {
    const sizeClass = `loading-${size}`;

    return <span className={`loading loading-spinner ${sizeClass}`} />;
};

LoadingSpinner.propTypes = {
    size: PropTypes.string, // Validate 'size' as a string
};

export default LoadingSpinner;
