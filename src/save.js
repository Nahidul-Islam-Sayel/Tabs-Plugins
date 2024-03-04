import { useBlockProps, RichText } from '@wordpress/block-editor';
import $ from 'jquery'; // Import jQuery

export default function save({ attributes }) {
    const { tabs, tabBackgroundColor, tabTextColor, tabTextSize } = attributes;

    // Function to handle tab click event
    const handleTabClick = (event) => {
		console.log('helloo')
    };

    return (
        <div { ...useBlockProps.save() }>
            <div className="easy-tabs" >
                <ul className="easy-tabs-nav"  >
                    {tabs.map(tab => (
                        <li
                            key={tab.id}
                            className={`easy-tabs-tab ${tab.id === 1 ? 'active' : ''}`}
                            data-tab-id={tab.id}
                            onClick={handleTabClick} // Attach click event
                            style={{ color: tabTextColor, fontSize: `${tabTextSize}px` , backgroundColor: tabBackgroundColor }}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
                <div className="easy-tabs-content">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`easy-tabs-pane ${tab.id === 1 ? 'active' : ''}`}
                            data-tab-id={tab.id}
                            style={{ color: tabTextColor, fontSize: `${tabTextSize}px` }}
                        >
                            <RichText.Content value={tab.content} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
