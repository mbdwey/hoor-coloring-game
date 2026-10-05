// Welcome Voice greeting player: plays when the game starts or on the first user interaction

class WelcomeVoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private hasPlayed: boolean = false;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/welcome.m4a');
      this.audio.preload = 'auto';
    }
  }

  // Attempt to play immediately on load, with fallback to first tap/click
  initAutoplay() {
    if (typeof window === 'undefined') return;

    const tryPlay = () => {
      if (this.hasPlayed || this.isMuted) return;
      if (!this.audio) {
        this.audio = new Audio('/welcome.m4a');
      }

      this.audio.currentTime = 0;
      const promise = this.audio.play();

      if (promise !== undefined) {
        promise
          .then(() => {
            this.hasPlayed = true;
            this.removeInteractionListeners();
          })
          .catch(() => {
            // Autoplay was blocked by browser policy; wait for first user gesture
            this.attachInteractionListeners();
          });
      }
    };

    // Attempt immediate play
    tryPlay();
  }

  // Force play (e.g. when user clicks mascot or sound button)
  play() {
    if (!this.audio) {
      this.audio = new Audio('/welcome.m4a');
    }
    this.audio.currentTime = 0;
    this.audio.play().catch((err) => {
      console.log('Voice audio playback prevented:', err);
    });
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
      if (muted) {
        this.audio.pause();
      }
    }
  }

  private handleFirstInteraction = () => {
    if (!this.hasPlayed && !this.isMuted) {
      this.play();
      this.hasPlayed = true;
    }
    this.removeInteractionListeners();
  };

  private attachInteractionListeners() {
    window.addEventListener('pointerdown', this.handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', this.handleFirstInteraction, { once: true, passive: true });
  }

  private removeInteractionListeners() {
    window.removeEventListener('pointerdown', this.handleFirstInteraction);
    window.removeEventListener('keydown', this.handleFirstInteraction);
  }
}

export const welcomeVoice = new WelcomeVoicePlayer();
