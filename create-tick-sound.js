// Simple script to create a tick sound file
// You can run this in the browser console or save as a separate file

function createTickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const duration = 0.15; // 150ms
  const samples = sampleRate * duration;
  
  const buffer = audioContext.createBuffer(1, samples, sampleRate);
  const data = buffer.getChannelData(0);
  
  // Generate a click/tick sound
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    // Short burst with exponential decay
    const envelope = Math.exp(-t * 50);
    const frequency = 1000; // 1kHz base frequency
    data[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.3;
    
    // Add some higher frequency content for the "tick"
    data[i] += envelope * Math.sin(2 * Math.PI * frequency * 2 * t) * 0.1;
  }
  
  return buffer;
}

// Function to download the generated sound as WAV
function downloadTickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const buffer = createTickSound();
  
  // Convert AudioBuffer to WAV blob
  const wav = audioBufferToWav(buffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tick.wav';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// WAV file format helper function
function audioBufferToWav(buffer) {
  const length = buffer.length;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  // PCM data
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return arrayBuffer;
}

// Uncomment the line below and run this in browser console to download the tick sound
// downloadTickSound();
