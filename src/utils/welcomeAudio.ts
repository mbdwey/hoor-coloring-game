// Welcome Voice greeting player: Maximizes chances of instant autoplay on page load
// with seamless fallback to first user gesture (touch, click, key).

type AutoplayStateListener = (isBlocked: boolean) => void;

class WelcomeVoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private hasPlayed: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<AutoplayStateListener> = new Set();
  public isBlocked: boolean = false;

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

  subscribe(listener: AutoplayStateListener) {
    this.listeners.add(listener);
    listener(this.isBlocked);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isBlocked));
  }

  // Attempt to play immediately on page load
  initAutoplay() {
    if (typeof window === 'undefined') return;
    this.bindAudioElement();
    if (!this.audio || this.hasPlayed || this.isMuted) return;

    // Force play immediately
    const startPlay = () => {
      if (!this.audio || this.hasPlayed || this.isMuted) return;

      const promise = this.audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            this.hasPlayed = true;
            this.isBlocked = false;
            this.notify();
            this.removeInteractionListeners();
          })
          .catch((err) => {
            console.log('Browser autoplay policy waiting for user gesture:', err.name);
            // Autoplay was blocked by browser security policy
            this.isBlocked = true;
            this.notify();
            this.attachInteractionListeners();
          });
      }
    };

    // If audio is already loaded/ready, play now; otherwise listen for canplay
    if (this.audio.readyState >= 2) {
      startPlay();
    } else {
      this.audio.addEventListener('canplay', startPlay, { once: true });
      startPlay();
    }
  }

  // Force play (e.g. clicking mascot or welcome banner)
  play() {
    this.bindAudioElement();
    if (!this.audio) return;

    this.audio.muted = false;
    this.audio.currentTime = 0;
    this.audio
      .play()
      .then(() => {
        this.hasPlayed = true;
        this.isBlocked = false;
        this.notify();
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
