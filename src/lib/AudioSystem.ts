"use client";

class AudioSystem {
  context: AudioContext | null = null;
  ambientOscillator: OscillatorNode | null = null;
  ambientGain: GainNode | null = null;
  isMuted = true;

  init() {
    if (typeof window === "undefined") return;
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.init();
      this.context?.resume();
      this.playAmbient();
    }
  }

  playHover() {
    if (this.isMuted || !this.context) return;
    if (window.innerWidth <= 768) return; // No sound effects on mobile

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  playClick() {
    if (this.isMuted || !this.context) return;
    if (window.innerWidth <= 768) return; // No sound effects on mobile

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  playAmbient() {
    if (this.isMuted || !this.context) return;
    if (this.ambientOscillator) return;

    this.ambientOscillator = this.context.createOscillator();
    this.ambientGain = this.context.createGain();

    this.ambientOscillator.type = "sine";
    this.ambientOscillator.frequency.value = 50; // Low frequency drone

    this.ambientGain.gain.setValueAtTime(0, this.context.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 2); // Fade in

    this.ambientOscillator.connect(this.ambientGain);
    this.ambientGain.connect(this.context.destination);

    this.ambientOscillator.start();
  }

  stopAmbient() {
    if (this.ambientGain && this.context) {
      this.ambientGain.gain.linearRampToValueAtTime(0.001, this.context.currentTime + 1);
      setTimeout(() => {
        if (this.ambientOscillator) {
          this.ambientOscillator.stop();
          this.ambientOscillator.disconnect();
          this.ambientOscillator = null;
        }
      }, 1000);
    }
  }

  updateAmbientPitch(scrollVelocity: number) {
    if (!this.ambientOscillator || !this.context || this.isMuted) return;
    
    // Scroll velocity changes pitch slightly
    const baseFreq = 50;
    const targetFreq = baseFreq + Math.min(Math.abs(scrollVelocity) * 200, 40);
    
    this.ambientOscillator.frequency.setTargetAtTime(targetFreq, this.context.currentTime, 0.1);
  }
}

export const audioSystem = new AudioSystem();
