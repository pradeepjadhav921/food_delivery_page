// src/utils/sounds.js
export const playWelcomeChime = () => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.value = 880; // A5 note
    gainNode.gain.value = 0.3;
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
    oscillator.stop(context.currentTime + 0.5);
  } catch (e) {
    console.log("Web Audio API not supported:", e);
    if (navigator.vibrate) navigator.vibrate(200);
  }
};