import {useState, useEffect, useCallback} from "react";
import { useAuth } from "../context/AuthContext";
import InteractiveMap from "../components/InteractiveMap";
import TableEditor from "../components/TableEditor";
import { toast } from "react-toastify";
import api from "../config/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { PlusCircle, RotateCcw, Save, Edit2 } from 'lucide-react';
import {connectWebSocket} from "@/config/websocketConfig.jsx";

const TableManagementPage = () => {
    const { user } = useAuth();
    const [tables, setTables] = useState([]);
    const [originalTables, setOriginalTables] = useState([]);
    const [modifiedTables, setModifiedTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const fetchTables = useCallback(async () => {
        if (!user?.companyId) {
            setError("No company ID found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/tables/company/${user.companyId}`);
            setTables(response.data);
            setOriginalTables(JSON.parse(JSON.stringify(response.data)));
            setError(null);
        } catch (err) {
            console.error("Error fetching tables:", err);
            setError("Failed to load tables");
        } finally {
            setLoading(false);
        }
    }, [user?.companyId]);
    // Fetch tables on mount and when user changes
    useEffect(() => {
        if (!user?.companyId) return;

        const handleTableUpdate = (updatedTable) => {
            console.log('Received table update:', updatedTable);
            setTables(prevTables =>
                prevTables.map(table =>
                    table.id === updatedTable.id ? { ...table, ...updatedTable } : table
                )
            );
            setOriginalTables(prevTables =>
                prevTables.map(table =>
                    table.id === updatedTable.id ? { ...table, ...updatedTable } : table
                )
            );
        };

        const cleanup = connectWebSocket(
            user.companyId,
            handleTableUpdate,
            notification => {
                if (notification.type === 'TABLE_STATUS_CHANGED') {
                    fetchTables();
                }
            }
        );

        return () => {
            if (cleanup) cleanup();
        };
    }, [user?.companyId, fetchTables]);

    useEffect(() => {
        fetchTables();
    }, [fetchTables]);

    // Handle table position updates
    const handleTablePositionUpdate = async (tableId, newPosition) => {
        const updatedPosition = {
            xPosition: Math.round(Number(newPosition.x)),
            yPosition: Math.round(Number(newPosition.y))
        };

        setTables(prevTables =>
            prevTables.map(table =>
                table.id === tableId
                    ? { ...table, ...updatedPosition }
                    : table
            )
        );

        setModifiedTables(prev => {
            const existingIndex = prev.findIndex(t => t.id === tableId);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    ...updatedPosition
                };
                return updated;
            }
            return [...prev, { id: tableId, ...updatedPosition }];
        });
    };


    // Save table updates
    const handleSaveTable = async (updatedTable) => {
        try {
            const tableUpdate = {
                id: updatedTable.id,
                tableNumber: updatedTable.tableNumber,
                capacity: parseInt(updatedTable.capacity),
                shape: updatedTable.shape,
                status: updatedTable.status,
                isOutdoor: updatedTable.isOutdoor,
                xPosition: updatedTable.xPosition,
                yPosition: updatedTable.yPosition,
                companyId: user.companyId
            };

            const response = await api.put(
                `/tables/${updatedTable.id}`,
                tableUpdate,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (response.status === 200) {
                setTables(prevTables =>
                    prevTables.map(table =>
                        table.id === updatedTable.id
                            ? { ...table, ...tableUpdate }
                            : table
                    )
                );
                setOriginalTables(prevTables =>
                    prevTables.map(table =>
                        table.id === updatedTable.id
                            ? { ...table, ...tableUpdate }
                            : table
                    )
                );
                toast.success("Table updated successfully");
            }
        } catch (error) {
            console.error('Error updating table:', error);
            toast.error(error.response?.data || 'Failed to update table');
        } finally {
            setSelectedTable(null);
        }
    };

    // Save all modified table positions
    const handleSaveChanges = async () => {
        if (modifiedTables.length === 0) {
            toast.info("No changes to save");
            return;
        }

        try {
            const updates = modifiedTables.map((table) => ({
                id: table.id,
                xPosition: Math.round(Number(table.xPosition)),
                yPosition: Math.round(Number(table.yPosition)),
                companyId: user.companyId,
            }));

            const response = await api.put(
                `/tables/company/${user.companyId}/positions`,
                updates,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 200) {
                setModifiedTables([]);
                setOriginalTables(JSON.parse(JSON.stringify(tables)));
                toast.success("Changes saved successfully");
            }
        } catch (err) {
            console.error("Error saving changes:", err);
            toast.error("Failed to save changes");
        }
    };

    // Add new table
    const handleAddTable = async () => {
        if (!user?.companyId) {
            toast.error("No company ID found");
            return;
        }

        try {
            const nextTableNumber = tables.length > 0
                ? `T${Math.max(...tables.map(t => parseInt(t.tableNumber.substring(1)))) + 1}`
                : "T1";

            const newTable = {
                tableNumber: nextTableNumber,
                capacity: 4,
                xPosition: 100,
                yPosition: 100,
                shape: "CIRCLE",
                status: "AVAILABLE",
                companyId: user.companyId,
                isOutdoor: false,
                floorLevel: 1,
                rotation: 0,
            };

            const response = await api.post(
                `/tables/company/${user.companyId}`,
                newTable,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (response.data) {
                const updatedTables = [...tables, response.data];
                setTables(updatedTables);
                setOriginalTables(JSON.parse(JSON.stringify(updatedTables)));
                toast.success("Table added successfully");
            }
        } catch (err) {
            console.error("Error adding table:", err);
            toast.error(err.response?.data || "Failed to add table");
        }
    };

    // Delete table
    const handleDeleteTable = async (tableId) => {
        if (!window.confirm('Are you sure you want to delete this table?')) {
            return;
        }

        try {
            await api.delete(`/tables/${tableId}`);
            setTables(prev => prev.filter(t => t.id !== tableId));
            setOriginalTables(prev => prev.filter(t => t.id !== tableId));
            setModifiedTables(prev => prev.filter(t => t.id !== tableId));
            toast.success("Table deleted successfully");
            setSelectedTable(null);
        } catch (err) {
            console.error("Error deleting table:", err);
            toast.error("Failed to delete table");
        }
    };

    // Undo all changes
    const handleUndoChanges = () => {
        setTables(JSON.parse(JSON.stringify(originalTables)));
        setModifiedTables([]);
        toast.info("Changes undone");
    };

    if (loading) return <LoadingSpinner message="Loading tables..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Table Management</h1>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddTable}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            <PlusCircle size={20} className="mr-2" />
                            Add Table
                        </button>
                        <button
                            onClick={handleUndoChanges}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            <RotateCcw size={20} className="mr-2" />
                            Undo Changes
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            <Save size={20} className="mr-2" />
                            Save Changes
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Edit2 size={20} className="mr-2" />
                        Edit Map
                    </button>
                )}
            </div>

            <InteractiveMap
                tables={tables}
                modifiedTables={modifiedTables}
                onTablePositionUpdate={handleTablePositionUpdate}
                onTableSelect={setSelectedTable}
                mode={isEditing ? "edit" : "view"}
            />

            {selectedTable && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <TableEditor
                        table={selectedTable}
                        onClose={() => setSelectedTable(null)}
                        onSave={handleSaveTable}
                        onDelete={handleDeleteTable}
                    />
                </div>
            )}
        </div>
    );
};

export default TableManagementPage;