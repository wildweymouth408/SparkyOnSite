// NEC Code Articles for Reference Tab

export interface NECArticle {
  id: string
  number: string
  title: string
  category: string
  summary: string
  details: string[]
  keyValues?: { label: string; value: string }[]
}

export const NEC_CATEGORIES = [
  'General',
  'Branch Circuits',
  'Grounding',
  'Conductors',
  'Boxes & Raceways',
  'Panels & Protection',
  'Motors',
  'Appliances',
] as const

export const NEC_ARTICLES: NECArticle[] = [
  {
    id: 'art-110-26',
    number: '110.26',
    title: 'Working Space Requirements',
    category: 'General',
    summary: 'Minimum clear working space around electrical equipment for safe access and maintenance.',
    details: [
      'Condition 1 (0-150V): 3 ft depth minimum',
      'Condition 2 (151-600V): 3.5 ft depth minimum',
      'Condition 3 (151-600V, both sides exposed): 4 ft depth minimum',
      'Width: 30 inches minimum or width of equipment, whichever is greater',
      'Height: 6.5 ft minimum from floor or platform',
      'Working space shall not be used for storage',
      'At least one entrance required; two entrances required for equipment rated 1200A or more and over 6 ft wide',
    ],
    keyValues: [
      { label: 'Condition 1 Depth', value: '3 ft' },
      { label: 'Condition 2 Depth', value: '3.5 ft' },
      { label: 'Condition 3 Depth', value: '4 ft' },
      { label: 'Min Width', value: '30 in' },
      { label: 'Min Height', value: '6.5 ft' },
    ],
  },
  {
    id: 'art-210-8',
    number: '210.8',
    title: 'GFCI Protection Requirements',
    category: 'Branch Circuits',
    summary: 'Locations requiring ground-fault circuit-interrupter protection for personnel.',
    details: [
      'Dwelling units (210.8(A)): Bathrooms, garages, outdoors, crawl spaces, basements, kitchens (within 6 ft of sink), laundry areas, boathouses',
      'Non-dwelling (210.8(B)): Bathrooms, kitchens, rooftops, outdoors, sinks (within 6 ft), indoor wet locations, locker rooms, garages/service bays, boat hoists',
      'All 125V through 250V, single-phase, 50A or less receptacles in listed locations',
      'GFCI protection required regardless of receptacle rating in specified locations',
      'Exceptions exist for dedicated equipment and industrial applications per specific conditions',
    ],
    keyValues: [
      { label: 'Voltage Range', value: '125-250V' },
      { label: 'Max Amperage', value: '50A' },
      { label: 'Trip Threshold', value: '4-6 mA' },
      { label: 'Sink Distance', value: '6 ft' },
    ],
  },
  {
    id: 'art-210-12',
    number: '210.12',
    title: 'AFCI Protection Requirements',
    category: 'Branch Circuits',
    summary: 'Arc-fault circuit-interrupter protection for dwelling unit branch circuits.',
    details: [
      'Required in dwelling units for 120V, single-phase, 15A and 20A branch circuits supplying outlets or devices in:',
      'Kitchens, family rooms, dining rooms, living rooms, parlors, libraries, dens, bedrooms, sunrooms, recreation rooms, closets, hallways, laundry areas, and similar rooms/areas',
      'AFCI devices detect dangerous arcing conditions that could start fires',
      'Combination-type AFCIs are the most common, protecting against both series and parallel arcs',
      'Can use AFCI breaker, AFCI receptacle (first outlet), or combination of devices with proper testing',
    ],
    keyValues: [
      { label: 'Voltage', value: '120V' },
      { label: 'Max Amperage', value: '15-20A' },
      { label: 'Phase', value: 'Single' },
    ],
  },
  {
    id: 'art-250-122',
    number: '250.122',
    title: 'Equipment Grounding Conductor Sizing',
    category: 'Grounding',
    summary: 'Minimum size of equipment grounding conductors based on overcurrent device rating.',
    details: [
      'Size based on the rating of the overcurrent device protecting the circuit',
      '15A OCPD: #14 Cu / #12 Al',
      '20A OCPD: #12 Cu / #10 Al',
      '30A OCPD: #10 Cu / #8 Al',
      '40A OCPD: #10 Cu / #8 Al',
      '60A OCPD: #10 Cu / #8 Al',
      '100A OCPD: #8 Cu / #6 Al',
      '200A OCPD: #6 Cu / #4 Al',
      '400A OCPD: #3 Cu / #1 Al',
      '600A OCPD: #1 Cu / 1/0 Al',
      '800A OCPD: 1/0 Cu / 3/0 Al',
      '1000A OCPD: 2/0 Cu / 4/0 Al',
      'Where circuit conductors are increased in size for voltage drop, EGC must be proportionally increased',
    ],
    keyValues: [
      { label: '15A', value: '#14 Cu' },
      { label: '20A', value: '#12 Cu' },
      { label: '60A', value: '#10 Cu' },
      { label: '100A', value: '#8 Cu' },
      { label: '200A', value: '#6 Cu' },
    ],
  },
  {
    id: 'art-310-16',
    number: '310.16',
    title: 'Ampacities of Insulated Conductors',
    category: 'Conductors',
    summary: 'Allowable ampacities of insulated conductors rated up to and including 2000 Volts.',
    details: [
      'Based on ambient temperature of 30°C (86°F)',
      'Not more than 3 current-carrying conductors in raceway, cable, or earth',
      'Temperature correction and adjustment factors may reduce ampacity',
      'Common values (Copper, 75°C column):',
      '#14: 15A | #12: 20A | #10: 30A',
      '#8: 50A | #6: 65A | #4: 85A',
      '#2: 115A | #1: 130A | 1/0: 150A',
      '2/0: 175A | 3/0: 200A | 4/0: 230A',
      '250: 255A | 300: 285A | 350: 310A',
      '500: 380A',
      'Terminal temperature limitations may require using a lower column (240.4(D), 110.14(C))',
    ],
    keyValues: [
      { label: '#12 Cu 75°C', value: '20A' },
      { label: '#10 Cu 75°C', value: '30A' },
      { label: '#8 Cu 75°C', value: '50A' },
      { label: '#6 Cu 75°C', value: '65A' },
      { label: '#4 Cu 75°C', value: '85A' },
      { label: '#2 Cu 75°C', value: '115A' },
    ],
  },
  {
    id: 'art-314-16',
    number: '314.16',
    title: 'Box Fill Calculations',
    category: 'Boxes & Raceways',
    summary: 'Number and size of conductors permitted in outlet and device boxes.',
    details: [
      'Each conductor originating outside the box and terminating inside: 1x volume allowance',
      'Each conductor passing through without splice or termination: 1x volume allowance',
      'Each conductor originating inside the box (pigtails): not counted separately',
      'Internal cable clamps (1 or more): 1x volume allowance based on largest conductor',
      'Support fittings (fixture studs/hickeys): 1x volume allowance each based on largest conductor',
      'Each device (switch/receptacle yoke): 2x volume allowance based on largest conductor connected',
      'Equipment grounding conductors (all): 1x volume allowance based on largest EGC',
      'Volume allowances: #14=2.00 cu.in., #12=2.25 cu.in., #10=2.50 cu.in., #8=3.00 cu.in., #6=5.00 cu.in.',
    ],
    keyValues: [
      { label: '#14 volume', value: '2.00 cu.in.' },
      { label: '#12 volume', value: '2.25 cu.in.' },
      { label: '#10 volume', value: '2.50 cu.in.' },
      { label: '#8 volume', value: '3.00 cu.in.' },
      { label: '#6 volume', value: '5.00 cu.in.' },
    ],
  },
  {
    id: 'art-334-80',
    number: '334.80',
    title: 'NM Cable Ampacity Adjustment',
    category: 'Conductors',
    summary: 'Ampacity adjustment for NM (Romex) cables bundled together or in thermal insulation.',
    details: [
      'Where more than 2 NM cables containing 2 or more current-carrying conductors are installed in contact with thermal insulation without maintaining spacing:',
      'The ampacity of each conductor shall be adjusted per 310.15(C)(1)',
      'Stacking NM cables through bored holes: When installed in wood framing with maintained spacing per manufacturer instructions, derating may not be required',
      'When NM cable is installed in thermal insulation, ampacity is limited to the 60°C column of Table 310.16',
      'This is critical for attic runs and insulated wall cavities',
    ],
  },
  {
    id: 'art-408-36',
    number: '408.36',
    title: 'Panelboard Overcurrent Protection',
    category: 'Panels & Protection',
    summary: 'Requirements for overcurrent protection of panelboards.',
    details: [
      'Each panelboard shall be protected by an overcurrent protective device having a rating not greater than that of the panelboard',
      'The overcurrent device shall be located within or at any point on the supply side of the panelboard',
      'Individual protection not required when panelboard feeder has overcurrent protection not exceeding panelboard rating',
      'Back-fed devices used for supply shall be secured in the "on" position with a fastener',
      'Service equipment panelboards: main breaker or fused main required per 408.36(A)',
    ],
    keyValues: [
      { label: 'Rating Match', value: 'OCPD <= Panel Rating' },
      { label: 'Service Equipment', value: 'Main breaker required' },
    ],
  },
  {
    id: 'art-422-11',
    number: '422.11',
    title: 'GFCI Protection for Appliances',
    category: 'Appliances',
    summary: 'Specific appliances requiring GFCI protection regardless of location.',
    details: [
      'Automotive vacuum machines: GFCI required',
      'Drinking water coolers and bottle fill stations: GFCI required',
      'High-pressure spray washing machines: GFCI required',
      'Tire inflation machines: GFCI required',
      'Vending machines: GFCI required (cord-and-plug or permanently connected)',
      'Sump pumps and sewage pumps: Per 210.8 requirements',
      'Dishwashers: GFCI required',
      'Protection can be integral to equipment, as a GFCI receptacle, or GFCI breaker',
    ],
  },
  {
    id: 'art-430-52',
    number: '430.52',
    title: 'Motor Branch Circuit Protection',
    category: 'Motors',
    summary: 'Maximum rating of motor branch-circuit short-circuit and ground-fault protective devices.',
    details: [
      'Dual-element fuse (time-delay): 175% of motor FLC',
      'Instantaneous trip breaker: 800% of motor FLC (1100% for Design B energy efficient)',
      'Inverse time breaker: 250% of motor FLC',
      'If value does not correspond to standard OCPD size, next higher standard size permitted',
      'Motor FLC from NEC tables 430.247-250 (not nameplate)',
      'Exception: If standard sized OCPD is not sufficient for starting current, next higher size permitted up to 400% for fuses and 300% for breakers',
    ],
    keyValues: [
      { label: 'Time-delay fuse', value: '175% FLC' },
      { label: 'Standard breaker', value: '250% FLC' },
      { label: 'Instantaneous', value: '800% FLC' },
    ],
  },
  {
    id: 'art-240-4',
    number: '240.4',
    title: 'Overcurrent Protection General',
    category: 'Panels & Protection',
    summary: 'General requirements for overcurrent protection of conductors',
    details: [
      'Conductors shall be protected against overcurrent in accordance with their ampacities',
      'Next higher standard OCPD rating permitted if ampacity does not correspond to standard rating, under specific conditions',
      'Small conductor restrictions: 14 AWG = 15A, 12 AWG = 20A, 10 AWG = 30A',
    ],
    keyValues: [
      { label: '14 AWG', value: '15A' },
      { label: '12 AWG', value: '20A' },
      { label: '10 AWG', value: '30A' },
    ],
  },
  {
    id: 'art-210-19',
    number: '210.19',
    title: 'Branch Circuit Conductor Sizing',
    category: 'Branch Circuits',
    summary: 'Requirements for sizing branch circuit conductors',
    details: [
      'Conductors shall have an ampacity not less than the maximum load to be served',
      'For other than continuous loads, 100% of load; for continuous loads, 125% of load',
      'Consider voltage drop: 3% for branch circuits, 5% total',
    ],
  },
  {
    id: 'art-215-2',
    number: '215.2',
    title: 'Feeder Conductor Sizing',
    category: 'Panels & Protection',
    summary: 'Requirements for sizing feeder conductors',
    details: [
      'Feeder conductors shall have ampacity not less than required to supply the load',
      'Continuous loads: 125% of load',
      'Consider voltage drop: 3% for feeders, 5% total',
    ],
  },
  {
    id: 'art-220-42',
    number: '220.42',
    title: 'General Lighting Load Demand Factors',
    category: 'General',
    summary: 'Demand factors for general lighting loads',
    details: [
      'First 12500 VA at 100%; next 112500 VA at 35%; remainder at 25%',
      'Dwelling units: 100% of lighting load',
    ],
  },
  {
    id: 'art-250-66',
    number: '250.66',
    title: 'Grounding Electrode Conductor Sizing',
    category: 'Grounding',
    summary: 'Sizing grounding electrode conductors for AC systems',
    details: [
      'Size based on largest service entrance conductor or equivalent area',
      'Table 250.66: Up to 2/0 Cu service = #6 Cu GEC; 3/0-350 Cu = #4 Cu; 400-600 Cu = #2 Cu; etc.',
    ],
    keyValues: [
      { label: 'Up to 2/0 Cu', value: '#6 Cu' },
      { label: '3/0-350 Cu', value: '#4 Cu' },
      { label: '400-600 Cu', value: '#2 Cu' },
    ],
  },
  {
    id: 'art-300-5',
    number: '300.5',
    title: 'Underground Installation Depth',
    category: 'General',
    summary: 'Minimum cover requirements for underground cables and raceways',
    details: [
      'Direct burial cables: 24 inches for 0-600V residential, 30 inches for commercial/industrial',
      'Raceways (conduit): 18 inches for 0-600V residential, 24 inches for commercial/industrial',
      'Protection required when less than minimum depth (concrete pad, etc.)',
    ],
  },
  {
    id: 'art-314-28',
    number: '314.28',
    title: 'Pull and Junction Box Sizing',
    category: 'Boxes & Raceways',
    summary: 'Minimum size requirements for pull and junction boxes',
    details: [
      'Straight pulls: length not less than 8 times the trade diameter of largest raceway',
      'Angle or U pulls: distance from entry to opposite wall not less than 6 times raceway diameter plus sum of diameters of other raceways in same row',
      'Splices and taps: box must be large enough for conductors and fittings',
    ],
  },
]

export function getArticleById(id: string): NECArticle | undefined {
  return NEC_ARTICLES.find(a => a.id === id)
}

export function searchArticles(query: string): NECArticle[] {
  const lower = query.toLowerCase()
  return NEC_ARTICLES.filter(a =>
    a.number.toLowerCase().includes(lower) ||
    a.title.toLowerCase().includes(lower) ||
    a.summary.toLowerCase().includes(lower) ||
    a.category.toLowerCase().includes(lower)
  )
}
