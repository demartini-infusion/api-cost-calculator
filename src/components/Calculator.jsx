import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Activity, Zap, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MODELS = {
    'gemini-3.0-flash': {
        name: 'Gemini 3.0 Flash',
        inputPrice: 0.50, // per 1M tokens
        outputPrice: 3.00, // per 1M tokens
    },
    'gemini-3.0-pro': {
        name: 'Gemini 3.0 Pro',
        inputPrice: 2.00, // per 1M tokens (< 200k context)
        outputPrice: 12.00, // per 1M tokens (< 200k context)
    }
};

const PRESETS = {
    'custom': {
        name: 'Custom',
        input: 0,
        output: 0,
        interactions: 1,
        leads: 100
    },
    'larissa': {
        name: 'Larissa (SDR AI)',
        input: 1500,
        output: 300,
        interactions: 5,
        leads: 1000
    }
};

const CostCalculator = () => {
    const [selectedModel, setSelectedModel] = useState('gemini-3.0-flash');
    const [params, setParams] = useState(PRESETS.larissa);

    // Update params when preset changes, but allows manual override
    const loadPreset = (presetName) => {
        if (PRESETS[presetName]) {
            setParams(PRESETS[presetName]);
        }
    };

    const calculateCosts = () => {
        const model = MODELS[selectedModel];
        const inputCostPerInteraction = (params.input / 1_000_000) * model.inputPrice;
        const outputCostPerInteraction = (params.output / 1_000_000) * model.outputPrice;
        const totalCostPerInteraction = inputCostPerInteraction + outputCostPerInteraction;

        const costPerLead = totalCostPerInteraction * params.interactions;
        const totalMonthlyCost = costPerLead * params.leads;

        return {
            inputCostPerInteraction,
            outputCostPerInteraction,
            totalCostPerInteraction,
            costPerLead,
            totalMonthlyCost
        };
    };

    const costs = calculateCosts();

    const chartData = [
        { name: 'Input', value: costs.inputCostPerInteraction * params.interactions * params.leads, color: '#60a5fa' }, // Blue-400
        { name: 'Output', value: costs.outputCostPerInteraction * params.interactions * params.leads, color: '#34d399' }, // Emerald-400
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Controls */}
                <div className="space-y-8">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Calculator className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">API Cost Calculator</h1>
                            <p className="text-muted-foreground">Estimate your AI agent infrastructure costs</p>
                        </div>
                    </div>

                    <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                        <h2 className="text-xl font-semibold flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-accent" />
                            Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Model</label>
                                <select
                                    className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    {Object.entries(MODELS).map(([key, model]) => (
                                        <option key={key} value={key}>{model.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium">Preset Scenario</label>
                                </div>
                                <div className="flex space-x-2">
                                    {Object.entries(PRESETS).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() => loadPreset(key)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${params.name === preset.name
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-transparent text-muted-foreground border-input hover:bg-secondary'
                                                }`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 flex items-center">
                                        Avg Input Tokens <Info className="w-3 h-3 ml-1 text-muted-foreground" />
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm"
                                        value={params.input}
                                        onChange={(e) => setParams({ ...params, input: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 flex items-center">
                                        Avg Output Tokens <Info className="w-3 h-3 ml-1 text-muted-foreground" />
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm"
                                        value={params.output}
                                        onChange={(e) => setParams({ ...params, output: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Interactions / Lead</label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm"
                                        value={params.interactions}
                                        onChange={(e) => setParams({ ...params, interactions: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Leads / Month</label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm"
                                        value={params.leads}
                                        onChange={(e) => setParams({ ...params, leads: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="space-y-6">

                    {/* Summary Card */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <DollarSign className="w-32 h-32" />
                        </div>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Monthly Cost</h2>
                        <div className="text-5xl font-bold mb-4">
                            ${costs.totalMonthlyCost.toFixed(2)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-muted-foreground">Cost per Lead</span>
                                <span className="font-semibold">${costs.costPerLead.toFixed(4)}</span>
                            </div>
                            <div>
                                <span className="block text-muted-foreground">Total Tokens</span>
                                <span className="font-semibold">{((params.input + params.output) * params.interactions * params.leads).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                            Cost Breakdown
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        formatter={(value) => [`$${value.toFixed(4)}`, 'Cost']}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            Breakdown of monthly costs between Input and Output tokens.
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Model Comparison (Monthly)</h3>
                        <div className="space-y-3">
                            {Object.entries(MODELS).map(([key, model]) => {
                                const inputCost = (params.input / 1_000_000) * model.inputPrice;
                                const outputCost = (params.output / 1_000_000) * model.outputPrice;
                                const monthly = (inputCost + outputCost) * params.interactions * params.leads;

                                return (
                                    <div key={key} className={`flex justify-between items-center p-3 rounded-lg ${selectedModel === key ? 'bg-secondary' : 'hover:bg-secondary/50'}`}>
                                        <span className={`text-sm ${selectedModel === key ? 'font-semibold' : ''}`}>{model.name}</span>
                                        <span className="font-mono text-sm">${monthly.toFixed(2)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CostCalculator;
