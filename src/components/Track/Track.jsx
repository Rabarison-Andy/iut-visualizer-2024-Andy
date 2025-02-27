import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";

const Track = ({ title, cover, src, duration, artists, index }) => {
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
  };

  return (
    <div className={s.track} onClick={onClick}>
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
      <span className={s.duration}>{getSeconds()}</span>
    </div>
  );
};

export default Track;
