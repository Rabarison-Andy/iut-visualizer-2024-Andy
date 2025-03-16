import { useState, useEffect } from "react";
import useStore from "../../utils/store";
import audioController from "../../utils/AudioController";
import s from "./SelectedTrack.module.scss";

const SelectedTrack = () => {
  const { selectedTrack } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mettre à jour l'état de lecture lorsque le track change
  useEffect(() => {
    if (selectedTrack) {
      setIsPlaying(audioController.isPlaying);
    }
  }, [selectedTrack]);
  
  // Vérifier périodiquement l'état de lecture
  useEffect(() => {
    const checkPlayingStatus = () => {
      setIsPlaying(audioController.isPlaying);
    };
    
    const interval = setInterval(checkPlayingStatus, 500);
    return () => clearInterval(interval);
  }, []);

  if (!selectedTrack) {
    return null;
  }

  const getSeconds = () => {
    const minutes = Math.floor(selectedTrack.duration / 60);
    let seconds = Math.round(selectedTrack.duration - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };
  
  const handlePlayPause = () => {
    const newPlayingState = audioController.togglePlayPause();
    setIsPlaying(newPlayingState);
  };

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <img src={selectedTrack.cover} alt="" className={s.cover} />
        <div className={s.info}>
          <h2 className={s.title}>{selectedTrack.title}</h2>
          <div className={s.artistContainer}>
            {Array.isArray(selectedTrack.artists) && selectedTrack.artists.length > 0 ? (
              selectedTrack.artists.map((artist, i) =>
                artist?.name ? (
                  <h3 key={artist.id || i} className={s.artist}>
                    {artist.name}
                  </h3>
                ) : null
              )
            ) : (
              <h3 className={s.artist}>{selectedTrack.artists?.name || "Artiste inconnu"}</h3>
            )}
          </div>
          <p className={s.duration}>Durée: {getSeconds()}</p>
          <div className={s.controls}>
            <button 
              className={s.playPauseButton} 
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTrack; 