import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Zap, RotateCw, Trash2, Download, Layers,
    ArrowUp, Play, Square, Shield, Wrench, Search, Database, Hexagon
} from 'lucide-react';

// --- 1. Данные (JSON) ---
const RAW_DATA = {
    "facilities": [
        // --- CORE (New) ---
        {
            "id": "phase_agreement_core",
            "name_en": "Phase Agreement Core",
            "category": "core",
            "width": 9,
            "height": 9,
            "power": 0,
            "description": "Central Hub. Only 1 allowed."
        },

        // Processing (Blue)
        { "id": "refining_unit", "name_en": "Refining Unit", "category": "processing", "width": 3, "height": 3, "power": 5 },
        { "id": "shredding_unit", "name_en": "Shredding Unit", "category": "processing", "width": 3, "height": 3, "power": 5 },
        { "id": "gearing_unit", "name_en": "Gearing Unit", "category": "processing", "width": 6, "height": 4, "power": 10 },
        { "id": "moulding_unit", "name_en": "Moulding Unit", "category": "processing", "width": 3, "height": 3, "power": 10 },
        { "id": "fitting_unit", "name_en": "Fitting Unit", "category": "processing", "width": 3, "height": 3, "power": 20 },
        { "id": "filling_unit", "name_en": "Filling Unit", "category": "processing", "width": 6, "height": 4, "power": 20 },
        { "id": "packaging_unit", "name_en": "Packaging Unit", "category": "processing", "width": 6, "height": 4, "power": 20 },
        { "id": "seed_picking_unit", "name_en": "Seed-Picking Unit", "category": "processing", "width": 5, "height": 5, "power": 10 },
        { "id": "planting_unit", "name_en": "Planting Unit", "category": "processing", "width": 5, "height": 5, "power": 20 },
        { "id": "grinding_unit", "name_en": "Grinding Unit", "category": "processing", "width": 6, "height": 4, "power": 50 },
        { "id": "reactor_crucible", "name_en": "Reactor Crucible", "category": "processing", "width": 5, "height": 5, "power": 50 },
        { "id": "separating_unit", "name_en": "Separating Unit", "category": "processing", "width": 6, "height": 4, "power": 20 },
        { "id": "fluid_supply_unit", "name_en": "Fluid Supply Unit", "category": "processing", "width": 3, "height": 3, "power": 10 },

        // Resourcing (Orange)
        { "id": "electric_mining_rig", "name_en": "Electric Mining Rig", "category": "resourcing", "width": 3, "height": 3, "power": 5 },
        { "id": "electric_mining_rig_mk2", "name_en": "Electric Mining Rig Mk II", "category": "resourcing", "width": 3, "height": 3, "power": 10 },
        { "id": "portable_originium_rig", "name_en": "Portable Originium Rig", "category": "resourcing", "width": 2, "height": 2, "power": 0 },

        // Power (Yellow)
        { "id": "relay_tower", "name_en": "Relay Tower", "category": "power", "width": 3, "height": 3, "power": 0, "radius": 80 },
        { "id": "electric_pylon", "name_en": "Electric Pylon", "category": "power", "width": 2, "height": 2, "power": 0, "radius": 30 },
        { "id": "thermal_bank", "name_en": "Thermal Bank", "category": "power", "width": 2, "height": 2, "power": 0 },
        { "id": "depot_loader", "name_en": "Depot Loader", "category": "power", "width": 1, "height": 3, "power": 0 },
        { "id": "depot_unloader", "name_en": "Depot Unloader", "category": "power", "width": 1, "height": 3, "power": 0 },

        // Combat (Red)
        { "id": "gun_tower", "name_en": "Gun Tower", "category": "combat", "width": 2, "height": 2, "power": 5 },
        { "id": "medical_tower", "name_en": "Medical Tower", "category": "combat", "width": 3, "height": 3, "power": 5 },
        { "id": "grenade_tower", "name_en": "Grenade Tower", "category": "combat", "width": 2, "height": 2, "power": 10 },
        { "id": "ln_tower", "name_en": "LN Tower", "category": "combat", "width": 2, "height": 2, "power": 10 },
        { "id": "heavy_gun_tower", "name_en": "Heavy Gun Tower", "category": "combat", "width": 2, "height": 2, "power": 20 },
        { "id": "sentry_tower", "name_en": "Sentry Tower", "category": "combat", "width": 2, "height": 2, "power": 20 },
        { "id": "omnidirectional_sonic_tower", "name_en": "Omnidirectional Sonic Tower", "category": "combat", "width": 2, "height": 2, "power": 20 },
        { "id": "beam_tower", "name_en": "Beam Tower", "category": "combat", "width": 2, "height": 2, "power": 10 },
        { "id": "surge_tower", "name_en": "Surge Tower", "category": "combat", "width": 2, "height": 2, "power": 20 },
        { "id": "he_grenade_tower", "name_en": "HE Grenade Tower", "category": "combat", "width": 2, "height": 2, "power": 20 },
        { "id": "marsh_gas_mk1", "name_en": "Marsh Gas Mk I", "category": "combat", "width": 2, "height": 2, "power": 20 },

        // Exploration (Purple)
        { "id": "protocol_stash", "name_en": "Protocol Stash", "category": "exploration", "width": 3, "height": 3, "power": 0 },
        { "id": "zipline_pylon", "name_en": "Zipline Pylon", "category": "exploration", "width": 2, "height": 2, "power": 0 },
        { "id": "easy_stash", "name_en": "Easy Stash", "category": "exploration", "width": 3, "height": 3, "power": 0 },
        { "id": "memo_beacon", "name_en": "Memo Beacon", "category": "exploration", "width": 2, "height": 2, "power": 0 },
        { "id": "zipline_tower", "name_en": "Zipline Tower", "category": "exploration", "width": 2, "height": 2, "power": 0 },

        // Logistics (Gray)
        { "id": "item_control_port", "name_en": "Item Control Port", "category": "logistics", "width": 1, "height": 1, "power": 0 },
        { "id": "belt_bridge", "name_en": "Belt Bridge", "category": "logistics", "width": 1, "height": 1, "power": 0 },
        { "id": "splitter", "name_en": "Splitter", "category": "logistics", "width": 1, "height": 1, "power": 0 },
        { "id": "converger", "name_en": "Converger", "category": "logistics", "width": 1, "height": 1, "power": 0 },
        { "id": "conveyor_belt", "name_en": "Conveyor Belt", "category": "logistics", "width": 1, "height": 1, "power": 0 },
    ]
};

