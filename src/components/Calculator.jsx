import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Activity, Zap, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MODELS = {
    // Google Gemini
    'gemini-3.0-flash': {
        name: 'Gemini 3.0 Flash',
        provider: 'Google Gemini',
        inputPrice: 0.50, // per 1M tokens
        outputPrice: 3.00, // per 1M tokens
    },
    'gemini-3.0-pro': {
        name: 'Gemini 3.0 Pro',
        provider: 'Google Gemini',
        inputPrice: 2.00, // per 1M tokens (< 200k context)
        outputPrice: 12.00, // per 1M tokens (< 200k context)
    },
    // Anthropic Claude
    'claude-opus-4-6': {
        name: 'Claude Opus 4.6',
        provider: 'Anthropic',
        inputPrice: 5.00, // per 1M tokens
        outputPrice: 25.00, // per 1M tokens
    },
    'claude-sonnet-4-6': {
        name: 'Claude Sonnet 4.6',
        provider: 'Anthropic',
        inputPrice: 3.00, // per 1M tokens
        outputPrice: 15.00, // per 1M tokens
    },
    'claude-haiku-4-5': {
        name: 'Claude Haiku 4.5',
        provider: 'Anthropic',
        inputPrice: 1.00, // per 1M tokens
        outputPrice: 5.00, // per 1M tokens
    },
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
        { name: 'Input', value: costs.inputCostPerInteraction * params.interactions * params.leads, color: '#00D4AA' }, // Infusion Green
        { name: 'Output', value: costs.outputCostPerInteraction * params.interactions * params.leads, color: '#483D8B' }, // Premium Indigo
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans selection:bg-infusion-green selection:text-infusion-purple">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Controls */}
                <div className="space-y-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md">
                            <Calculator className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-heading font-semibold tracking-tight text-white">API Cost Calculator</h1>
                            <p className="text-muted-foreground font-light tracking-wide mt-1">Estimate your AIOS agent infrastructure costs</p>
                        </div>
                    </div>

                    <div className="space-y-8 bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                        <h2 className="text-2xl font-heading font-medium flex items-center text-infusion-green">
                            <Activity className="w-6 h-6 mr-3" />
                            Configuration
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wider">Model</label>
                                <select
                                    className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all hover:border-primary/50"
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                >
                                    {Object.entries(
                                        Object.entries(MODELS).reduce((groups, [key, model]) => {
                                            const provider = model.provider;
                                            if (!groups[provider]) groups[provider] = [];
                                            groups[provider].push([key, model]);
                                            return groups;
                                        }, {})
                                    ).map(([provider, models]) => (
                                        <optgroup key={provider} label={provider} className="bg-card text-foreground">
                                            {models.map(([key, model]) => (
                                                <option key={key} value={key} className="bg-card text-foreground">{model.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Preset Scenario</label>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(PRESETS).map(([key, preset]) => (
                                        <button
                                            key={key}
                                            onClick={() => loadPreset(key)}
                                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${params.name === preset.name
                                                ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(0,212,170,0.4)]'
                                                : 'bg-transparent text-muted-foreground border-white/10 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider flex items-center">
                                        Avg Input Tokens <Info className="w-3 h-3 ml-1" />
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-base font-mono focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                                        value={params.input}
                                        onChange={(e) => setParams({ ...params, input: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider flex items-center">
                                        Avg Output Tokens <Info className="w-3 h-3 ml-1" />
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-base font-mono focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                                        value={params.output}
                                        onChange={(e) => setParams({ ...params, output: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Interactions / Lead</label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-base font-mono focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                                        value={params.interactions}
                                        onChange={(e) => setParams({ ...params, interactions: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Leads / Month</label>
                                    <input
                                        type="number"
                                        className="w-full bg-secondary/30 border border-white/10 rounded-xl p-4 text-base font-mono focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
                                        value={params.leads}
                                        onChange={(e) => setParams({ ...params, leads: parseInt(e.target.value) || 0, name: 'Custom' })}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className="space-y-8">

                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-card to-secondary/50 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <DollarSign className="w-40 h-40 text-primary" />
                        </div>
                        <h2 className="text-sm font-medium text-infusion-green uppercase tracking-[0.2em] mb-4">Total Monthly Cost</h2>
                        <div className="text-6xl font-heading font-semibold mb-8 text-white tracking-tight">
                            $<span className="font-mono tracking-tighter">{costs.totalMonthlyCost.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <span className="block text-muted-foreground mb-1">Cost per Lead</span>
                                <span className="font-mono text-xl font-medium text-infusion-mint">${costs.costPerLead.toFixed(4)}</span>
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <span className="block text-muted-foreground mb-1">Total Tokens</span>
                                <span className="font-mono text-xl font-medium text-infusion-mint">{((params.input + params.output) * params.interactions * params.leads).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h3 className="text-xl font-heading font-medium mb-6 flex items-center">
                            <Zap className="w-5 h-5 mr-3 text-infusion-green" />
                            Cost Breakdown
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }} barSize={32}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#aaa', fontSize: 13, fontFamily: 'Inter' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff', fontFamily: 'Space Mono' }}
                                        formatter={(value) => [`$${value.toFixed(4)}`, 'Cost']}
                                    />
                                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 flex justify-center space-x-6 text-xs text-muted-foreground">
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-infusion-green mr-2"></div> Input</div>
                            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-infusion-indigo mr-2"></div> Output</div>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Model Comparison</h3>
                        <div className="space-y-2">
                            {Object.entries(
                                Object.entries(MODELS).reduce((groups, [key, model]) => {
                                    const provider = model.provider;
                                    if (!groups[provider]) groups[provider] = [];
                                    groups[provider].push([key, model]);
                                    return groups;
                                }, {})
                            ).map(([provider, models]) => (
                                <div key={provider}>
                                    <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest px-4 pt-3 pb-1">{provider}</div>
                                    {models.map(([key, model]) => {
                                        const inputCost = (params.input / 1_000_000) * model.inputPrice;
                                        const outputCost = (params.output / 1_000_000) * model.outputPrice;
                                        const monthly = (inputCost + outputCost) * params.interactions * params.leads;

                                        return (
                                            <div key={key} className={`flex justify-between items-center p-4 rounded-xl transition-all ${selectedModel === key ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5 border border-transparent'}`}>
                                                <span className={`text-sm ${selectedModel === key ? 'font-semibold text-primary' : ''}`}>{model.name}</span>
                                                <span className={`font-mono text-sm ${selectedModel === key ? 'text-white' : 'text-muted-foreground'}`}>${monthly.toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CostCalculator;
