var sky, sunSphere;

function initSky() {

	// Add Sky
	sky = new THREE.Sky();
	sky.scale.setScalar( 450000 );
	scene.add( sky );

	// Add Sun Helper
	sunSphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry( 20000, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff } )
	);
	sunSphere.position.y = - 700000;
	sunSphere.visible = false;
	scene.add( sunSphere );

	/// GUI

	var effectController  = {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: 0.49, // elevation / inclination
		azimuth: 0.25, // Facing front,
		sun: ! true
	};
