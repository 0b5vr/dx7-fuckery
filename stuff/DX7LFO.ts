export interface DX7LFO {
  speed: number;                            // 0-99
  delay: number;                            // 0-99
  pitchModulationDepth: number;             // 0-99
  amplitudeModulationDepth: number;         // 0-99
  sync: boolean;                            // 0-1
  waveform: number;                         // 0-5 (TRI, SAW DN, SAW UP, SQU, SIN, S&H)
  pitchModulationSensitivity: number;       // 0-7
}
