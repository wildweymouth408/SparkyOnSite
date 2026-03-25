'use client';

import React, { useState } from 'react';

export default function VoltageDropPage() {
  const [values, setValues] = useState({
    voltage: 120,
    current: 20,
    distance: 100,
    resistance: 0.0053
  });

  const voltageDrop = (values.current * values.distance * values.resistance) / 1000;
  const percentageDrop = ((voltageDrop / values.voltage) * 100).toFixed(2);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Voltage Drop Calculator
      </h1>
      <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
        Per NEC Article 210 - Calculate voltage drop across conductors
      </p>

      <div style={{ background: '#1e293b', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Voltage (V): {values.voltage}
          </label>
          <input
            type="range"
            min="12"
            max="480"
            value={values.voltage}
            onChange={(e) => setValues({ ...values, voltage: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Current (Amps): {values.current}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={values.current}
            onChange={(e) => setValues({ ...values, current: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Distance (feet): {values.distance}
          </label>
          <input
            type="range"
            min="10"
            max="500"
            value={values.distance}
            onChange={(e) => setValues({ ...values, distance: parseFloat(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '0' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Copper Resistance (Ω/1000ft): {values.resistance}
          </label>
          <select
            value={values.resistance}
            onChange={(e) => setValues({ ...values, resistance: parseFloat(e.target.value) })}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#334155',
              color: 'white',
              border: '1px solid #475569',
              borderRadius: '0.375rem'
            }}
          >
            <option value={0.0053}>14 AWG (0.0053)</option>
            <option value={0.0033}>12 AWG (0.0033)</option>
            <option value={0.0021}>10 AWG (0.0021)</option>
            <option value={0.0013}>8 AWG (0.0013)</option>
          </select>
        </div>
      </div>

      <div style={{ 
        background: 'linear-gradient(to right, #1a3a4a, #1e293b)',
        borderRadius: '0.75rem',
        padding: '2rem',
        borderLeft: '4px solid #06b6d4'
      }}>
        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Voltage Drop</p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '1rem' }}>
          {voltageDrop.toFixed(2)}V
        </p>

        <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Percentage Drop</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: percentageDrop > 5 ? '#ef4444' : '#10b981' }}>
          {percentageDrop}%
        </p>

        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '1rem' }}>
          {percentageDrop > 5 ? '⚠️ Exceeds NEC recommendation of 5%' : '✓ Within NEC limits'}
        </p>
      </div>
    </div>
  );
}