import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { tabs, activeTab } = attributes;
  { tabs&& tabs.map(tab=>console.log(tab.content))}
    return (
        <div { ...useBlockProps.save() }>
            <div className="easy-tabs">
                <ul className="easy-tabs-nav">
                    {tabs.map(tab => (
                        <li
                            key={tab.id}
                            className={`easy-tabs-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
                <div className="easy-tabs-content">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`easy-tabs-pane ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            {activeTab === tab.id && <RichText.Content value={tab.content} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
