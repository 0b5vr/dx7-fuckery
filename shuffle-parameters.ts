import { BinaryReader } from './stuff/BinaryReader.ts';
import { BinaryWriter } from './stuff/BinaryWriter.ts';
import { ReadDX7Voices } from './stuff/ReadDX7Voices.ts';
import { WriteDX7Voices } from './stuff/WriteDX7Voices.ts';
import { DX7Op } from './stuff/DX7Op.ts';
import { DX7Voice } from './stuff/DX7Voice.ts';

// Helper function to pick random element from array
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Extract operators and voices as complete objects
function extractPools(voices: DX7Voice[]) {
  const opPool: DX7Op[] = [];
  const voicePool: DX7Voice[] = [];

  for (const voice of voices) {
    voicePool.push(voice);

    for (const op of voice.operators) {
      opPool.push(op);
    }
  }

  return {
    operators: opPool,
    voices: voicePool,
  };
}

// Create a shuffled operator by mixing components from different operators
function createShuffledOperator(opPool: DX7Op[]): DX7Op {
  return {
    eg: pickRandom(opPool).eg,
    keyboardLevelScalingBreakPoint: pickRandom(opPool).keyboardLevelScalingBreakPoint,
    keyboardLevelScalingLeftDepth: pickRandom(opPool).keyboardLevelScalingLeftDepth,
    keyboardLevelScalingRightDepth: pickRandom(opPool).keyboardLevelScalingRightDepth,
    keyboardLevelScalingLeftCurve: pickRandom(opPool).keyboardLevelScalingLeftCurve,
    keyboardLevelScalingRightCurve: pickRandom(opPool).keyboardLevelScalingRightCurve,
    detune: pickRandom(opPool).detune,
    frequencyCoarse: pickRandom(opPool).frequencyCoarse,
    frequencyFine: pickRandom(opPool).frequencyFine,
    oscillatorMode: pickRandom(opPool).oscillatorMode,
    keyboardRateScaling: pickRandom(opPool).keyboardRateScaling,
    keyVelocitySensitivity: pickRandom(opPool).keyVelocitySensitivity,
    amplitudeModulationSensitivity: pickRandom(opPool).amplitudeModulationSensitivity,
    outputLevel: pickRandom(opPool).outputLevel,
  };
}

// Create a shuffled voice by mixing components from different voices
function createShuffledVoice(
  index: number,
  voicePool: DX7Voice[],
  opPool: DX7Op[],
): DX7Voice {
  return {
    operators: [
      createShuffledOperator(opPool),
      createShuffledOperator(opPool),
      createShuffledOperator(opPool),
      createShuffledOperator(opPool),
      createShuffledOperator(opPool),
      createShuffledOperator(opPool),
    ],
    pitchEG: pickRandom(voicePool).pitchEG,
    algorithm: pickRandom(voicePool).algorithm,
    feedback: pickRandom(voicePool).feedback,
    lfo: pickRandom(voicePool).lfo,
    oscillatorSync: pickRandom(voicePool).oscillatorSync,
    transpose: pickRandom(voicePool).transpose,
    voiceName: `ALIEN ${index.toString().padStart(2, '0')}`,
  };
}

// == main =========================================================================================
// Read existing voices from the .syx file
const inputFile = Deno.args[0];
if (!inputFile) {
  console.error('Usage: deno run shuffle-parameters.ts <input.syx>');
  Deno.exit(1);
}

const syxData = Deno.readFileSync(inputFile);
const reader = new BinaryReader(syxData.buffer);
const sourceVoices = ReadDX7Voices(reader);

// Extract pools of complete operators and voices
const pools = extractPools(sourceVoices);

// Generate 32 shuffled voices
const shuffledVoices: DX7Voice[] = [];
for (let i = 0; i < 32; i++) {
  shuffledVoices.push(createShuffledVoice(i + 1, pools.voices, pools.operators));
}

// Write to file
const writer = new BinaryWriter(4104);
WriteDX7Voices(writer, shuffledVoices);
Deno.writeFileSync(`output-shuffled-${Date.now()}.syx`, new Uint8Array(writer.buffer));
