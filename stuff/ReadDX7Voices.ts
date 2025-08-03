import { BinaryReader } from './BinaryReader.ts';
import { DX7Voice } from './DX7Voice.ts';
import { ReadDX7VoicePacked } from './ReadDX7VoicePacked.ts';

export function ReadDX7Voices(reader: BinaryReader): DX7Voice[] {
  // Validate SYSEX Header (6 bytes)
  const expectedHeader = [0xF0, 0x43, 0x00, 0x09, 0x20, 0x00];
  const actualHeader = [
    reader.readByte(),
    reader.readByte(),
    reader.readByte(),
    reader.readByte(),
    reader.readByte(),
    reader.readByte()
  ];

  for (let i = 0; i < 6; i++) {
    if (actualHeader[i] !== expectedHeader[i]) {
      throw new Error('Invalid SYSEX header');
    }
  }

  const voices: DX7Voice[] = [];

  // Read 32 voices
  for (let i = 0; i < 32; i++) {
    const voice = ReadDX7VoicePacked(reader);
    voices.push(voice);
  }

  // Skip checksum and end byte
  reader.readByte(); // checksum
  reader.readByte(); // 0xF7 - End SysEx

  return voices;
}
