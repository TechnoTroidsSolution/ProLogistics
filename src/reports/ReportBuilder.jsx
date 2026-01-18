import { useState, useEffect } from 'react';
import { REPORT_SCHEMAS, SCHEMA_COLUMNS, generateReportData } from '../data/reports-data';
import {
    ArrowLeft,
    Save,
    Download,
    Database,
    Layout,
    Filter,
    Play,
    ChevronRight,
    Check,
    Plus,
    X,
    FileSpreadsheet
} from 'lucide-react';

export default function ReportBuilder({ report, onSave, onCancel }) {
    // If report is provided, we are editing. Otherwise, default initial state.
    const [activeStep, setActiveStep] = useState(report ? 3 : 1); // 1: Schema, 2: Columns, 3: Filters & Preview

    const [config, setConfig] = useState({
        name: report?.name || '',
        description: report?.description || '',
        schema: report?.schema || '',
        columns: report?.columns || [],
        filters: report?.filters || []
    });

    const [previewData, setPreviewData] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Load initial preview if editing
    useEffect(() => {
        if (report) {
            handleRunQuery();
        }
    }, []);

    const handleSchemaSelect = (schemaId) => {
        setConfig({ ...config, schema: schemaId, columns: [], filters: [] });
        setActiveStep(2);
    };

    const toggleColumn = (colId) => {
        const newColumns = config.columns.includes(colId)
            ? config.columns.filter(id => id !== colId)
            : [...config.columns, colId];
        setConfig({ ...config, columns: newColumns });
    };

    const addFilter = () => {
        const availableCols = SCHEMA_COLUMNS[config.schema] || [];
        if (availableCols.length === 0) return;

        setConfig({
            ...config,
            filters: [
                ...config.filters,
                { column: availableCols[0].id, operator: 'equals', value: '' }
            ]
        });
    };

    const updateFilter = (index, field, value) => {
        const newFilters = [...config.filters];
        newFilters[index] = { ...newFilters[index], [field]: value };
        setConfig({ ...config, filters: newFilters });
    };

    const removeFilter = (index) => {
        const newFilters = config.filters.filter((_, i) => i !== index);
        setConfig({ ...config, filters: newFilters });
    };

    const handleRunQuery = () => {
        if (!config.schema || config.columns.length === 0) return;

        setIsGenerating(true);
        // Simulate API delay
        setTimeout(() => {
            const data = generateReportData(config.schema, config.columns);
            setPreviewData(data);
            setIsGenerating(false);
        }, 800);
    };

    const handleExport = () => {
        // Simulate export
        const blob = new Blob(['Simulated Excel File Content'], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.name || 'report'}_export.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStepStatus = (step) => {
        if (activeStep === step) return 'active';
        if (activeStep > step) return 'completed';
        return 'pending';
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 -m-6 p-6"> {/* Negative margin to break out of container padding if needed, or structured differently */}

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {report ? 'Edit Report' : 'New Custom Report'}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Step {activeStep} of 3</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-blue-600 font-medium">
                                {activeStep === 1 ? 'Select Data Source' : activeStep === 2 ? 'Choose Columns' : 'Filters & Preview'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {activeStep === 3 && (
                        <button
                            onClick={handleExport}
                            disabled={previewData.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileSpreadsheet size={18} className="text-green-600" />
                            <span>Export Excel</span>
                        </button>
                    )}
                    <button
                        onClick={() => onSave(config)}
                        disabled={!config.name || !config.schema || config.columns.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        <span>Save Report</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-6 h-[calc(100vh-200px)]">

                {/* Sidebar / Configuration Panel */}
                <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {/* Progress Steps */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between relative px-2">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-0" />
                            {[1, 2, 3].map((step) => {
                                const status = getStepStatus(step);
                                return (
                                    <button
                                        key={step}
                                        onClick={() => status !== 'pending' && setActiveStep(step)}
                                        disabled={status === 'pending'}
                                        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${status === 'active' ? 'bg-blue-600 text-white ring-4 ring-blue-50' :
                                                status === 'completed' ? 'bg-green-500 text-white' :
                                                    'bg-white border-2 border-gray-300 text-gray-400'
                                            }`}
                                    >
                                        {status === 'completed' ? <Check size={16} /> : step}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">

                        {/* Step 1: Basic Info & Schema */}
                        {(activeStep === 1 || activeStep > 1) && (
                            <div className={`space-y-4 mb-8 ${activeStep !== 1 && 'opacity-50 pointer-events-none'}`}>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                        <Database size={16} /> Data Source
                                    </h3>
                                    {activeStep === 1 ? (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {REPORT_SCHEMAS.map(schema => (
                                                <button
                                                    key={schema.id}
                                                    onClick={() => handleSchemaSelect(schema.id)}
                                                    className={`p-3 text-left rounded-lg border transition-all ${config.schema === schema.id
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100'
                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="font-medium text-sm">{schema.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Check size={14} className="text-green-500" />
                                            {REPORT_SCHEMAS.find(s => s.id === config.schema)?.name} Selected
                                        </div>
                                    )}
                                </div>

                                {activeStep === 1 && (
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                                            <input
                                                type="text"
                                                value={config.name}
                                                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                                                placeholder="e.g., Weekly Driver Efficiency"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                            <textarea
                                                value={config.description}
                                                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                                                placeholder="Brief description of the report..."
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Columns */}
                        {(activeStep === 2 || activeStep > 2) && (
                            <div className={`space-y-4 mb-8 ${activeStep !== 2 && 'hidden'}`}>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                    <Layout size={16} /> Select Columns
                                </h3>
                                <div className="space-y-2">
                                    {config.schema && SCHEMA_COLUMNS[config.schema].map((col) => (
                                        <label
                                            key={col.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${config.columns.includes(col.id)
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${config.columns.includes(col.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'
                                                }`}>
                                                {config.columns.includes(col.id) && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={config.columns.includes(col.id)}
                                                onChange={() => toggleColumn(col.id)}
                                            />
                                            <span className={`text-sm ${config.columns.includes(col.id) ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                                                {col.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    disabled={config.columns.length === 0}
                                    onClick={() => setActiveStep(3)}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Step 3: Filters (Only visible in step 3 sidebar) */}
                        {activeStep === 3 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                        <Filter size={16} /> Filters
                                    </h3>
                                    <button
                                        onClick={addFilter}
                                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <Plus size={14} /> Add Filter
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {config.filters.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded">No filters applied. Showing all data.</p>
                                    ) : (
                                        config.filters.map((filter, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2 relative group">
                                                <button
                                                    onClick={() => removeFilter(idx)}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>

                                                <select
                                                    value={filter.column}
                                                    onChange={(e) => updateFilter(idx, 'column', e.target.value)}
                                                    className="w-full text-xs p-1.5 border border-gray-300 rounded bg-white"
                                                >
                                                    {SCHEMA_COLUMNS[config.schema]?.map(col => (
                                                        <option key={col.id} value={col.id}>{col.name}</option>
                                                    ))}
                                                </select>

                                                <div className="flex gap-2">
                                                    <select
                                                        value={filter.operator}
                                                        onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                                                        className="w-1/3 text-xs p-1.5 border border-gray-300 rounded bg-white"
                                                    >
                                                        <option value="equals">Equals</option>
                                                        <option value="contains">Contains</option>
                                                        <option value="greater_than">Greater than</option>
                                                        <option value="less_than">Less than</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={filter.value}
                                                        onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                                                        placeholder="Value..."
                                                        className="flex-1 text-xs p-1.5 border border-gray-300 rounded bg-white"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={handleRunQuery}
                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    <Play size={16} /> Run / Refresh Query
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content / Preview Area */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {activeStep === 3 ? (
                        <>
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    Query Results Preview
                                    <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        {previewData.length} records found
                                    </span>
                                </h3>
                            </div>

                            <div className="flex-1 overflow-auto custom-scrollbar">
                                {isGenerating ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="text-sm">Generating preview...</p>
                                    </div>
                                ) : previewData.length > 0 ? (
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                {config.columns.map(colId => {
                                                    const col = SCHEMA_COLUMNS[config.schema]?.find(c => c.id === colId);
                                                    return (
                                                        <th key={colId} className="px-6 py-3 font-medium text-gray-600 border-b">
                                                            {col?.name || colId}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {previewData.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                                    {config.columns.map(colId => (
                                                        <td key={`${row.id}-${colId}`} className="px-6 py-3 text-gray-700">
                                                            {row[colId]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Database size={48} className="text-gray-200 mb-2" />
                                        <p>Click "Run Query" to preview data</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Layout size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Configure your report</h3>
                            <p className="max-w-xs mx-auto">
                                {activeStep === 1
                                    ? "Start by selecting a data source and naming your report."
                                    : "Choose the columns you want to include in your report."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
