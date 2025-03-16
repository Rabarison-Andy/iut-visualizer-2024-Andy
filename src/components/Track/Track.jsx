import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import useStore from "../../utils/store";
import s from "./Track.module.scss";

const Track = ({ title, cover, src, duration, artists, index }) => {
  const { selectedTrack, setSelectedTrack, playlist, addToPlaylist } = useStore();
  
  const getSeconds = () => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };

  const onClick = () => {
    audioController.play(src);
    scene.cover.setCover(cover);
    
    // Mettre à jour le track sélectionné
    setSelectedTrack({
      title,
      cover,
      src,
      duration,
      artists,
      index
    });
  };
  
  const handleAddToPlaylist = (e) => {
    e.stopPropagation(); // Empêcher le déclenchement du onClick du parent
    
    addToPlaylist({
      title,
      cover,
      src,
      duration,
      artists,
      index
    });
  };
  
  // Vérifier si ce track est déjà dans la playlist
  const isInPlaylist = playlist.some(track => 
    track.title === title && track.src === src
  );

  // Vérifier si ce track est le track sélectionné en comparant le titre et la source
  const isSelected = selectedTrack && 
    selectedTrack.title === title && 
    selectedTrack.src === src;

  return (
    <div className={`${s.track} ${isSelected ? s.active : ''}`} onClick={onClick}>
      <span className={s.order}>{index + 1}</span>
      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <div className={s.details}>
          <span className={s.trackName}>{title}</span>
          {Array.isArray(artists) && artists.length > 0 ? (
           artists.map((artist, i) =>
            artist?.name ? (
              <span key={artist.id || i} className={s.artistName}>
                {artist.name}
              </span>
              ) : null
            )
          ) : (
            <span className={s.artistName}>{artists?.name || "Artiste inconnu"}</span>
          )}
          </div>
      </div>
      <div className={s.controls}>
        <span className={s.duration}>{getSeconds()}</span>
        <button 
          className={`${s.addToPlaylist} ${isInPlaylist ? s.added : ''}`} 
          onClick={handleAddToPlaylist}
          title="Ajouter à la playlist"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Track;
