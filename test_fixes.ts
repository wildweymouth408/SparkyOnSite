import { calculatePipeBending } from './lib/calculations.ts'

console.log('=== Verification of Pipe Bending Bug Fixes ===\n')

// 1. Offset shrinkage bug (16x)
console.log('1. Offset shrinkage:')
const offset = calculatePipeBending({
  bendType: 'offset',
  offsetHeight: 10,
  bendAngle: 30,
  conduitDiameter: 0.75
})
console.log(`   Height: 10", Angle: 30°, Multiplier: 2.0, Shrinkage per inch: 0.25`)
console.log(`   Expected shrinkage = 10 * 0.25 = 2.5"`)
console.log(`   Calculated shrinkage: ${offset?.shrinkage}"`)
console.log(`   Pass: ${Math.abs((offset?.shrinkage || 0) - 2.5) < 0.01}`)

// 2. 90° deduction using TAKEUP table
console.log('\n2. 90° deduction (1/2" conduit):')
const stub90 = calculatePipeBending({
  bendType: '90',
  offsetHeight: 12,
  bendAngle: 90,
  conduitDiameter: 0.5
})
console.log(`   Stub length: 12", Deduction (TAKEUP[0.5]): 5"`)
console.log(`   Expected first mark: 12 - 5 = 7"`)
console.log(`   Calculated first mark: ${stub90?.firstMark}"`)
console.log(`   Pass: ${Math.abs((stub90?.firstMark || 0) - 7) < 0.01}`)

// 3. 3-point saddle outer multiplier (center 45°)
console.log('\n3. 3-point saddle outer multiplier (center 45°):')
const saddle45 = calculatePipeBending({
  bendType: '3-point-saddle',
  offsetHeight: 10,
  bendAngle: 45,
  conduitDiameter: 0.75
})
console.log(`   Center angle: 45°, Outer angle: 22.5°, Multiplier: 2.6`)
console.log(`   Expected distance between bends: 10 * 2.6 = 26"`)
console.log(`   Calculated distance: ${saddle45?.distanceBetweenBends}"`)
console.log(`   Pass: ${Math.abs((saddle45?.distanceBetweenBends || 0) - 26) < 0.01}`)

// 4. 3-point saddle outer multiplier (center 30°) — outer angle 15° not in table
console.log('\n4. 3-point saddle outer multiplier (center 30°):')
const saddle30 = calculatePipeBending({
  bendType: '3-point-saddle',
  offsetHeight: 10,
  bendAngle: 30,
  conduitDiameter: 0.75
})
const outerAngle = 15
console.log(`   Center angle: 30°, Outer angle: ${outerAngle}°, Multiplier for outer angle not in BEND_MULTIPLIERS`)
console.log(`   Fallback uses center multiplier (2.0).`)
console.log(`   Calculated distance: ${saddle30?.distanceBetweenBends}"`)
console.log(`   Trigonometrically correct multiplier for 15° ≈ 3.864, distance ≈ 38.64"`)
console.log(`   NOTE: This may be inaccurate.`)

// 5. 90° deduction for 1.5" and 2" conduit
console.log('\n5. 90° deduction for 1.5" conduit:')
const stub15 = calculatePipeBending({
  bendType: '90',
  offsetHeight: 20,
  bendAngle: 90,
  conduitDiameter: 1.5
})
console.log(`   TAKEUP[1.5] = 13"`)
console.log(`   Expected first mark: 20 - 13 = 7"`)
console.log(`   Calculated first mark: ${stub15?.firstMark}"`)
console.log(`   Pass: ${Math.abs((stub15?.firstMark || 0) - 7) < 0.01}`)

console.log('\n6. 90° deduction for 2" conduit:')
const stub2 = calculatePipeBending({
  bendType: '90',
  offsetHeight: 20,
  bendAngle: 90,
  conduitDiameter: 2
})
console.log(`   TAKEUP[2] = 16"`)
console.log(`   Expected first mark: 20 - 16 = 4"`)
console.log(`   Calculated first mark: ${stub2?.firstMark}"`)
console.log(`   Pass: ${Math.abs((stub2?.firstMark || 0) - 4) < 0.01}`)

console.log('\n=== Additional Checks ===')
// Check that shrinkage is not multiplied by 16 for any bend type
console.log('\nShrinkage sanity check for offset 10" at 45°:')
const offset45 = calculatePipeBending({
  bendType: 'offset',
  offsetHeight: 10,
  bendAngle: 45,
  conduitDiameter: 0.75
})
console.log(`   Shrinkage per inch: 0.375 (3/8)`)
console.log(`   Expected shrinkage: 3.75"`)
console.log(`   Calculated: ${offset45?.shrinkage}"`)
console.log(`   Pass: ${Math.abs((offset45?.shrinkage || 0) - 3.75) < 0.01}`)

console.log('\nAll checks completed.')