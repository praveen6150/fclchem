import { ProductItem, PresentationChapter } from '../types';

export const FALCON_PRODUCTS: ProductItem[] = [
  // Adhesives & Sealants
  {
    id: 'prod-1',
    name: 'Falcon Contact Adhesive 88',
    category: 'adhesives',
    shortDesc: 'Solvent-based high-strength contact adhesive for decorative laminates, wood, and rubber.',
    fullDesc: 'Falcon Contact Adhesive 88 is a heavy-duty polychloroprene rubber-based adhesive engineered for bonding decorative laminates, wood joinery, leather, foam, rubber sheets, and metal surfaces. Formulated for fast tack, heat resistance, and durable long-term adhesion.',
    keyFeatures: [
      'High initial tack and immediate bond strength',
      'Excellent heat and water resistance',
      'Easy brush or trowel application',
      'Suitable for woodwork, furniture, and leathercraft'
    ],
    applications: [
      'Woodworking & Furniture Assembly',
      'Laminate Tabletop & Countertop Bonding',
      'Rubber Sheet & Foam Insulation Attachment',
      'Automotive Interior & Leather Trim'
    ],
    packaging: ['1 Liter Can', '4 Liter Tin', '18 Liter Drum', '200 Liter Steel Drum'],
    specs: {
      appearance: 'Viscous Amber Liquid',
      density: '0.86 - 0.89 g/cm³',
      viscosity: '2,500 - 3,500 cps',
      dryingTime: '10 - 15 minutes',
      shelfLife: '12 Months unopened'
    },
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Falcon PVA Wood Glue 55',
    category: 'adhesives',
    shortDesc: 'Premium polyvinyl acetate emulsion wood adhesive for high-strength joinery.',
    fullDesc: 'Falcon PVA Wood Glue 55 is a high-grade, cross-linking water-based poly-vinyl acetate dispersion. Formulated specifically for carpentry, hardwood assembly, finger jointing, and veneer lamination with invisible glue lines.',
    keyFeatures: [
      'Fast setting time with high tensile bond strength',
      'Transparent, non-staining cured joint',
      'Eco-friendly water-based formula, low VOC',
      'Conforms to D3 moisture-resistant standards'
    ],
    applications: [
      'Hardwood & Softwood Assembly',
      'Plywood & MDF Board Jointing',
      'Veneering & Decorative Wood Overlays',
      'Doors, Windows & Cabinetry Manufacturing'
    ],
    packaging: ['500g Squeeze Bottle', '5kg Bucket', '20kg Pail'],
    specs: {
      appearance: 'Milky White Liquid (Dries Clear)',
      density: '1.05 g/cm³',
      viscosity: '12,000 - 16,000 cps',
      dryingTime: '20 - 30 minutes press time',
      shelfLife: '12 Months'
    },
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Falcon Neutral Silicone Sealant',
    category: 'adhesives',
    shortDesc: 'Non-corrosive, neutral cure weatherproofing silicone for glass, aluminum, and joints.',
    fullDesc: 'Falcon Neutral Silicone Sealant is a 1-component, non-corrosive silicone sealant designed for architectural glazing, expansion joints, curtain wall sealing, and aluminum composite panel fixing.',
    keyFeatures: [
      '100% neutral silicone cure, non-corrosive to metals',
      'Superior resistance to UV, ozone, and extreme heat',
      'High elasticity & dynamic movement accommodation (±25%)',
      'Primerless adhesion to glass, aluminum, steel, and masonry'
    ],
    applications: [
      'Curtain Wall Glazing & Facade Sealing',
      'Aluminum Window & Door Frame Joints',
      'Perimeter Waterproof Sealing',
      'Cleanroom & HVAC Duct Jointing'
    ],
    packaging: ['280ml Cartridge', '600ml Sausage Foil'],
    specs: {
      appearance: 'Paste (Clear, White, Black, Bronze, Grey)',
      density: '1.38 g/cm³',
      dryingTime: 'Skin time 10-15 mins, Full cure 24h',
      shelfLife: '12 Months'
    }
  },

  // Construction Chemicals
  {
    id: 'prod-4',
    name: 'Falcon Proof 100 Waterproofing',
    category: 'construction',
    shortDesc: 'Elastomeric acrylic liquid waterproofing membrane for roofs, balconies, and wet areas.',
    fullDesc: 'Falcon Proof 100 is a single-component, premium elastomeric liquid-applied acrylic membrane. Formulated for seamless waterproofing on concrete roofs, exposed decks, parapets, wet rooms, and under-tile applications in harsh climates.',
    keyFeatures: [
      'High elongation elasticity (>350%) bridging substrate cracks',
      'Solar reflective property reduces surface temperatures',
      'Seamless UV-stable seamless liquid membrane',
      'Direct application by brush, roller, or airless spray'
    ],
    applications: [
      'Exposed Concrete Roofs & Decks',
      'Wet Area Waterproofing (Bathrooms, Kitchens)',
      'Balconies & Parapet Walls',
      'Refurbishment of Aged Bituminous Roofing'
    ],
    packaging: ['5kg Bucket', '20kg Heavy-Duty Pail'],
    specs: {
      appearance: 'White / Grey / Green Liquid Paste',
      density: '1.30 g/cm³',
      dryingTime: 'Touch dry 2-4 hours, Full cure 48 hours',
      shelfLife: '12 Months'
    },
    featured: true
  },
  {
    id: 'prod-5',
    name: 'Falcon Epoxy Floor Coating 2K',
    category: 'construction',
    shortDesc: 'High-build, solvent-free epoxy floor coating for heavy-duty industrial floors.',
    fullDesc: 'Falcon Epoxy Floor Coating 2K is a two-component, high-performance solvent-free epoxy resin system designed to protect concrete floors against heavy vehicular traffic, chemical abrasion, and mechanical impacts.',
    keyFeatures: [
      'High compressive and tensile mechanical strength',
      'Seamless hygienic glossy finish easy to clean',
      'Resistant to oils, hydraulic fluids, solvents, and mild acids',
      'Anti-slip broadcast option available'
    ],
    applications: [
      'Dubai Industrial City Warehouses & Logistics Hubs',
      'Automotive Workshops & Assembly Plants',
      'Pharmaceutical & Food Processing Plants',
      'Multi-level Car Park Flooring Systems'
    ],
    packaging: ['5kg Kit (Base + Hardener)', '20kg Industrial Kit'],
    specs: {
      appearance: 'Glossy Colored Finish (RAL shades)',
      density: '1.45 g/cm³',
      dryingTime: 'Pot life 40 mins, Foot traffic 24h, Full cure 7 days',
      shelfLife: '12 Months'
    },
    featured: true
  },
  {
    id: 'prod-6',
    name: 'Falcon Concrete Admixture HR',
    category: 'construction',
    shortDesc: 'High-range water-reducing superplasticizer for high-strength concrete.',
    fullDesc: 'Falcon Concrete Admixture HR is a modified polycarboxylate ether (PCE) based high-range water-reducing admixture. Engineered to produce high-slump, self-consolidating, and high-strength concrete mixtures.',
    keyFeatures: [
      'Dramatic water reduction up to 30%',
      'Extended slump retention for long-distance transit in hot UAE weather',
      'Enhances early and final compressive strengths',
      'Reduces permeability and chloride ion penetration'
    ],
    applications: [
      'High-Rise Commercial & Residential Towers',
      'Precast Concrete Elements & Structural Beams',
      'Ready-Mix Concrete Plants',
      'Heavy Infrastructure & Bridge Structures'
    ],
    packaging: ['20 Liter Can', '210 Liter Drum', '1000 Liter IBC Tote'],
    specs: {
      appearance: 'Light Brown Liquid',
      density: '1.08 g/cm³',
      shelfLife: '12 Months'
    }
  },

  // Industrial Coatings & Paints
  {
    id: 'prod-7',
    name: 'Falcon Anti-Corrosive Zinc Primer',
    category: 'coatings',
    shortDesc: 'Fast-drying rust-inhibitive zinc phosphate primer for structural steel.',
    fullDesc: 'Falcon Anti-Corrosive Zinc Primer is a modified alkyd resin primer enriched with active zinc phosphate pigments. Provides barrier rust protection for structural steelwork, storage tanks, and industrial machinery.',
    keyFeatures: [
      'Rapid air-drying time for fast shop coat application',
      'Exceptional adhesion to blast-cleaned steel',
      'Compatible with synthetic enamels and polyurethane topcoats',
      'Protects steel against marine atmospheric exposure'
    ],
    applications: [
      'Structural Steel Building Frames & Trusses',
      'Storage Tanks & Pipe Racks',
      'Heavy Equipment & Crane Chassis',
      'Architectural Ironwork & Fencing'
    ],
    packaging: ['1 Liter Can', '4 Liter Tin', '20 Liter Drum'],
    specs: {
      appearance: 'Grey / Red Oxide Matte',
      density: '1.35 g/cm³',
      dryingTime: 'Touch dry 20 mins, Recoat 4 hours',
      shelfLife: '12 Months'
    }
  },
  {
    id: 'prod-8',
    name: 'Falcon Heat Resistant Paint 600C',
    category: 'coatings',
    shortDesc: 'Silicone-based high-temperature coating for exhaust systems and chimneys up to 600°C.',
    fullDesc: 'Falcon Heat Resistant Paint 600C is a specialized silicone resin based heat-resistant coating designed to endure continuous thermal cycles up to 600°C without flaking, blistering, or color degradation.',
    keyFeatures: [
      'Continuous thermal resistance up to 600°C (1112°F)',
      'High heat thermal shock resistance',
      'Sleek metallic silver / matte black finish',
      'Direct application on pre-treated steel'
    ],
    applications: [
      'Industrial Exhaust Pipes & Silencers',
      'Boilers, Stacks, and Power Plant Chimneys',
      'Incinerators & Furnace Outer Casing',
      'Refinery Heaters & Process Piping'
    ],
    packaging: ['1 Liter Can', '4 Liter Tin', '20 Liter Drum'],
    specs: {
      appearance: 'Aluminum Silver / Matte Black',
      density: '1.15 g/cm³',
      dryingTime: 'Touch dry 30 mins, Heat cure at 200°C for 1h',
      shelfLife: '12 Months'
    }
  },

  // Aerosols & Cleaners
  {
    id: 'prod-9',
    name: 'Falcon Spray Adhesive 77',
    category: 'aerosols',
    shortDesc: 'Heavy-duty aerosol contact spray for foam, fabric, insulation, and paper.',
    fullDesc: 'Falcon Spray Adhesive 77 is a fast-acting multi-purpose aerosol spray adhesive. Provides uniform webbing spray pattern with low soak-in for bonding acoustic foam, carpets, fabrics, cardboard, and lightweight materials.',
    keyFeatures: [
      'Controlled spray pattern with zero overspray clutter',
      'Fast tack onset within 15 seconds',
      'Non-dimpling adhesive bond line for thin fabrics',
      'Ideal for quick industrial and upholstery fixes'
    ],
    applications: [
      'Acoustic Panel & Foam Installation',
      'HVAC Duct Insulation Board Bonding',
      'Vehicle Headliner & Carpet Upholstery',
      'Exhibition Booth Assembly & Signage'
    ],
    packaging: ['500ml Aerosol Can (12 cans / box)'],
    specs: {
      appearance: 'Clear / Pale Yellow Mist',
      dryingTime: 'Tack time 15-45 seconds',
      shelfLife: '24 Months'
    },
    featured: true
  },
  {
    id: 'prod-10',
    name: 'Falcon Industrial Degreaser & Cleaner',
    category: 'aerosols',
    shortDesc: 'Heavy-duty solvent degreaser aerosol for engine parts and machinery.',
    fullDesc: 'Falcon Industrial Degreaser is a fast-evaporating solvent spray formulated to dissolve heavy grease, oil build-ups, tar, asphalt, and grime from mechanical equipment without leaving residue.',
    keyFeatures: [
      'High pressure spray flushes out hidden crevices',
      'Fast evaporation rate leaves clean dry surface',
      'Non-conductive, safe on cold electrical components',
      'Powerful solvent action cuts through hardened grease'
    ],
    applications: [
      'Engine Parts, Gears & Transmission Cleaning',
      'Maintenance of Manufacturing Machinery',
      'Brake Disc & Mechanical Component Flushing',
      'Mold & Tooling Degreasing'
    ],
    packaging: ['400ml Aerosol Can', '5 Liter Can', '20 Liter Pail'],
    specs: {
      appearance: 'Clear Liquid Spray',
      shelfLife: '24 Months'
    }
  }
];

