// Sparky's Tip of the Day - rotating practical NEC & field tips

export interface SparkTip {
  id: string
  category: 'safety' | 'code' | 'technique' | 'tool'
  title: string
  body: string
  reference?: string
}

export const TIPS: SparkTip[] = [
  {
    id: 'tip-1',
    category: 'code',
    title: 'Voltage Drop Rule of Thumb',
    body: 'NEC recommends no more than 3% voltage drop on branch circuits and 5% total for feeder + branch combined. Always calculate before pulling wire.',
    reference: 'NEC 210.19(A) FPN',
  },
  {
    id: 'tip-2',
    category: 'safety',
    title: 'Lockout/Tagout Every Time',
    body: 'NFPA 70E requires proper lockout/tagout procedures. Never trust someone who says "it\'s already off." Verify zero energy state yourself.',
    reference: 'NFPA 70E 120.5',
  },
  {
    id: 'tip-3',
    category: 'technique',
    title: 'Anti-Short Bushings Matter',
    body: 'Red-head (anti-short) bushings on MC cable are not optional. They protect conductors from the sharp edges of the armor at the connector.',
    reference: 'NEC 330.40',
  },
  {
    id: 'tip-4',
    category: 'code',
    title: 'Box Fill - Don\'t Forget Clamps',
    body: 'Internal cable clamps count as one conductor volume based on the largest wire in the box. Many failed inspections come from forgotten clamp fills.',
    reference: 'NEC 314.16(B)(2)',
  },
  {
    id: 'tip-5',
    category: 'tool',
    title: 'Torpedo Level on Every Bend',
    body: 'Keep a torpedo level on your bender shoe. A level conduit run starts with level bends. The 30 seconds spent checking saves hours of rework.',
  },
  {
    id: 'tip-6',
    category: 'safety',
    title: 'The 6-Foot GFCI Rule',
    body: 'Any 125V-250V receptacle within 6 feet of a sink edge needs GFCI protection. Measure from the outside edge of the sink, not the faucet.',
    reference: 'NEC 210.8',
  },
  {
    id: 'tip-7',
    category: 'technique',
    title: 'Offset Multiplier Quick Math',
    body: 'For 30-degree offsets: multiply obstacle height by 2 for distance between bends, and by 1/4" shrinkage per inch of offset. It\'s the most common bend angle for a reason.',
  },
  {
    id: 'tip-8',
    category: 'code',
    title: 'Wire Ampacity Terminal Limits',
    body: 'Even if your wire is rated for 90C, most terminals are rated 75C. You must use the 75C ampacity column for circuits over 100A unless the equipment is listed for higher.',
    reference: 'NEC 110.14(C)',
  },
  {
    id: 'tip-9',
    category: 'technique',
    title: 'Mark Your Conduit Twice',
    body: 'Always double-check your measurements and marks before bending. Once the conduit is bent, there\'s no "un-bending" it cleanly. Measure twice, bend once.',
  },
  {
    id: 'tip-10',
    category: 'safety',
    title: 'Arc Flash Boundaries',
    body: 'Know your arc flash boundaries before opening any panel. The inner boundary (prohibited approach) is where serious burns occur in less than one second.',
    reference: 'NFPA 70E Table 130.7(C)(15)',
  },
  {
    id: 'tip-11',
    category: 'code',
    title: 'Conduit Fill: The 40% Rule',
    body: 'Three or more conductors in a conduit? Maximum 40% fill. Two conductors: 31%. One conductor: 53%. These are cross-sectional area percentages, not diameter.',
    reference: 'NEC Chapter 9, Table 1',
  },
  {
    id: 'tip-12',
    category: 'tool',
    title: 'Keep Your Level App Handy',
    body: 'A digital level app on your phone works great for checking conduit runs and device box alignment. Just make sure to calibrate it on a known-level surface first.',
  },
  {
    id: 'tip-13',
    category: 'code',
    title: 'AFCI vs GFCI: Know the Difference',
    body: 'GFCI protects people from shock (ground faults). AFCI protects property from fire (arc faults). Many locations now require both, and dual-function breakers exist.',
    reference: 'NEC 210.8 & 210.12',
  },
  {
    id: 'tip-14',
    category: 'technique',
    title: 'Pull Wire, Don\'t Push It',
    body: 'For longer conduit runs, always pull wire with a proper fish tape and head. Pushing wire creates kinks and jacket damage. Use wire pulling lubricant on runs over 50 feet.',
  },
]

export function getTipOfTheDay(): SparkTip {
  // Use day of year as index for daily rotation
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return TIPS[dayOfYear % TIPS.length]
}
