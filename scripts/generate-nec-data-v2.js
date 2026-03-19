const fs = require('fs');
const path = require('path');

// Same necDatabase array as before
const necDatabase = [
  {
    article: "110.26",
    title: "Working Space About Electrical Equipment",
    scope: "Requirements for safe access and working space around electrical equipment",
    keyPoints: [
      {
        id: "110.26(A)",
        text: "Working space shall be not less than 30 inches wide, 36 inches deep, and 6.5 feet high",
        plainEnglish: "3 feet clear space in front of panels, floor to ceiling",
        application: "All panelboards, switchboards, motor control centers"
      },
      {
        id: "110.26(B)",
        text: "Clear working space required in front of equipment for safe operation",
        plainEnglish: "No storage, boxes, or equipment blocking electrical panels",
        application: "Electrical rooms, mechanical rooms, utility spaces"
      }
    ],
    commonViolations: [
      { scenario: "Storage boxes blocking electrical panel", consequence: "No safe access for maintenance, arc flash hazard, OSHA violation", fix: "Clear 36-inch deep, 30-inch wide, 6.5-foot high working space. Mark with floor tape." },
      { scenario: "Panel mounted too close to wall (less than 30 inches wide space)", consequence: "Unable to safely work on energized equipment", fix: "Relocate panel or widen access aisle to minimum 30 inches" }
    ],
    relatedArticles: ["110.27", "408.36", "250.24"]
  },
  {
    article: "210.8",
    title: "GFCI Protection for Personnel",
    scope: "Ground-fault circuit-interrupter protection requirements to prevent shock",
    keyPoints: [
      {
        id: "210.8(A)",
        text: "GFCI protection required for all 125V single-phase 15A and 20A outlets in bathrooms, garages, outdoors, crawl spaces, unfinished basements, kitchens, laundry areas",
        plainEnglish: "GFCI outlets or breakers required near water, outside, and damp locations",
        application: "All residential, commercial, and industrial 120V general purpose outlets",
        exceptions: ["Dedicated appliance circuits not readily accessible", "Garage door openers in some jurisdictions"]
      },
      {
        id: "210.8(B)",
        text: "Commercial and industrial facilities: GFCI for all 125V 15A/20A outlets in bathrooms, rooftops, kitchens",
        plainEnglish: "Commercial kitchens, outdoor roof outlets, bathrooms need GFCI",
        application: "Commercial tenant spaces, restaurants, office kitchens"
      }
    ],
    commonViolations: [
      { scenario: "Standard outlet within 6 feet of commercial sink without GFCI", consequence: "Shock hazard in wet location, inspection failure", fix: "Install GFCI receptacle or GFCI circuit breaker" },
      { scenario: "Missing GFCI in unfinished basement", consequence: "Electrocution risk in damp environment", fix: "Install GFCI protection for all 120V outlets in unfinished basements" }
    ],
    relatedArticles: ["210.12", "406.4", "590.6"]
  },
  {
    article: "210.12",
    title: "Arc-Fault Circuit-Interrupter Protection",
    scope: "AFCI requirements to prevent fires from electrical arcing",
    keyPoints: [
      {
        id: "210.12(A)",
        text: "All 120V single-phase 15A and 20A branch circuits supplying outlets or devices in dwelling units shall be AFCI protected",
        plainEnglish: "AFCI breakers required for almost all residential circuits (2023 NEC)",
        application: "Bedrooms, living rooms, hallways, closets, kitchens, laundry rooms",
        exceptions: ["Branch circuits supplying only fire alarm systems"]
      }
    ],
    commonViolations: [
      { scenario: "Standard breaker used for bedroom circuit instead of AFCI", consequence: "Fire safety violation, failed inspection, insurance issues", fix: "Install combination-type AFCI circuit breaker" },
      { scenario: "AFCI breaker nuisance tripping with refrigerator or garage door opener", consequence: "Loss of power to critical equipment", fix: "Use AFCI breaker designed for motor loads, or dedicated non-AFCI circuit if code permits" }
    ],
    relatedArticles: ["210.8", "406.4", "550.25"]
  },
  {
    article: "250.24",
    title: "Grounding Service-Supplied AC Systems",
    scope: "Connection of grounded conductor to grounding electrode system at service",
    keyPoints: [
      {
        id: "250.24(A)",
        text: "The grounded conductor shall be connected to the grounding electrode system at the service point",
        plainEnglish: "Neutral connects to ground ONLY at the main service panel",
        application: "Main service entrance - bonding screw/strap installed",
        exceptions: ["Separately derived systems per 250.30"]
      },
      {
        id: "250.24(B)",
        text: "Main bonding jumper shall connect the grounded conductor to the equipment grounding conductor",
        plainEnglish: "In main panel only, connect neutral bus to ground bus/case",
        application: "Main service panel - remove this bond in subpanels"
      }
    ],
    commonViolations: [
      { scenario: "Bonding screw left in subpanel (neutral and ground bonded)", consequence: "Neutral current flows on ground paths, creates shock hazard, violates 250.24", fix: "Remove green bonding screw or strap in subpanel. Neutral and ground must be separate downstream of main." },
      { scenario: "Subpanel fed with 3-wire (no separate ground) instead of 4-wire", consequence: "No equipment grounding path, shock hazard", fix: "Run 4-wire feeder (2 hots, neutral, ground) to subpanel" }
    ],
    relatedArticles: ["250.32", "408.36", "310.16"]
  },
  {
    article: "250.32",
    title: "Grounding at Separate Buildings",
    scope: "Grounding requirements for feeders to detached structures",
    keyPoints: [
      {
        id: "250.32(A)",
        text: "Grounding electrode required at separate building supplied by feeder",
        plainEnglish: "Running power to garage or shed? Needs ground rod(s) there",
        application: "Detached garages, workshops, outbuildings with subpanels",
        exceptions: ["Single branch circuit with no subpanel"]
      },
      {
        id: "250.32(B)",
        text: "Grounded conductor not to be connected to equipment grounding conductors at separate buildings",
        plainEnglish: "Subpanel in garage: neutral isolated from ground, remove bonding screw",
        application: "All subpanels in detached structures"
      }
    ],
    commonViolations: [
      { scenario: "Garage subpanel with neutral and ground bonded together", consequence: "Parallel paths for neutral current, shock hazard, code violation", fix: "Remove bonding screw in garage subpanel. Install separate ground bar." },
      { scenario: "Missing ground rod(s) at detached structure", consequence: "Inadequate grounding, potential equipment damage, inspection fail", fix: "Install minimum two ground rods 6 feet apart at separate building" }
    ],
    relatedArticles: ["250.24", "250.53", "408.36"]
  },
  {
    article: "250.53",
    title: "Grounding Electrode Installation",
    scope: "Requirements for grounding electrodes and their installation",
    keyPoints: [
      { id: "250.53(A)", text: "Rod, pipe, and plate electrodes shall not be less than 8 feet in length", plainEnglish: "Ground rods must be 8 feet long, driven fully except for connection", application: "Commercial and residential services" },
      { id: "250.53(B)", text: "Two grounding electrodes required unless single rod proves <25 ohms resistance", plainEnglish: "Install two ground rods minimum - don't bother testing, just add the second", application: "All new construction, commercial services" },
      { id: "250.53(C)", text: "Spacing of electrode shall be not less than 6 feet apart", plainEnglish: "Ground rods must be minimum 6 feet apart to be effective", application: "Multiple ground rod installations" }
    ],
    commonViolations: [
      { scenario: "Single ground rod for commercial service without resistance test", consequence: "Inadequate grounding, potential equipment damage, inspection failure", fix: "Install second ground rod minimum 6 feet from first, or perform fall-of-potential test proving <25 ohms" },
      { scenario: "Ground rods installed only 2-3 feet apart", consequence: "Electrodes act as single ground, ineffective grounding system", fix: "Space ground rods minimum 6 feet apart (more is better)" }
    ],
    relatedArticles: ["250.24", "250.32", "250.66"]
  },
  {
    article: "310.16",
    title: "Allowable Ampacities",
    scope: "Ampacity tables for wire sizing based on temperature ratings",
    keyPoints: [
      { id: "310.16-General", text: "Ampacities for conductors rated 0-2000 volts per Table 310.16", plainEnglish: "How many amps can this wire carry? Depends on temperature rating (60°C, 75°C, 90°C)", application: "Sizing branch circuit and feeder conductors" },
      { id: "310.15(B)(3)(a)", text: "Adjustment factors for more than three current-carrying conductors in raceway", plainEnglish: "4-6 wires in conduit = 80% of table ampacity. 7-9 wires = 70%.", application: "Conduit fill derating calculations" }
    ],
    commonViolations: [
      { scenario: "14 AWG wire on 20A breaker (using 60°C ampacity)", consequence: "Fire hazard from overheated conductors, insulation damage", fix: "Use 12 AWG minimum for 20A circuits, or downsize breaker to 15A" },
      { scenario: "Not derating ampacity for 6 circuits in single conduit", consequence: "Conductors overheat due to bundled heat, fire hazard", fix: "Apply 80% derating factor to Table 310.16 ampacities, or separate circuits into multiple conduits" }
    ],
    relatedArticles: ["210.19", "250.66", "314.16"]
  },
  {
    article: "314.16",
    title: "Box Fill Calculations",
    scope: "Box fill calculations and volume requirements",
    keyPoints: [
      { id: "314.16(A)", text: "Boxes shall be of sufficient size to provide free space for all enclosed conductors", plainEnglish: "Count your wires - each box has maximum fill capacity", application: "All junction boxes, outlet boxes, device boxes" },
      { id: "314.16(B)", text: "Volume allowance: 14 AWG = 2.00 cu.in., 12 AWG = 2.25 cu.in., 10 AWG = 2.50 cu.in.", plainEnglish: "14 gauge wire takes 2 cubic inches, 12 gauge takes 2.25, etc.", application: "Calculating required box size" },
      { id: "314.16(B)(4)", text: "Device or equipment fill shall be counted as 2 conductors", plainEnglish: "Switch or receptacle in box counts as 2 wires worth of space", application: "Device box calculations" },
      { id: "314.16(B)(2)", text: "Clamp fill shall be counted as 1 conductor", plainEnglish: "Cable clamps inside box count as 1 wire worth of space", application: "Metal box calculations" }
    ],
    commonViolations: [
      { scenario: "Box overstuffed with too many wire connections", consequence: "Overheating, damaged wire insulation, short circuits, inspection fail", fix: "Calculate fill: count each wire + device (as 2) + clamps (as 1). Use larger box or add extension ring if overfilled." },
      { scenario: "4-inch square box with 12 AWG wires and receptacle - no extension ring", consequence: "Box overfilled beyond 21 cubic inches, wires compressed", fix: "4-inch square = 21 cu.in. max. Add extension ring for additional wires." }
    ],
    relatedArticles: ["314.20", "314.24", "300.14"]
  }
];

