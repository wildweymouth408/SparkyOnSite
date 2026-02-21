'use client';

import { useState, useMemo } from 'react'
import { 
  Search, 
  Mic, 
  Bookmark, 
  AlertTriangle, 
  Check, 
  X, 
  Zap, 
  ChevronRight, 
  Calculator,
  Star,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

// Types
interface KeyPoint {
  id: string
  text: string
  plainEnglish: string
  application: string
  exceptions?: string[]
}

interface Violation {
  scenario: string
  consequence: string
  fix: string
}

interface NECArticle {
  article: string
  title: string
  scope: string
  keyPoints: KeyPoint[]
  commonViolations: Violation[]
  relatedArticles: string[]
}

// NEC Database
const necDatabase: NECArticle[] = [
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
      {
        scenario: "Storage boxes blocking electrical panel",
        consequence: "No safe access for maintenance, arc flash hazard, OSHA violation",
        fix: "Clear 36-inch deep, 30-inch wide, 6.5-foot high working space. Mark with floor tape."
      },
      {
        scenario: "Panel mounted too close to wall (less than 30 inches wide space)",
        consequence: "Unable to safely work on energized equipment",
        fix: "Relocate panel or widen access aisle to minimum 30 inches"
      }
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
      {
        scenario: "Standard outlet within 6 feet of commercial sink without GFCI",
        consequence: "Shock hazard in wet location, inspection failure",
        fix: "Install GFCI receptacle or GFCI circuit breaker"
      },
      {
        scenario: "Missing GFCI in unfinished basement",
        consequence: "Electrocution risk in damp environment",
        fix: "Install GFCI protection for all 120V outlets in unfinished basements"
      }
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
        exceptions: ["Branch circuits supplying only fire alarm systems", "Outlets for specific appliances where GFCI required"]
      }
    ],
    commonViolations: [
      {
        scenario: "Standard breaker used for bedroom circuit instead of AFCI",
        consequence: "Fire safety violation, failed inspection, insurance issues",
        fix: "Install combination-type AFCI circuit breaker"
      },
      {
        scenario: "AFCI breaker nuisance tripping with refrigerator or garage door opener",
        consequence: "Loss of power to critical equipment",
        fix: "Use AFCI breaker designed for motor loads, or dedicated non-AFCI circuit for appliance if code permits"
      }
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
        application: "Main service entrance - bonding screw/scrap installed",
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
      {
        scenario: "Bonding screw left in subpanel (neutral and ground bonded)",
        consequence: "Neutral current flows on ground paths, creates shock hazard, violates 250.24",
        fix: "Remove green bonding screw or strap in subpanel. Neutral and ground must be separate downstream of main."
      },
      {
        scenario: "Subpanel fed with 3-wire (no separate ground) instead of 4-wire",
        consequence: "No equipment grounding path, shock hazard",
        fix: "Run 4-wire feeder (2 hots, neutral, ground) to subpanel"
      }
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
        exceptions: ["Single branch circuit with no subpanel", "Structure served by only one branch circuit"]
      },
      {
        id: "250.32(B)",
        text: "Grounded conductor not to be connected to equipment grounding conductors at separate buildings",
        plainEnglish: "Subpanel in garage: neutral isolated from ground, remove bonding screw",
        application: "All subpanels in detached structures"
      }
    ],
    commonViolations: [
      {
        scenario: "Garage subpanel with neutral and ground bonded together",
        consequence: "Parallel paths for neutral current, shock hazard, code violation",
        fix: "Remove bonding screw in garage subpanel. Install separate ground bar."
      },
      {
        scenario: "Missing ground rod(s) at detached structure",
        consequence: "Inadequate grounding, potential equipment damage, inspection fail",
        fix: "Install minimum two ground rods 6 feet apart at separate building"
      }
    ],
    relatedArticles: ["250.24", "250.53", "408.36"]
  },
  {
    article: "250.53",
    title: "Grounding Electrode Installation",
    scope: "Requirements for grounding electrodes and their installation",
    keyPoints: [
      {
        id: "250.53(A)",
        text: "Rod, pipe, and plate electrodes shall not be less than 8 feet in length",
        plainEnglish: "Ground rods must be 8 feet long, driven fully except for connection",
        application: "Commercial and residential services"
      },
      {
        id: "250.53(B)",
        text: "Two grounding electrodes required unless single rod proves <25 ohms resistance",
        plainEnglish: "Install two ground rods minimum - don't bother testing, just add the second",
        application: "All new construction, commercial services"
      },
      {
        id: "250.53(C)",
        text: "Spacing of electrode shall be not less than 6 feet apart",
        plainEnglish: "Ground rods must be minimum 6 feet apart to be effective",
        application: "Multiple ground rod installations"
      }
    ],
    commonViolations: [
      {
        scenario: "Single ground rod for commercial service without resistance test",
        consequence: "Inadequate grounding, potential equipment damage, inspection failure",
        fix: "Install second ground rod minimum 6 feet from first, or perform fall-of-potential test proving <25 ohms"
      },
      {
        scenario: "Ground rods installed only 2-3 feet apart",
        consequence: "Electrodes act as single ground, ineffective grounding system",
        fix: "Space ground rods minimum 6 feet apart (more is better)"
      }
    ],
    relatedArticles: ["250.24", "250.32", "250.66"]
  },
  {
    article: "310.16",
    title: "Allowable Ampacities",
    scope: "Ampacity tables for wire sizing based on temperature ratings",
    keyPoints: [
      {
        id: "310.16-General",
        text: "Ampacities for conductors rated 0-2000 volts per Table 310.16",
        plainEnglish: "How many amps can this wire carry? Depends on temperature rating (60°C, 75°C, 90°C)",
        application: "Sizing branch circuit and feeder conductors"
      },
      {
        id: "310.15(B)(3)(a)",
        text: "Adjustment factors for more than three current-carrying conductors in raceway",
        plainEnglish: "4-6 wires in conduit = 80% of table ampacity. 7-9 wires = 70%.",
        application: "Conduit fill derating calculations"
      }
    ],
    commonViolations: [
      {
        scenario: "14 AWG wire on 20A breaker (using 60°C ampacity)",
        consequence: "Fire hazard from overheated conductors, insulation damage",
        fix: "Use 12 AWG minimum for 20A circuits, or downsize breaker to 15A"
      },
      {
        scenario: "Not derating ampacity for 6 circuits in single conduit",
        consequence: "Conductors overheat due to bundled heat, fire hazard",
        fix: "Apply 80% derating factor to Table 310.16 ampacities, or separate circuits into multiple conduits"
      }
    ],
    relatedArticles: ["210.19", "250.66", "314.16"]
  },
  {
    article: "314.16",
    title: "Box Fill Calculations",
    scope: "Box fill calculations and volume requirements",
    keyPoints: [
      {
        id: "314.16(A)",
        text: "Boxes shall be of sufficient size to provide free space for all enclosed conductors",
        plainEnglish: "Count your wires - each box has maximum fill capacity",
        application: "All junction boxes, outlet boxes, device boxes"
      },
      {
        id: "314.16(B)",
        text: "Volume allowance per conductor: 14 AWG = 2.00 cubic inches, 12 AWG = 2.25 cubic inches, 10 AWG = 2.50 cubic inches",
        plainEnglish: "14 gauge wire takes 2 cubic inches, 12 gauge takes 2.25, etc.",
        application: "Calculating required box size"
      },
      {
        id: "314.16(B)(4)",
        text: "Device or equipment fill shall be counted as 2 conductors",
        plainEnglish: "Switch or receptacle in box counts as 2 wires worth of space",
        application: "Device box calculations"
      },
      {
        id: "314.16(B)(2)",
        text: "Clamp fill shall be counted as 1 conductor",
        plainEnglish: "Cable clamps inside box count as 1 wire worth of space",
        application: "Metal box calculations"
      }
    ],
    commonViolations: [
      {
        scenario: "Box overstuffed with too many wire connections",
        consequence: "Overheating, damaged wire insulation, short circuits, inspection fail",
        fix: "Calculate fill: count each wire + device (as 2) + clamps (as 1). Use larger box or add extension ring if overfilled."
      },
      {
        scenario: "4-inch square box with 12 AWG wires and receptacle - no extension ring",
        consequence: "Box overfilled beyond 21 cubic inches, wires compressed",
        fix: "4-inch square = 21 cu.in. max. 12 AWG = 2.25 cu.in. each. 6 wires (14.25) + device (4.5) + clamps (2.25) = 21 cu.in. Add extension ring for additional wires."
      }
    ],
    relatedArticles: ["314.20", "314.24", "300.14"]
  }
]

