import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile, interpolate, useCurrentFrame, spring } from 'remotion';
import { loadFont } from '@remotion/fonts';
import { Inter, JetBrains_Mono } from '@remotion/font-google';

// Load fonts (will be cached)
loadFont(Inter, { weights: ['400', '600', '700'] });
loadFont(JetBrains_Mono, { weights: ['400'] });

export const WireSizingVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // Animation helpers
  const fadeIn = (startFrame: number, durationFrames: number = 15) => {
    return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  const slideIn = (startFrame: number, from: 'left' | 'right' | 'top' | 'bottom' = 'left', distance: number = 100) => {
    const direction = from === 'left' ? -distance : from === 'right' ? distance : from === 'top' ? -distance : distance;
    const axis = from === 'left' || from === 'right' ? 'translateX' : 'translateY';
    return interpolate(
      frame,
      [startFrame, startFrame + 10],
      [direction, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  };

  const pulse = (startFrame: number, cycles: number = 3) => {
    const cycleDuration = 10;
    const cycle = Math.floor((frame - startFrame) / cycleDuration);
    if (cycle < 0 || cycle >= cycles) return 1;
    const cycleFrame = (frame - startFrame) % cycleDuration;
    return interpolate(cycleFrame, [0, 5, 10], [1, 1.1, 1]);
  };

  // Scene timings (in frames)
  const SCENE = {
    HOOK: 0,                    // 0-5s
    PROBLEM: 5 * fps,          // 5-12s
    SOLUTION: 12 * fps,        // 12-20s
    RESULT: 20 * fps,          // 20-28s
    CTA: 28 * fps,             // 28-30s
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b' }}>
      {/* Background music */}
      <Audio
        src={staticFile('music/upbeat-instrumental.mp3')}
        volume={0.3}
        startFrom={0}
      />

      {/* Narration audio */}
      <Sequence from={SCENE.HOOK} durationInFrames={5 * fps}>
        <Audio
          src={staticFile('narration/hook.mp3')}
          volume={1}
        />
      </Sequence>
      <Sequence from={SCENE.PROBLEM} durationInFrames={7 * fps}>
        <Audio
          src={staticFile('narration/problem.mp3')}
          volume={1}
        />
      </Sequence>
      <Sequence from={SCENE.SOLUTION} durationInFrames={8 * fps}>
        <Audio
          src={staticFile('narration/solution.mp3')}
          volume={1}
        />
      </Sequence>
      <Sequence from={SCENE.RESULT} durationInFrames={8 * fps}>
        <Audio
          src={staticFile('narration/result.mp3')}
          volume={1}
        />
      </Sequence>
      <Sequence from={SCENE.CTA} durationInFrames={2 * fps}>
        <Audio
          src={staticFile('narration/cta.mp3')}
          volume={1}
        />
      </Sequence>

      {/* Scene 1: Hook */}
      <Sequence from={SCENE.HOOK} durationInFrames={5 * fps}>
        <AbsoluteFill style={{ opacity: fadeIn(SCENE.HOOK) }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '80%',
          }}>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 72,
              fontWeight: 700,
              color: '#fafafa',
              lineHeight: 1.2,
              marginBottom: 40,
            }}>
              Tired of wire‑size guesswork?
            </h1>
            <div style={{
              width: '60%',
              height: 4,
              backgroundColor: '#f97316',
              margin: '0 auto',
              borderRadius: 2,
              transform: `scaleX(${interpolate(frame, [SCENE.HOOK, SCENE.HOOK + 15], [0, 1])})`,
              transformOrigin: 'center',
            }} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Problem */}
      <Sequence from={SCENE.PROBLEM} durationInFrames={7 * fps}>
        <AbsoluteFill style={{ opacity: fadeIn(SCENE.PROBLEM) }}>
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '80%',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 48,
              color: '#a1a1aa',
              lineHeight: 1.4,
              marginBottom: 30,
            }}>
              Manual calculations waste time
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 48,
              color: '#a1a1aa',
              lineHeight: 1.4,
              marginBottom: 30,
            }}>
              and risk <span style={{ color: '#ef4444', fontWeight: 600 }}>NEC violations</span>.
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Solution – Sparky UI demo */}
      <Sequence from={SCENE.SOLUTION} durationInFrames={8 * fps}>
        <AbsoluteFill style={{ opacity: fadeIn(SCENE.SOLUTION) }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            backgroundColor: '#18181b',
            borderRadius: 24,
            padding: 40,
            border: '2px solid #27272a',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Sparky UI mockup */}
            <div style={{ marginBottom: 30 }}>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 36,
                fontWeight: 700,
                color: '#fafafa',
                marginBottom: 20,
              }}>
                Wire Sizing Calculator
              </h2>
            </div>

            {/* Input rows */}
            {[
              { label: 'Amps', value: '20', startFrame: SCENE.SOLUTION + 10 },
              { label: 'Distance (feet)', value: '100', startFrame: SCENE.SOLUTION + 25 },
              { label: 'Voltage', value: '120', startFrame: SCENE.SOLUTION + 40 },
              { label: 'Conductor', value: 'Copper', startFrame: SCENE.SOLUTION + 55 },
            ].map((input, i) => (
              <div key={i} style={{
                marginBottom: 20,
                opacity: fadeIn(input.startFrame, 10),
                transform: `translateX(${slideIn(input.startFrame, 'left', 50)}px)`,
              }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 18,
                  color: '#a1a1aa',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  {input.label}
                </label>
                <div style={{
                  backgroundColor: '#0a0b0e',
                  border: `2px solid ${frame >= input.startFrame && frame < input.startFrame + 20 ? '#f97316' : '#27272a'}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  transform: `scale(${pulse(input.startFrame, 2)})`,
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 28,
                    color: '#fafafa',
                  }}>
                    {input.value}
                  </span>
                </div>
              </div>
            ))}

            {/* Calculate button */}
            <div style={{
              marginTop: 30,
              opacity: fadeIn(SCENE.SOLUTION + 70, 10),
              transform: `translateY(${slideIn(SCENE.SOLUTION + 70, 'bottom', 30)}px)`,
            }}>
              <button style={{
                width: '100%',
                backgroundColor: '#f97316',
                color: '#09090b',
                fontFamily: 'Inter, sans-serif',
                fontSize: 24,
                fontWeight: 700,
                padding: '20px',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
              }}>
                Calculate
              </button>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '80%',
            opacity: fadeIn(SCENE.SOLUTION + 60),
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 36,
              color: '#a1a1aa',
            }}>
              Sparky gives you the right answer every time.
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Result */}
      <Sequence from={SCENE.RESULT} durationInFrames={8 * fps}>
        <AbsoluteFill style={{ opacity: fadeIn(SCENE.RESULT) }}>
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 120,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              color: '#f97316',
              marginBottom: 20,
              textShadow: '0 10px 30px rgba(249, 115, 22, 0.4)',
              transform: `scale(${spring({ frame: frame - SCENE.RESULT, fps, config: { damping: 20 } })})`,
            }}>
              #12 AWG
            </div>
            <div style={{
              fontSize: 36,
              fontFamily: 'Inter, sans-serif',
              color: '#a1a1aa',
              marginBottom: 40,
              opacity: fadeIn(SCENE.RESULT + 10),
            }}>
              NEC 310.12 – Dwelling unit branch circuits
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              opacity: fadeIn(SCENE.RESULT + 20),
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 32,
                color: '#22c55e',
                fontWeight: 600,
              }}>
                NEC‑compliant
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Call‑to‑action */}
      <Sequence from={SCENE.CTA} durationInFrames={2 * fps}>
        <AbsoluteFill style={{ opacity: fadeIn(SCENE.CTA, 10) }}>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '90%',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 48,
              color: '#fafafa',
              fontWeight: 700,
              marginBottom: 20,
            }}>
              Try Sparky free
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 36,
              color: '#a1a1aa',
            }}>
              — link in bio
            </p>
            <div style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'center',
              gap: 20,
            }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                backgroundColor: '#09090b',
                border: '2px solid #27272a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 24,
                  color: '#f97316',
                  fontWeight: 700,
                }}>
                  S
                </span>
              </div>
              <div style={{
                alignSelf: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: 28,
                color: '#fafafa',
                fontWeight: 600,
              }}>
                sparkyonsite.com
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Subtle grid overlay */}
      <AbsoluteFill style={{
        backgroundImage: `linear-gradient(rgba(39, 39, 42, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(39, 39, 42, 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.2,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};