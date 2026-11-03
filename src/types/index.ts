export type Discipline = 'Landscape' | 'Architecture' | 'Integrated Design-Build';

export type ProjectCategory = 
  | 'Residential' 
  | 'Commercial' 
  | 'Civic & Public Space' 
  | 'Hospitality' 
  | 'Masterplan' 
  | 'Mixed-Use';

export type ProjectStage =
  | 'Inception & Brief'
  | 'Concept & 3D Visualisation'
  | 'Statutory Approvals (LASPPPA/FCDA)'
  | 'Detailed Technical Drawings'
  | 'Earthworks & Civils'
  | 'Hardscaping & Structures'
  | 'Softscaping & Nursery Planting'
  | 'Snagging & Practical Completion'
  | 'Handover & Post-Occupancy'
  | 'Maintenance Retainer';

export type ProjectHealth = 'On Track' | 'Attention Needed' | 'Critical Delay' | 'Completed';

export interface ProjectLocation {
  city: 'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan';
  neighborhood: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface ProjectBudget {
  currency: 'NGN' | 'USD';
  estimatedCost: number;
  actualCost: number;
  contractValue: number;
  invoicedAmount: number;
  receivedAmount: number;
}

export interface StageGateItem {
  id: string;
  title: string;
  discipline: Discipline;
  completed: boolean;
  requiredForSignoff: boolean;
  signedOffBy?: string;
  signedOffAt?: string;
}

export interface ProjectTeam {
  leadArchitect: string;
  leadArchitectRole: string;
  landscapeSpecialist?: string;
  siteEngineer?: string;
  quantitySurveyor?: string;
  clientRepresentative?: string;
  assignedMembers: string[];
}

export interface Project {
  id: string;
  code: string; // e.g. ARB-2024-001 or BDW-2024-012
  name: string;
  client: {
    name: string;
    organization: string;
    email: string;
    phone: string;
    type: 'Corporate' | 'Private HNI' | 'Government' | 'Real Estate Developer';
  };
  discipline: Discipline;
  category: ProjectCategory;
  currentStage: ProjectStage;
  health: ProjectHealth;
  siteArea: string; // e.g. "1.8 Hectares", "3,200 m²"
  location: ProjectLocation;
  timeline: {
    startDate: string;
    targetCompletion: string;
    progressPercentage: number;
    daysRemaining: number;
  };
  budget: ProjectBudget;
  team: ProjectTeam;
  description: string;
  architecturalNote?: string;
  highlights: string[];
  coverImage: string;
  images: string[];
  stageGates: StageGateItem[];
  tags: string[];
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  stage: ProjectStage;
  discipline: Discipline;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedToAvatar?: string;
  dueDate: string;
  estimatedHours: number;
  loggedHours: number;
  isWeatherSensitive: boolean; // Nigerian rainy season delay mitigation
  dependencies?: string[];
  checklist?: { id: string; text: string; done: boolean }[];
  tags: string[];
  createdAt: string;
}

export interface NurseryItem {
  id: string;
  commonName: string;
  scientificName: string;
  category: 'Specimen Trees' | 'Architectural Palms' | 'Tropical Shrubs' | 'Living Wall Bio-Facade' | 'Groundcover & Turf' | 'Architectural Succulents';
  containerSize: string; // "50L Rootball Bag", "25L Pot", "Living Wall Modular Tray", "Sod Roll"
  heightMeters: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  nurseryLocation: 'Arabella Lekki Nursery Zone A' | 'Arabella Epe Glasshouse' | 'Abuja Holding Yard & Depot';
  unitCostNGN: number;
  waterRequirement: 'Very Low' | 'Moderate' | 'High Drought Tolerant' | 'Daily Irrigation';
  lightRequirement: 'Full Sun' | 'Partial Shade' | 'Deep Tropical Shade' | 'Any Light';
  isWestAfricanNative: boolean;
  idealForBioWall: boolean;
  allocatedProjects: { projectId: string; projectName: string; quantity: number }[];
  photoUrl: string;
  notes?: string;
}

export interface StatutoryPermit {
  id: string;
  projectId: string;
  projectName: string;
  regulatoryBody: 'LASPPPA' | 'LABSCA' | 'Lagos Drainage Dept' | 'FCDA Abuja' | 'EIA Federal' | 'Fire Safety' | 'Surveyor General';
  permitType: string; // e.g. "Planning Permit", "Building Control Certification", "Environmental Impact Assessment", "Drainage Outfall Approval"
  referenceNumber: string;
  status: 'Pending Submission' | 'Under Review' | 'Queries Issued' | 'Approved & Stamped' | 'Renewal Needed';
  submissionDate: string;
  targetApprovalDate: string;
  actualApprovalDate?: string;
  caseOfficer?: string;
  assignedExpediter: string;
  feePaidNGN: number;
  conditionsCount: number;
  documents: { name: string; url: string; date: string }[];
  notes: string;
}

export interface SiteLog {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  weather: 'Sunny & Clear (32°C)' | 'Heavy Torrential Downpour (Lagos Wet Season)' | 'Scattered Showers' | 'Harmattan Dust Haze (Abuja)' | 'Overcast & Humid';
  rainDelayHours: number;
  laborHeadcount: {
    masons: number;
    pavers: number;
    horticulturists: number;
    irrigationPlumbers: number;
    weldersAndCarpenters: number;
    generalHelpers: number;
    supervisors: number;
  };
  heavyEquipment: string[]; // e.g. ["CAT 308 Excavator", "Wacker Neuson Plate Compactor", "Dump Truck 15T"]
  completedWorkToday: string[];
  siteSafetyIssues: string;
  inspectedBy: string;
  architectInstructionIssued?: string;
  photos: { caption: string; url: string }[];
}

export interface SnagItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  locationArea: string; // e.g., "North Living Wall Matrix", "Main Driveway Herringbone Pavers", "Pergola Timber Joints"
  discipline: 'Hardscape' | 'Softscape & Planting' | 'Irrigation & Drainage' | 'Architectural Concrete' | 'Exterior Lighting' | 'Joinery & Metalwork';
  severity: 'Cosmetic' | 'Standard Snag' | 'Urgent' | 'Critical Safety';
  status: 'Open' | 'Rectification In Progress' | 'Ready for Re-inspection' | 'Resolved & Approved';
  assignedContractorOrTeam: string;
  reportedBy: string;
  reportedDate: string;
  resolvedDate?: string;
  description: string;
  beforePhoto?: string;
  afterPhoto?: string;
}

export interface BOQItem {
  id: string;
  projectId: string;
  itemNumber: string; // e.g. "DIV 02 - Earthworks & Subgrade"
  description: string;
  unit: 'm³' | 'm²' | 'lin.m' | 'item' | 'nr' | 'bags' | 'truckload';
  quantity: number;
  rateNGN: number;
  totalNGN: number;
  discipline: Discipline;
  claimedPercentage: number;
  certifiedAmountNGN: number;
  status: 'In Budget' | 'Varied / Exceeded' | 'Certified & Paid';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Landscape Architecture' | 'Building Design (BDW)' | 'Civil Engineering' | 'Horticulture & Nursery' | 'Site Supervision' | 'Finance & QS';
  email: string;
  phone: string;
  avatar: string;
  activeProjectsCount: number;
  currentSiteLocation: string;
}
