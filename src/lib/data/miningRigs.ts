import { v4 as uuidv4 } from 'uuid';

export interface MiningRig {
  id: string;
  name: string;
  model: string;
  hashrate: number;
  hashrateUnit: string;
  powerConsumption: number;
  algorithms: string[];
  dailyProfitability: number;
  hardware: {
    type: 'ASIC' | 'GPU';
    specs: string[];
  };
  price: number;
  condition: 'New' | 'Used';
  location: string;
  sellerRating: number;
  quantity: number;
  cooling: string;
  warranty: {
    duration: number;
    type: string;
  };
  images: string[];
  description: string;
  features: string[];
}

export const miningRigs: MiningRig[] = [
  // Previous rigs remain the same...
  {
    id: uuidv4(),
    name: "Avalon 1366",
    model: "A1366",
    hashrate: 88,
    hashrateUnit: "TH/s",
    powerConsumption: 3300,
    algorithms: ["SHA-256"],
    dailyProfitability: 4.85,
    hardware: {
      type: "ASIC",
      specs: ["Avalon A1366 Chips", "Built-in Power Supply"]
    },
    price: 3200,
    condition: "New",
    location: "China",
    sellerRating: 4.6,
    quantity: 100,
    cooling: "Air-cooling",
    warranty: {
      duration: 6,
      type: "Standard Warranty"
    },
    images: ["https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a"],
    description: "Reliable and cost-effective Bitcoin mining solution",
    features: ["Stable Performance", "Easy Maintenance", "Power Efficient"]
  },
  // ... rest of the mining rigs data remains the same
];

export const getAvailableAlgorithms = () => {
  const algorithms = new Set<string>();
  miningRigs.forEach(rig => {
    rig.algorithms.forEach(algo => algorithms.add(algo));
  });
  return Array.from(algorithms);
};

export const getPriceRanges = () => {
  const ranges = [
    { id: 'under1', label: 'Under $1,000', min: 0, max: 1000 },
    { id: '1to5', label: '$1,000 - $5,000', min: 1000, max: 5000 },
    { id: 'over5', label: 'Over $5,000', min: 5000, max: Infinity }
  ];
  return ranges;
};

export const getLocations = () => {
  const locations = new Set<string>();
  miningRigs.forEach(rig => locations.add(rig.location));
  return Array.from(locations);
};