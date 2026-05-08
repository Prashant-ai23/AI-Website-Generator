import React, { useState } from 'react';
import { useCodeGenerator } from '../hooks/useCodeGenerator';
import type { PageConfig, FormConfig, TableConfig, LayoutConfig, RoutingConfig } from '../types/codeGenerator';

type GenerationType = 'page' | 'form' | 'table' | 'layout' | 'routing';

export const CodeGeneratorComponent: React.FC = () => {
  const { code, loading, error, generatePage, generateForm, generateTable, generateLayout, generateRouting, copyToClipboard } = useCodeGenerator();
  const [activeTab, setActiveTab] = useState<GenerationType>('page');
  const [stylingLib, setStylingLib] = useState<'tailwind' | 'mui'>('tailwind');

  // Page config state
  const [pageConfig, setPageConfig] = useState<PageConfig>({
    name: 'HomePage',
    title: 'Welcome to My App',
    styling: 'tailwind',
    sections: ['Features', 'Benefits'],
  });

  // Form config state
  const [formConfig, setFormConfig] = useState<FormConfig>({
    name: 'LoginForm',
    styling: 'tailwind',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password', required: true },
    ],
  });

  // Table config state
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    name: 'UsersTable',
    styling: 'tailwind',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ],
    actions: ['view', 'edit', 'delete'],
  });

  // Layout config state
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    name: 'AppLayout',
    styling: 'tailwind',
    type: 'header-footer',
    hasNavigation: true,
    navigationItems: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
  });

  // Routing config state
  const [routingConfig, setRoutingConfig] = useState<RoutingConfig>({
    styling: 'tailwind',
    routes: [
      { path: '/', name: 'Home', component: 'pages/Home' },
      { path: '/about', name: 'About', component: 'pages/About' },
      { path: '/dashboard', name: 'Dashboard', component: 'pages/Dashboard', protected: true },
    ],
  });

  const handleGeneratePage = async () => {
    try {
      await generatePage({ ...pageConfig, styling: stylingLib });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateForm = async () => {
    try {
      await generateForm({ ...formConfig, styling: stylingLib });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateTable = async () => {
    try {
      await generateTable({ ...tableConfig, styling: stylingLib });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateLayout = async () => {
    try {
      await generateLayout({ ...layoutConfig, styling: stylingLib });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateRouting = async () => {
    try {
      await generateRouting({ ...routingConfig, styling: stylingLib });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">React Code Generator</h1>
          <p className="text-gray-600 mt-2">Generate React components with Tailwind CSS or Material-UI</p>
        </div>

        {/* Styling Library Selector */}
        <div className="mb-6 flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="styling"
              value="tailwind"
              checked={stylingLib === 'tailwind'}
              onChange={(e) => setStylingLib(e.target.value as any)}
              className="mr-2"
            />
            <span className="font-medium text-gray-700">Tailwind CSS</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="styling"
              value="mui"
              checked={stylingLib === 'mui'}
              onChange={(e) => setStylingLib(e.target.value as any)}
              className="mr-2"
            />
            <span className="font-medium text-gray-700">Material-UI</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Generator</h2>

              {/* Tabs */}
              <div className="flex flex-col gap-2 mb-6">
                {(['page', 'form', 'table', 'layout', 'routing'] as GenerationType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded font-medium transition ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Configuration Forms */}
              <div className="space-y-4">
                {activeTab === 'page' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
                      <input
                        type="text"
                        value={pageConfig.name}
                        onChange={(e) => setPageConfig({ ...pageConfig, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                      <input
                        type="text"
                        value={pageConfig.title}
                        onChange={(e) => setPageConfig({ ...pageConfig, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleGeneratePage}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
                    >
                      {loading ? 'Generating...' : 'Generate Page'}
                    </button>
                  </>
                )}

                {activeTab === 'form' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
                      <input
                        type="text"
                        value={formConfig.name}
                        onChange={(e) => setFormConfig({ ...formConfig, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Count: {formConfig.fields.length}</label>
                      <button
                        onClick={() =>
                          setFormConfig({
                            ...formConfig,
                            fields: [...formConfig.fields, { name: '', label: '', type: 'text' }],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200"
                      >
                        + Add Field
                      </button>
                    </div>
                    <button
                      onClick={handleGenerateForm}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
                    >
                      {loading ? 'Generating...' : 'Generate Form'}
                    </button>
                  </>
                )}

                {activeTab === 'table' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
                      <input
                        type="text"
                        value={tableConfig.name}
                        onChange={(e) => setTableConfig({ ...tableConfig, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Column Count: {tableConfig.columns.length}</label>
                      <button
                        onClick={() =>
                          setTableConfig({
                            ...tableConfig,
                            columns: [...tableConfig.columns, { key: '', label: '' }],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200"
                      >
                        + Add Column
                      </button>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tableConfig.sortable}
                        onChange={(e) => setTableConfig({ ...tableConfig, sortable: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Sortable</span>
                    </label>
                    <button
                      onClick={handleGenerateTable}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
                    >
                      {loading ? 'Generating...' : 'Generate Table'}
                    </button>
                  </>
                )}

                {activeTab === 'layout' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Component Name</label>
                      <input
                        type="text"
                        value={layoutConfig.name}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Layout Type</label>
                      <select
                        value={layoutConfig.type}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="header-footer">Header & Footer</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="two-column">Two Column</option>
                        <option value="three-column">Three Column</option>
                      </select>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={layoutConfig.hasNavigation}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, hasNavigation: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Include Navigation</span>
                    </label>
                    <button
                      onClick={handleGenerateLayout}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
                    >
                      {loading ? 'Generating...' : 'Generate Layout'}
                    </button>
                  </>
                )}

                {activeTab === 'routing' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Routes: {routingConfig.routes.length}</label>
                      <button
                        onClick={() =>
                          setRoutingConfig({
                            ...routingConfig,
                            routes: [...routingConfig.routes, { path: '', name: '', component: '' }],
                          })
                        }
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200"
                      >
                        + Add Route
                      </button>
                    </div>
                    <button
                      onClick={handleGenerateRouting}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
                    >
                      {loading ? 'Generating...' : 'Generate Routing'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Code Output Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Generated Code</h2>
                {code && (
                  <button
                    onClick={() => copyToClipboard(code.code)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-sm"
                  >
                    Copy Code
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {code ? (
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700">
                    <span className="text-sm font-mono text-gray-300">{code.framework}.tsx</span>
                    <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">{code.styling}</span>
                  </div>
                  <pre className="p-4 text-sm text-gray-100 overflow-x-auto max-h-96">
                    <code>{code.code}</code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Select a component type and click generate to see the code</p>
                </div>
              )}
            </div>

            {/* Export Options */}
            {code && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Export Options</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const blob = new Blob([code.code], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `component.${code.language === 'typescript' ? 'tsx' : 'jsx'}`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm"
                  >
                    Download Component
                  </button>
                  <button
                    onClick={() => {
                      const json = JSON.stringify({ code: code.code, ...code }, null, 2);
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'component.json';
                      a.click();
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded text-sm"
                  >
                    Export Config
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGeneratorComponent;
