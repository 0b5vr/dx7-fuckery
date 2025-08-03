import { DX7EG } from './DX7EG.ts';

export interface DX7Op {
  // Envelope Generator (EG)
  eg: DX7EG;

  // Keyboard Level Scaling
  keyboardLevelScalingBreakPoint: number;    // 0-99 (C3 = $27)
  keyboardLevelScalingLeftDepth: number;     // 0-99
  keyboardLevelScalingRightDepth: number;    // 0-99
  keyboardLevelScalingLeftCurve: number;     // 0-3 (-LIN, -EXP, +EXP, +LIN)
  keyboardLevelScalingRightCurve: number;    // 0-3 (-LIN, -EXP, +EXP, +LIN)

  // Keyboard Rate Scaling
  keyboardRateScaling: number;               // 0-7

  // Modulation
  amplitudeModulationSensitivity: number;    // 0-3
  keyVelocitySensitivity: number;            // 0-7

  // Operator Settings
  outputLevel: number;                       // 0-99
  oscillatorMode: number;                    // 0 = RATIO, 1 = FIXED
  frequencyCoarse: number;                   // 0-31
  frequencyFine: number;                     // 0-99
  detune: number;                            // 0-14 (-7 to +7)
}
