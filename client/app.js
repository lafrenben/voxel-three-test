var createGame = require('voxel-engine');
var voxel = require('voxel');

(function(opts, setup) {
  setup = setup || defaultSetup;
  var defaults = {
    generate: function(x, y, z) {
      if (x === 0 && y === 0 && z === 0) {
	return 1;
      }
      return 0;
    },
    chunkDistance: 2,
    texturePath: 'assets/textures/blocks/',
    materials: [['grass_top', 'dirt', 'grass_side'], 'stone', 'dirt', 'wool_colored_light_blue', 'wool_colored_orange'],
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true },
    interactElement: document.getElementById('gamemode')
  };
  opts = defaults;

  // setup the game and add some trees
  var game = createGame(opts);
  var container = opts.container || document.body;
  window.game = game; // for debugging
  game.appendTo(container);
  if (game.notCapable()) return game;

  setup(game, null);
  
  return game;
})();

function defaultSetup(game, avatar) {
  
  var THREE = game.THREE;

  // Testing putting 3D models in the scene
  //var geometry = new THREE.CubeGeometry(10, 10, 10);
  // var geometry = new THREE.SphereGeometry(5, 32, 32);
  // var material = new THREE.MeshNormalMaterial();
  // var gameMaterial = game.materials.material;
  // var mesh = new THREE.Mesh(geometry, material);
  // mesh.position.set(0, 20, 0);
  // game.scene.add(mesh);

  // Testing moving the camera to a third-person perspective 
  var perspective = 'third';

  game.camera.position.set(-2, 2, -2);
  game.camera.lookAt( new THREE.Vector3() );

  game.interact.on('attain', function() {
    //game.scene.remove(game.camera);
    //avatar.pov('first');
    game.camera.position.set(0,0,0);
    game.camera.rotation.set(0,0,0);
    perspective = 'first';
  });

  game.interact.on('release', function() {
    var ppos = game.camera.localToWorld( new THREE.Vector3() );
    var cpos = game.camera.localToWorld( new THREE.Vector3(0,32/0.04,32/0.04) );

    //avatar.remove(game.camera);
    game.scene.add(game.camera);
    game.camera.position.set(cpos.x, cpos.y, cpos.z);
    game.camera.lookAt( ppos );
    perspective = 'third';
  });

  // Track the mouse position
  var canvas = this.game.view.element;
  var curMousePos = null;
  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }
  canvas.addEventListener('mousemove', function(evt) {
    curMousePos = getMousePos(canvas, evt);
  }, false);

  canvas.onmousedown = function() {
    console.log("Mouse down! " + perspective);

    var m3d = new THREE.Vector3();
    m3d.set((curMousePos.x / canvas.width) * 2 - 1, -(curMousePos.y / canvas.height) * 2 + 1, 0.5);
    // NOTE: This code will be slightly different for the most-recent version of THREE.js
    var projector = new THREE.Projector();
    projector.unprojectVector(m3d, game.camera);
    var mv = game.raycastVoxels(game.cameraPosition(), m3d.sub(game.camera.position).normalize().toArray(), 1000);
    console.log("Clicking on voxel " + mv.voxel);

    if (perspective === 'third') {
      game.setBlock(mv.adjacent, 4);
      game.render(20);
    }
  };

  // window.setInterval(function() {
  //   console.log('Update');
  //   console.log(game.camera.position);
  //   console.log(game.camera.rotation);
  // }, 1000);

}
