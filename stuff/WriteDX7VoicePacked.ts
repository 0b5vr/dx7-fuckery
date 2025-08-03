import { BinaryWriter } from './BinaryWriter.ts';
import { DX7Voice } from './DX7Voice.ts';

export function WriteDX7VoicePacked(writer: BinaryWriter, voice: DX7Voice): void {

  // Serialize each operator (6 operators, bytes 0-101)
  for (let opIndex = 0; opIndex < 6; opIndex++) {
    const op = voice.operators[opIndex];

    // Bytes 0-7: EG Rates and Levels
    writer.writeByte(op.eg.rate[0]);
    writer.writeByte(op.eg.rate[1]);
    writer.writeByte(op.eg.rate[2]);
    writer.writeByte(op.eg.rate[3]);
    writer.writeByte(op.eg.level[0]);
    writer.writeByte(op.eg.level[1]);
    writer.writeByte(op.eg.level[2]);
    writer.writeByte(op.eg.level[3]);

    // Byte 8: Keyboard Level Scaling Break Point
    writer.writeByte(op.keyboardLevelScalingBreakPoint);

    // Byte 9: Left and Right Depth
    writer.writeByte(op.keyboardLevelScalingLeftDepth);
    writer.writeByte(op.keyboardLevelScalingRightDepth);

    // Byte 11: Packed curves (bits 3-2: right curve, bits 1-0: left curve)
    const curveByte = (op.keyboardLevelScalingRightCurve << 2) | op.keyboardLevelScalingLeftCurve;
    writer.writeByte(curveByte);

    // Byte 12: Packed detune and rate scaling (bits 6-3: detune, bits 2-0: rate scaling)
    const detuneRateByte = (op.detune << 3) | op.keyboardRateScaling;
    writer.writeByte(detuneRateByte);

    // Byte 13: Key Velocity Sensitivity and AM Sensitivity
    const modByte = (op.keyVelocitySensitivity << 2) | op.amplitudeModulationSensitivity;
    writer.writeByte(modByte);

    // Byte 14: Output Level
    writer.writeByte(op.outputLevel);

    // Byte 15: Frequency Coarse and Oscillator Mode
    const oscByte = (op.frequencyCoarse << 1) | op.oscillatorMode;
    writer.writeByte(oscByte);

    // Byte 16: Frequency Fine
    writer.writeByte(op.frequencyFine);
  }

  // Byte 102-105: Pitch EG Rate 1-4
  writer.writeByte(voice.pitchEG.rate[0]);
  writer.writeByte(voice.pitchEG.rate[1]);
  writer.writeByte(voice.pitchEG.rate[2]);
  writer.writeByte(voice.pitchEG.rate[3]);

  // Byte 106-109: Pitch EG Level 1-4
  writer.writeByte(voice.pitchEG.level[0]);
  writer.writeByte(voice.pitchEG.level[1]);
  writer.writeByte(voice.pitchEG.level[2]);
  writer.writeByte(voice.pitchEG.level[3]);

  // Byte 110: Algorithm
  writer.writeByte(voice.algorithm);

  // Byte 111: Oscillator Sync and Feedback
  const feedbackSyncByte = (voice.oscillatorSync ? 1 : 0) << 3 | voice.feedback;
  writer.writeByte(feedbackSyncByte);

  // Byte 112: LFO Speed
  writer.writeByte(voice.lfo.speed);

  // Byte 113: LFO Delay
  writer.writeByte(voice.lfo.delay);

  // Byte 114: LFO Pitch Mod Depth
  writer.writeByte(voice.lfo.pitchModulationDepth);

  // Byte 115: LFO Amplitude Mod Depth
  writer.writeByte(voice.lfo.amplitudeModulationDepth);

  // Byte 116: LFO Pitch Mod Sensitivity, Waveform, and Sync (bits 6-4: pitchModSens, bits 3-1: waveform, bit 0: sync)
  const lfoSyncWaveByte = (voice.lfo.pitchModulationSensitivity << 4) | (voice.lfo.waveform << 1) | (voice.lfo.sync ? 1 : 0);
  writer.writeByte(lfoSyncWaveByte);

  // Byte 117: Transpose
  writer.writeByte(voice.transpose);

  // Byte 118-127: Voice Name (10 characters, pad with spaces if needed)
  const paddedName = voice.voiceName.padEnd(10, ' ');
  writer.writeChars(paddedName);
}