function getChapter(articleNumber) {
  const num = parseFloat(articleNumber);
  if (num >= 90 && num <= 110) return 'Chapter 1: General';
  if (num >= 200 && num <= 290) return 'Chapter 2: Wiring and Protection';
  if (num >= 300 && num <= 392) return 'Chapter 3: Wiring Methods';
  if (num >= 400 && num <= 490) return 'Chapter 4: Equipment for General Use';
  if (num >= 500 && num <= 590) return 'Chapter 5: Special Occupancies';
  if (num >= 600 && num <= 695) return 'Chapter 6: Special Equipment';
  if (num >= 700 && num <= 770) return 'Chapter 7: Special Conditions';
  if (num >= 800 && num <= 840) return 'Chapter 8: Communications Systems';
  if (num >= 900 && num <= 999) return 'Chapter 9: Tables';
  return 'Chapter 1: General';
}

const newArticles = necDatabase.map(item => {
  const content = item.keyPoints.map(kp => ({
    type: 'paragraph',
    text: kp.text,
    plainEnglish: kp.plainEnglish,
    application: kp.application,
    id: kp.id,
  }));
  const violations = item.commonViolations.map(v => ({
    type: 'violation',
    scenario: v.scenario,
    consequence: v.consequence,
    fix: v.fix,
  }));
  return {
    id: `art-${item.article.replace('.', '-')}`,
    articleNumber: item.article,
    title: item.title,
    chapter: getChapter(item.article),
    scope: item.scope,
    content: [...content, ...violations],
    relatedArticles: item.relatedArticles,
    keyPoints: item.keyPoints,
    commonViolations: item.commonViolations,
  };
});

// Write JSON file
const jsonPath = path.join(__dirname, '../lib/nec-data.json');
fs.writeFileSync(jsonPath, JSON.stringify({ articles: newArticles }, null, 2));
console.log(`Generated JSON at ${jsonPath}`);

// Write TypeScript data file (no import)
const tsDataPath = path.join(__dirname, '../lib/nec-data-generated.ts');
const tsContent = `// Auto-generated NEC 2023 dataset
export const NEC_ARTICLES_DATA = ${JSON.stringify(newArticles, null, 2)} as const;
`;
fs.writeFileSync(tsDataPath, tsContent);
console.log(`Generated TypeScript data at ${tsDataPath}`);