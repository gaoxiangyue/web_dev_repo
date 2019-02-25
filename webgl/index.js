/* testing cloth simulation */

var pinsFormation = [];
var pins = [ 6 ];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];


function togglePins() {

	pins = pinsFormation[ ~~ ( Math.random() * pinsFormation.length ) ];

}

if ( WEBGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container, stats;
var camera, scene, renderer;

var clothGeometry;
var sphere;
var object;
var mixers= new Array();
var clock = new THREE.Clock();
var scenes = {
				Boombox: {
					name: 'BoomBox (PBR)',
					url: './models/gltf/BoomBox/%s/BoomBox.gltf',
					author: 'Microsoft',
					authorURL: 'https://www.microsoft.com/',
					cameraPos: new THREE.Vector3( 0.02, 0.01, 0.03 ),
					objectPosition: new THREE.Vector3( 1.8, 1, 10 ),
					objectRotation: new THREE.Euler( 0, Math.PI, 0 ),
					objectScale: new THREE.Vector3( 50, 50, 50 ),
					addLights: true,
					extensions: [ 'glTF', 'glTF-pbrSpecularGlossiness', 'glTF-Binary', 'glTF-dds' ],
					addEnvMap: true
				},
				'Bot Skinned': {
					name: 'Bot Skinned',
					url: './models/gltf/BotSkinned/%s/Bot_Skinned.gltf',
					author: 'MozillaVR',
					authorURL: 'https://vr.mozilla.org/',
					cameraPos: new THREE.Vector3( 0.5, 2, 2 ),
					center: new THREE.Vector3( 0, 1.2, 0 ),
					objectRotation: new THREE.Euler( 0, 0, 0 ),
						objectPosition: new THREE.Vector3( 1.8, 1, 2 ),
					addLights: true,
					addGround: true,
					shadows: true,
					extensions: [ 'glTF-MaterialsUnlit' ]
				},
				MetalRoughSpheres: {
					name: 'MetalRoughSpheres (PBR)',
					url: './models/gltf/MetalRoughSpheres/%s/MetalRoughSpheres.gltf',
					author: '@emackey',
					authorURL: 'https://twitter.com/emackey',
					cameraPos: new THREE.Vector3( 2, 1, 15 ),
					objectRotation: new THREE.Euler( 0, 0, 0 ),
						objectPosition: new THREE.Vector3( 1.8, 1, 3 ),
					addLights: true,
					extensions: [ 'glTF', 'glTF-Embedded' ],
					addEnvMap: true
				},
				Duck: {
					name: 'Duck',
					url: './models/gltf/Duck/%s/Duck.gltf',
					author: 'Sony',
					authorURL: 'https://www.playstation.com/en-us/corporate/about/',
					cameraPos: new THREE.Vector3( 0, 3, 5 ),
						objectPosition: new THREE.Vector3( 2.8, 0, 0 ),
					addLights: true,
					addGround: true,
					shadows: true,
					extensions: [ 'glTF', 'glTF-Embedded', 'glTF-pbrSpecularGlossiness', 'glTF-Binary', 'glTF-Draco' ]
				},
				Monster: {
					name: 'Monster',
					url: './models/gltf/Monster/%s/Monster.gltf',
					author: '3drt.com',
					authorURL: 'http://www.3drt.com/downloads.htm',
					cameraPos: new THREE.Vector3( 3, 1, 7 ),
					objectScale: new THREE.Vector3( 0.04, 0.04, 0.04 ),
					objectPosition: new THREE.Vector3( 0.2, 0.1, 0 ),
					objectRotation: new THREE.Euler( 0, - 3 * Math.PI / 4, 0 ),
					animationTime: 3,
					addLights: true,
					shadows: true,
					addGround: true,
					extensions: [ 'glTF', 'glTF-Embedded', 'glTF-Binary', 'glTF-Draco', 'glTF-lights' ]
				},
				'Cesium Man': {
					name: 'Cesium Man',
					url: './models/gltf/CesiumMan/%s/CesiumMan.gltf',
					author: 'Cesium',
					authorURL: 'https://cesiumjs.org/',
					cameraPos: new THREE.Vector3( 0, 3, 10 ),
					objectRotation: new THREE.Euler( 0, 0, 0 ),
					addLights: true,
					addGround: true,
					shadows: true,
					extensions: [ 'glTF', 'glTF-Embedded', 'glTF-Binary', 'glTF-Draco' ]
				},
				'Cesium Milk Truck': {
					name: 'Cesium Milk Truck',
					url: './models/gltf/CesiumMilkTruck/%s/CesiumMilkTruck.gltf',
					author: 'Cesium',
					authorURL: 'https://cesiumjs.org/',
					cameraPos: new THREE.Vector3( 0, 3, 10 ),
					objectRotation: new THREE.Euler( 0, Math.PI / 2, 0 ),
					objectPosition: new THREE.Vector3( 0, -0.1, 5 ),
					addLights: true,
					addGround: true,
					shadows: true,
					extensions: [ 'glTF', 'glTF-Embedded', 'glTF-Binary', 'glTF-Draco' ]
				},
				'Outlined Box': {
					name: 'Outlined Box',
					url: './models/gltf/OutlinedBox/OutlinedBox.gltf',
					author: '@twittmann',
					authorURL: 'https://github.com/twittmann',
					cameraPos: new THREE.Vector3( 0, 5, 15 ),
					objectScale: new THREE.Vector3( 0.01, 0.01, 0.01 ),
					objectRotation: new THREE.Euler( 0, 90, 0 ),
						objectPosition: new THREE.Vector3( 1.8, 1, 10 ),
					addLights: true,
					shadows: true,
					extensions: [ 'glTF' ]
				},
			};
var state;

// Initialize
init();
//Animate
animate();

			
function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// scene
	scene = new THREE.Scene();
	var envMap = new THREE.CubeTextureLoader()
					.setPath( 'textures/cube/skyboxsun25deg/')
					.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
	envMap.format = THREE.RGBFormat;
	scene.background = envMap;
	scene.fog = new THREE.Fog( 0xd7cbb1, 800, 1000 );

	// camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
	//camera.position.set( -1000, 1500, 1500 );
	camera.position.set( - 1.8, 1.9, -2.7 );
	// lights
    addLight(scene);
	// cloth
	object =addCloth(scene);
	// sphere
	sphere = addSphere(scene);
    // poles
   addPoles(scene);
	// ground
    addGround(scene);
	addRoad(scene);
	
	addHelmet(scene);
	for (var i = 0; i<Object.keys( scenes ).length; i++)
	{
		state = {
					scene: Object.keys( scenes )[ i ],
					extension: scenes[ Object.keys( scenes )[i] ].extensions[ 0 ],
					playAnimation: true
				};
		addBoombox(scene, state);
	}
	
	
	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// controls
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.5;
	controls.minDistance = 1;
	controls.maxDistance = 1000;

	// performance monitor
	stats = new Stats();
	container.appendChild( stats.dom );
	
	window.addEventListener( 'resize', onWindowResize, false );
	
}

