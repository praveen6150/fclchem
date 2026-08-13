// Web Audio API Sound Synthesizer Engine for Corporate Ambient Experience

class CorporateAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private fxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Ambient synth nodes
  private isAmbientPlaying = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientLfo: OscillatorNode | null = null;

  private isMuted = false;
  private fxVolumeVal = 0.5;
  private ambientVolumeVal = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();
      this.fxGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();

      this.analyser.fftSize = 64;

      this.fxGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.updateVolumes();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public ensureContext(): boolean {
    this.initContext();
    return !!this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateVolumes();
  }

  public setFxVolume(vol: number) {
    this.fxVolumeVal = Math.max(0, Math.min(1, vol));
    this.updateVolumes();
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolumeVal = Math.max(0, Math.min(1, vol));
    this.updateVolumes();
  }

  private updateVolumes() {
    if (!this.masterGain || !this.fxGain || !this.ambientGain) return;
    const now = this.ctx?.currentTime || 0;
    
    if (this.isMuted) {
      this.masterGain.gain.setValueAtTime(0, now);
    } else {
      this.masterGain.gain.setValueAtTime(1, now);
    }

    this.fxGain.gain.setValueAtTime(this.fxVolumeVal, now);
    this.ambientGain.gain.setValueAtTime(this.ambientVolumeVal, now);
  }

  // --- Sound Effects ---

  // Sleek click pop (synced to every button click)
  public playClickSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency sweep from 850Hz down to 220Hz for a crisp tactile tick
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.fxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Subtle warm hover chime
  public playHoverSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1450, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.fxGain);

    osc.start(now);
    osc.stop(now + 0.065);
  }

  // Slide / Tab transition swoosh
  public playSlideChangeSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;

    // Dual pitch harmonic sweep
    [400, 600, 900].forEach((freq, idx) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08 + idx * 0.02);

      gain.gain.setValueAtTime(0.12 / (idx + 1), now + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.02);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + idx * 0.02);
      osc.stop(now + 0.14 + idx * 0.02);
    });
  }

  // Presentation Chapter Cue Bell
  public playChapterCue() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    // Resonant metallic bell tone
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, i) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0.2 / (i + 1), now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i * 0.04);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + i * 0.04);
      osc.stop(now + 0.85 + i * 0.04);
    });
  }

  // Success arpeggio for form submission
  public playSuccessSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.22, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.08);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + 0.45 + idx * 0.08);
    });
  }

  // --- Corporate Ambient Pad Soundtrack ---

  public startAmbientPad() {
    this.ensureContext();
    if (!this.ctx || !this.ambientGain || this.isAmbientPlaying) return;

    this.isAmbientPlaying = true;
    const now = this.ctx.currentTime;

    // Filter for warm soft tone
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(450, now);

    // Filter modulation LFO
    this.ambientLfo = this.ctx.createOscillator();
    this.ambientLfo.frequency.setValueAtTime(0.12, now); // Slow 0.12 Hz breathing modulation
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, now);

    this.ambientLfo.connect(lfoGain);
    lfoGain.connect(this.ambientFilter.frequency);
    this.ambientLfo.start(now);

    // Warm chord harmonics (D major 9 soft pad: D3, A3, F#4, C#5, E5)
    const padChord = [146.83, 220.00, 369.99, 554.37, 659.25];
    this.ambientOscillators = [];

    padChord.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientFilter) return;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Slight detune for rich corporate analog shimmer
      osc.detune.setValueAtTime((idx - 2) * 4, now);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.15 / padChord.length, now + 2.0); // 2 second soft fade in

      osc.connect(oscGain);
      oscGain.connect(this.ambientFilter);

      osc.start(now);
      this.ambientOscillators.push(osc);
    });

    this.ambientFilter.connect(this.ambientGain);
  }

  public stopAmbientPad() {
    if (!this.isAmbientPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop(now + 0.5);
      } catch {
        // ignore if already stopped
      }
    });

    if (this.ambientLfo) {
      try {
        this.ambientLfo.stop(now + 0.5);
      } catch {
        // ignore
      }
    }

    this.ambientOscillators = [];
    this.ambientLfo = null;
    this.ambientFilter = null;
    this.isAmbientPlaying = false;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public getAnalyserData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new CorporateAudioEngine();
