  <!--  Author: Julian Schuster
 Goldkante - Mit hochgeladenen 3D-Modellen im .glb-Format in einem canvas interagieren
 Dauer: 15h -->
<template>
  <div>
    <section id="loading-screen" ref="loadingScreen">
      <div id="loader"></div>
    </section>
    <div ref="canvas"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import $ from "jquery";
import { GUI } from "dat.gui";

export default {
  name: "ThreeModel",
  props: {
    path: {
      type: String,
    },
  },
  data: function () {
    const scene = new THREE.Scene(); //Neue Three.js scene initialisieren
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ); //Kamera initialisieren
    const renderer = new THREE.WebGLRenderer({ antialias: true }); //Renderer zum darstellen der Scene initialisieren
    const light = new THREE.DirectionalLight("hsl(0, 100%, 100%)"); //Direktionales Licht erzeugen
    const control = new OrbitControls(camera, renderer.domElement); //OrbitControls erzeugen
    // const axes = new THREE.AxesHelper(500); //Achsen erzeugen

    const clock = new THREE.Clock(); //Clock für Animationen initialisieren

    //Hilfsvariablen für Animationen
    var mixer = null;
    var activeAction = null;
    var lastAction = null;
    var selectedAction = null;

    //dat.gui für Animations-GUI
    const gui = new GUI({ autoPlace: false, width: 100 });
    gui.domElement.id = "gui";
    gui.addFolder("Animations");
    gui.close(); //gui per default schließen

    //progressbar
    var progress = document.createElement("div");
    var progressBar = document.createElement("div");

    progress.appendChild(progressBar);

    document.body.appendChild(progress);

    //LoadingManager mit einem loadingScreen erstellen
    const manager = new THREE.LoadingManager(() => {
      const loadingScreen = this.$refs.loadingScreen;
      loadingScreen.classList.add("fade-out");
      loadingScreen.addEventListener("transitionend", this.onTransitionEnd);
    });

    //glTF-loader
    const loader = new GLTFLoader(manager);

    //glTF resource laden
    loader.load(
      //resource URL des .glb file
      this.path,
      function (gltf) {
        //Wenn Animationen vorhanden sind
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene); //AnimationMixer setzen
          var action = mixer.clipAction(gltf.animations[0]); //Default-Animation setzen
          activeAction = action;
          action.play(); //Animation spielen

          //Alle Animationen durchlaufen und add-EventListener hinzufügen
          gltf.animations.forEach((animation) => {
            var obj = {
              add: function () {
                selectedAction = mixer.clipAction(animation);
                lastAction = activeAction;
                activeAction = selectedAction;
                lastAction.fadeOut(1);
                activeAction.reset();
                activeAction.fadeIn(1);
                activeAction.play();
              },
            };
            gui.add(obj, "add").name(animation.name); //Animation zur GUI hinzufügen
          });
        }

        scene.add(gltf.scene); //gltf-Object zur Scene hinzufügen
        fitCameraToSelection(camera, control, gltf.scene.children, 1); //Kamera auf das geladene gltf-Object setzen
        animate(); //animate() einmal initial aufrufen

        //Hilfsfunktion um die Kamera nah vor geladenen Objekten zu platzieren
        function fitCameraToSelection(camera, controls, selection, fitOffset) {
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          const box = new THREE.Box3(); //An Achsen ausgerichtete Bounding Box in 3D

          box.makeEmpty();

          for (const object of selection) {
            box.expandByObject(object);
          }

          box.getSize(size);
          box.getCenter(center);

          const maxSize = Math.max(size.x, size.y, size.z);
          const fitHeightDistance =
            maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
          const fitWidthDistance = fitHeightDistance / camera.aspect;
          const distance =
            fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

          const direction = controls.target
            .clone()
            .sub(camera.position)
            .normalize()
            .multiplyScalar(distance);

          controls.maxDistance = distance * 10;
          controls.target.copy(center);

          camera.near = distance / 100;
          camera.far = distance * 100;
          camera.updateProjectionMatrix();
          camera.position.copy(controls.target).sub(direction);

          controls.update();
        }
        //60x in der Sekunde ausgeführt
        function animate() {
          requestAnimationFrame(animate); //Neurendern beantragen

          var delta = clock.getDelta();

          //Wenn es einen mixer für Animationen gibt
          if (mixer) {
            mixer.update(delta);
          }

          light.position.copy(camera.position); //Licht auf Kamera setzen -> Headlight
          renderer.render(scene, camera); //rendern
        }
      }
    );
    return {
      scene: scene,
      camera: camera,
      controls: control,
      renderer: renderer,
      light: light,
      loader: loader,
      // axes: axes,
      sizeX: 0,
      sizeY: 0,
      clock: clock,
      mixer: mixer,
      gui: gui,
    };
  },
  created: function () {
    window.addEventListener("resize", this.resize);
  },
  mounted: function () {
    var c = this.$refs.canvas; //div für das canvas holen
    c.appendChild(this.renderer.domElement); //Canvas appenden
    c.appendChild(this.gui.domElement); //Gui zum canvas hinzufügen

    //Fenster Größe des parent-Div holen
    this.sizeX = $("#modelDiv").width();
    this.sizeY = $("#modelDiv").height();

    //Kamera, Licht und evtl. Achsen zur Scene hinzufügen
    this.scene.add(this.camera);
    this.scene.add(this.light);

    // this.scene.add(this.axes);

    this.renderer.setSize(this.sizeX, this.sizeY); //Fenstergröße setzen
    this.camera.position.z = 200; //Kamera auf der z-achse verschieben

    //Textur laden und als Hintergrund setzen
    var texture = new THREE.TextureLoader().load("watermarkBackground.png");
    this.scene.background = texture;
  },
  methods: {
    resize() {
      //Fenster Größe des parent-Div holen
      this.sizeX = $("#modelDiv").width();
      this.sizeY = $("#modelDiv").height();

      var factor = 1; // Faktor

      //neue width und height berechnen
      var w = this.sizeX * factor;
      var h = this.sizeY * factor;

      this.renderer.setSize(w, h); //canvas auf neu berechnete Größe setzen
      this.camera.aspect = w / h; // AsceptRatio berechnen
      this.camera.updateProjectionMatrix(); //Kamera bzw. ProjektionsMatrix updaten
    },
    onTransitionEnd() {
      let canvas = this.$refs.loadingScreen;
      canvas.remove();
    },
  },
};
</script>

<style>
#gui {
  position: absolute;
  top: 2px;
  right: 2px;
}

#loading-screen {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../public/watermarkBackground.png");
  opacity: 1;
  transition: 1s opacity;
}

#loading-screen.fade-out {
  opacity: 0;
}

#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #000000;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
#loader:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #000000;
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}
#loader:after {
  content: "";
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #000000;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