export const FALCON_CHAPTERS: PresentationChapter[] = [
  {
    id: 1,
    title: 'Pioneering Chemical Manufacturing in the UAE',
    subtitle: 'Over Four Decades of Quality, Reliability & Innovation',
    description: 'Founded in the United Arab Emirates, Falcon Chemicals LLC has evolved into a premier regional and global manufacturer of high-performance adhesives, sealants, construction chemicals, and industrial coatings.',
    highlights: [
      'Established in Dubai, UAE with state-of-the-art facilities',
      'Fully compliant with ISO 9001:2015 & ISO 14001:2015 standards',
      'Trusted supplier to major construction, joinery, and marine industries',
      'Dedicated R&D laboratory driving sustainable chemical formulas'
    ],
    durationSec: 12,
    bgGradient: 'from-slate-900 via-blue-950 to-slate-900',
    statLabel: 'Years of Excellence',
    statValue: '48+'
  },
  {
    id: 2,
    title: 'Advanced Jebel Ali Industrial Plant Production',
    subtitle: 'Precision Processing & Modern Logistics Infrastructure',
    description: 'Our advanced manufacturing and research plant in Jebel Ali Industrial Area No. 3 utilizes stainless steel reactors, precision metering systems, and high-speed packaging lines to deliver uncompromised chemical purity.',
    highlights: [
      'Multi-line automated liquid and paste filling systems',
      'Strict batch testing & quality assurance protocol',
      'Large-capacity bulk chemical storage for rapid fulfillment',
      'Strategically situated near Jebel Ali Port for global export'
    ],
    durationSec: 12,
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    statLabel: 'Export Destinations',
    statValue: '40+ Countries'
  },
  {
    id: 3,
    title: 'Four Core Industrial Divisions',
    subtitle: 'Comprehensive Formulations for End-to-End Applications',
    description: 'Falcon Chemicals offers tailored chemical solutions spanning Adhesives & Sealants, Construction Waterproofing & Flooring, Protective Marine & Heat Coatings, and Convenience Aerosols.',
    highlights: [
      'Solvent & Water-based Adhesives for furniture and automotive',
      'Polycarboxylate PCE concrete admixtures & epoxy flooring',
      'Heat resistant coatings engineered up to 600°C',
      'Custom private labeling and aerosol OEM manufacturing'
    ],
    durationSec: 12,
    bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    statLabel: 'Specialized Products',
    statValue: '150+'
  },
  {
    id: 4,
    title: 'Sustainable Engineering & Global Reach',
    subtitle: 'Empowering Modern Infrastructure with Eco-Friendly Formulations',
    description: 'As part of our commitment to sustainability, Falcon Chemicals continuously pioneers Low-VOC, solvent-free, and water-based chemical alternatives compliant with green building regulations.',
    highlights: [
      'Low-VOC & Green Building (LEED) compliant product options',
      'Robust global logistics network across MEA, Europe, and Asia',
      'Experienced technical support team for field consultation',
      'Continuous innovation in eco-friendly chemical alternatives'
    ],
    durationSec: 12,
    bgGradient: 'from-slate-950 via-cyan-950 to-slate-900',
    statLabel: 'Client Satisfaction',
    statValue: '99.4%'
  }
];

export const COMPANY_INFO = {
  name: 'Falcon Chemicals LLC',
  tagline: 'Precision Chemical Solutions for Global Industry',
  established: '1976',
  headquarters: 'Jebel Ali Industrial Area No. 3, Dubai, United Arab Emirates',
  phone: '+971 4 8801444',
  timing: 'Mon - Sat: 8:30 AM - 5:00 PM (GST)',
  email: 'inquiry@falconchemicals.com',
  websiteMain: 'www.falconchemicals.com',
  websiteRegional: 'www.falconchemicals.ae',
  poBox: 'P.O. Box 2924, Dubai, U.A.E.',
  certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018', 'UAE ESMA Certified']
};
