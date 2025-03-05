import s from "./Landing.module.scss";
import AudioController from "../../utils/AudioController";
import { useState } from "react";
import Button from "../Button/Button";

const Landing = () => {
  const [hasClicked, setHasClicked] = useState(false);

  const onClick = () => {
    AudioController.setup();
    setHasClicked(true);
  };

  return (
    <section className={`${s.landing} ${hasClicked ? s.landingHidden : ""}`}>
      {/* Fond animé */}
      <div className={s.bg}>
        <div></div>
        <div></div>
      </div>

      {/* Texte principal avec effet glow */}
        <div className={s.headerText} aria-hidden="true">
        <p>Music Visualizer</p>
      </div>

      {/* Texte descriptif */}
      <p className={s.description}>
        Visualiser vos sons préférés en temps réel, à travers différents éléments 3D.
        Une nouvelle manière d'écouter votre musique !
      </p>

      {/* SVG pour les effets glow */}
      <svg
        className={s.filters}
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-4" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
            <feColorMatrix
              in="blur4"
              type="matrix"
              values="1 0 0 0 0  0 0.98 0 0 0  0 0 0.96 0 0  0 0 0 0.8 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Contenu principal */}
      <div className={s.wrapper}>
        <p className={s.subtitle}>
          Projet conçu dans le cadre du cours Dispositifs Interactifs à l'IUT de
          Champs-sur-Marne. Expérimentez avec Three.js, GSAP, React et la Web
          Audio API en important vos fichiers MP3 pour une visualisation 3D.
        </p>
        <Button label="Commencer" onClick={onClick} />
      </div>
    </section>
  );
};

export default Landing;
