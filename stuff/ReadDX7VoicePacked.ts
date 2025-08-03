import { BinaryReader } from './BinaryReader.ts';
import { DX7Voice } from './DX7Voice.ts';

function createEmptyOperator() {
  return {
    eg: {
      rate: [0, 0, 0, 0],
      level: [0, 0, 0, 0]
    },
    keyboardLevelScalingBreakPoint: 0,
    keyboardLevelScalingLeftDepth: 0,
    keyboardLevelScalingRightDepth: 0,
    keyboardLevelScalingLeftCurve: 0,
    keyboardLevelScalingRightCurve: 0,
    detune: 0,
    keyboardRateScaling: 0,
    keyVelocitySensitivity: 0,
    amplitudeModulationSensitivity: 0,
    outputLevel: 0,
    frequencyCoarse: 0,
    oscillatorMode: 0,
    frequencyFine: 0
  };
}

function createEmptyVoice(): DX7Voice {
  return {
    operators: [
      createEmptyOperator(),
      createEmptyOperator(),
      createEmptyOperator(),
      createEmptyOperator(),
      createEmptyOperator(),
      createEmptyOperator()
    ],
    pitchEG: {
      rate: [0, 0, 0, 0],
      level: [0, 0, 0, 0]
    },
    algorithm: 0,
    feedback: 0,
    oscillatorSync: false,
    lfo: {
      speed: 0,
      delay: 0,
      pitchModulationDepth: 0,
      amplitudeModulationDepth: 0,
      pitchModulationSensitivity: 0,
      waveform: 0,
      sync: false
    },
    transpose: 0,
    voiceName: ''
  };
}

export function ReadDX7VoicePacked(reader: BinaryReader): DX7Voice {
  const voice = createEmptyVoice();

  // Read each operator (6 operators, bytes 0-101)
  for (let opIndex = 0; opIndex < 6; opIndex++) {
    const op = voice.operators[opIndex];

    op.eg.rate[0] = reader.readByte();
    op.eg.rate[1] = reader.readByte();
    op.eg.rate[2] = reader.readByte();
    op.eg.rate[3] = reader.readByte();
    op.eg.level[0] = reader.readByte();
    op.eg.level[1] = reader.readByte();
    op.eg.level[2] = reader.readByte();
    op.eg.level[3] = reader.readByte();
    op.keyboardLevelScalingBreakPoint = reader.readByte();
    op.keyboardLevelScalingLeftDepth = reader.readByte();
    op.keyboardLevelScalingRightDepth = reader.readByte();

    // Unpack curves (bits 3-2: right curve, bits 1-0: left curve)
    const curveByte = reader.readByte();
    op.keyboardLevelScalingRightCurve = (curveByte >> 2) & 0x03;
    op.keyboardLevelScalingLeftCurve = curveByte & 0x03;

    // Unpack detune and rate scaling (bits 6-3: detune, bits 2-0: rate scaling)
    const detuneRateByte = reader.readByte();
    op.detune = (detuneRateByte >> 3) & 0x0F;
    op.keyboardRateScaling = detuneRateByte & 0x07;

    // Unpack Key Velocity Sensitivity and AM Sensitivity
    const modByte = reader.readByte();
    op.keyVelocitySensitivity = (modByte >> 2) & 0x07;
    op.amplitudeModulationSensitivity = modByte & 0x03;

    // Output Level
    op.outputLevel = reader.readByte();

    // Unpack Frequency Coarse and Oscillator Mode
    const oscByte = reader.readByte();
    op.frequencyCoarse = (oscByte >> 1) & 0x1F;
    op.oscillatorMode = oscByte & 0x01;

    // Frequency Fine
    op.frequencyFine = reader.readByte();
  }

  // Pitch EG Rate 1-4
  voice.pitchEG.rate[0] = reader.readByte();
  voice.pitchEG.rate[1] = reader.readByte();
  voice.pitchEG.rate[2] = reader.readByte();
  voice.pitchEG.rate[3] = reader.readByte();

  // Pitch EG Level 1-4
  voice.pitchEG.level[0] = reader.readByte();
  voice.pitchEG.level[1] = reader.readByte();
  voice.pitchEG.level[2] = reader.readByte();
  voice.pitchEG.level[3] = reader.readByte();

  // Algorithm
  voice.algorithm = reader.readByte();

  // Unpack Oscillator Sync and Feedback
  const feedbackSyncByte = reader.readByte();
  voice.oscillatorSync = ((feedbackSyncByte >> 3) & 0x01) === 1;
  voice.feedback = feedbackSyncByte & 0x07;

  // LFO Speed
  voice.lfo.speed = reader.readByte();

  // LFO Delay
  voice.lfo.delay = reader.readByte();

  // LFO Pitch Mod Depth
  voice.lfo.pitchModulationDepth = reader.readByte();

  // LFO Amplitude Mod Depth
  voice.lfo.amplitudeModulationDepth = reader.readByte();

  // Unpack LFO Pitch Mod Sensitivity, Waveform, and Sync
  const lfoSyncWaveByte = reader.readByte();
  voice.lfo.pitchModulationSensitivity = (lfoSyncWaveByte >> 4) & 0x07;
  voice.lfo.waveform = (lfoSyncWaveByte >> 1) & 0x07;
  voice.lfo.sync = (lfoSyncWaveByte & 0x01) === 1;

  // Transpose
  voice.transpose = reader.readByte();

  // Voice Name (10 characters)
  voice.voiceName = reader.readChars(10).trim();

  return voice;
}