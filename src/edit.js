import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ColorPalette, RangeControl, SelectControl } from '@wordpress/components';
import { v4 as uuidv4 } from 'uuid'; 
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { tabs: initialTabs, tabBackgroundColor, tabTextColor, tabTextSize, contentTextColor, contentBackgroundColor, contentTextSize, contentAlignment } = attributes;
    const [tabs, setTabs] = useState(initialTabs);
    const [activeTab, setActiveTab] = useState(null); 
    const [selectedContent, setSelectedContent] = useState(null); 

    const handleTabClick = (tabId) => {
        setActiveTab(tabId === activeTab ? null : tabId);
        setSelectedContent(null); 
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
        const newTabId = uuidv4(); 
        const newTab = { id: newTabId, label: __('New Tab', 'easy-tabs'), content: __('Type your content here...', 'easy-tabs') }; 
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

    const onContentBackgroundColorChange = (newColor) => {
        setAttributes({ contentBackgroundColor: newColor });
    };

    const onContentTextColorChange = (newColor) => {
        setAttributes({ contentTextColor: newColor });
    };

    const onContentTextSizeChange = (newSize) => {
        setAttributes({ contentTextSize: newSize });
    };

    const onContentAlignmentChange = (newAlignment) => {
        setAttributes({ contentAlignment: newAlignment });
    };

    return (
        <div {...useBlockProps()}>
            {activeTab && ( 
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
                    <PanelBody title={__('Content Options')}>
                        <ColorPalette
                            value={contentBackgroundColor}
                            onChange={onContentBackgroundColorChange}
                            label={__('Content Background Color')}
                        />
                        <ColorPalette
                            value={contentTextColor}
                            onChange={onContentTextColorChange}
                            label={__('Content Text Color')}
                        />
                        <RangeControl
                            value={contentTextSize}
                            onChange={onContentTextSizeChange}
                            label={__('Content Text Size')}
                            min={10}
                            max={30}
                        />
                        <SelectControl
                            value={contentAlignment}
                            onChange={onContentAlignmentChange}
                            options={[
                                { label: __('Left'), value: 'left' },
                                { label: __('Center'), value: 'center' },
                                { label: __('Right'), value: 'right' },
                            ]}
                            label={__('Content Alignment')}
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
                            style={{
                                backgroundColor: contentBackgroundColor,
                                color: contentTextColor,
                                fontSize: `${contentTextSize}px`,
                                textAlign: contentAlignment,
                            }}
                        >
                            <RichText
                                tagName="div"
                                value={tab.content}
                                onChange={(content) => handleContentChange(tab.id, content)}
                                placeholder={__('Type your content here...', 'easy-tabs')} 
                                onFocus={() => setSelectedContent(tab.id)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
