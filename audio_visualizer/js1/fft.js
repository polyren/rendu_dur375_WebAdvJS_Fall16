

var SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight,

mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

SEPARATION = 200,
AMOUNTX = 10,
AMOUNTY = 10,
camera, scene, renderer;

init();
FFTArray();
animate();

function init() {
	var container, separation = 100, amountX = 50, amountY = 50,
	particles, particle;

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();

	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );

	// particles

	var PI2 = Math.PI * 2;
	var material = new THREE.SpriteCanvasMaterial( {

		color: 0xffffff,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();

		}

	} );

	for ( var i = 0; i < 10; i ++ ) {

		particle = new THREE.Sprite( material );
		particle.position.x = Math.random() * 2 - 1;
		particle.position.y = Math.random() * 2 - 1;
		particle.position.z = Math.random() * 2 - 1;
		particle.position.normalize();
		particle.position.multiplyScalar( Math.random() * 10 + 450 );
		particle.scale.multiplyScalar( 2 );
		scene.add( particle );
	}

	// lines



	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}
function FFTArray(dataArray){
////draw attributes sphere/////////
	// var radius = 50, segments = 128, rings = 64;

	// var geometry = new THREE.SphereBufferGeometry( radius, segments, rings );

	// displacement = new Float32Array( geometry.attributes.position.count );
	// noise = new Float32Array( geometry.attributes.position.count );

	// for ( var i = 0; i < displacement.length; i ++ ) {
	// 	noise[ i ] = Math.random() * 5;
	// }
	// geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

	// sphere = new THREE.Mesh( geometry, shaderMaterial );
	// scene.add( sphere );




		for (var i = 0; i < 10; i++) {
		var geometry = new THREE.Geometry();

		var vertex = new THREE.Vector3( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
		vertex.normalize();
		vertex.multiplyScalar( 450 );

		geometry.vertices.push( vertex );

		var vertex2 = vertex.clone();
		vertex2.multiplyScalar( Math.random()* 0.3 + 1 );

		geometry.vertices.push( vertex2 );

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: Math.random() } ) );
		scene.add( line );
		}
	}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

//

function animate() {
	requestAnimationFrame( animate );
	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}
