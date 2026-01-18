import { useState, useEffect } from 'react';
import ReportList from './ReportList';
import ReportBuilder from './ReportBuilder';
import { SAVED_REPORTS } from '../data/reports-data';

export default function Reports() {
    // State
    const [reports, setReports] = useState([]);
    const [view, setView] = useState('list'); // 'list' | 'builder'
    const [editingReport, setEditingReport] = useState(null);

    // Load initial data
    useEffect(() => {
        // Simulate fetching from API
        setReports(SAVED_REPORTS);
    }, []);

    // Handlers
    const handleCreateNew = () => {
        setEditingReport(null);
        setView('builder');
    };

    const handleEditReport = (report) => {
        setEditingReport(report);
        setView('builder');
    };

    const handleRunReport = (report) => {
        // For now, running just opens in builder mode with preview step active
        // In a real app, this might open a dedicated "View Report" page
        setEditingReport(report);
        setView('builder');
    };

    const handleDeleteReport = (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            setReports(reports.filter(r => r.id !== reportId));
        }
    };

    const handleSaveReport = (reportConfig) => {
        if (editingReport) {
            // Update existing
            setReports(reports.map(r => r.id === editingReport.id ? { ...r, ...reportConfig, lastRun: 'Just now' } : r));
        } else {
            // Create new
            const newReport = {
                id: Date.now(),
                ...reportConfig,
                lastRun: 'Never',
                createdBy: 'Current User'
            };
            setReports([...reports, newReport]);
        }
        setView('list');
        setEditingReport(null);
    };

    const handleCancelBuilder = () => {
        setView('list');
        setEditingReport(null);
    };

    return (
        <div className="h-full">
            {view === 'list' ? (
                <ReportList
                    reports={reports}
                    onCreateNew={handleCreateNew}
                    onRunReport={handleRunReport}
                    onEditReport={handleEditReport}
                    onDeleteReport={handleDeleteReport}
                />
            ) : (
                <ReportBuilder
                    report={editingReport}
                    onSave={handleSaveReport}
                    onCancel={handleCancelBuilder}
                />
            )}
        </div>
    );
}
