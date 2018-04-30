import icon from '../assets/images/troll.png';
import sound from '../assets/audio/trololo_cut.mp3';

const defaultOptions = {
  icon,
};

class Notifications {
  constructor() {
    this.state = {
      notifications: [],
      enabled: undefined,
      playing: false,
    };
  }

  disable() {
    this.state.enabled = false;
  }

  enable() {
    this.state.enabled = true;
  }

  getStatus() {
    return Notification.permission;
  }

  isEnabled() {
    return !!this.state.enabled && this.getStatus() === 'granted';
  }

  playAudio() {
    if (this.state.playing) return;

    const audio = document.createElement('audio');

    audio.src = sound;

    document.body.appendChild(audio);

    window.setTimeout(() => {
      document.body.removeChild(audio);

      this.state.playing = false;
    }, audio.duration);

    this.state.playing = true;

    audio.play();
  }

  // Handlers
  // =============================================
  request() {
    const status = this.getStatus();

    // notifications are enabled
    if (status === 'granted') {
      this.enable();

      return Promise.resolve();
    }

    if (status === 'denied') {
      this.disable();

      return Promise.reject();
    }

    // if the status is "default" we want to create a Promise.
    return new Promise((resolve, reject) => {
      const fail = () => {
        this.disable();

        reject();
      };

      const success = permission => {
        if (permission === 'granted') {
          this.enable();

          resolve();
        }

        if (permission === 'denied') {
          fail();
        }
      };

      Notification.requestPermission()
        .then(success)
        .catch(fail)
      ;
    });
  }

  create(title, options) {
    if (!this.isEnabled()) {
      return;
    }

    try {
      const newOptions = {
        ...options,
        ...defaultOptions,
      };

      if (newOptions.audio) {
        this.playAudio();
      }

      const instance = new Notification(title, newOptions);
      this.state.notifications.push(instance);

      return instance;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new Notifications();
