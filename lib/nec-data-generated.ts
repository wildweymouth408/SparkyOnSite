// Auto-generated NEC 2023 dataset
export const NEC_ARTICLES_DATA = [
  {
    "id": "art-110-26",
    "articleNumber": "110.26",
    "title": "Working Space About Electrical Equipment",
    "chapter": "Chapter 1: General",
    "scope": "Requirements for safe access and working space around electrical equipment",
    "content": [
      {
        "type": "paragraph",
        "text": "Working space shall be not less than 30 inches wide, 36 inches deep, and 6.5 feet high",
        "plainEnglish": "3 feet clear space in front of panels, floor to ceiling",
        "application": "All panelboards, switchboards, motor control centers",
        "id": "110.26(A)"
      },
      {
        "type": "paragraph",
        "text": "Clear working space required in front of equipment for safe operation",
        "plainEnglish": "No storage, boxes, or equipment blocking electrical panels",
        "application": "Electrical rooms, mechanical rooms, utility spaces",
        "id": "110.26(B)"
      },
      {
        "type": "violation",
        "scenario": "Storage boxes blocking electrical panel",
        "consequence": "No safe access for maintenance, arc flash hazard, OSHA violation",
        "fix": "Clear 36-inch deep, 30-inch wide, 6.5-foot high working space. Mark with floor tape."
      },
      {
        "type": "violation",
        "scenario": "Panel mounted too close to wall (less than 30 inches wide space)",
        "consequence": "Unable to safely work on energized equipment",
        "fix": "Relocate panel or widen access aisle to minimum 30 inches"
      }
    ],
    "relatedArticles": [
      "110.27",
      "408.36",
      "250.24"
    ],
    "keyPoints": [
      {
        "id": "110.26(A)",
        "text": "Working space shall be not less than 30 inches wide, 36 inches deep, and 6.5 feet high",
        "plainEnglish": "3 feet clear space in front of panels, floor to ceiling",
        "application": "All panelboards, switchboards, motor control centers"
      },
      {
        "id": "110.26(B)",
        "text": "Clear working space required in front of equipment for safe operation",
        "plainEnglish": "No storage, boxes, or equipment blocking electrical panels",
        "application": "Electrical rooms, mechanical rooms, utility spaces"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Storage boxes blocking electrical panel",
        "consequence": "No safe access for maintenance, arc flash hazard, OSHA violation",
        "fix": "Clear 36-inch deep, 30-inch wide, 6.5-foot high working space. Mark with floor tape."
      },
      {
        "scenario": "Panel mounted too close to wall (less than 30 inches wide space)",
        "consequence": "Unable to safely work on energized equipment",
        "fix": "Relocate panel or widen access aisle to minimum 30 inches"
      }
    ]
  },
  {
    "id": "art-210-8",
    "articleNumber": "210.8",
    "title": "GFCI Protection for Personnel",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Ground-fault circuit-interrupter protection requirements to prevent shock",
    "content": [
      {
        "type": "paragraph",
        "text": "GFCI protection required for all 125V single-phase 15A and 20A outlets in bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, laundry areas",
        "plainEnglish": "GFCI outlets or breakers required near water, outside, and damp locations",
        "application": "All residential, commercial, and industrial 120V general purpose outlets",
        "id": "210.8(A)"
      },
      {
        "type": "paragraph",
        "text": "Commercial and industrial facilities: GFCI for all 125V 15A/20A outlets in bathrooms, rooftops, kitchens",
        "plainEnglish": "Commercial kitchens, outdoor roof outlets, bathrooms need GFCI",
        "application": "Commercial tenant spaces, restaurants, office kitchens",
        "id": "210.8(B)"
      },
      {
        "type": "violation",
        "scenario": "Standard outlet within 6 feet of commercial sink without GFCI",
        "consequence": "Shock hazard in wet location, inspection failure",
        "fix": "Install GFCI receptacle or GFCI circuit breaker"
      },
      {
        "type": "violation",
        "scenario": "Missing GFCI in unfinished basement",
        "consequence": "Electrocution risk in damp environment",
        "fix": "Install GFCI protection for all 120V outlets in unfinished basements"
      }
    ],
    "relatedArticles": [
      "210.12",
      "406.4",
      "590.6"
    ],
    "keyPoints": [
      {
        "id": "210.8(A)",
        "text": "GFCI protection required for all 125V single-phase 15A and 20A outlets in bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, laundry areas",
        "plainEnglish": "GFCI outlets or breakers required near water, outside, and damp locations",
        "application": "All residential, commercial, and industrial 120V general purpose outlets",
        "exceptions": [
          "Dedicated appliance circuits not readily accessible",
          "Garage door openers in some jurisdictions"
        ]
      },
      {
        "id": "210.8(B)",
        "text": "Commercial and industrial facilities: GFCI for all 125V 15A/20A outlets in bathrooms, rooftops, kitchens",
        "plainEnglish": "Commercial kitchens, outdoor roof outlets, bathrooms need GFCI",
        "application": "Commercial tenant spaces, restaurants, office kitchens"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Standard outlet within 6 feet of commercial sink without GFCI",
        "consequence": "Shock hazard in wet location, inspection failure",
        "fix": "Install GFCI receptacle or GFCI circuit breaker"
      },
      {
        "scenario": "Missing GFCI in unfinished basement",
        "consequence": "Electrocution risk in damp environment",
        "fix": "Install GFCI protection for all 120V outlets in unfinished basements"
      }
    ]
  },
  {
    "id": "art-210-12",
    "articleNumber": "210.12",
    "title": "Arc-Fault Circuit-Interrupter Protection",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "AFCI requirements to prevent fires from electrical arcing",
    "content": [
      {
        "type": "paragraph",
        "text": "All 120V single-phase 15A and 20A branch circuits supplying outlets or devices in dwelling units shall be AFCI protected",
        "plainEnglish": "AFCI breakers required for almost all residential circuits (2023 NEC)",
        "application": "Bedrooms, living rooms, hallways, closets, kitchens, laundry rooms",
        "id": "210.12(A)"
      },
      {
        "type": "violation",
        "scenario": "Standard breaker used for bedroom circuit instead of AFCI",
        "consequence": "Fire safety violation, failed inspection, insurance issues",
        "fix": "Install combination-type AFCI circuit breaker"
      },
      {
        "type": "violation",
        "scenario": "AFCI breaker nuisance tripping with refrigerator or garage door opener",
        "consequence": "Loss of power to critical equipment",
        "fix": "Use AFCI breaker designed for motor loads, or dedicated non-AFCI circuit if code permits"
      }
    ],
    "relatedArticles": [
      "210.8",
      "406.4",
      "550.25"
    ],
    "keyPoints": [
      {
        "id": "210.12(A)",
        "text": "All 120V single-phase 15A and 20A branch circuits supplying outlets or devices in dwelling units shall be AFCI protected",
        "plainEnglish": "AFCI breakers required for almost all residential circuits (2023 NEC)",
        "application": "Bedrooms, living rooms, hallways, closets, kitchens, laundry rooms",
        "exceptions": [
          "Branch circuits supplying only fire alarm systems"
        ]
      }
    ],
    "commonViolations": [
      {
        "scenario": "Standard breaker used for bedroom circuit instead of AFCI",
        "consequence": "Fire safety violation, failed inspection, insurance issues",
        "fix": "Install combination-type AFCI circuit breaker"
      },
      {
        "scenario": "AFCI breaker nuisance tripping with refrigerator or garage door opener",
        "consequence": "Loss of power to critical equipment",
        "fix": "Use AFCI breaker designed for motor loads, or dedicated non-AFCI circuit if code permits"
      }
    ]
  },
  {
    "id": "art-250-24",
    "articleNumber": "250.24",
    "title": "Grounding Service-Supplied AC Systems",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Connection of grounded conductor to grounding electrode system at service",
    "content": [
      {
        "type": "paragraph",
        "text": "The grounded conductor shall be connected to the grounding electrode system at the service point",
        "plainEnglish": "Neutral connects to ground ONLY at the main service panel",
        "application": "Main service entrance - bonding screw/strap installed",
        "id": "250.24(A)"
      },
      {
        "type": "paragraph",
        "text": "Main bonding jumper shall connect the grounded conductor to the equipment grounding conductor",
        "plainEnglish": "In main panel only, connect neutral bus to ground bus/case",
        "application": "Main service panel - remove this bond in subpanels",
        "id": "250.24(B)"
      },
      {
        "type": "violation",
        "scenario": "Bonding screw left in subpanel (neutral and ground bonded)",
        "consequence": "Neutral current flows on ground paths, creates shock hazard, violates 250.24",
        "fix": "Remove green bonding screw or strap in subpanel. Neutral and ground must be separate downstream of main."
      },
      {
        "type": "violation",
        "scenario": "Subpanel fed with 3-wire (no separate ground) instead of 4-wire",
        "consequence": "No equipment grounding path, shock hazard",
        "fix": "Run 4-wire feeder (2 hots, neutral, ground) to subpanel"
      }
    ],
    "relatedArticles": [
      "250.32",
      "408.36",
      "310.16"
    ],
    "keyPoints": [
      {
        "id": "250.24(A)",
        "text": "The grounded conductor shall be connected to the grounding electrode system at the service point",
        "plainEnglish": "Neutral connects to ground ONLY at the main service panel",
        "application": "Main service entrance - bonding screw/strap installed",
        "exceptions": [
          "Separately derived systems per 250.30"
        ]
      },
      {
        "id": "250.24(B)",
        "text": "Main bonding jumper shall connect the grounded conductor to the equipment grounding conductor",
        "plainEnglish": "In main panel only, connect neutral bus to ground bus/case",
        "application": "Main service panel - remove this bond in subpanels"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Bonding screw left in subpanel (neutral and ground bonded)",
        "consequence": "Neutral current flows on ground paths, creates shock hazard, violates 250.24",
        "fix": "Remove green bonding screw or strap in subpanel. Neutral and ground must be separate downstream of main."
      },
      {
        "scenario": "Subpanel fed with 3-wire (no separate ground) instead of 4-wire",
        "consequence": "No equipment grounding path, shock hazard",
        "fix": "Run 4-wire feeder (2 hots, neutral, ground) to subpanel"
      }
    ]
  },
  {
    "id": "art-250-32",
    "articleNumber": "250.32",
    "title": "Grounding at Separate Buildings",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Grounding requirements for feeders to detached structures",
    "content": [
      {
        "type": "paragraph",
        "text": "Grounding electrode required at separate building supplied by feeder",
        "plainEnglish": "Running power to garage or shed? Needs ground rod(s) there",
        "application": "Detached garages, workshops, outbuildings with subpanels",
        "id": "250.32(A)"
      },
      {
        "type": "paragraph",
        "text": "Grounded conductor not to be connected to equipment grounding conductors at separate buildings",
        "plainEnglish": "Subpanel in garage: neutral isolated from ground, remove bonding screw",
        "application": "All subpanels in detached structures",
        "id": "250.32(B)"
      },
      {
        "type": "violation",
        "scenario": "Garage subpanel with neutral and ground bonded together",
        "consequence": "Parallel paths for neutral current, shock hazard, code violation",
        "fix": "Remove bonding screw in garage subpanel. Install separate ground bar."
      },
      {
        "type": "violation",
        "scenario": "Missing ground rod(s) at detached structure",
        "consequence": "Inadequate grounding, potential equipment damage, inspection fail",
        "fix": "Install minimum two ground rods 6 feet apart at separate building"
      }
    ],
    "relatedArticles": [
      "250.24",
      "250.53",
      "408.36"
    ],
    "keyPoints": [
      {
        "id": "250.32(A)",
        "text": "Grounding electrode required at separate building supplied by feeder",
        "plainEnglish": "Running power to garage or shed? Needs ground rod(s) there",
        "application": "Detached garages, workshops, outbuildings with subpanels",
        "exceptions": [
          "Single branch circuit with no subpanel"
        ]
      },
      {
        "id": "250.32(B)",
        "text": "Grounded conductor not to be connected to equipment grounding conductors at separate buildings",
        "plainEnglish": "Subpanel in garage: neutral isolated from ground, remove bonding screw",
        "application": "All subpanels in detached structures"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Garage subpanel with neutral and ground bonded together",
        "consequence": "Parallel paths for neutral current, shock hazard, code violation",
        "fix": "Remove bonding screw in garage subpanel. Install separate ground bar."
      },
      {
        "scenario": "Missing ground rod(s) at detached structure",
        "consequence": "Inadequate grounding, potential equipment damage, inspection fail",
        "fix": "Install minimum two ground rods 6 feet apart at separate building"
      }
    ]
  },
  {
    "id": "art-250-53",
    "articleNumber": "250.53",
    "title": "Grounding Electrode Installation",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Requirements for grounding electrodes and their installation",
    "content": [
      {
        "type": "paragraph",
        "text": "Rod, pipe, and plate electrodes shall not be less than 8 feet in length",
        "plainEnglish": "Ground rods must be 8 feet long, driven fully except for connection",
        "application": "Commercial and residential services",
        "id": "250.53(A)"
      },
      {
        "type": "paragraph",
        "text": "Two grounding electrodes required unless single rod proves <25 ohms resistance",
        "plainEnglish": "Install two ground rods minimum - don't bother testing, just add the second",
        "application": "All new construction, commercial services",
        "id": "250.53(B)"
      },
      {
        "type": "paragraph",
        "text": "Spacing of electrode shall be not less than 6 feet apart",
        "plainEnglish": "Ground rods must be minimum 6 feet apart to be effective",
        "application": "Multiple ground rod installations",
        "id": "250.53(C)"
      },
      {
        "type": "violation",
        "scenario": "Single ground rod for commercial service without resistance test",
        "consequence": "Inadequate grounding, potential equipment damage, inspection failure",
        "fix": "Install second ground rod minimum 6 feet from first, or perform fall-of-potential test proving <25 ohms"
      },
      {
        "type": "violation",
        "scenario": "Ground rods installed only 2-3 feet apart",
        "consequence": "Electrodes act as single ground, ineffective grounding system",
        "fix": "Space ground rods minimum 6 feet apart (more is better)"
      }
    ],
    "relatedArticles": [
      "250.24",
      "250.32",
      "250.66"
    ],
    "keyPoints": [
      {
        "id": "250.53(A)",
        "text": "Rod, pipe, and plate electrodes shall not be less than 8 feet in length",
        "plainEnglish": "Ground rods must be 8 feet long, driven fully except for connection",
        "application": "Commercial and residential services"
      },
      {
        "id": "250.53(B)",
        "text": "Two grounding electrodes required unless single rod proves <25 ohms resistance",
        "plainEnglish": "Install two ground rods minimum - don't bother testing, just add the second",
        "application": "All new construction, commercial services"
      },
      {
        "id": "250.53(C)",
        "text": "Spacing of electrode shall be not less than 6 feet apart",
        "plainEnglish": "Ground rods must be minimum 6 feet apart to be effective",
        "application": "Multiple ground rod installations"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Single ground rod for commercial service without resistance test",
        "consequence": "Inadequate grounding, potential equipment damage, inspection failure",
        "fix": "Install second ground rod minimum 6 feet from first, or perform fall-of-potential test proving <25 ohms"
      },
      {
        "scenario": "Ground rods installed only 2-3 feet apart",
        "consequence": "Electrodes act as single ground, ineffective grounding system",
        "fix": "Space ground rods minimum 6 feet apart (more is better)"
      }
    ]
  },
  {
    "id": "art-310-16",
    "articleNumber": "310.16",
    "title": "Allowable Ampacities",
    "chapter": "Chapter 3: Wiring Methods",
    "scope": "Ampacity tables for wire sizing based on temperature ratings",
    "content": [
      {
        "type": "paragraph",
        "text": "Ampacities for conductors rated 0-2000 volts per Table 310.16",
        "plainEnglish": "How many amps can this wire carry? Depends on temperature rating (60°C, 75°C, 90°C)",
        "application": "Sizing branch circuit and feeder conductors",
        "id": "310.16-General"
      },
      {
        "type": "table",
        "caption": "Table 310.16 — Ampacity of Insulated Conductors Rated 0–2000V in Raceway, Cable, or Earth (Based on Ambient Temp 30°C / 86°F)",
        "rows": [
          { "Size": "14 AWG", "Cu 60°C": "15*", "Cu 75°C": "15*", "Cu 90°C": "15*", "Al 60°C": "—", "Al 75°C": "—", "Al 90°C": "—" },
          { "Size": "12 AWG", "Cu 60°C": "20*", "Cu 75°C": "20*", "Cu 90°C": "20*", "Al 60°C": "15*", "Al 75°C": "15*", "Al 90°C": "15*" },
          { "Size": "10 AWG", "Cu 60°C": "30*", "Cu 75°C": "30*", "Cu 90°C": "30*", "Al 60°C": "25*", "Al 75°C": "25*", "Al 90°C": "25*" },
          { "Size": "8 AWG",  "Cu 60°C": "40",  "Cu 75°C": "50",  "Cu 90°C": "55",  "Al 60°C": "30",  "Al 75°C": "40",  "Al 90°C": "45" },
          { "Size": "6 AWG",  "Cu 60°C": "55",  "Cu 75°C": "65",  "Cu 90°C": "75",  "Al 60°C": "40",  "Al 75°C": "50",  "Al 90°C": "60" },
          { "Size": "4 AWG",  "Cu 60°C": "70",  "Cu 75°C": "85",  "Cu 90°C": "95",  "Al 60°C": "55",  "Al 75°C": "65",  "Al 90°C": "75" },
          { "Size": "3 AWG",  "Cu 60°C": "85",  "Cu 75°C": "100", "Cu 90°C": "115", "Al 60°C": "65",  "Al 75°C": "75",  "Al 90°C": "85" },
          { "Size": "2 AWG",  "Cu 60°C": "95",  "Cu 75°C": "115", "Cu 90°C": "130", "Al 60°C": "75",  "Al 75°C": "90",  "Al 90°C": "100" },
          { "Size": "1 AWG",  "Cu 60°C": "110", "Cu 75°C": "130", "Cu 90°C": "145", "Al 60°C": "85",  "Al 75°C": "100", "Al 90°C": "115" },
          { "Size": "1/0",    "Cu 60°C": "125", "Cu 75°C": "150", "Cu 90°C": "170", "Al 60°C": "100", "Al 75°C": "120", "Al 90°C": "135" },
          { "Size": "2/0",    "Cu 60°C": "145", "Cu 75°C": "175", "Cu 90°C": "195", "Al 60°C": "115", "Al 75°C": "135", "Al 90°C": "150" },
          { "Size": "3/0",    "Cu 60°C": "165", "Cu 75°C": "200", "Cu 90°C": "225", "Al 60°C": "130", "Al 75°C": "155", "Al 90°C": "175" },
          { "Size": "4/0",    "Cu 60°C": "195", "Cu 75°C": "230", "Cu 90°C": "260", "Al 60°C": "150", "Al 75°C": "180", "Al 90°C": "205" },
          { "Size": "250 kcmil", "Cu 60°C": "215", "Cu 75°C": "255", "Cu 90°C": "290", "Al 60°C": "170", "Al 75°C": "205", "Al 90°C": "230" },
          { "Size": "300 kcmil", "Cu 60°C": "240", "Cu 75°C": "285", "Cu 90°C": "320", "Al 60°C": "190", "Al 75°C": "230", "Al 90°C": "255" },
          { "Size": "350 kcmil", "Cu 60°C": "260", "Cu 75°C": "310", "Cu 90°C": "350", "Al 60°C": "210", "Al 75°C": "250", "Al 90°C": "280" },
          { "Size": "400 kcmil", "Cu 60°C": "280", "Cu 75°C": "335", "Cu 90°C": "380", "Al 60°C": "225", "Al 75°C": "270", "Al 90°C": "305" },
          { "Size": "500 kcmil", "Cu 60°C": "320", "Cu 75°C": "380", "Cu 90°C": "430", "Al 60°C": "260", "Al 75°C": "310", "Al 90°C": "350" },
          { "Size": "600 kcmil", "Cu 60°C": "355", "Cu 75°C": "420", "Cu 90°C": "475", "Al 60°C": "285", "Al 75°C": "340", "Al 90°C": "385" },
          { "Size": "750 kcmil", "Cu 60°C": "400", "Cu 75°C": "475", "Cu 90°C": "535", "Al 60°C": "320", "Al 75°C": "385", "Al 90°C": "435" },
          { "Size": "1000 kcmil","Cu 60°C": "455", "Cu 75°C": "545", "Cu 90°C": "615", "Al 60°C": "375", "Al 75°C": "445", "Al 90°C": "500" }
        ]
      },
      {
        "type": "paragraph",
        "text": "Adjustment factors for more than three current-carrying conductors in raceway",
        "plainEnglish": "4-6 wires in conduit = 80% of table ampacity. 7-9 wires = 70%.",
        "application": "Conduit fill derating calculations",
        "id": "310.15(B)(3)(a)"
      },
      {
        "type": "violation",
        "scenario": "14 AWG wire on 20A breaker (using 60°C ampacity)",
        "consequence": "Fire hazard from overheated conductors, insulation damage",
        "fix": "Use 12 AWG minimum for 20A circuits, or downsize breaker to 15A"
      },
      {
        "type": "violation",
        "scenario": "Not derating ampacity for 6 circuits in single conduit",
        "consequence": "Conductors overheat due to bundled heat, fire hazard",
        "fix": "Apply 80% derating factor to Table 310.16 ampacities, or separate circuits into multiple conduits"
      }
    ],
    "relatedArticles": [
      "210.19",
      "250.66",
      "314.16"
    ],
    "keyPoints": [
      {
        "id": "310.16-General",
        "text": "Ampacities for conductors rated 0-2000 volts per Table 310.16",
        "plainEnglish": "How many amps can this wire carry? Depends on temperature rating (60°C, 75°C, 90°C)",
        "application": "Sizing branch circuit and feeder conductors"
      },
      {
        "id": "310.15(B)(3)(a)",
        "text": "Adjustment factors for more than three current-carrying conductors in raceway",
        "plainEnglish": "4-6 wires in conduit = 80% of table ampacity. 7-9 wires = 70%.",
        "application": "Conduit fill derating calculations"
      }
    ],
    "commonViolations": [
      {
        "scenario": "14 AWG wire on 20A breaker (using 60°C ampacity)",
        "consequence": "Fire hazard from overheated conductors, insulation damage",
        "fix": "Use 12 AWG minimum for 20A circuits, or downsize breaker to 15A"
      },
      {
        "scenario": "Not derating ampacity for 6 circuits in single conduit",
        "consequence": "Conductors overheat due to bundled heat, fire hazard",
        "fix": "Apply 80% derating factor to Table 310.16 ampacities, or separate circuits into multiple conduits"
      }
    ]
  },
  {
    "id": "art-314-16",
    "articleNumber": "314.16",
    "title": "Box Fill Calculations",
    "chapter": "Chapter 3: Wiring Methods",
    "scope": "Box fill calculations and volume requirements",
    "content": [
      {
        "type": "paragraph",
        "text": "Boxes shall be of sufficient size to provide free space for all enclosed conductors",
        "plainEnglish": "Count your wires - each box has maximum fill capacity",
        "application": "All junction boxes, outlet boxes, device boxes",
        "id": "314.16(A)"
      },
      {
        "type": "paragraph",
        "text": "Volume allowance: 14 AWG = 2.00 cu.in., 12 AWG = 2.25 cu.in., 10 AWG = 2.50 cu.in.",
        "plainEnglish": "14 gauge wire takes 2 cubic inches, 12 gauge takes 2.25, etc.",
        "application": "Calculating required box size",
        "id": "314.16(B)"
      },
      {
        "type": "paragraph",
        "text": "Device or equipment fill shall be counted as 2 conductors",
        "plainEnglish": "Switch or receptacle in box counts as 2 wires worth of space",
        "application": "Device box calculations",
        "id": "314.16(B)(4)"
      },
      {
        "type": "paragraph",
        "text": "Clamp fill shall be counted as 1 conductor",
        "plainEnglish": "Cable clamps inside box count as 1 wire worth of space",
        "application": "Metal box calculations",
        "id": "314.16(B)(2)"
      },
      {
        "type": "table",
        "caption": "Table 314.16(A) — Metal Boxes — Maximum Volume",
        "rows": [
          { "Box Type": "4\" Sq × 1-1/4\"", "Volume (cu.in.)": "18.0" },
          { "Box Type": "4\" Sq × 1-1/2\"", "Volume (cu.in.)": "21.0" },
          { "Box Type": "4\" Sq × 2-1/8\"", "Volume (cu.in.)": "30.3" },
          { "Box Type": "4-11/16\" Sq × 1-1/4\"", "Volume (cu.in.)": "25.5" },
          { "Box Type": "4-11/16\" Sq × 1-1/2\"", "Volume (cu.in.)": "29.5" },
          { "Box Type": "4-11/16\" Sq × 2-1/8\"", "Volume (cu.in.)": "42.0" },
          { "Box Type": "3×2×1-1/2\" Device", "Volume (cu.in.)": "7.5" },
          { "Box Type": "3×2×2\" Device", "Volume (cu.in.)": "10.0" },
          { "Box Type": "3×2×2-1/4\" Device", "Volume (cu.in.)": "10.5" },
          { "Box Type": "3×2×2-1/2\" Device", "Volume (cu.in.)": "12.5" },
          { "Box Type": "3×2×2-3/4\" Device", "Volume (cu.in.)": "14.0" },
          { "Box Type": "3×2×3-1/2\" Device", "Volume (cu.in.)": "18.0" },
          { "Box Type": "4\" Oct × 1-1/4\"", "Volume (cu.in.)": "12.5" },
          { "Box Type": "4\" Oct × 1-1/2\"", "Volume (cu.in.)": "15.5" },
          { "Box Type": "4\" Oct × 2-1/8\"", "Volume (cu.in.)": "21.5" }
        ]
      },
      {
        "type": "table",
        "caption": "Table 314.16(B) — Volume Allowance Required per Conductor",
        "rows": [
          { "Wire Size": "18 AWG", "Volume (cu.in.)": "1.50" },
          { "Wire Size": "16 AWG", "Volume (cu.in.)": "1.75" },
          { "Wire Size": "14 AWG", "Volume (cu.in.)": "2.00" },
          { "Wire Size": "12 AWG", "Volume (cu.in.)": "2.25" },
          { "Wire Size": "10 AWG", "Volume (cu.in.)": "2.50" },
          { "Wire Size": "8 AWG",  "Volume (cu.in.)": "3.00" },
          { "Wire Size": "6 AWG",  "Volume (cu.in.)": "5.00" }
        ]
      },
      {
        "type": "violation",
        "scenario": "Box overstuffed with too many wire connections",
        "consequence": "Overheating, damaged wire insulation, short circuits, inspection fail",
        "fix": "Calculate fill: count each wire + device (as 2) + clamps (as 1). Use larger box or add extension ring if overfilled."
      },
      {
        "type": "violation",
        "scenario": "4-inch square box with 12 AWG wires and receptacle - no extension ring",
        "consequence": "Box overfilled beyond 21 cubic inches, wires compressed",
        "fix": "4-inch square = 21 cu.in. max. Add extension ring for additional wires."
      }
    ],
    "relatedArticles": [
      "314.20",
      "314.24",
      "300.14"
    ],
    "keyPoints": [
      {
        "id": "314.16(A)",
        "text": "Boxes shall be of sufficient size to provide free space for all enclosed conductors",
        "plainEnglish": "Count your wires - each box has maximum fill capacity",
        "application": "All junction boxes, outlet boxes, device boxes"
      },
      {
        "id": "314.16(B)",
        "text": "Volume allowance: 14 AWG = 2.00 cu.in., 12 AWG = 2.25 cu.in., 10 AWG = 2.50 cu.in.",
        "plainEnglish": "14 gauge wire takes 2 cubic inches, 12 gauge takes 2.25, etc.",
        "application": "Calculating required box size"
      },
      {
        "id": "314.16(B)(4)",
        "text": "Device or equipment fill shall be counted as 2 conductors",
        "plainEnglish": "Switch or receptacle in box counts as 2 wires worth of space",
        "application": "Device box calculations"
      },
      {
        "id": "314.16(B)(2)",
        "text": "Clamp fill shall be counted as 1 conductor",
        "plainEnglish": "Cable clamps inside box count as 1 wire worth of space",
        "application": "Metal box calculations"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Box overstuffed with too many wire connections",
        "consequence": "Overheating, damaged wire insulation, short circuits, inspection fail",
        "fix": "Calculate fill: count each wire + device (as 2) + clamps (as 1). Use larger box or add extension ring if overfilled."
      },
      {
        "scenario": "4-inch square box with 12 AWG wires and receptacle - no extension ring",
        "consequence": "Box overfilled beyond 21 cubic inches, wires compressed",
        "fix": "4-inch square = 21 cu.in. max. Add extension ring for additional wires."
      }
    ]
  },
  {
    "id": "art-250-122",
    "articleNumber": "250.122",
    "title": "Equipment Grounding Conductor Sizing",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Minimum size of equipment grounding conductors based on overcurrent device rating",
    "content": [
      {
        "type": "paragraph",
        "text": "Size based on the rating of the overcurrent device protecting the circuit",
        "plainEnglish": "Equipment ground wire size matches breaker size",
        "application": "Sizing equipment grounding conductors for feeders and branch circuits",
        "id": "250.122(A)"
      },
      {
        "type": "paragraph",
        "text": "15A OCPD: #14 Cu / #12 Al; 20A OCPD: #12 Cu / #10 Al; 30A OCPD: #10 Cu / #8 Al; 40A OCPD: #10 Cu / #8 Al; 60A OCPD: #10 Cu / #8 Al; 100A OCPD: #8 Cu / #6 Al; 200A OCPD: #6 Cu / #4 Al; 400A OCPD: #3 Cu / #1 Al; 600A OCPD: #1 Cu / 1/0 Al; 800A OCPD: 1/0 Cu / 3/0 Al; 1000A OCPD: 2/0 Cu / 4/0 Al",
        "plainEnglish": "Larger breaker requires larger ground wire",
        "application": "Select EGC size from Table 250.122",
        "id": "250.122(B)"
      },
      {
        "type": "paragraph",
        "text": "Where circuit conductors are increased in size for voltage drop, EGC must be proportionally increased",
        "plainEnglish": "If you upsize wires for voltage drop, you must also upsize the ground wire",
        "application": "Long wire runs with increased conductor size",
        "id": "250.122(C)"
      },
      {
        "type": "violation",
        "scenario": "Using #14 ground with 20A circuit",
        "consequence": "Inadequate fault current path, potential equipment damage and shock hazard",
        "fix": "Use #12 copper ground for 20A circuits"
      },
      {
        "type": "violation",
        "scenario": "Not up-sizing ground wire when conductors increased for voltage drop",
        "consequence": "Ground wire undersized relative to circuit conductors, slow trip times",
        "fix": "Increase ground wire size proportionally to the circuit conductor increase"
      }
    ],
    "relatedArticles": [
      "250.66",
      "310.16",
      "240.4"
    ],
    "keyPoints": [
      {
        "id": "250.122(A)",
        "text": "Size based on the rating of the overcurrent device protecting the circuit",
        "plainEnglish": "Equipment ground wire size matches breaker size",
        "application": "Sizing equipment grounding conductors for feeders and branch circuits"
      },
      {
        "id": "250.122(B)",
        "text": "15A OCPD: #14 Cu / #12 Al; 20A OCPD: #12 Cu / #10 Al; 30A OCPD: #10 Cu / #8 Al; 40A OCPD: #10 Cu / #8 Al; 60A OCPD: #10 Cu / #8 Al; 100A OCPD: #8 Cu / #6 Al; 200A OCPD: #6 Cu / #4 Al; 400A OCPD: #3 Cu / #1 Al; 600A OCPD: #1 Cu / 1/0 Al; 800A OCPD: 1/0 Cu / 3/0 Al; 1000A OCPD: 2/0 Cu / 4/0 Al",
        "plainEnglish": "Larger breaker requires larger ground wire",
        "application": "Select EGC size from Table 250.122"
      },
      {
        "id": "250.122(C)",
        "text": "Where circuit conductors are increased in size for voltage drop, EGC must be proportionally increased",
        "plainEnglish": "If you upsize wires for voltage drop, you must also upsize the ground wire",
        "application": "Long wire runs with increased conductor size"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Using #14 ground with 20A circuit",
        "consequence": "Inadequate fault current path, potential equipment damage and shock hazard",
        "fix": "Use #12 copper ground for 20A circuits"
      },
      {
        "scenario": "Not up-sizing ground wire when conductors increased for voltage drop",
        "consequence": "Ground wire undersized relative to circuit conductors, slow trip times",
        "fix": "Increase ground wire size proportionally to the circuit conductor increase"
      }
    ]
  },
  {
    "id": "art-334-80",
    "articleNumber": "334.80",
    "title": "NM Cable Ampacity Adjustment",
    "chapter": "Chapter 3: Wiring Methods",
    "scope": "Ampacity adjustment for NM (Romex) cables bundled together or in thermal insulation",
    "content": [
      {
        "type": "paragraph",
        "text": "Where more than 2 NM cables containing 2 or more current-carrying conductors are installed in contact with thermal insulation without maintaining spacing, the ampacity of each conductor shall be adjusted per 310.15(C)(1)",
        "plainEnglish": "Bundled Romex in insulation must be derated",
        "application": "Attic runs, insulated wall cavities",
        "id": "334.80(A)"
      },
      {
        "type": "paragraph",
        "text": "When NM cable is installed in thermal insulation, ampacity is limited to the 60°C column of Table 310.16",
        "plainEnglish": "Romex in insulation cannot use the 90°C column",
        "application": "NM cable in spray foam, batt insulation",
        "id": "334.80(B)"
      },
      {
        "type": "violation",
        "scenario": "Running multiple NM cables through bored holes without spacing",
        "consequence": "Overheating due to bundling, fire hazard",
        "fix": "Maintain spacing between cables or derate ampacity per 310.15(C)(1)"
      },
      {
        "type": "violation",
        "scenario": "Using 90°C ampacity for NM cable in insulation",
        "consequence": "Conductors overheat, insulation damage",
        "fix": "Use 60°C ampacity column for NM cable in thermal insulation"
      }
    ],
    "relatedArticles": [
      "310.16",
      "310.15",
      "334.12"
    ],
    "keyPoints": [
      {
        "id": "334.80(A)",
        "text": "Where more than 2 NM cables containing 2 or more current-carrying conductors are installed in contact with thermal insulation without maintaining spacing, the ampacity of each conductor shall be adjusted per 310.15(C)(1)",
        "plainEnglish": "Bundled Romex in insulation must be derated",
        "application": "Attic runs, insulated wall cavities"
      },
      {
        "id": "334.80(B)",
        "text": "When NM cable is installed in thermal insulation, ampacity is limited to the 60°C column of Table 310.16",
        "plainEnglish": "Romex in insulation cannot use the 90°C column",
        "application": "NM cable in spray foam, batt insulation"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Running multiple NM cables through bored holes without spacing",
        "consequence": "Overheating due to bundling, fire hazard",
        "fix": "Maintain spacing between cables or derate ampacity per 310.15(C)(1)"
      },
      {
        "scenario": "Using 90°C ampacity for NM cable in insulation",
        "consequence": "Conductors overheat, insulation damage",
        "fix": "Use 60°C ampacity column for NM cable in thermal insulation"
      }
    ]
  },
  {
    "id": "art-408-36",
    "articleNumber": "408.36",
    "title": "Panelboard Overcurrent Protection",
    "chapter": "Chapter 4: Equipment for General Use",
    "scope": "Requirements for overcurrent protection of panelboards",
    "content": [
      {
        "type": "paragraph",
        "text": "Each panelboard shall be protected by an overcurrent protective device having a rating not greater than that of the panelboard",
        "plainEnglish": "Breaker protecting panel must match or be less than panel rating",
        "application": "Main breaker sizing, feeder breaker sizing",
        "id": "408.36(A)"
      },
      {
        "type": "paragraph",
        "text": "The overcurrent device shall be located within or at any point on the supply side of the panelboard",
        "plainEnglish": "Protection can be upstream, not necessarily inside panel",
        "application": "Feeder breaker location",
        "id": "408.36(B)"
      },
      {
        "type": "paragraph",
        "text": "Back-fed devices used for supply shall be secured in the 'on' position with a fastener",
        "plainEnglish": "Main breaker in panel must be fastened",
        "application": "Panel installation, generator interlock kits",
        "id": "408.36(C)"
      },
      {
        "type": "violation",
        "scenario": "Panelboard rated 100A fed by 125A breaker",
        "consequence": "Panel may overheat, fire hazard",
        "fix": "Replace breaker with 100A or smaller"
      },
      {
        "type": "violation",
        "scenario": "Back-fed main breaker not secured with fastener",
        "consequence": "Breaker can be accidentally turned off, arcing hazard",
        "fix": "Install approved fastener kit to secure breaker"
      }
    ],
    "relatedArticles": [
      "408.30",
      "408.40",
      "240.4"
    ],
    "keyPoints": [
      {
        "id": "408.36(A)",
        "text": "Each panelboard shall be protected by an overcurrent protective device having a rating not greater than that of the panelboard",
        "plainEnglish": "Breaker protecting panel must match or be less than panel rating",
        "application": "Main breaker sizing, feeder breaker sizing"
      },
      {
        "id": "408.36(B)",
        "text": "The overcurrent device shall be located within or at any point on the supply side of the panelboard",
        "plainEnglish": "Protection can be upstream, not necessarily inside panel",
        "application": "Feeder breaker location"
      },
      {
        "id": "408.36(C)",
        "text": "Back-fed devices used for supply shall be secured in the 'on' position with a fastener",
        "plainEnglish": "Main breaker in panel must be fastened",
        "application": "Panel installation, generator interlock kits"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Panelboard rated 100A fed by 125A breaker",
        "consequence": "Panel may overheat, fire hazard",
        "fix": "Replace breaker with 100A or smaller"
      },
      {
        "scenario": "Back-fed main breaker not secured with fastener",
        "consequence": "Breaker can be accidentally turned off, arcing hazard",
        "fix": "Install approved fastener kit to secure breaker"
      }
    ]
  },
  {
    "id": "art-422-11",
    "articleNumber": "422.11",
    "title": "GFCI Protection for Appliances",
    "chapter": "Chapter 4: Equipment for General Use",
    "scope": "Specific appliances requiring GFCI protection regardless of location",
    "content": [
      {
        "type": "paragraph",
        "text": "Automotive vacuum machines, drinking water coolers, high-pressure spray washing machines, tire inflation machines, vending machines, sump pumps, sewage pumps, dishwashers require GFCI protection",
        "plainEnglish": "Many appliances need GFCI even if not in wet location",
        "application": "Commercial appliances, residential dishwashers",
        "id": "422.11(A)"
      },
      {
        "type": "violation",
        "scenario": "Dishwasher installed without GFCI protection",
        "consequence": "Shock hazard, code violation",
        "fix": "Install GFCI breaker or receptacle for dishwasher circuit"
      },
      {
        "type": "violation",
        "scenario": "Vending machine plugged into standard outlet",
        "consequence": "Shock hazard in potentially wet area",
        "fix": "Provide GFCI protection for vending machine outlet"
      }
    ],
    "relatedArticles": [
      "210.8",
      "422.5",
      "550.15"
    ],
    "keyPoints": [
      {
        "id": "422.11(A)",
        "text": "Automotive vacuum machines, drinking water coolers, high-pressure spray washing machines, tire inflation machines, vending machines, sump pumps, sewage pumps, dishwashers require GFCI protection",
        "plainEnglish": "Many appliances need GFCI even if not in wet location",
        "application": "Commercial appliances, residential dishwashers"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Dishwasher installed without GFCI protection",
        "consequence": "Shock hazard, code violation",
        "fix": "Install GFCI breaker or receptacle for dishwasher circuit"
      },
      {
        "scenario": "Vending machine plugged into standard outlet",
        "consequence": "Shock hazard in potentially wet area",
        "fix": "Provide GFCI protection for vending machine outlet"
      }
    ]
  },
  {
    "id": "art-430-52",
    "articleNumber": "430.52",
    "title": "Motor Branch Circuit Protection",
    "chapter": "Chapter 4: Equipment for General Use",
    "scope": "Maximum rating of motor branch-circuit short-circuit and ground-fault protective devices",
    "content": [
      {
        "type": "paragraph",
        "text": "Dual-element fuse (time-delay): 175% of motor FLC; Instantaneous trip breaker: 800% of motor FLC (1100% for Design B energy efficient); Inverse time breaker: 250% of motor FLC",
        "plainEnglish": "Motor breakers/fuses can be much larger than motor current to allow starting",
        "application": "Sizing motor overload protection",
        "id": "430.52(A)"
      },
      {
        "type": "paragraph",
        "text": "If value does not correspond to standard OCPD size, next higher standard size permitted",
        "plainEnglish": "Round up to the next standard breaker size",
        "application": "Selecting breaker size",
        "id": "430.52(B)"
      },
      {
        "type": "paragraph",
        "text": "Motor FLC from NEC tables 430.247-250 (not nameplate)",
        "plainEnglish": "Use NEC tables, not motor nameplate, for full load current",
        "application": "Lookup motor FLC based on horsepower and voltage",
        "id": "430.52(C)"
      },
      {
        "type": "violation",
        "scenario": "Using motor nameplate current instead of NEC table",
        "consequence": "Incorrect OCPD sizing, nuisance trips or inadequate protection",
        "fix": "Use NEC Table 430.247-250 for motor FLC"
      },
      {
        "type": "violation",
        "scenario": "Sizing breaker at 100% of motor FLC",
        "consequence": "Breaker trips on motor startup",
        "fix": "Size per 430.52 percentages (175% fuse, 250% breaker)"
      }
    ],
    "relatedArticles": [
      "430.6",
      "430.32",
      "430.250"
    ],
    "keyPoints": [
      {
        "id": "430.52(A)",
        "text": "Dual-element fuse (time-delay): 175% of motor FLC; Instantaneous trip breaker: 800% of motor FLC (1100% for Design B energy efficient); Inverse time breaker: 250% of motor FLC",
        "plainEnglish": "Motor breakers/fuses can be much larger than motor current to allow starting",
        "application": "Sizing motor overload protection"
      },
      {
        "id": "430.52(B)",
        "text": "If value does not correspond to standard OCPD size, next higher standard size permitted",
        "plainEnglish": "Round up to the next standard breaker size",
        "application": "Selecting breaker size"
      },
      {
        "id": "430.52(C)",
        "text": "Motor FLC from NEC tables 430.247-250 (not nameplate)",
        "plainEnglish": "Use NEC tables, not motor nameplate, for full load current",
        "application": "Lookup motor FLC based on horsepower and voltage"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Using motor nameplate current instead of NEC table",
        "consequence": "Incorrect OCPD sizing, nuisance trips or inadequate protection",
        "fix": "Use NEC Table 430.247-250 for motor FLC"
      },
      {
        "scenario": "Sizing breaker at 100% of motor FLC",
        "consequence": "Breaker trips on motor startup",
        "fix": "Size per 430.52 percentages (175% fuse, 250% breaker)"
      }
    ]
  },
  {
    "id": "art-240-4",
    "articleNumber": "240.4",
    "title": "Overcurrent Protection General",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "General requirements for overcurrent protection of conductors",
    "content": [
      {
        "type": "paragraph",
        "text": "Conductors shall be protected against overcurrent in accordance with their ampacities",
        "plainEnglish": "Breaker/fuse must match wire size",
        "application": "Basic circuit protection",
        "id": "240.4(A)"
      },
      {
        "type": "paragraph",
        "text": "Next higher standard OCPD rating permitted if ampacity does not correspond to standard rating, under specific conditions",
        "plainEnglish": "Can go up one size if wire ampacity is between standard breaker sizes",
        "application": "Oversized conductors for voltage drop",
        "id": "240.4(B)"
      },
      {
        "type": "paragraph",
        "text": "Small conductor restrictions: 14 AWG = 15A, 12 AWG = 20A, 10 AWG = 30A",
        "plainEnglish": "Don't put 14 gauge on a 20A breaker",
        "application": "Residential and commercial branch circuits",
        "id": "240.4(D)"
      },
      {
        "type": "violation",
        "scenario": "14 AWG wire on 20A breaker",
        "consequence": "Fire hazard, insulation damage",
        "fix": "Use 15A breaker or upgrade to 12 AWG wire"
      },
      {
        "type": "violation",
        "scenario": "Oversized breaker for voltage drop without meeting 240.4(B) conditions",
        "consequence": "Inadequate protection, fire risk",
        "fix": "Ensure all conditions met before using next higher size"
      }
    ],
    "relatedArticles": [
      "310.16",
      "240.21",
      "240.6"
    ],
    "keyPoints": [
      {
        "id": "240.4(A)",
        "text": "Conductors shall be protected against overcurrent in accordance with their ampacities",
        "plainEnglish": "Breaker/fuse must match wire size",
        "application": "Basic circuit protection"
      },
      {
        "id": "240.4(B)",
        "text": "Next higher standard OCPD rating permitted if ampacity does not correspond to standard rating, under specific conditions",
        "plainEnglish": "Can go up one size if wire ampacity is between standard breaker sizes",
        "application": "Oversized conductors for voltage drop"
      },
      {
        "id": "240.4(D)",
        "text": "Small conductor restrictions: 14 AWG = 15A, 12 AWG = 20A, 10 AWG = 30A",
        "plainEnglish": "Don't put 14 gauge on a 20A breaker",
        "application": "Residential and commercial branch circuits"
      }
    ],
    "commonViolations": [
      {
        "scenario": "14 AWG wire on 20A breaker",
        "consequence": "Fire hazard, insulation damage",
        "fix": "Use 15A breaker or upgrade to 12 AWG wire"
      },
      {
        "scenario": "Oversized breaker for voltage drop without meeting 240.4(B) conditions",
        "consequence": "Inadequate protection, fire risk",
        "fix": "Ensure all conditions met before using next higher size"
      }
    ]
  },
  {
    "id": "art-210-19",
    "articleNumber": "210.19",
    "title": "Branch Circuit Conductor Sizing",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Requirements for sizing branch circuit conductors",
    "content": [
      {
        "type": "paragraph",
        "text": "Conductors shall have an ampacity not less than the maximum load to be served",
        "plainEnglish": "Wire must be big enough for the load",
        "application": "Sizing branch circuits for appliances, outlets",
        "id": "210.19(A)"
      },
      {
        "type": "paragraph",
        "text": "For other than continuous loads, 100% of load; for continuous loads, 125% of load",
        "plainEnglish": "Continuous loads (on 3+ hours) require larger wire",
        "application": "Lighting, motor loads",
        "id": "210.19(A)(1)"
      },
      {
        "type": "paragraph",
        "text": "Consider voltage drop: 3% for branch circuits, 5% total",
        "plainEnglish": "Long wire runs may need bigger wire to prevent voltage drop",
        "application": "Outbuildings, long circuits",
        "id": "210.19(A)(2)"
      },
      {
        "type": "violation",
        "scenario": "Sizing wire for continuous load at 100% instead of 125%",
        "consequence": "Overheating, insulation damage",
        "fix": "Multiply continuous load by 1.25 before selecting wire size"
      },
      {
        "type": "violation",
        "scenario": "Ignoring voltage drop on long runs",
        "consequence": "Poor appliance performance, motor damage",
        "fix": "Increase conductor size or reduce run length"
      }
    ],
    "relatedArticles": [
      "210.20",
      "215.2",
      "310.16"
    ],
    "keyPoints": [
      {
        "id": "210.19(A)",
        "text": "Conductors shall have an ampacity not less than the maximum load to be served",
        "plainEnglish": "Wire must be big enough for the load",
        "application": "Sizing branch circuits for appliances, outlets"
      },
      {
        "id": "210.19(A)(1)",
        "text": "For other than continuous loads, 100% of load; for continuous loads, 125% of load",
        "plainEnglish": "Continuous loads (on 3+ hours) require larger wire",
        "application": "Lighting, motor loads"
      },
      {
        "id": "210.19(A)(2)",
        "text": "Consider voltage drop: 3% for branch circuits, 5% total",
        "plainEnglish": "Long wire runs may need bigger wire to prevent voltage drop",
        "application": "Outbuildings, long circuits"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Sizing wire for continuous load at 100% instead of 125%",
        "consequence": "Overheating, insulation damage",
        "fix": "Multiply continuous load by 1.25 before selecting wire size"
      },
      {
        "scenario": "Ignoring voltage drop on long runs",
        "consequence": "Poor appliance performance, motor damage",
        "fix": "Increase conductor size or reduce run length"
      }
    ]
  },
  {
    "id": "art-215-2",
    "articleNumber": "215.2",
    "title": "Feeder Conductor Sizing",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Requirements for sizing feeder conductors",
    "content": [
      {
        "type": "paragraph",
        "text": "Feeder conductors shall have ampacity not less than required to supply the load",
        "plainEnglish": "Feeder wires must handle total load of all branch circuits",
        "application": "Sizing subpanel feeders",
        "id": "215.2(A)"
      },
      {
        "type": "paragraph",
        "text": "Continuous loads: 125% of load",
        "plainEnglish": "Feeders for continuous loads need larger wire",
        "application": "Commercial lighting feeders",
        "id": "215.2(A)(1)"
      },
      {
        "type": "paragraph",
        "text": "Consider voltage drop: 3% for feeders, 5% total",
        "plainEnglish": "Long feeder runs need bigger wire",
        "application": "Detached buildings, long feeders",
        "id": "215.2(A)(2)"
      },
      {
        "type": "violation",
        "scenario": "Feeder sized for total load without considering continuous load multiplier",
        "consequence": "Overheating, insulation damage",
        "fix": "Apply 125% multiplier to continuous portion of load"
      },
      {
        "type": "violation",
        "scenario": "Ignoring voltage drop on long feeder runs",
        "consequence": "Poor voltage regulation, equipment issues",
        "fix": "Upsize feeder conductors or reduce length"
      }
    ],
    "relatedArticles": [
      "215.3",
      "220.42",
      "310.16"
    ],
    "keyPoints": [
      {
        "id": "215.2(A)",
        "text": "Feeder conductors shall have ampacity not less than required to supply the load",
        "plainEnglish": "Feeder wires must handle total load of all branch circuits",
        "application": "Sizing subpanel feeders"
      },
      {
        "id": "215.2(A)(1)",
        "text": "Continuous loads: 125% of load",
        "plainEnglish": "Feeders for continuous loads need larger wire",
        "application": "Commercial lighting feeders"
      },
      {
        "id": "215.2(A)(2)",
        "text": "Consider voltage drop: 3% for feeders, 5% total",
        "plainEnglish": "Long feeder runs need bigger wire",
        "application": "Detached buildings, long feeders"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Feeder sized for total load without considering continuous load multiplier",
        "consequence": "Overheating, insulation damage",
        "fix": "Apply 125% multiplier to continuous portion of load"
      },
      {
        "scenario": "Ignoring voltage drop on long feeder runs",
        "consequence": "Poor voltage regulation, equipment issues",
        "fix": "Upsize feeder conductors or reduce length"
      }
    ]
  },
  {
    "id": "art-220-42",
    "articleNumber": "220.42",
    "title": "General Lighting Load Demand Factors",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Demand factors for general lighting loads",
    "content": [
      {
        "type": "paragraph",
        "text": "First 12500 VA at 100%; next 112500 VA at 35%; remainder at 25%",
        "plainEnglish": "Large lighting loads can be derated",
        "application": "Commercial and industrial load calculations",
        "id": "220.42(A)"
      },
      {
        "type": "paragraph",
        "text": "Dwelling units: 100% of lighting load",
        "plainEnglish": "No demand factor for residential lighting",
        "application": "Residential load calculations",
        "id": "220.42(B)"
      },
      {
        "type": "violation",
        "scenario": "Applying demand factor to residential lighting",
        "consequence": "Undersized service, overcurrent protection",
        "fix": "Use 100% for dwelling unit lighting"
      },
      {
        "type": "violation",
        "scenario": "Not applying demand factor to large commercial lighting",
        "consequence": "Oversized feeders and service, increased cost",
        "fix": "Apply demand factors per Table 220.42"
      }
    ],
    "relatedArticles": [
      "220.12",
      "220.14",
      "220.50"
    ],
    "keyPoints": [
      {
        "id": "220.42(A)",
        "text": "First 12500 VA at 100%; next 112500 VA at 35%; remainder at 25%",
        "plainEnglish": "Large lighting loads can be derated",
        "application": "Commercial and industrial load calculations"
      },
      {
        "id": "220.42(B)",
        "text": "Dwelling units: 100% of lighting load",
        "plainEnglish": "No demand factor for residential lighting",
        "application": "Residential load calculations"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Applying demand factor to residential lighting",
        "consequence": "Undersized service, overcurrent protection",
        "fix": "Use 100% for dwelling unit lighting"
      },
      {
        "scenario": "Not applying demand factor to large commercial lighting",
        "consequence": "Oversized feeders and service, increased cost",
        "fix": "Apply demand factors per Table 220.42"
      }
    ]
  },
  {
    "id": "art-250-66",
    "articleNumber": "250.66",
    "title": "Grounding Electrode Conductor Sizing",
    "chapter": "Chapter 2: Wiring and Protection",
    "scope": "Sizing grounding electrode conductors for AC systems",
    "content": [
      {
        "type": "paragraph",
        "text": "Size based on largest service entrance conductor or equivalent area",
        "plainEnglish": "Ground wire to rods based on service wire size",
        "application": "Sizing ground wire from panel to ground rods",
        "id": "250.66(A)"
      },
      {
        "type": "paragraph",
        "text": "Table 250.66: Up to 2/0 Cu service = #6 Cu GEC; 3/0-350 Cu = #4 Cu; 400-600 Cu = #2 Cu; etc.",
        "plainEnglish": "Larger service requires larger ground wire",
        "application": "Select GEC size from table",
        "id": "250.66(B)"
      },
      {
        "type": "violation",
        "scenario": "Using #8 Cu for 200A service (requires #6)",
        "consequence": "Inadequate grounding, potential equipment damage",
        "fix": "Size GEC per Table 250.66"
      },
      {
        "type": "violation",
        "scenario": "Splicing GEC without irreversible compression connector",
        "consequence": "Poor connection, high impedance",
        "fix": "Use exothermic weld or irreversible compression splice"
      }
    ],
    "relatedArticles": [
      "250.64",
      "250.70",
      "310.16"
    ],
    "keyPoints": [
      {
        "id": "250.66(A)",
        "text": "Size based on largest service entrance conductor or equivalent area",
        "plainEnglish": "Ground wire to rods based on service wire size",
        "application": "Sizing ground wire from panel to ground rods"
      },
      {
        "id": "250.66(B)",
        "text": "Table 250.66: Up to 2/0 Cu service = #6 Cu GEC; 3/0-350 Cu = #4 Cu; 400-600 Cu = #2 Cu; etc.",
        "plainEnglish": "Larger service requires larger ground wire",
        "application": "Select GEC size from table"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Using #8 Cu for 200A service (requires #6)",
        "consequence": "Inadequate grounding, potential equipment damage",
        "fix": "Size GEC per Table 250.66"
      },
      {
        "scenario": "Splicing GEC without irreversible compression connector",
        "consequence": "Poor connection, high impedance",
        "fix": "Use exothermic weld or irreversible compression splice"
      }
    ]
  },
  {
    "id": "art-300-5",
    "articleNumber": "300.5",
    "title": "Underground Installation Depth",
    "chapter": "Chapter 3: Wiring Methods",
    "scope": "Minimum cover requirements for underground cables and raceways",
    "content": [
      {
        "type": "paragraph",
        "text": "Direct burial cables: 24 inches for 0-600V residential, 30 inches for commercial/industrial",
        "plainEnglish": "Bury cables deep enough to avoid damage",
        "application": "Underground wiring for outbuildings, landscape lighting",
        "id": "300.5(A)"
      },
      {
        "type": "paragraph",
        "text": "Raceways (conduit): 18 inches for 0-600V residential, 24 inches for commercial/industrial",
        "plainEnglish": "Conduit can be shallower than direct burial",
        "application": "Underground conduit runs",
        "id": "300.5(B)"
      },
      {
        "type": "paragraph",
        "text": "Protection required when less than minimum depth (concrete pad, etc.)",
        "plainEnglish": "If shallow, add protection",
        "application": "Under driveways, sidewalks",
        "id": "300.5(D)"
      },
      {
        "type": "violation",
        "scenario": "Burying UF cable only 12 inches deep",
        "consequence": "Damage from digging, shock hazard",
        "fix": "Increase depth to minimum 24 inches or install protection"
      },
      {
        "type": "violation",
        "scenario": "No warning tape above underground cables",
        "consequence": "Accidental dig-in, cable damage",
        "fix": "Install caution tape 12 inches above cable"
      }
    ],
    "relatedArticles": [
      "300.50",
      "310.10",
      "338.12"
    ],
    "keyPoints": [
      {
        "id": "300.5(A)",
        "text": "Direct burial cables: 24 inches for 0-600V residential, 30 inches for commercial/industrial",
        "plainEnglish": "Bury cables deep enough to avoid damage",
        "application": "Underground wiring for outbuildings, landscape lighting"
      },
      {
        "id": "300.5(B)",
        "text": "Raceways (conduit): 18 inches for 0-600V residential, 24 inches for commercial/industrial",
        "plainEnglish": "Conduit can be shallower than direct burial",
        "application": "Underground conduit runs"
      },
      {
        "id": "300.5(D)",
        "text": "Protection required when less than minimum depth (concrete pad, etc.)",
        "plainEnglish": "If shallow, add protection",
        "application": "Under driveways, sidewalks"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Burying UF cable only 12 inches deep",
        "consequence": "Damage from digging, shock hazard",
        "fix": "Increase depth to minimum 24 inches or install protection"
      },
      {
        "scenario": "No warning tape above underground cables",
        "consequence": "Accidental dig-in, cable damage",
        "fix": "Install caution tape 12 inches above cable"
      }
    ]
  },
  {
    "id": "art-314-28",
    "articleNumber": "314.28",
    "title": "Pull and Junction Box Sizing",
    "chapter": "Chapter 3: Wiring Methods",
    "scope": "Minimum size requirements for pull and junction boxes",
    "content": [
      {
        "type": "paragraph",
        "text": "Straight pulls: length not less than 8 times the trade diameter of largest raceway",
        "plainEnglish": "Box length for straight pull = 8x conduit diameter",
        "application": "Sizing pull boxes for straight conduit runs",
        "id": "314.28(A)"
      },
      {
        "type": "paragraph",
        "text": "Angle or U pulls: distance from entry to opposite wall not less than 6 times raceway diameter plus sum of diameters of other raceways in same row",
        "plainEnglish": "More complex calculation for angled pulls",
        "application": "Pull boxes with multiple conduits",
        "id": "314.28(B)"
      },
      {
        "type": "paragraph",
        "text": "Splices and taps: box must be large enough for conductors and fittings",
        "plainEnglish": "Junction boxes must have enough space",
        "application": "Splicing boxes",
        "id": "314.28(C)"
      },
      {
        "type": "violation",
        "scenario": "Pull box too small for straight pull of 4-inch conduit",
        "consequence": "Conductor damage during pulling, insulation damage",
        "fix": "Size box at least 32 inches long (8x4)"
      },
      {
        "type": "violation",
        "scenario": "Ignoring multiple conduits in same row for angle pull",
        "consequence": "Box too small, difficult pull",
        "fix": "Calculate per 314.28(B)"
      }
    ],
    "relatedArticles": [
      "314.16",
      "300.14",
      "362.28"
    ],
    "keyPoints": [
      {
        "id": "314.28(A)",
        "text": "Straight pulls: length not less than 8 times the trade diameter of largest raceway",
        "plainEnglish": "Box length for straight pull = 8x conduit diameter",
        "application": "Sizing pull boxes for straight conduit runs"
      },
      {
        "id": "314.28(B)",
        "text": "Angle or U pulls: distance from entry to opposite wall not less than 6 times raceway diameter plus sum of diameters of other raceways in same row",
        "plainEnglish": "More complex calculation for angled pulls",
        "application": "Pull boxes with multiple conduits"
      },
      {
        "id": "314.28(C)",
        "text": "Splices and taps: box must be large enough for conductors and fittings",
        "plainEnglish": "Junction boxes must have enough space",
        "application": "Splicing boxes"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Pull box too small for straight pull of 4-inch conduit",
        "consequence": "Conductor damage during pulling, insulation damage",
        "fix": "Size box at least 32 inches long (8x4)"
      },
      {
        "scenario": "Ignoring multiple conduits in same row for angle pull",
        "consequence": "Box too small, difficult pull",
        "fix": "Calculate per 314.28(B)"
      }
    ]
  }
  ,{
    "id": "art-ch9-table1",
    "articleNumber": "Ch9-T1",
    "title": "Chapter 9, Table 1 — Conduit Fill Percentages",
    "chapter": "Chapter 9: Tables",
    "scope": "Maximum percent of cross-sectional area of conduit or tubing for conductors and cables",
    "content": [
      {
        "type": "paragraph",
        "text": "The number of conductors in a single conduit or tubing shall not exceed the percentages in Table 1",
        "plainEnglish": "1 wire: use 53% of conduit area. 2 wires: 31%. 3 or more wires: 40%.",
        "application": "All raceway conduit fill calculations",
        "id": "Ch9-T1"
      },
      {
        "type": "table",
        "caption": "Table 1 — Percent of Cross Section of Conduit and Tubing for Conductors and Cables",
        "rows": [
          { "Number of Conductors": "1",  "Maximum Fill": "53%", "Notes": "Single wire allowed more room for pulling" },
          { "Number of Conductors": "2",  "Maximum Fill": "31%", "Notes": "Two wires require more clearance" },
          { "Number of Conductors": "3+", "Maximum Fill": "40%", "Notes": "Standard fill for multiple conductors" }
        ]
      },
      {
        "type": "violation",
        "scenario": "4 conductors filling 50% of conduit area",
        "consequence": "Exceeds 40% fill limit, conductor insulation damage during pulling",
        "fix": "Upsize to next conduit trade size or reduce number of conductors per conduit"
      }
    ],
    "relatedArticles": ["Ch9-T4", "Ch9-T5", "314.16"],
    "keyPoints": [
      {
        "id": "Ch9-T1",
        "text": "1 conductor: 53% fill. 2 conductors: 31% fill. 3+ conductors: 40% fill.",
        "plainEnglish": "Three or more wires: never fill more than 40% of the conduit interior",
        "application": "All conduit fill calculations"
      }
    ],
    "commonViolations": [
      {
        "scenario": "4 conductors filling 50% of conduit area",
        "consequence": "Exceeds 40% fill limit, conductor insulation damage during pulling",
        "fix": "Upsize to next conduit trade size or reduce number of conductors per conduit"
      }
    ]
  },
  {
    "id": "art-ch9-table4",
    "articleNumber": "Ch9-T4",
    "title": "Chapter 9, Table 4 — Conduit Internal Areas",
    "chapter": "Chapter 9: Tables",
    "scope": "Dimensions and percent area calculations for conduit and tubing",
    "content": [
      {
        "type": "paragraph",
        "text": "Internal cross-sectional areas of EMT, RMC, and PVC conduit by trade size",
        "plainEnglish": "Total internal area of the conduit. Multiply by 40% fill limit for actual usable area.",
        "application": "Conduit fill calculations — total area and usable area at 40% fill",
        "id": "Ch9-T4"
      },
      {
        "type": "table",
        "caption": "Table 4 — Internal Area (sq.in.) of Conduit by Trade Size",
        "rows": [
          { "Trade Size": "1/2\"",   "EMT":  "0.304", "RMC":  "0.314", "PVC":  "0.285" },
          { "Trade Size": "3/4\"",   "EMT":  "0.533", "RMC":  "0.533", "PVC":  "0.508" },
          { "Trade Size": "1\"",     "EMT":  "0.864", "RMC":  "0.887", "PVC":  "0.832" },
          { "Trade Size": "1-1/4\"", "EMT":  "1.496", "RMC":  "1.526", "PVC":  "1.453" },
          { "Trade Size": "1-1/2\"", "EMT":  "2.036", "RMC":  "2.071", "PVC":  "1.986" },
          { "Trade Size": "2\"",     "EMT":  "3.356", "RMC":  "3.408", "PVC":  "3.291" },
          { "Trade Size": "2-1/2\"", "EMT":  "5.858", "RMC":  "4.866", "PVC":  "4.695" },
          { "Trade Size": "3\"",     "EMT":  "8.846", "RMC":  "7.499", "PVC":  "7.268" },
          { "Trade Size": "3-1/2\"", "EMT": "11.545", "RMC":  "9.521", "PVC":  "9.737" },
          { "Trade Size": "4\"",     "EMT": "14.753", "RMC": "12.554", "PVC": "12.554" }
        ]
      }
    ],
    "relatedArticles": ["Ch9-T1", "Ch9-T5"],
    "keyPoints": [
      {
        "id": "Ch9-T4",
        "text": "Internal cross-sectional areas of conduit by trade size and type",
        "plainEnglish": "Larger conduit trade size = more area. EMT vs RMC vs PVC have slightly different internal areas.",
        "application": "Use with Table 1 fill percentages and Table 5 wire areas to calculate conduit fill"
      }
    ],
    "commonViolations": []
  },
  {
    "id": "art-ch9-table5",
    "articleNumber": "Ch9-T5",
    "title": "Chapter 9, Table 5 — Wire Cross-Sectional Areas",
    "chapter": "Chapter 9: Tables",
    "scope": "Dimensions of insulated conductors and fixture wires for conduit fill calculations",
    "content": [
      {
        "type": "paragraph",
        "text": "Cross-sectional area of insulated conductors by type and size for conduit fill",
        "plainEnglish": "How much space does each wire take up inside a conduit? Use this table to add up all wire areas.",
        "application": "Conduit fill calculations — wire area input for Table 1 fill percentage",
        "id": "Ch9-T5"
      },
      {
        "type": "table",
        "caption": "Table 5 — Approximate Area (sq.in.) of Insulated Conductors",
        "rows": [
          { "Wire Size": "14 AWG", "THHN":   "0.0097", "THWN":   "0.0097", "XHHW":   "0.0139" },
          { "Wire Size": "12 AWG", "THHN":   "0.0133", "THWN":   "0.0133", "XHHW":   "0.0181" },
          { "Wire Size": "10 AWG", "THHN":   "0.0211", "THWN":   "0.0211", "XHHW":   "0.0243" },
          { "Wire Size": "8 AWG",  "THHN":   "0.0366", "THWN":   "0.0366", "XHHW":   "0.0437" },
          { "Wire Size": "6 AWG",  "THHN":   "0.0507", "THWN":   "0.0507", "XHHW":   "0.0590" },
          { "Wire Size": "4 AWG",  "THHN":   "0.0824", "THWN":   "0.0824", "XHHW":   "0.0814" },
          { "Wire Size": "3 AWG",  "THHN":   "0.0973", "THWN":   "0.0973", "XHHW":   "0.0962" },
          { "Wire Size": "2 AWG",  "THHN":   "0.1158", "THWN":   "0.1158", "XHHW":   "0.1146" },
          { "Wire Size": "1 AWG",  "THHN":   "0.1562", "THWN":   "0.1562", "XHHW":   "0.1534" },
          { "Wire Size": "1/0",    "THHN":   "0.1855", "THWN":   "0.1855", "XHHW":   "0.1825" },
          { "Wire Size": "2/0",    "THHN":   "0.2223", "THWN":   "0.2223", "XHHW":   "0.2190" },
          { "Wire Size": "3/0",    "THHN":   "0.2679", "THWN":   "0.2679", "XHHW":   "0.2642" },
          { "Wire Size": "4/0",    "THHN":   "0.3237", "THWN":   "0.3237", "XHHW":   "0.3197" },
          { "Wire Size": "250 kcmil", "THHN": "0.3970", "THWN":  "0.3970", "XHHW":   "0.3904" },
          { "Wire Size": "300 kcmil", "THHN": "0.4608", "THWN":  "0.4608", "XHHW":   "0.4536" },
          { "Wire Size": "350 kcmil", "THHN": "0.5242", "THWN":  "0.5242", "XHHW":   "0.5166" },
          { "Wire Size": "400 kcmil", "THHN": "0.5863", "THWN":  "0.5863", "XHHW":   "0.5782" },
          { "Wire Size": "500 kcmil", "THHN": "0.7073", "THWN":  "0.7073", "XHHW":   "0.6984" },
          { "Wire Size": "600 kcmil", "THHN": "0.8676", "THWN":  "0.8676", "XHHW":   "0.8709" },
          { "Wire Size": "750 kcmil", "THHN": "1.0496", "THWN":  "1.0496", "XHHW":   "1.0532" }
        ]
      }
    ],
    "relatedArticles": ["Ch9-T1", "Ch9-T4"],
    "keyPoints": [
      {
        "id": "Ch9-T5",
        "text": "Approximate cross-sectional area of insulated conductors for conduit fill",
        "plainEnglish": "Sum up all wire areas from this table, then compare to conduit area × fill limit",
        "application": "Conduit fill calculations per Chapter 9 Table 1"
      }
    ],
    "commonViolations": []
  },
  {
    "id": "art-430-248-250",
    "articleNumber": "430.248/250",
    "title": "Tables 430.248 & 430.250 — Motor Full-Load Amps",
    "chapter": "Chapter 4: Equipment",
    "scope": "Full-load current values for sizing motor conductors, overcurrent protection, and controllers",
    "content": [
      {
        "type": "paragraph",
        "text": "Use table values (not nameplate FLA) for conductor sizing and overcurrent device selection",
        "plainEnglish": "Size motor conductors and breakers from these NEC tables, NOT the motor nameplate. Conductors min 125% of FLA. Breaker max 250% of FLA.",
        "application": "Motor branch circuit conductor sizing (430.22), OCPD sizing (430.52)",
        "id": "430.248"
      },
      {
        "type": "table",
        "caption": "Table 430.248 — Single-Phase Motor Full-Load Amps",
        "rows": [
          { "HP":   "0.5", "115V":  "9.8", "200V":  "5.6", "208V":  "5.4", "230V":  "4.9" },
          { "HP":  "0.75", "115V": "13.8", "200V":  "7.9", "208V":  "7.6", "230V":  "6.9" },
          { "HP":     "1", "115V": "16.0", "200V":  "9.2", "208V":  "8.8", "230V":  "8.0" },
          { "HP":   "1.5", "115V": "20.0", "200V": "11.5", "208V": "11.0", "230V": "10.0" },
          { "HP":     "2", "115V": "24.0", "200V": "13.8", "208V": "13.2", "230V": "12.0" },
          { "HP":     "3", "115V": "34.0", "200V": "19.6", "208V": "18.7", "230V": "17.0" },
          { "HP":     "5", "115V": "56.0", "200V": "32.2", "208V": "30.8", "230V": "28.0" },
          { "HP":   "7.5", "115V":    "—", "200V": "46.0", "208V": "44.0", "230V": "40.0" },
          { "HP":    "10", "115V":    "—", "200V": "64.0", "208V": "61.0", "230V": "50.0" }
        ]
      },
      {
        "type": "table",
        "caption": "Table 430.250 — Three-Phase Motor Full-Load Amps",
        "rows": [
          { "HP":   "0.5", "200V":  "2.5", "208V":  "2.4", "230V":  "2.2", "460V":  "1.1", "575V":  "0.9" },
          { "HP":  "0.75", "200V":  "3.7", "208V":  "3.5", "230V":  "3.2", "460V":  "1.6", "575V":  "1.3" },
          { "HP":     "1", "200V":  "4.8", "208V":  "4.6", "230V":  "4.2", "460V":  "2.1", "575V":  "1.7" },
          { "HP":   "1.5", "200V":  "6.9", "208V":  "6.6", "230V":  "6.0", "460V":  "3.0", "575V":  "2.4" },
          { "HP":     "2", "200V":  "7.8", "208V":  "7.5", "230V":  "6.8", "460V":  "3.4", "575V":  "2.7" },
          { "HP":     "3", "200V": "11.0", "208V": "10.6", "230V":  "9.6", "460V":  "4.8", "575V":  "3.9" },
          { "HP":     "5", "200V": "17.5", "208V": "16.7", "230V": "15.2", "460V":  "7.6", "575V":  "6.1" },
          { "HP":   "7.5", "200V": "25.3", "208V": "24.2", "230V": "22.0", "460V": "11.0", "575V":  "9.0" },
          { "HP":    "10", "200V": "32.2", "208V": "30.8", "230V": "28.0", "460V": "14.0", "575V": "11.0" },
          { "HP":    "15", "200V": "48.3", "208V": "46.2", "230V": "42.0", "460V": "21.0", "575V": "17.0" },
          { "HP":    "20", "200V": "62.1", "208V": "59.4", "230V": "54.0", "460V": "27.0", "575V": "22.0" },
          { "HP":    "25", "200V": "78.2", "208V": "74.8", "230V": "68.0", "460V": "34.0", "575V": "27.0" },
          { "HP":    "30", "200V": "92.0", "208V": "88.0", "230V": "80.0", "460V": "40.0", "575V": "32.0" },
          { "HP":    "40", "200V":  "120", "208V":  "114", "230V":  "104", "460V": "52.0", "575V": "41.0" },
          { "HP":    "50", "200V":  "150", "208V":  "143", "230V":  "130", "460V": "65.0", "575V": "52.0" },
          { "HP":    "60", "200V":  "177", "208V":  "169", "230V":  "154", "460V": "77.0", "575V": "62.0" },
          { "HP":    "75", "200V":  "221", "208V":  "211", "230V":  "192", "460V": "96.0", "575V": "77.0" },
          { "HP":   "100", "200V":  "285", "208V":  "273", "230V":  "248", "460V":  "124", "575V": "99.0" }
        ]
      },
      {
        "type": "violation",
        "scenario": "Using nameplate FLA instead of NEC table FLA for conductor sizing",
        "consequence": "Conductors may be undersized for worst-case motor operation",
        "fix": "Use NEC Table 430.248 (1-phase) or 430.250 (3-phase) for all conductor and OCPD sizing"
      },
      {
        "type": "violation",
        "scenario": "Motor branch circuit breaker sized at exactly 125% of FLA",
        "consequence": "Motor will nuisance-trip on startup inrush current",
        "fix": "Size inverse-time breaker at max 250% of FLA per NEC 430.52(C)(1). Fuse max 175%."
      }
    ],
    "relatedArticles": ["430.22", "430.52", "310.16"],
    "keyPoints": [
      {
        "id": "430.22",
        "text": "Motor conductors shall have an ampacity of not less than 125% of the motor full-load current",
        "plainEnglish": "Wire to motor = table FLA × 1.25 minimum",
        "application": "Single motor branch circuit conductor sizing"
      },
      {
        "id": "430.52",
        "text": "Branch-circuit overcurrent device shall not exceed 250% of motor FLA for inverse-time breakers",
        "plainEnglish": "Breaker = table FLA × 2.5 maximum (round up to standard size)",
        "application": "Motor branch circuit breaker sizing"
      }
    ],
    "commonViolations": [
      {
        "scenario": "Using nameplate FLA instead of NEC table FLA for conductor sizing",
        "consequence": "Conductors may be undersized for worst-case motor operation",
        "fix": "Use NEC Table 430.248 (1-phase) or 430.250 (3-phase) for all conductor and OCPD sizing"
      },
      {
        "scenario": "Motor branch circuit breaker sized at exactly 125% of FLA",
        "consequence": "Motor will nuisance-trip on startup inrush current",
        "fix": "Size inverse-time breaker at max 250% of FLA per NEC 430.52(C)(1). Fuse max 175%."
      }
    ]
  }
] as const;
