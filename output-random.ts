import { BinaryWriter } from './stuff/BinaryWriter.ts';
import { WriteDX7Voices } from './stuff/WriteDX7Voices.ts';
import { DX7Op } from './stuff/DX7Op.ts';
import { DX7Voice } from './stuff/DX7Voice.ts';

// カスみたいな音しか出ないよ

function randomByte(max: number = 255): number {
  return Math.floor(Math.random() * (max + 1));
}

function randomOperator(): DX7Op {
  return {
    eg: {
      rate: [randomByte(99), randomByte(99), randomByte(99), randomByte(99)],
      level: [randomByte(99), randomByte(99), randomByte(99), randomByte(99)],
    },
    keyboardLevelScalingBreakPoint: 0,
    keyboardLevelScalingLeftDepth: 0,
    keyboardLevelScalingRightDepth: 0,
    keyboardLevelScalingLeftCurve: 0,
    keyboardLevelScalingRightCurve: 0,
    detune: randomByte(14),
    keyboardRateScaling: randomByte(7),
    keyVelocitySensitivity: randomByte(7),
    amplitudeModulationSensitivity: 0,
    outputLevel: Math.floor(99 * Math.pow(Math.random(), 0.5)), // randomByte(99),
    frequencyCoarse: Math.floor(31 * Math.pow(Math.random(), 2)), // randomByte(31),
    oscillatorMode: randomByte(1),
    frequencyFine: randomByte(99),
  };
}

function randomVoice(index: number): DX7Voice {
  return {
    operators: [
      randomOperator(),
      randomOperator(),
      randomOperator(),
      randomOperator(),
      randomOperator(),
      randomOperator(),
    ],
    pitchEG: {
      rate: [50, 50, 50, 50],
      level: [50, 50, 50, 50],
    },
    algorithm: randomByte(31),
    feedback: randomByte(7),
    oscillatorSync: Math.random() < 0.5,
    lfo: {
      speed: 34,
      delay: 33,
      pitchModulationDepth: 0,
      amplitudeModulationDepth: 0,
      pitchModulationSensitivity: 3,
      waveform: 4,
      sync: false,
    },
    transpose: 24,
    voiceName: `RANDOM ${index.toString().padStart(2, '0')}`,
  };
}

// == main =========================================================================================
// Generate 32 random voices
const voices: DX7Voice[] = [];
for (let i = 0; i < 32; i++) {
  voices.push(randomVoice(i + 1));
}

// Create writer and write voices
const writer = new BinaryWriter(4104);
WriteDX7Voices(writer, voices);

// Write to file
Deno.writeFileSync('output-random.syx', new Uint8Array(writer.buffer));
console.log('Generated random_voices.syx with 32 randomized DX7 voices');
