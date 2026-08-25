// Web Audio API Sound Synthesizer Engine for Corporate Ambient Experience
// Sophisticated multi-harmonic corporate soundscape engine with acoustic warmth, shimmer, chord progressions, and modern tech UX sounds

export type AmbientSoundStyle = 'corporate-shimmer' | 'deep-focus' | 'minimal-pulse' | 'breeze-chill';

class CorporateAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private fxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Ambient synth state & nodes
  private isAmbientPlaying = false;
  private currentAmbientStyle: AmbientSoundStyle = 'corporate-shimmer';
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGainNodes: GainNode[] = [];
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientFilter2: BiquadFilterNode | null = null;
  private ambientLfo: OscillatorNode | null = null;
  private ambientLfoGain: GainNode | null = null;
  private progressionTimer: ReturnType<typeof setInterval> | null = null;
  private currentChordIndex = 0;

  // Soundscape Chords (Frequencies in Hz for warm cinematic progression)
  // Progression: I (D maj9) -> vi (B min11) -> IV (G maj9) -> V (A sus4/9)
  private readonly chordProgressions: number[][] = [
    [146.83, 220.00, 293.66, 369.99, 554.37, 659.25], // Dmaj9 (D3, A3, D4, F#4, C#5, E5)
    [123.47, 185.00, 246.94, 369.99, 440.00, 587.33], // Bm11  (B2, F#3, B3, F#4, A4, D5)
    [196.00, 246.94, 293.66, 369.99, 440.00, 587.33], // Gmaj9 (G3, B3, D4, F#4, A4, D5)
    [220.00, 277.18, 329.63, 440.00, 554.37, 659.25], // A9    (A3, C#4, E4, A4, C#5, E5)
  ];

  private isMuted = false;
  private fxVolumeVal = 0.45;
  private ambientVolumeVal = 0.28;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();
      this.fxGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();

      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.85;

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
    return !this.ctx ? false : true;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.updateVolumes();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
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
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0, now);
    } else {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(1, now);
    }

    this.fxGain.gain.cancelScheduledValues(now);
    this.fxGain.gain.setValueAtTime(this.fxVolumeVal, now);
    
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(this.ambientVolumeVal, now);
  }

  // --- Tactile & Modern Interactive UI Sound Effects ---

  // Sleek organic UI click pop with subtle frequency sweep
  public playClickSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Smooth pitch sweep for a rounded modern click feel
    osc.frequency.setValueAtTime(720, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    osc.connect(gain);
    gain.connect(this.fxGain);

    osc.start(now);
    osc.stop(now + 0.045);
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
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(1380, now + 0.035);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.fxGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Slide / Section transition swoosh
  public playSlideChangeSound() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;

    // Dual pitch harmonic sweep with subtle stereo shimmer
    [380, 570, 850].forEach((freq, idx) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.09 + idx * 0.02);

      gain.gain.setValueAtTime(0.09 / (idx + 1), now + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12 + idx * 0.02);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + idx * 0.02);
      osc.stop(now + 0.13 + idx * 0.02);
    });
  }

  // Presentation Chapter Cue Bell with warm crystal reverb decay
  public playChapterCue() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const bellPitches = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    bellPitches.forEach((freq, i) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.035);

      gain.gain.setValueAtTime(0.18 / (i + 1), now + i * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1 + i * 0.035);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + i * 0.035);
      osc.stop(now + 1.15 + i * 0.035);
    });
  }

  // Success chime arpeggio
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
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + idx * 0.07);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + idx * 0.07);
      osc.stop(now + 0.5 + idx * 0.07);
    });
  }

  // Security Error / Access Denied low buzzer
  public playError() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.fxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Notification Chime (for incoming virtual email OTP token)
  public playNotification() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.fxGain) return;

    const now = this.ctx.currentTime;
    [587.33, 880.00].forEach((freq, idx) => {
      if (!this.ctx || !this.fxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + idx * 0.08);

      osc.connect(gain);
      gain.connect(this.fxGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + 0.4 + idx * 0.08);
    });
  }

  // Aliases for clean invocation across components
  public playClick() {
    this.playClickSound();
  }

  public playHover() {
    this.playHoverSound();
  }

  public playSuccess() {
    this.playSuccessSound();
  }

  // --- Dynamic Multi-Layer Corporate Ambient Soundscape ---
  // Features: Organic chord progression, resonant low-pass filter breathing, and shimmering harmonics

  public startAmbientPad(style: AmbientSoundStyle = 'corporate-shimmer') {
    this.ensureContext();
    if (!this.ctx || !this.ambientGain) return;

    if (this.isAmbientPlaying) {
      this.stopAmbientPad();
    }

    this.isAmbientPlaying = true;
    this.currentAmbientStyle = style;
    const now = this.ctx.currentTime;

    // 1. Dual Filter Stage (Warm Resonant Lowpass + Sweet High-shelf)
    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(650, now);
    this.ambientFilter.Q.setValueAtTime(1.8, now);

    this.ambientFilter2 = this.ctx.createBiquadFilter();
    this.ambientFilter2.type = 'peaking';
    this.ambientFilter2.frequency.setValueAtTime(2200, now);
    this.ambientFilter2.gain.setValueAtTime(2.5, now);
    this.ambientFilter2.Q.setValueAtTime(0.8, now);

    // 2. Slow breathing LFO for subtle filter sweep
    this.ambientLfo = this.ctx.createOscillator();
    this.ambientLfo.frequency.setValueAtTime(0.08, now); // ~12 second organic breathing cycle
    this.ambientLfoGain = this.ctx.createGain();
    this.ambientLfoGain.gain.setValueAtTime(280, now);

    this.ambientLfo.connect(this.ambientLfoGain);
    this.ambientLfoGain.connect(this.ambientFilter.frequency);
    this.ambientLfo.start(now);

    // 3. Connect filter chain to ambient master
    this.ambientFilter.connect(this.ambientFilter2);
    this.ambientFilter2.connect(this.ambientGain);

    // 4. Start first chord
    this.currentChordIndex = 0;
    this.buildCurrentChord(now);

    // 5. Automatic slow cinematic chord progression transition (every 14 seconds)
    this.progressionTimer = setInterval(() => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
      this.transitionToNextChord(this.ctx.currentTime);
    }, 14000);
  }

  private buildCurrentChord(now: number) {
    if (!this.ctx || !this.ambientFilter) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.ambientOscillators = [];
    this.ambientGainNodes = [];

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientFilter) return;

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Alternating waveforms for organic texture
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Micro-detuning for lush acoustic chorus sheen
      const detuneCents = (idx - (chord.length / 2)) * 3.5;
      osc.detune.setValueAtTime(detuneCents, now);

      oscGain.gain.setValueAtTime(0, now);
      // Soft gentle fade in over 3 seconds
      oscGain.gain.linearRampToValueAtTime(0.18 / Math.sqrt(chord.length), now + 3.0);

      osc.connect(oscGain);
      oscGain.connect(this.ambientFilter);

      osc.start(now);
      this.ambientOscillators.push(osc);
      this.ambientGainNodes.push(oscGain);
    });
  }

  private transitionToNextChord(now: number) {
    if (!this.ctx) return;
    const targetChord = this.chordProgressions[this.currentChordIndex];

    // Smoothly cross-glide the frequencies of running oscillators
    this.ambientOscillators.forEach((osc, idx) => {
      if (idx < targetChord.length) {
        const targetFreq = targetChord[idx];
        osc.frequency.cancelScheduledValues(now);
        // Exponential glide over 4.5 seconds
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, targetFreq), now + 4.5);
      }
    });
  }

  public stopAmbientPad() {
    if (this.progressionTimer) {
      clearInterval(this.progressionTimer);
      this.progressionTimer = null;
    }

    if (!this.isAmbientPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Fade out oscillators gently
    this.ambientGainNodes.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.linearRampToValueAtTime(0, now + 1.2);
      } catch {
        // ignore
      }
    });

    this.ambientOscillators.forEach((osc) => {
      try {
        osc.stop(now + 1.3);
      } catch {
        // ignore
      }
    });

    if (this.ambientLfo) {
      try {
        this.ambientLfo.stop(now + 1.3);
      } catch {
        // ignore
      }
    }

    this.ambientOscillators = [];
    this.ambientGainNodes = [];
    this.ambientLfo = null;
    this.ambientLfoGain = null;
    this.ambientFilter = null;
    this.ambientFilter2 = null;
    this.isAmbientPlaying = false;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public getAnalyserData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(64);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new CorporateAudioEngine();

