import React, { useState } from 'react';
import { useBackendGenerator } from '../hooks/useBackendGenerator';
import type { APIResourceConfig, APIField, APIGenerationOptions } from '../types/backendGenerator';

type GenerationType = 'model' | 'service' | 'controller' | 'routes' | 'validation' | 'complete';

export const BackendGeneratorComponent: React.FC = () => {
  const { code, loading, error, generateModel, generateService, generateController, generateRoutes, generateValidation, generateCompleteAPI, copyToClipboard } = useBackendGenerator();
  const [activeTab, setActiveTab] = useState<GenerationType>('complete');

  const [resourceConfig, setResourceConfig] = useState<APIResourceConfig>({
    name: 'User',
    pluralName: 'users',
    fields: [
      { name: 'email', type: 'email', required: true, unique: true },
      { name: 'password', type: 'string', required: true, minLength: 6 },
      { name: 'firstName', type: 'string', required: true },
      { name: 'lastName', type: 'string', required: true },
      { name: 'role', type: 'enum', enum: ['user', 'admin'], default: 'user' },
      { name: 'isActive', type: 'boolean', default: true },
    ],
    timestamps: true,
    softDelete: false,
    validation: 'joi',
    database: 'mongodb',
  });

  const [options, setOptions] = useState<APIGenerationOptions>({
    includePagination: true,
    includeSearch: true,
    includeFiltering: true,
    includeValidation: true,
    includeSorting: true,
    routes: ['create', 'read', 'update', 'delete', 'list'],
  });

  const handleAddField = () => {
    setResourceConfig({
      ...resourceConfig,
      fields: [...resourceConfig.fields, { name: '', type: 'string', required: false }],
    });
  };

  const handleRemoveField = (index: number) => {
    const newFields = resourceConfig.fields.filter((_, i) => i !== index);
    setResourceConfig({ ...resourceConfig, fields: newFields });
  };

  const handleFieldChange = (index: number, key: keyof APIField, value: any) => {
    const newFields = [...resourceConfig.fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setResourceConfig({ ...resourceConfig, fields: newFields });
  };

  const handleGenerate = async () => {
    try {
      switch (activeTab) {
        case 'model':
          await generateModel(resourceConfig, options);
          break;
        case 'service':
          await generateService(resourceConfig, options);
          break;
        case 'controller':
          await generateController(resourceConfig, options);
          break;
        case 'routes':
          await generateRoutes(resourceConfig, options);
          break;
        case 'validation':
          await generateValidation(resourceConfig);
          break;
        case 'complete':
          await generateCompleteAPI(resourceConfig, options);
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Backend API Generator</h1>
          <p className="text-gray-600 mt-2">Generate Express routes, controllers, services, and MongoDB models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration</h2>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['model', 'service', 'controller', 'routes', 'validation', 'complete'] as GenerationType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-sm rounded font-medium transition ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Resource Config */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name (singular)</label>
                  <input
                    type="text"
                    value={resourceConfig.name}
                    onChange={(e) => setResourceConfig({ ...resourceConfig, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name (plural)</label>
                  <input
                    type="text"
                    value={resourceConfig.pluralName}
                    onChange={(e) => setResourceConfig({ ...resourceConfig, pluralName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={resourceConfig.timestamps}
                    onChange={(e) => setResourceConfig({ ...resourceConfig, timestamps: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include Timestamps</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={resourceConfig.softDelete}
                    onChange={(e) => setResourceConfig({ ...resourceConfig, softDelete: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Soft Delete Support</span>
                </label>
              </div>

              {/* Options */}
              <div className="border-t pt-4 space-y-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700">Features</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includePagination}
                    onChange={(e) => setOptions({ ...options, includePagination: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Pagination</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeSearch}
                    onChange={(e) => setOptions({ ...options, includeSearch: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Search</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeFiltering}
                    onChange={(e) => setOptions({ ...options, includeFiltering: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Filtering</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.includeSorting}
                    onChange={(e) => setOptions({ ...options, includeSorting: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Sorting</span>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded"
              >
                {loading ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2">
            {/* Fields Configuration */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Fields ({resourceConfig.fields.length})</h2>
                <button
                  onClick={handleAddField}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-sm"
                >
                  + Add Field
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {resourceConfig.fields.map((field, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Field name"
                        value={field.name}
                        onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="email">Email</option>
                        <option value="enum">Enum</option>
                        <option value="reference">Reference</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                          className="mr-1"
                        />
                        Required
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={field.unique}
                          onChange={(e) => handleFieldChange(idx, 'unique', e.target.checked)}
                          className="mr-1"
                        />
                        Unique
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={field.indexed}
                          onChange={(e) => handleFieldChange(idx, 'indexed', e.target.checked)}
                          className="mr-1"
                        />
                        Indexed
                      </label>
                      <button
                        onClick={() => handleRemoveField(idx)}
                        className="ml-auto px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Output */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Generated Code</h2>
                {code && (
                  <button
                    onClick={() => {
                      const codeContent = code.model || code.service || code.controller || code.routes || code.validation || '';
                      copyToClipboard(codeContent);
                    }}
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
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                    <span className="text-sm font-mono text-gray-300">{activeTab}.ts</span>
                  </div>
                  <pre className="p-4 text-xs text-gray-100 overflow-x-auto max-h-96">
                    <code>
                      {code.model || code.service || code.controller || code.routes || code.validation || ''}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Configure fields and click Generate to see code</p>
                </div>
              )}

              {/* Export Options */}
              {code && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      const codeContent = code.model || code.service || code.controller || code.routes || code.validation || '';
                      const blob = new Blob([codeContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${activeTab}.ts`;
                      a.click();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm"
                  >
                    Download File
                  </button>
                  {code.type === 'complete' && (
                    <button
                      onClick={() => {
                        const allCode = {
                          model: code.model,
                          service: code.service,
                          controller: code.controller,
                          routes: code.routes,
                          validation: code.validation,
                        };
                        const json = JSON.stringify(allCode, null, 2);
                        const blob = new Blob([json], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${resourceConfig.name.toLowerCase()}-api.json`;
                        a.click();
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded text-sm"
                    >
                      Download Complete API
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendGeneratorComponent;