// Ampacity Table Data
const ampacityTable = [
  { size: "14 AWG", copper: { "60°C": 15, "75°C": 20, "90°C": 25 } },
  { size: "12 AWG", copper: { "60°C": 20, "75°C": 25, "90°C": 30 } },
  { size: "10 AWG", copper: { "60°C": 30, "75°C": 35, "90°C": 40 } },
  { size: "8 AWG", copper: { "60°C": 40, "75°C": 50, "90°C": 55 } },
  { size: "6 AWG", copper: { "60°C": 55, "75°C": 65, "90°C": 75 } },
  { size: "4 AWG", copper: { "60°C": 70, "75°C": 85, "90°C": 95 } },
  { size: "3 AWG", copper: { "60°C": 85, "75°C": 100, "90°C": 110 } },
  { size: "2 AWG", copper: { "60°C": 95, "75°C": 115, "90°C": 130 } },
]

// Wire volumes for box fill
const wireVolumes: Record<string, number> = {
  "14": 2.00,
  "12": 2.25,
  "10": 2.50,
  "8": 3.00,
  "6": 5.00
}

// Common box sizes
const boxSizes = [
  { name: "4x1-1/4 round", volume: 12.5 },
  { name: "4x1-1/2 round", volume: 14.5 },
  { name: "4x2-1/8 round", volume: 21.5 },
  { name: "4 square x 1-1/4", volume: 18.0 },
  { name: "4 square x 1-1/2", volume: 21.0 },
  { name: "4 square x 2-1/8", volume: 30.3 },
  { name: "4-11/16 x 1-1/4", volume: 25.5 },
  { name: "4-11/16 x 1-1/2", volume: 29.5 },
  { name: "4-11/16 x 2-1/8", volume: 42.0 },
  { name: "Single gang (18 cu.in.)", volume: 18.0 },
  { name: "Double gang (34 cu.in.)", volume: 34.0 },
]

