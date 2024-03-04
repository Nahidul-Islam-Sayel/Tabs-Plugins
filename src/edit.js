import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPalette, RangeControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { tabs: initialTabs, tabBackgroundColor, tabTextColor, tabTextSize } = attributes;
    const [tabs, setTabs] = useState(initialTabs);
    const [activeTab, setActiveTab] = useState(null); 
    const [selectedContent, setSelectedContent] = useState(null); // State to track if content is selected

    const handleTabClick = (tabId) => {
        setActiveTab(tabId === activeTab ? null : tabId);
        setSelectedContent(null); // Deselect content when a tab is selected
    };

    const handleTabNameChange = (tabId, newName) => {
        const updatedTabs = tabs.map(tab => (tab.id === tabId ? { ...tab, label: newName } : tab));
        setTabs(updatedTabs);
        setAttributes({ tabs: updatedTabs });
    };

    const handleContentChange = (tabId, newContent) => {
        const updatedTabs = tabs.map(tab => (tab.id === tabId ? { ...tab, content: newContent } : tab));
        setTabs(updatedTabs);
        setAttributes({ tabs: updatedTabs });
    };

    const addTab = () => {
        const newTabId = tabs.length + 1;
        const newTab = { id: newTabId, label: __('Tab', 'easy-tabs') + ' ' + newTabId, content: __('Type your content here...', 'easy-tabs') }; // Default content added here
        const updatedTabs = [...tabs, newTab];
        setTabs(updatedTabs);
        setAttributes({ tabs: updatedTabs });
    };

    const removeTab = (tabId) => {
        const updatedTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(updatedTabs);
        setAttributes({ tabs: updatedTabs });
        if (activeTab === tabId) {
            setActiveTab(null); 
        }
    };

    const moveTabRight = (tabId) => {
        const tabToMoveIndex = tabs.findIndex(tab => tab.id === tabId);
        if (tabToMoveIndex < tabs.length - 1) {
            const updatedTabs = [...tabs];
            const temp = updatedTabs[tabToMoveIndex];
            updatedTabs[tabToMoveIndex] = updatedTabs[tabToMoveIndex + 1];
            updatedTabs[tabToMoveIndex + 1] = temp;
            setTabs(updatedTabs);
            setAttributes({ tabs: updatedTabs });
        }
    };

    const moveTabLeft = (tabId) => {
        const tabToMoveIndex = tabs.findIndex(tab => tab.id === tabId);
        if (tabToMoveIndex > 0) {
            const updatedTabs = [...tabs];
            const temp = updatedTabs[tabToMoveIndex];
            updatedTabs[tabToMoveIndex] = updatedTabs[tabToMoveIndex - 1];
            updatedTabs[tabToMoveIndex - 1] = temp;
            setTabs(updatedTabs);
            setAttributes({ tabs: updatedTabs });
        }
    };

    const groupTabsIntoRows = () => {
        const rows = [];
        const numberOfTabsPerRow = 5;
        for (let i = 0; i < tabs.length; i += numberOfTabsPerRow) {
            rows.push(tabs.slice(i, i + numberOfTabsPerRow));
        }
        return rows;
    };

    const onBackgroundColorChange = (newColor) => {
        setAttributes({ tabBackgroundColor: newColor });
    };

    const onTextColorChange = (newColor) => {
        setAttributes({ tabTextColor: newColor });
    };

    const onTextSizeChange = (newSize) => {
        setAttributes({ tabTextSize: newSize });
    };

    return (
        <div {...useBlockProps()}>
            {activeTab && ( // Render InspectorPanel only if a tab is active
                <InspectorControls>
                    <PanelBody title={__('Tab Options')}>
                        <ColorPalette
                            value={tabBackgroundColor}
                            onChange={onBackgroundColorChange}
                            label={__('Background Color')}
                        />
                        <ColorPalette
                            value={tabTextColor}
                            onChange={onTextColorChange}
                            label={__('Text Color')}
                        />
                        <RangeControl
                            value={tabTextSize}
                            onChange={onTextSizeChange}
                            label={__('Text Size')}
                            min={10}
                            max={30}
                        />
                    </PanelBody>
                </InspectorControls>
            )}
            <div className="easy-tabs">
                {groupTabsIntoRows().map((row, index) => (
                    <ul key={index} className="easy-tabs-nav">
                        {row.map((tab, tabIndex) => (
                            <li
                                key={tab.id}
                                className={`easy-tabs-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab.id)}
                                style={{
                                    backgroundColor: tabBackgroundColor,
                                    color: tabTextColor,
                                    fontSize: `${tabTextSize}px`
                                }}
                            >
                                <RichText
                                    tagName="span"
                                    value={tab.label}
                                    onChange={(newName) => handleTabNameChange(tab.id, newName)}
                                />
                                {activeTab === tab.id && (
                                    <div className="tab-actions">
                                        {tabIndex !== 0 && (
                                            <button className="move-left" onClick={() => moveTabLeft(tab.id)}>←</button>
                                        )}
                                        {tabIndex !== row.length - 1 && (
                                            <button className="move-right" onClick={() => moveTabRight(tab.id)}>→</button>
                                        )}
                                        <div className="options-box">
                                            <button className="remove-tab" onClick={() => removeTab(tab.id)}>×</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                        {index === 0 && (
                            <li className="add-tab">
                                <button onClick={addTab}>+</button>
                            </li>
                        )}
                    </ul>
                ))}
                <div className="easy-tabs-content">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`easy-tabs-pane ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <RichText
                                tagName="div"
                                value={tab.content}
                                onChange={(content) => handleContentChange(tab.id, content)}
                                placeholder={__('Type your content here...', 'easy-tabs')} // Placeholder added here
                                onFocus={() => setSelectedContent(tab.id)} // Set selected content
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
