var createGame = require('voxel-engine');
var voxel = require('voxel');
var player = require('voxel-player');
var walk = require('voxel-walk');

(function(opts, setup) {
  setup = setup || defaultSetup;
  var defaults = {
    generate: function(x, y, z) {
      if (x === 16 && y === 1 && z === 16) {
	return 1;
      }
      if (y === 0) {
      	return 2;
      }
      return 0;
    },
    chunkDistance: 2,
    texturePath: 'assets/textures/blocks/',
    materials: [['grass_top', 'dirt', 'grass_side'], 'stone', 'dirt', 'wool_colored_light_blue', 'wool_colored_orange'],
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true }
  };
  opts = defaults;

  var game = createGame(opts);
  var container = opts.container || document.body;
  window.game = game; // for debugging
  game.appendTo(container);
  if (game.notCapable()) return game;

  // create the player from a minecraft skin file and tell the
  // game to use it as the main player
  var createPlayer = player(game);
  var avatar = createPlayer(opts.playerSkin || 'assets/textures/players/skin.png');
  avatar.possess();
  avatar.yaw.position.set(2, 14, 4);

  setup(game, avatar);
  
  return game;
})();

function defaultSetup(game, avatar) {
  
  var THREE = game.THREE;
  var target = game.controls.target();

  // Test of adding additional 3D models to the scene
  var geometry = new THREE.SphereGeometry(5, 32, 32);
  var material = new THREE.MeshNormalMaterial();
  var gameMaterial = game.materials.material;
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 20, 0);
  game.scene.add(mesh);

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle();
  });

  game.on('tick', function() {
    walk.render(target.playerSkin);
    var vx = Math.abs(target.velocity.x);
    var vz = Math.abs(target.velocity.z);
    if (vx > 0.001 || vz > 0.001) walk.stopWalking();
    else walk.startWalking();
  });

}