export function CodeTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [showCalculator, setShowCalculator] = useState(false)
  
  // Calculator state
  const [wireSize, setWireSize] = useState("12")
  const [wireCount, setWireCount] = useState(4)
  const [deviceCount, setDeviceCount] = useState(1)
  const [hasClamps, setHasClamps] = useState(true)
  const [groundCount, setGroundCount] = useState(1)

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice search requires Chrome or Safari')
      return
    }
    
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      setSearchQuery(event.results[0][0].transcript)
    }
    
    recognition.start()
  }

  const calculateBoxFill = () => {
    const wireVol = wireVolumes[wireSize] || 2.25
    const wiresTotal = wireCount * wireVol
    const devicesTotal = deviceCount * (wireVol * 2)
    const clampsTotal = hasClamps ? wireVol : 0
    const groundTotal = groundCount > 0 ? wireVol : 0
    
    return {
      total: wiresTotal + devicesTotal + clampsTotal + groundTotal,
      breakdown: {
        wires: wiresTotal,
        devices: devicesTotal,
        clamps: clampsTotal,
        ground: groundTotal
      }
    }
  }

  const filteredArticles = useMemo(() => {
    if (activeFilter) {
      const filterMap: Record<string, string[]> = {
        "GFCI": ["210.8"],
        "AFCI": ["210.12"],
        "Grounding": ["250.24", "250.32", "250.53"],
        "Wire Size": ["310.16"],
        "Box Fill": ["314.16"],
        "Clearance": ["110.26"]
      }
      const articles = filterMap[activeFilter] || []
      return necDatabase.filter(a => articles.includes(a.article))
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return necDatabase.filter(article => 
        article.article.toLowerCase().includes(q) ||
        article.title.toLowerCase().includes(q) ||
        article.keyPoints.some(kp => 
          kp.plainEnglish.toLowerCase().includes(q) ||
          kp.text.toLowerCase().includes(q)
        ) ||
        article.commonViolations.some(v => 
          v.scenario.toLowerCase().includes(q)
        )
      )
    }
    
    return necDatabase
  }, [searchQuery, activeFilter])

  const quickFilters = ["GFCI", "AFCI", "Grounding", "Wire Size", "Box Fill", "Clearance"]

  const calc = showCalculator ? calculateBoxFill() : null
  const suitableBoxes = calc ? boxSizes.filter(b => b.volume >= calc.total) : []

  return (
    <div className="h-full overflow-y-auto pb-20">
      {/* Search Header */}
      <div className="sticky top-0 bg-[#0f1115] z-10 px-4 py-3 border-b border-[#333]">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-[#00ff88]" />
          <span className="text-sm font-bold text-[#00ff88] uppercase tracking-wider">NEC Code</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full bg-[#1a1f2e] border border-[#333] rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder-[#555] focus:border-[#00ff88] focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={startVoiceSearch}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'hover:bg-[#252a3a]'}`}
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-white' : 'text-[#00ff88]'}`} />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {quickFilters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-[#00ff88] text-[#0f1115]'
                  : 'bg-[#1a1f2e] text-[#888] border border-[#333]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Box Fill Calculator */}
      {(activeFilter === "Box Fill" || searchQuery.toLowerCase().includes("box")) && (
        <div className="mx-4 mt-4 bg-[#1a1f2e] border border-[#333] rounded-lg p-3">
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#00ff88]" />
              <span className="font-bold text-white text-sm">Box Fill Calculator</span>
            </div>
            {showCalculator ? <ChevronUp className="h-4 w-4 text-[#888]" /> : <ChevronDown className="h-4 w-4 text-[#888]" />}
          </button>
          
          {showCalculator && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#555] block mb-1">Wire</label>
                  <select 
                    value={wireSize} 
                    onChange={(e) => setWireSize(e.target.value)}
                    className="w-full bg-[#0f1115] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
                  >
                    <option value="14">14 AWG</option>
                    <option value="12">12 AWG</option>
                    <option value="10">10 AWG</option>
                    <option value="8">8 AWG</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#555] block mb-1">Wires</label>
                  <input 
                    type="number" 
                    value={wireCount}
                    onChange={(e) => setWireCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0f1115] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#555] block mb-1">Devices</label>
                  <input 
                    type="number" 
                    value={deviceCount}
                    onChange={(e) => setDeviceCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0f1115] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#555] block mb-1">Grounds</label>
                  <input 
                    type="number" 
                    value={groundCount}
                    onChange={(e) => setGroundCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0f1115] border border-[#333] rounded px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              
              <label className="flex items-center gap-2 text-xs text-[#888]">
                <input 
                  type="checkbox" 
                  checked={hasClamps}
                  onChange={(e) => setHasClamps(e.target.checked)}
                  className="rounded border-[#333] bg-[#0f1115] text-[#00ff88]"
                />
                Has cable clamps
              </label>

              <div className="bg-[#0f1115] rounded p-2 border border-[#333]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#888]">Total:</span>
                  <span className={`text-lg font-bold ${calc!.total > 30 ? 'text-red-400' : 'text-[#00ff88]'}`}>
                    {calc!.total.toFixed(1)} <span className="text-xs">cu.in.</span>
                  </span>
                </div>
                {suitableBoxes.length > 0 ? (
                  <div className="text-xs text-[#00ff88]">
                    ✓ Fits: {suitableBoxes[0].name}
                  </div>
                ) : (
                  <div className="text-xs text-red-400">⚠ Need larger box</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ampacity Table */}
      {(activeFilter === "Wire Size" || searchQuery.toLowerCase().includes("wire") || searchQuery.toLowerCase().includes("ampacity")) && (
        <div className="mx-4 mt-4 bg-[#1a1f2e] border border-[#333] rounded-lg p-3 overflow-x-auto">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-[#00ff88]" />
            <span className="font-bold text-white text-sm">Ampacity (310.16)</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#333] text-[#555]">
                <th className="text-left py-1">Size</th>
                <th className="text-center py-1">60°C</th>
                <th className="text-center py-1 text-[#00ff88]">75°C</th>
                <th className="text-center py-1">90°C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {ampacityTable.map((row) => (
                <tr key={row.size}>
                  <td className="py-1 font-mono text-[#f0f0f0]">{row.size}</td>
                  <td className="text-center py-1 text-[#888]">{row.copper["60°C"]}A</td>
                  <td className="text-center py-1 text-[#f0f0f0]">{row.copper["75°C"]}A</td>
                  <td className="text-center py-1 text-[#888]">{row.copper["90°C"]}A</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Article Cards */}
      <div className="px-4 py-4 space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.article} className="bg-[#1a1f2e] border border-[#333] rounded-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#252a3a] p-3 border-b border-[#333] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[#00ff88] font-bold text-sm font-mono">{article.article}</span>
                </div>
                <h3 className="text-white font-semibold text-sm">{article.title}</h3>
                <p className="text-[#888] text-xs mt-0.5">{article.scope}</p>
              </div>
              <button 
                onClick={() => setBookmarked(prev => 
                  prev.includes(article.article) 
                    ? prev.filter(a => a !== article.article)
                    : [...prev, article.article]
                )}
                className="p-1.5 hover:bg-[#333] rounded-full"
              >
                <Bookmark 
                  className={`h-4 w-4 ${bookmarked.includes(article.article) ? 'fill-[#00ff88] text-[#00ff88]' : 'text-[#555]'}`} 
                />
              </button>
            </div>

            {/* Key Points */}
            <div className="p-3 space-y-3">
              {article.keyPoints.map((kp) => (
                <div key={kp.id} className="bg-[#0f1115] rounded p-2.5 border-l-2 border-[#00ff88]">
                  <span className="text-[#00ff88] text-xs font-mono font-bold">{kp.id}</span>
                  <p className="text-white text-sm font-medium mt-1">{kp.plainEnglish}</p>
                  <p className="text-[#666] text-xs italic mt-0.5">"{kp.text}"</p>
                  <p className="text-[#00d4ff] text-xs mt-1">→ {kp.application}</p>
                </div>
              ))}
            </div>

            {/* Violations */}
            {article.commonViolations.length > 0 && (
              <div className="p-3 bg-[#1f1620] border-t border-[#333]">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-xs uppercase text-red-400 font-bold">Violations</span>
                </div>
                {article.commonViolations.map((v, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="flex items-start gap-1.5">
                      <X className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-red-300 text-xs">{v.scenario}</p>
                    </div>
                    <div className="flex items-start gap-1.5 mt-1 pl-5">
                      <Check className="h-3.5 w-3.5 text-[#00ff88] mt-0.5 shrink-0" />
                      <p className="text-[#00ff88] text-xs">{v.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Related */}
            {article.relatedArticles.length > 0 && (
              <div className="p-3 border-t border-[#333] bg-[#252a3a]/50">
                <div className="flex flex-wrap gap-1.5">
                  {article.relatedArticles.map((art) => (
                    <button 
                      key={art}
                      onClick={() => {
                        setSearchQuery(art)
                        setActiveFilter(null)
                      }}
                      className="inline-flex items-center gap-0.5 px-2 py-1 bg-[#1a1f2e] text-[#00d4ff] text-xs rounded hover:bg-[#333]"
                    >
                      {art}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
