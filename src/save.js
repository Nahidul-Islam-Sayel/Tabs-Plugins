import { useBlockProps, RichText } from '@wordpress/block-editor';
export default function save({ attributes }) {
    const { tabs, tabBackgroundColor, tabTextColor, tabTextSize, contentBackgroundColor, contentTextColor, contentTextSize, contentAlignment } = attributes;
    const handleTabClick = (event) => {
		console.log('helloo')
    };

    return (
        <div { ...useBlockProps.save() }>
            <div className="easy-tabs">
                <ul className="easy-tabs-nav">
                    {tabs.map(tab => (
                        <li
                            key={tab.id}
                            className={`easy-tabs-tab ${tab.id === attributes.activeTab ? 'active' : ''}`}
                            data-tab-id={tab.id}
                            onClick={handleTabClick} 
                            style={{ color: tabTextColor, fontSize: `${tabTextSize}px`, backgroundColor: tabBackgroundColor }}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
                <div className="easy-tabs-content">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`easy-tabs-pane ${tab.id === attributes.activeTab ? 'active' : ''}`}
                            data-tab-id={tab.id}
                            style={{ backgroundColor: contentBackgroundColor, color: contentTextColor, fontSize: `${contentTextSize}px`, textAlign: contentAlignment }}
                        >
                            <RichText.Content value={tab.content} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