//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//
var clock = new THREE.Clock();

function animate() {

	requestAnimationFrame( animate );

	var time = Date.now();

	var windStrength = Math.cos( time / 7000 ) * 20 + 40;

	windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) )
	windForce.normalize()
	windForce.multiplyScalar( windStrength );
	
	simulate( time );
	render();
	stats.update();
	
	var dt = clock.getDelta();
	for ( var i = 0; i < mixers.length; i ++ ) {
		var mixer = mixers[i];
		mixer.update(dt );
	}

}

function render() {

	var p = cloth.particles;

	for ( var i = 0, il = p.length; i < il; i ++ ) {

		var v = p[ i ].position;

		clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );

	}

	clothGeometry.attributes.position.needsUpdate = true;

	clothGeometry.computeVertexNormals();

	sphere.position.copy( ballPosition );

	renderer.render( scene, camera );

}




/***********************************
// add LIGHT
***********************************/
function addLight(scene){
	
scene.add( new THREE.AmbientLight( 0x666666 ) );

var light = new THREE.DirectionalLight( 0xdfebff, 1 );
light.position.set( 50, 200, 100 );
light.position.multiplyScalar( 1.3 );

light.castShadow = true;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

var d = 6;

light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;

light.shadow.camera.far = 1000;

scene.add( light );

return light;
}


/***********************************
// add GEO
***********************************/
function addSphere(scene) {
	// sphere
	var ballGeo = new THREE.SphereBufferGeometry( ballSize, 32, 16 );
	var ballMaterial = new THREE.MeshLambertMaterial();
	var sphere = new THREE.Mesh( ballGeo, ballMaterial );
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	sphere.visible = ! true;
	scene.add( sphere );
	return sphere;
}

