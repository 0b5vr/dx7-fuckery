import { BinaryWriter } from './BinaryWriter.ts';
import { DX7Voice } from './DX7Voice.ts';
import { WriteDX7VoicePacked } from './WriteDX7VoicePacked.ts';

export function WriteDX7Voices(writer: BinaryWriter, voices: DX7Voice[]): void {

  // SYSEX Header (6 bytes)
  writer.writeByte(0xF0); // Start SysEx
  writer.writeByte(0x43); // Yamaha ID
  writer.writeByte(0x00); // Sub-status & channel number
  writer.writeByte(0x09); // Format number for 32 voices
  writer.writeByte(0x20); // Byte count MS byte
  writer.writeByte(0x00); // Byte count LS byte (4096 bytes total)

  // Serialize up to 32 voices
  for (let i = 0; i < 32; i++) {
    if (i >= voices.length) {
      // If there are fewer than 32 voices, fill with empty voice data
      const emptyVoice = new ArrayBuffer(128);
      writer.writeBuffer(emptyVoice);
    } else {
      // Write each voice using the packed format
      WriteDX7VoicePacked(writer, voices[i]);
    }
  }

  // Byte 4102: Calculate checksum (masked 2's complement of sum of 4096 bytes)
  let sum = 0;
  for (let i = 6; i < 4102; i++) {
    sum += writer.array[i];
  }
  const checksum = (~sum + 1) & 0x7F;
  writer.writeByte(checksum);

  // Byte 4103: End SysEx
  writer.writeByte(0xF7);
}