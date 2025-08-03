import { DX7LFO } from './DX7LFO.ts';
import { DX7Op } from './DX7Op.ts';
import { DX7EG } from './DX7EG.ts';

export interface DX7Voice {
  // Six operators (OP1-OP6)
  operators: [DX7Op, DX7Op, DX7Op, DX7Op, DX7Op, DX7Op];

  // Global Parameters
  pitchEG: DX7EG;

  // Algorithm and Feedback
  algorithm: number;                        // 0-31 (32 algorithms)
  feedback: number;                         // 0-7
  oscillatorSync: boolean;                  // 0-1

  // LFO
  lfo: DX7LFO;

  // Voice Settings
  transpose: number;                        // 0-48 (C1 to C4)
  voiceName: string;                        // 10 ASCII characters
}
