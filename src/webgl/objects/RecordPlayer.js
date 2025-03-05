import * as THREE from "three";
import audioController from "../../utils/AudioController";
import scene from "../Scene";

export default class RecordPlayer {
    constructor() {
        this.group = null;
        this.platter = null;

        // Chargement des textures
        this.textures = {
            ao: scene.textureLoader.load("/textures/Textures_AO_4k.png"),
            color: scene.textureLoader.load("/textures/Textures_COL_4k.png"),
            metalness: scene.textureLoader.load("/textures/Textures_METL_4k.png"),
            normal: scene.textureLoader.load("/textures/Textures_NRML_4k.png"),
            opacity: scene.textureLoader.load("/textures/Textures_OPAC_4k.png"),
            roughness: scene.textureLoader.load("/textures/Textures_ROUGH_4k.png")
        };

        // Correction du sens des textures
        Object.values(this.textures).forEach(texture => {
            texture.flipY = false;
        });

        // Créfinition du matériau
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            aoMap: this.textures.ao,
            metalnessMap: this.textures.metalness,
            normalMap: this.textures.normal,
            alphaMap: this.textures.opacity,
            roughnessMap: this.textures.roughness,
            transparent: true,
            side: THREE.DoubleSide
        });

        // Chargement du modèle GLB
        scene.gltfLoader.load(
            "/models/RecordPlayer.glb",
            (gltf) => {
                //console.log("✅ Modèle RecordPlayer chargé avec succès !");
                this.group = gltf.scene;

                // Appliquer le matériau à tous les meshes du modèle
                this.group.traverse((object) => {
                    if (object.isMesh) {
                        object.material = this.material;
                        object.frustumCulled = false;
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                // Rechercher l'objet "Platter" dans la hiérarchie du modèle
                this.platter = this.group.getObjectByName("Platter");
                //if (this.platter) {
                    //console.log("✅ Objet 'Platter' trouvé !");
                //} else {
                    //console.warn("❌ Objet 'Platter' non trouvé dans le modèle.");
                //}

                // Ajuster la position et la rotation du modèle si nécessaire
                this.group.rotation.x = Math.PI / 4;
                this.group.position.set(0, 0, 0);

                // Ajouter le modèle à la scène
                scene.scene.add(this.group);

                // Ajouter un helper visuel pour la boîte de collision
                //const helper = new THREE.BoxHelper(this.group, 0xff0000);
                //scene.scene.add(helper);
            },
            //undefined,
            //(error) => {
                //console.error("❌ Erreur lors du chargement du modèle :", error);
            //}
        );

        // Ajouter des lumières pour éclairer la scène
        this.addLights();
    }

    addLights() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.scene.add(ambientLight);

        // Lumière directionnelle
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.scene.add(directionalLight);

        // Lumière ponctuelle
        const pointLight = new THREE.PointLight(0xffffff, 2, 10);
        pointLight.position.set(2, 3, 2);
        scene.scene.add(pointLight);
    }

    update() {
        // Faire tourner le modèle principal
        if (this.group) {
            this.group.rotation.y += 0.001;
        }

        if (this.platter && audioController.fdata) {
            const hasAudioData = audioController.fdata.some(value => value > 0);
            if (hasAudioData && !this.isPlatterRotating) {
                this.isPlatterRotating = true;
            }
        }

        if (this.platter && this.isPlatterRotating) {
            this.platter.rotation.y += 0.009;
        }
    }
}