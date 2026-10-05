// Welcome Voice greeting player: Silently auto-plays on load
// with immediate fallback to the first user tap/click anywhere on the screen.

class WelcomeVoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private hasPlayed: boolean = false;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.bindAudioElement();
    }
  }

  private bindAudioElement() {
    if (this.audio) return;

    // Check if the native element in index.html already exists
    const existing = document.getElementById('welcome-audio') as HTMLAudioElement | null;
    if (existing) {
      this.audio = existing;
    } else {
      this.audio = new Audio('/welcome.m4a');
      this.audio.id = 'welcome-audio';
      this.audio.preload = 'auto';
      this.audio.autoplay = true;
      (this.audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
      document.body?.appendChild(this.audio);
    }

    this.audio.addEventListener('ended', () => {
      this.hasPlayed = true;
    });
  }

  // Attempt to play immediately on page load
  initAutoplay() {
    if (typeof window === 'undefined') return;
    this.bindAudioElement();
    if (!this.audio || this.hasPlayed || this.isMuted) return;

    const startPlay = () => {
      if (!this.audio || this.hasPlayed || this.isMuted) return;

      const promise = this.audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            this.hasPlayed = true;
            this.removeInteractionListeners();
          })
          .catch(() => {
            // Autoplay was restricted by browser; queue for first user tap/click
            this.attachInteractionListeners();
          });
      }
    };

    if (this.audio.readyState >= 2) {
      startPlay();
    } else {
      this.audio.addEventListener('canplay', startPlay, { once: true });
      startPlay();
    }
  }

  // Force play (e.g. selecting picture or clicking mascot)
  play() {
    this.bindAudioElement();
    if (!this.audio) return;

    this.audio.muted = false;
    this.audio.currentTime = 0;
    this.audio
      .play()
      .then(() => {
        this.hasPlayed = true;
        this.removeInteractionListeners();
      })
      .catch((err) => {
        console.warn('Playback error:', err);
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

  private handleUserGesture = () => {
    if (!this.hasPlayed && !this.isMuted) {
      this.play();
    }
    this.removeInteractionListeners();
  };

  private attachInteractionListeners() {
    const events = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown'];
    events.forEach((evt) => {
      window.addEventListener(evt, this.handleUserGesture, { once: true, passive: true });
    });
  }

  private removeInteractionListeners() {
    const events = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown'];
    events.forEach((evt) => {
      window.removeEventListener(evt, this.handleUserGesture);
    });
  }
}

export const welcomeVoice = new WelcomeVoicePlayer();