// Хелпер для цветов
const getCategoryColor = (cat, id) => {
    if (id === 'conveyor_belt') return 'bg-slate-600';
    switch (cat) {
        case 'core': return 'bg-cyan-600 shadow-cyan-500/20 shadow-xl border-cyan-400';
        case 'processing': return 'bg-blue-600/90';
        case 'resourcing': return 'bg-orange-600/90';
        case 'power': return 'bg-yellow-500/90';
        case 'combat': return 'bg-red-600/90';
        case 'exploration': return 'bg-purple-600/90';
        case 'logistics': return 'bg-gray-500/90';
        default: return 'bg-slate-600';
    }
};

const getCategoryIcon = (cat) => {
    switch (cat) {
        case 'core': return <Hexagon className="w-4 h-4" />;
        case 'processing': return <Wrench className="w-4 h-4" />;
        case 'resourcing': return <Database className="w-4 h-4" />;
        case 'power': return <Zap className="w-4 h-4" />;
        case 'combat': return <Shield className="w-4 h-4" />;
        case 'exploration': return <Search className="w-4 h-4" />;
        case 'logistics': return <ArrowUp className="w-4 h-4" />;
        default: return <Square className="w-4 h-4" />;
    }
};

const CELL_SIZE = 40;
const GRID_SIZE = 40;

