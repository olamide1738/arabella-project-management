import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Minus, 
  Search, 
  Sun, 
  Droplet, 
  Leaf, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  DollarSign
} from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';
import { NurseryItem } from '../../types';
import { formatCurrency, formatExactCurrency } from '../../utils/formatters';

export const NurseryInventoryView: React.FC = () => {
  const { nurseryItems, updateNurseryStock, addNurseryItem, projects } = useProjects();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddSpeciesOpen, setIsAddSpeciesOpen] = useState(false);

  // New species form state
  const [commonName, setCommonName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<NurseryItem['category']>('Living Wall Bio-Facade');
  const [containerSize, setContainerSize] = useState('Living Wall Modular Tray');
  const [heightMeters, setHeightMeters] = useState('0.6m');
  const [currentStock, setCurrentStock] = useState(500);
  const [nurseryLocation, setNurseryLocation] = useState<NurseryItem['nurseryLocation']>('Arabella Lekki Nursery Zone A');
  const [unitCostNGN, setUnitCostNGN] = useState(12000);
  const [waterRequirement, setWaterRequirement] = useState<NurseryItem['waterRequirement']>('Moderate');
  const [lightRequirement, setLightRequirement] = useState<NurseryItem['lightRequirement']>('Partial Shade');
  const [isWestAfricanNative, setIsWestAfricanNative] = useState(true);
  const [idealForBioWall, setIdealForBioWall] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80');

  const filtered = nurseryItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchCommon = item.commonName.toLowerCase().includes(q);
      const matchSci = item.scientificName.toLowerCase().includes(q);
      const matchLoc = item.nurseryLocation.toLowerCase().includes(q);
      if (!matchCommon && !matchSci && !matchLoc) return false;
    }
    return true;
  });

  const handleAddSpecies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonName.trim()) return;

    addNurseryItem({
      commonName,
      scientificName,
      category,
      containerSize,
      heightMeters,
      currentStock,
      reservedStock: 0,
      availableStock: currentStock,
      nurseryLocation,
      unitCostNGN,
      waterRequirement,
      lightRequirement,
      isWestAfricanNative,
      idealForBioWall,
      allocatedProjects: [],
      photoUrl,
    });

    setIsAddSpeciesOpen(false);
    setCommonName('');
    setScientificName('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-arabella-100 text-arabella-900 dark:bg-arabella-950 dark:text-arabella-300 text-[11px] font-bold mb-1">
            <Sprout className="w-3.5 h-3.5" />
            <span>Arabella In-House Propagation & Holding Yards</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Plant Nursery & Living Wall Stock
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Real-time inventory of West African specimen trees, living bio-facade flora, and sports turf across Lekki, Epe, and Abuja yards.
          </p>
        </div>

        <button
          onClick={() => setIsAddSpeciesOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-arabella-900 hover:bg-arabella-800 text-gold-300 text-xs font-semibold border border-gold-500/30 shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Species to Nursery</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search common name, botanical genus..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
          >
            <option value="All">All Botanical Categories</option>
            <option value="Living Wall Bio-Facade">Living Wall Bio-Facade</option>
            <option value="Architectural Palms">Architectural Palms</option>
            <option value="Specimen Trees">Specimen Trees</option>
            <option value="Architectural Succulents">Architectural Succulents</option>
            <option value="Groundcover & Turf">Groundcover & Turf</option>
          </select>
        </div>

        <div className="text-xs text-stone-400">
          Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filtered.length}</span> species
        </div>
      </div>

      {/* Species Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:border-arabella-600 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                <img
                  src={item.photoUrl}
                  alt={item.commonName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  {item.isWestAfricanNative && (
                    <span className="text-[10px] font-bold bg-arabella-900/90 text-gold-300 border border-gold-400/40 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      West African Native
                    </span>
                  )}
                  {item.idealForBioWall && (
                    <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Bio-Wall Ready
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {item.commonName}
                  </h3>
                  <p className="text-xs italic text-stone-300 font-serif">
                    {item.scientificName}
                  </p>
                </div>
              </div>

              {/* Details & Specs */}
              <div className="p-4 space-y-3 text-xs">
                {/* Location & Specs */}
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300 text-[11px]">
                  <span className="flex items-center gap-1 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-arabella-600" />
                    {item.nurseryLocation}
                  </span>
                  <span className="font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {item.containerSize}
                  </span>
                </div>

                {/* Sun & Water requirements */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.lightRequirement}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                    <Droplet className="w-3.5 h-3.5 text-sky-500" />
                    <span>{item.waterRequirement}</span>
                  </div>
                </div>

                {/* Stock Counts */}
                <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">Available Stock</span>
                      <div className="font-serif text-xl font-bold text-arabella-900 dark:text-arabella-300">
                        {item.availableStock.toLocaleString()}
                        <span className="text-xs font-sans text-stone-500 ml-1 font-normal">units</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400">Reserved for Jobs</span>
                      <div className="font-serif text-lg font-bold text-amber-600 dark:text-amber-400">
                        {item.reservedStock.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Stock quick adjuster */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-700/80 text-[11px]">
                    <span className="text-stone-400">Stock Count Adjust:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateNurseryStock(item.id, -10)}
                        className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                        title="Deduct 10 units"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => updateNurseryStock(item.id, 10)}
                        className="p-1 rounded bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-700 dark:text-stone-200"
                        title="Add 10 units"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Allocation Tags */}
                {item.allocatedProjects.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      Assigned Commissions
                    </span>
                    <div className="space-y-1">
                      {item.allocatedProjects.map((alloc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] p-1.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          <span className="truncate max-w-[170px] font-medium">{alloc.projectName}</span>
                          <span className="font-bold font-mono">{alloc.quantity} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Unit Rate */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Atelier Nursery Rate:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                {formatExactCurrency(item.unitCostNGN)} / unit
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Species Modal */}
      {isAddSpeciesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#111714] rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Register New Botanical Species
              </h3>
              <button onClick={() => setIsAddSpeciesOpen(false)} className="text-stone-400 hover:text-stone-600">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSpecies} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Common Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Travelers Palm"
                    value={commonName}
                    onChange={e => setCommonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Botanical / Scientific *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ravenala madagascariensis"
                    value={scientificName}
                    onChange={e => setScientificName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="Living Wall Bio-Facade">Living Wall Bio-Facade</option>
                    <option value="Architectural Palms">Architectural Palms</option>
                    <option value="Specimen Trees">Specimen Trees</option>
                    <option value="Architectural Succulents">Architectural Succulents</option>
                    <option value="Groundcover & Turf">Groundcover & Turf</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Nursery Yard Location</label>
                  <select
                    value={nurseryLocation}
                    onChange={e => setNurseryLocation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                  >
                    <option value="Arabella Lekki Nursery Zone A">Arabella Lekki Nursery Zone A</option>
                    <option value="Arabella Epe Glasshouse">Arabella Epe Glasshouse</option>
                    <option value="Abuja Holding Yard & Depot">Abuja Holding Yard & Depot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Current Stock Quantity</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={e => setCurrentStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold">Unit Cost (NGN ₦)</label>
                  <input
                    type="number"
                    value={unitCostNGN}
                    onChange={e => setUnitCostNGN(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWestAfricanNative}
                    onChange={e => setIsWestAfricanNative(e.target.checked)}
                    className="rounded text-arabella-600"
                  />
                  <span>West African Native</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={idealForBioWall}
                    onChange={e => setIdealForBioWall(e.target.checked)}
                    className="rounded text-arabella-600"
                  />
                  <span>Suitable for Vertical Living Wall</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpeciesOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-arabella-900 hover:bg-arabella-800 text-gold-300 font-bold"
                >
                  Save Species
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
