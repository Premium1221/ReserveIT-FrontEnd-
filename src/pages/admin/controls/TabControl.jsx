import PropTypes from 'prop-types';
import './TabControl.css';

const TabControl = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="tab-controls" data-testid="tab-controls">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'active-tab' : ''}
                    onClick={() => onTabChange(tab.id)}
                    data-testid={tab.testId}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

TabControl.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired
};

export default TabControl;