const App = () => {
    // State
    const [placedModules, setPlacedModules] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [hoverPos, setHoverPos] = useState({ x: null, y: null });
    const [totalPowerConsumption, setTotalPowerConsumption] = useState(0);

    const gridContainerRef = useRef(null);

    // Power Calc
    useEffect(() => {
        const power = placedModules.reduce((acc, item) => {
            const moduleData = RAW_DATA.facilities.find(m => m.id === item.moduleId);
            return acc + (moduleData ? (moduleData.power || 0) : 0);
        }, 0);
        setTotalPowerConsumption(power);
    }, [placedModules]);

    // Keybinds
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['r', 'R', 'к', 'К'].includes(e.key)) {
                setRotation(prev => (prev + 90) % 360);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getModuleData = (id) => RAW_DATA.facilities.find(m => m.id === id);

    const getDimensions = (moduleData, rot) => {
        if (!moduleData) return { w: 1, h: 1 };
        const isRotated = rot === 90 || rot === 270;
        return isRotated
            ? { w: moduleData.height, h: moduleData.width }
            : { w: moduleData.width, h: moduleData.height };
    };

    const isValidPlacement = (x, y, w, h, ignoreId = null) => {
        if (x < 0 || y < 0 || x + w > GRID_SIZE || y + h > GRID_SIZE) return false;
        for (const item of placedModules) {
            if (item.id === ignoreId) continue;
            const itemData = getModuleData(item.moduleId);
            const { w: itemW, h: itemH } = getDimensions(itemData, item.rotation);
            if (x < item.x + itemW && x + w > item.x && y < item.y + itemH && y + h > item.y) {
                return false;
            }
        }
        return true;
    };

    const placeModule = (x, y) => {
        const moduleData = getModuleData(selectedModuleId);
        if (!moduleData) return;

        // --- UNIQUE CONSTRAINT FOR CORE ---
        if (moduleData.id === 'phase_agreement_core') {
            const alreadyExists = placedModules.some(m => m.moduleId === 'phase_agreement_core');
            if (alreadyExists) {
                // Simple alert or visual feedback could go here
                console.log("Only one Phase Agreement Core allowed!");
                return;
            }
        }

        const { w, h } = getDimensions(moduleData, rotation);

        if (!isValidPlacement(x, y, w, h)) {
            const existing = placedModules.find(m =>
                m.x === x && m.y === y && m.moduleId === 'conveyor_belt' && moduleData.id === 'conveyor_belt'
            );
            if (!existing) return;
        }

        const filteredList = placedModules.filter(m => !(m.x === x && m.y === y && moduleData.id === 'conveyor_belt'));

        const newModule = {
            id: Date.now().toString() + Math.random(),
            moduleId: selectedModuleId,
            x,
            y,
            rotation: rotation
        };

        setPlacedModules([...filteredList, newModule]);
    };

    // --- MOUSE HANDLERS ---

    const handleMouseDown = (e) => {
        if (e.button !== 0 || !hoverPos.x) return; // Only left click
        placeModule(hoverPos.x, hoverPos.y);
    };

    const handleMouseMove = (e) => {
        if (!gridContainerRef.current) return;
        const rect = gridContainerRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left + gridContainerRef.current.scrollLeft) / CELL_SIZE);
        const y = Math.floor((e.clientY - rect.top + gridContainerRef.current.scrollTop) / CELL_SIZE);

        // Update Hover
        if (x !== hoverPos.x || y !== hoverPos.y) {
            setHoverPos({ x, y });
        }
    };

    const removeModule = (instanceId, e) => {
        e.stopPropagation();
        setPlacedModules(placedModules.filter(m => m.id !== instanceId));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(placedModules, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "endfield_layout.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- RENDER HELPERS ---
    const renderModuleContent = (data, rot) => {
        if (data.id === 'conveyor_belt') {
            return (
                <div className="flex items-center justify-center w-full h-full text-white/90" style={{ transform: `rotate(${rot}deg)` }}>
                    <ArrowUp className="w-6 h-6" />
                </div>
            );
        }
        if (data.category === 'logistics') {
            return (
                <div className="flex items-center justify-center w-full h-full text-white/80 border-2 border-white/20 rounded-full" style={{ transform: `rotate(${rot}deg)` }}>
                    {data.id === 'splitter' ? '⑂' : data.id === 'converger' ? '⑃' : '⚙'}
                </div>
            );
        }

        // Core Special Render
        if (data.category === 'core') {
            return (
                <div className="flex flex-col items-center justify-center text-center w-full h-full relative p-2 border-4 border-cyan-300/30">
                    <Hexagon className="w-12 h-12 text-cyan-200 mb-2" />
                    <span className="text-white font-bold text-sm uppercase tracking-widest drop-shadow-md">
            PAC CORE
          </span>
                    <div className="absolute top-0 w-full h-2 bg-cyan-400" />
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center text-center w-full h-full relative p-1">
        <span className="text-white/95 font-bold text-[10px] leading-tight select-none drop-shadow-md z-10 break-words w-full">
          {data.name_en.replace('Unit', '').replace('Tower', '')}
        </span>
                <div className="absolute top-0 w-full h-1.5 bg-white/40" />
            </div>
        );
    };

    // Group modules by category
    const categories = ['core', 'logistics', 'processing', 'resourcing', 'power', 'combat', 'exploration'];

    return (
        <div className="flex h-screen w-full bg-slate-900 text-slate-100 font-sans overflow-hidden select-none">

            {/* SIDEBAR */}
            <div className="w-80 flex-shrink-0 flex flex-col border-r border-slate-700 bg-slate-800">
                <div className="p-4 border-b border-slate-700 bg-slate-900 shadow-md z-10">
                    <h1 className="text-lg font-bold text-yellow-500 tracking-wider flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        PROTOCOL: BLUEPRINT
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {categories.map(cat => {
                        const mods = RAW_DATA.facilities.filter(m => m.category === cat);
                        if (mods.length === 0) return null;
                        return (
                            <div key={cat} className="mb-2">
                                <div className="sticky top-0 bg-slate-800/95 backdrop-blur px-4 py-2 border-b border-slate-700 flex items-center gap-2 text-xs font-bold uppercase text-slate-400 z-10">
                                    {getCategoryIcon(cat)} {cat}
                                </div>
                                <div className="p-2 grid grid-cols-2 gap-2">
                                    {mods.map(mod => (
                                        <div
                                            key={mod.id}
                                            onClick={() => setSelectedModuleId(mod.id)}
                                            className={`
                            p-2 rounded cursor-pointer transition-all relative min-h-[80px] flex flex-col justify-between
                            ${selectedModuleId === mod.id
                                                ? 'ring-2 ring-yellow-500 bg-slate-700'
                                                : 'bg-slate-750 hover:bg-slate-700 border border-slate-600/50'}
                        `}
                                        >
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-xs leading-tight mb-1 block">{mod.name_en}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400">{mod.width}x{mod.height}</div>
                                            </div>

                                            <div className="flex justify-end mt-2">
                                                {mod.power > 0 && (
                                                    <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-yellow-200 flex items-center gap-0.5">
                                    <Zap className="w-3 h-3" /> -{mod.power}
                                </span>
                                                )}
                                                {mod.power === 0 && (
                                                    <span className="text-[10px] bg-slate-600/40 px-1.5 py-0.5 rounded text-slate-300">
                                    0⚡
                                </span>
                                                )}
                                            </div>

                                            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${getCategoryColor(mod.category, mod.id).split(' ')[0]}`}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-3 border-t border-slate-700 bg-slate-900 text-[10px] text-slate-400">
                    <p className="mb-1 font-bold text-slate-300">CONTROLS:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <span>• <span className="text-yellow-500">Left Click</span>: Place</span>
                        <span>• <span className="text-yellow-500">R</span>: Rotate</span>
                        <span>• <span className="text-red-400">R-Click</span>: Cancel</span>
                        <span>• <span className="text-blue-400">Export</span>: Save JSON</span>
                    </div>
                </div>
            </div>

            {/* CANVAS AREA */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">

                {/* TOP HUD */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-4 bg-slate-800/90 backdrop-blur border border-slate-600 px-6 py-2 rounded shadow-2xl">
                    <div className="flex items-center gap-3 border-r border-slate-600 pr-6">
                        <div className="text-right">
                            <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Total Load</span>
                            <span className={`font-mono font-bold text-xl ${totalPowerConsumption > 0 ? 'text-orange-400' : 'text-slate-500'}`}>
                    {totalPowerConsumption} <span className="text-sm">kW</span>
                </span>
                        </div>
                        <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Box className="w-6 h-6 text-blue-400" />
                        <div className="text-left">
                            <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Modules</span>
                            <span className="font-mono font-bold text-xl text-white">{placedModules.length}</span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={handleExport} className="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded shadow-lg border border-blue-500" title="Save Blueprint">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => setPlacedModules([])} className="p-2 bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-700 rounded shadow-lg" title="Clear Grid">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* GRID */}
                <div
                    ref={gridContainerRef}
                    className="flex-1 overflow-auto relative cursor-crosshair custom-scrollbar bg-[#0b1120]"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverPos({x:null, y:null})}
                    onContextMenu={(e) => { e.preventDefault(); setSelectedModuleId(null); }}
                >
                    <div
                        className="relative"
                        style={{
                            width: GRID_SIZE * CELL_SIZE,
                            height: GRID_SIZE * CELL_SIZE,
                            backgroundImage: `
                linear-gradient(to right, #1e293b 1px, transparent 1px),
                linear-gradient(to bottom, #1e293b 1px, transparent 1px)
              `,
                            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                        }}
                    >
                        {/* Placed Modules */}
                        {placedModules.map(item => {
                            const data = getModuleData(item.moduleId);
                            const dims = getDimensions(data, item.rotation);
                            const isBelt = item.moduleId === 'conveyor_belt';

                            return (
                                <div
                                    key={item.id}
                                    className={`absolute border border-black/20 shadow-sm flex items-center justify-center group transition-colors
                    ${getCategoryColor(data.category, data.id)}
                  `}
                                    style={{
                                        left: item.x * CELL_SIZE,
                                        top: item.y * CELL_SIZE,
                                        width: dims.w * CELL_SIZE,
                                        height: dims.h * CELL_SIZE,
                                        zIndex: isBelt ? 5 : 10,
                                    }}
                                >
                                    {renderModuleContent(data, item.rotation)}

                                    {/* Delete Button (Hover) */}
                                    <button
                                        onMouseDown={(e) => removeModule(item.id, e)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all z-20 shadow-lg border border-white/20"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Ghost Preview */}
                        {selectedModuleId && hoverPos.x !== null && (
                            <div
                                className={`absolute border-2 pointer-events-none opacity-50 z-20 transition-all duration-75
                  ${isValidPlacement(hoverPos.x, hoverPos.y, getDimensions(getModuleData(selectedModuleId), rotation).w, getDimensions(getModuleData(selectedModuleId), rotation).h)
                                    ? 'border-green-400 bg-green-500/30'
                                    : 'border-red-500 bg-red-500/30'}
                `}
                                style={{
                                    left: hoverPos.x * CELL_SIZE,
                                    top: hoverPos.y * CELL_SIZE,
                                    width: getDimensions(getModuleData(selectedModuleId), rotation).w * CELL_SIZE,
                                    height: getDimensions(getModuleData(selectedModuleId), rotation).h * CELL_SIZE,
                                }}
                            />
                        )}

                        {/* Origin Lines */}
                        <div className="absolute left-0 top-0 w-full h-0.5 bg-yellow-500/20 z-0 pointer-events-none" />
                        <div className="absolute left-0 top-0 h-full w-0.5 bg-yellow-500/20 z-0 pointer-events-none" />

                    </div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
        </div>
    );
};

export default App;