function addPoles(scene) {
	// poles
	var poleGeo = new THREE.BoxBufferGeometry( 0.05, 1, 0.05 );
	var poleMat = new THREE.MeshLambertMaterial();

	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = - 1;
	mesh.position.y = 0.5;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = 1;
	mesh.position.y = 0.5;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 2.05, 0.05, 0.05 ), poleMat );
	mesh.position.y = 1;
	mesh.position.x = 0;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var gg = new THREE.BoxBufferGeometry( 0.10, 0.10, 0.10 );
	var mesh = new THREE.Mesh( gg, poleMat );
	mesh.position.y = -0.05;
	mesh.position.x = 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( gg, poleMat );
	mesh.position.y = -0.05;
	mesh.position.x = - 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );
	return mesh;
}
 
 function addCloth(scene){
 	// cloth material
	var loader = new THREE.TextureLoader();
	var clothTexture = loader.load( 'textures/patterns/circuit_pattern.png' );
	clothTexture.anisotropy = 16;
	var clothMaterial = new THREE.MeshLambertMaterial( {
		map: clothTexture,
		side: THREE.DoubleSide,
		alphaTest: 0.5
	} );
	// cloth geometry
	clothGeometry = new THREE.ParametricBufferGeometry( clothFunction, cloth.w, cloth.h );
	// cloth mesh
	var mesh = new THREE.Mesh( clothGeometry, clothMaterial );
	mesh.position.set( 0, 0, 0 );
	mesh.castShadow = false;
	scene.add( mesh );

	mesh.customDepthMaterial = new THREE.MeshDepthMaterial( {

		depthPacking: THREE.RGBADepthPacking,
		map: clothTexture,
		alphaTest: 0.5

	} );
	return mesh;
 }
 
  function addGround(scene){
	var loader = new THREE.TextureLoader();
 	var groundTexture = loader.load( 'textures/terrain/grasslight-big.jpg' );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 250, 250 );
	groundTexture.anisotropy = 16;
	  
	var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), groundMaterial );
	mesh.position.y = -0.1;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	 
	 return mesh;
 }
  
  function addRoad(scene){
	var loader = new THREE.TextureLoader();
 	var groundTexture = loader.load( 'textures/terrain/lane.jpg' );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 1, 1 );
	groundTexture.anisotropy = 1;
	var floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.8,
					color: 0xffffff,
					metalness: 0.2,
					bumpScale: 0.0005
				} );
    	var textureLoader = new THREE.TextureLoader();
				textureLoader.load( "textures/hardwood2_diffuse.jpg", function ( map ) {

					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2, 1000 );
					floorMat.map = map;
					floorMat.needsUpdate = true;

	} );
				textureLoader.load( "textures/hardwood2_bump.jpg", function ( map ) {

					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2, 1000 );
					floorMat.bumpMap = map;
					floorMat.needsUpdate = true;

	} );
				textureLoader.load( "textures/hardwood2_roughness.jpg", function ( map ) {

					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 2, 1000 );
					floorMat.roughnessMap = map;
					floorMat.needsUpdate = true;

	} );
	  
	var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 4, 2000 ), floorMat );
	mesh.position.y = - 0.05;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	 
	 return mesh;
 }
  
  
  function addHelmet(scene){
  	// model
	var loader = new THREE.GLTFLoader().setPath( 'models/gltf/DamagedHelmet/glTF/' );
	var loadStartTime = performance.now();
	loader.load( 'DamagedHelmet.gltf', function ( gltf ) {

		console.info( 'Load time: ' + ( performance.now() - loadStartTime ).toFixed( 2 ) + ' ms.' );
		//gltf.scene.rotation.y = Math.PI ;
		//gltf.scene.position.z = -5;
		//gltf.scene.position.y =1;
		var object = gltf.scene;
		object.position.set(0,1,-2);
		object.receiveShadow = true;
		object.castShadow = true;
		object.traverse( function ( node ) {

						if ( node.isMesh || node.isLight ) node.castShadow = true;

					} );
       
		scene.add( object );
			}, undefined, function ( e ) {

			console.error( e );

		} );
	  
  }
  
    function addBoombox(scene, state){
	var sceneInfo = scenes[ state.scene ];
		
  	// model
    var loader = new THREE.GLTFLoader();

	THREE.DRACOLoader.setDecoderPath( 'js/libs/draco/gltf/' );
	loader.setDRACOLoader( new THREE.DRACOLoader() );

	var url = sceneInfo.url.replace( /%s/g, state.extension );

	if ( state.extension === 'glTF-Binary' ) {

		url = url.replace( '.gltf', '.glb' );

	}

	var loadStartTime = performance.now();

	loader.load( url, function ( data ) {
		
	var gltf = data;
 	
	var object = gltf.scene;

	console.info( 'Load time: ' + ( performance.now() - loadStartTime ).toFixed( 2 ) + ' ms.' );
				if ( sceneInfo.objectPosition ) {

						object.position.copy( sceneInfo.objectPosition );
					    console.info('posset');

					}

					if ( sceneInfo.objectRotation ) {

						object.rotation.copy( sceneInfo.objectRotation );

					}
					
					if ( sceneInfo.objectScale ) {

						object.scale.copy( sceneInfo.objectScale );

					}
					object.traverse( function ( node ) {

						if ( node.isMesh || node.isLight ) node.castShadow = true;

					} );
					// animations
					var animations = gltf.animations;

					if ( animations && animations.length ) {

						var mixer = new THREE.AnimationMixer( object );

						for ( var i = 0; i < animations.length; i ++ ) {

							var animation = animations[ i ];

							// There's .3333 seconds junk at the tail of the Monster animation that
							// keeps it from looping cleanly. Clip it at 3 seconds
							if ( sceneInfo.animationTime ) {

								animation.duration = sceneInfo.animationTime;

							}

							var action = mixer.clipAction( animation );

							if ( state.playAnimation ) action.play();

						}
						mixers[mixers.length] = mixer;

					}
					
	scene.add( object );

	});
					
  }