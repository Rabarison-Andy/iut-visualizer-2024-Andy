import gsap from "gsap";
import detect from "bpm-detective";

class AudioController {
  constructor() {
    this.isPlaying = false;
  }

  setup() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.bpm = null;

    // this.audio.src = danceTheNight;
    this.audio.volume = 0.1;

    this.audioSource = this.ctx.createMediaElementSource(this.audio);

    this.analyserNode = new AnalyserNode(this.ctx, {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
    });

    this.fdata = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.audioSource.connect(this.analyserNode);
    this.audioSource.connect(this.ctx.destination);

    gsap.ticker.add(this.tick);

    this.audio.addEventListener("loadeddata", async () => {
      await this.detectBPM();
      // console.log(`The BPM is: ${bpm}`);
    });
    
    // Mettre à jour l'état de lecture lorsque l'audio se termine
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
    });
  }

  detectBPM = async () => {
    // Create an offline audio context to process the data
    const offlineCtx = new OfflineAudioContext(
      1,
      this.audio.duration * this.ctx.sampleRate,
      this.ctx.sampleRate
    );
    // Decode the current audio data
    const response = await fetch(this.audio.src); // Fetch the audio file
    const buffer = await response.arrayBuffer();
    const audioBuffer = await offlineCtx.decodeAudioData(buffer);
    // Use bpm-detective to detect the BPM
    this.bpm = detect(audioBuffer);
    //console.log(`Detected BPM: ${this.bpm}`);
    // return bpm;
  };

  play = (src) => {
    this.audio.src = src;
    this.audio.play();
    this.isPlaying = true;
  };
  
  pause = () => {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  };
  
  resume = () => {
    if (this.audio && !this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  };
  
  togglePlayPause = () => {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
    return this.isPlaying;
  };

  tick = () => {
    this.analyserNode.getByteFrequencyData(this.fdata);
  };
}

const audioController = new AudioController();
export default audioController;
