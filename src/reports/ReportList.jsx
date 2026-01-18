import { FileText, Plus, Search, Filter, MoreVertical, Play, Edit, Trash2 } from 'lucide-react';

export default function ReportList({ reports, onCreateNew, onRunReport, onEditReport, onDeleteReport }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and generate custom reports</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Create New Report</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div className="relative">
                                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{report.description}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                                <span className="px-2 py-1 bg-gray-100 rounded-full font-medium text-gray-600 capitalize">
                                    {report.schema}
                                </span>
                                <span>•</span>
                                <span>Last run: {report.lastRun}</span>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => onRunReport(report)}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Play size={16} />
                                    Run
                                </button>
                                <button
                                    onClick={() => onEditReport(report)}
                                    className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteReport(report.id)}
                                    className="inline-flex items-center justify-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card (Empty State-ish) */}
                {!reports.length && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
                        <p className="text-gray-500 mt-1 mb-6">Get started by creating your first custom report</p>
                        <button
                            onClick={onCreateNew}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Create New Report</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
