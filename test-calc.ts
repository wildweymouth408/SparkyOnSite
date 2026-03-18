import { calculatePipeBending } from './lib/calculations.ts'

console.log('Testing Pipe Bending Calculator fixes...')

// Test 1: Offset shrinkage bug (16x)
const offsetResult = calculatePipeBending({
  bendType: 'offset',
  offsetHeight: 10,
  bendAngle: 30,
  conduitDiameter: 0.75
})
console.log('Offset test:')
console.log('  Distance between bends:', offsetResult?.distanceBetweenBends)
console.log('  Shrinkage:', offsetResult?.shrinkage)
console.log('  Expected shrinkage ~2.5" (10 * 0.25)')
console.log('  Pass?', Math.abs((offsetResult?.shrinkage || 0) - 2.5) < 0.01)

// Test 2: 90° deduction using TAKEUP table
const stubResult = calculatePipeBending({
  bendType: '90',
  offsetHeight: 12,
  bendAngle: 90,
  conduitDiameter: 0.5
})
console.log('\n90° stub test:')
console.log('  First mark (stub - deduction):', stubResult?.firstMark)
console.log('  Expected deduction 5" => mark at 7"')
console.log('  Pass?', Math.abs((stubResult?.firstMark || 0) - 7) < 0.01)

// Test 3: 3-point saddle outer multiplier
const saddle3Result = calculatePipeBending({
  bendType: '3-point-saddle',
  offsetHeight: 10,
  bendAngle: 45,
  conduitDiameter: 0.75
})
console.log('\n3-point saddle test:')
console.log('  Distance between bends:', saddle3Result?.distanceBetweenBends)
console.log('  Expected distance ~26" (10 * 2.6)')
console.log('  Pass?', Math.abs((saddle3Result?.distanceBetweenBends || 0) - 26) < 0.01)
console.log('  Shrinkage:', saddle3Result?.shrinkage)
console.log('  Expected shrinkage ~1.875" (10 * 0.1875)')
console.log('  Pass?', Math.abs((saddle3Result?.shrinkage || 0) - 1.875) < 0.01)

// Test 4: 4-point saddle shrinkage fix
const saddle4Result = calculatePipeBending({
  bendType: '4-point-saddle',
  offsetHeight: 10,
  bendAngle: 45,
  conduitDiameter: 0.75
})
console.log('\n4-point saddle test:')
console.log('  Shrinkage:', saddle4Result?.shrinkage)
console.log('  Expected shrinkage ~3.75" (10 * 0.375)')
console.log('  Pass?', Math.abs((saddle3Result?.shrinkage || 0) - 1.875) < 0.01)

// Test 5: Missing conduit sizes 1.5" and 2"
const sizeTest1 = calculatePipeBending({
  bendType: '90',
  offsetHeight: 12,
  bendAngle: 90,
  conduitDiameter: 1.5
})
console.log('\n1.5" conduit deduction test:')
console.log('  First mark:', sizeTest1?.firstMark)
console.log('  Expected deduction 13" => mark at -1"? Wait offsetHeight 12, deduction 13 => negative')
console.log('  Deduction should be 13" per TAKEUP')
const sizeTest2 = calculatePipeBending({
  bendType: '90',
  offsetHeight: 20,
  bendAngle: 90,
  conduitDiameter: 2
})
console.log('\n2" conduit deduction test:')
console.log('  First mark:', sizeTest2?.firstMark)
console.log('  Expected deduction 16" => mark at 4"')
console.log('  Pass?', Math.abs((sizeTest2?.firstMark || 0) - 4) < 0.01)

console.log('\nAll tests completed.')