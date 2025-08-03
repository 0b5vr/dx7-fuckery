import { BinaryReader } from './stuff/BinaryReader.ts';
import { ReadDX7Voices } from './stuff/ReadDX7Voices.ts';

const voiceNumber = 11;

// Read input syx file
const inputFile = Deno.args[0];
if (!inputFile) {
  console.error('provide a syx file plz');
  Deno.exit(1);
}

// Read the syx file
const data = Deno.readFileSync(inputFile);
const reader = new BinaryReader(data.buffer);

// Read all voices from the syx file
const voices = ReadDX7Voices(reader);

// Get the requested voice
const voice = voices[voiceNumber - 1];

// Output the voice data to console
console.log(JSON.stringify(voice, null, 2));
