var gl;
var program;
var positionLocation;
var colorLocation;
var matrixLocation;
var positionBuffer;
var colorBuffer;
var matrix;
var translation = [100, 150, 0];
var x = 0;
var y = 0;
var z= 10;
var rotation = [degToRad(y), degToRad(x), degToRad(z)];
var scale = [0.5, 0.5, 0.5];

function ClampAngle(x){
  if(x < 0){
  return 360 + (x % 360);
  }
  return x % 360;
  }


  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }
class Vector3{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }
    x;
    y;
    z;
}
class Transform{
  constructor(){
    this.position = new Vector3(0,0,0);
    this.rotation = new Vector3(0,0,0);
    this.scale = new Vector3(1,1,1);
  }
    position;
    rotation;
    scale;

    forward(){
      var dir =  new Vector3();
      dir.x = Math.sin(degToRad(this.rotation.y)) * Math.cos(degToRad(this.rotation.x));
      dir.y = Math.sin(degToRad(-this.rotation.x));
      dir.z = Math.cos(degToRad(this.rotation.x)) * Math.cos(degToRad(this.rotation.y));
      
      return dir;
    }
    right(){
    var dir =  new Vector3();
     dir.x = Math.sin(degToRad(ClampAngle(this.rotation.y + 90))) * Math.cos(degToRad(ClampAngle(this.rotation.x)));
     dir.y = Math.sin(degToRad(-ClampAngle(this.rotation.x)));
     dir.z = Math.cos(degToRad(ClampAngle(this.rotation.x))) * Math.cos(degToRad(ClampAngle(this.rotation.y + 90) % 360));
     console.log('rotation');
      console.log(this.rotation);
      console.log('right')
      console.log(dir);
     return dir;
    }
    up(){
    var dir =  new Vector3();
    dir.x = Math.sin(degToRad(this.rotation.y)) * Math.cos(degToRad(this.rotation.x));
    dir.y = Math.sin(degToRad(-this.rotation.x));
    dir.z = Math.cos(degToRad(this.rotation.x)) * Math.cos(degToRad(this.rotation.y));
    return dir;
    }
  }
class GameObject {
    id;
    name;
    Transform;
    
    BodyModel;
    ColorModel;
}

class BodyModel{
    id;
    name;
    colors;
    colorsBuffer;
    verts;
    vertsBuffer;
}
class Game{
	
    BodyModels = [];
    GameObjects = [];
    camera;
    constructor(){
      this.webglSETUP();
      var cube = new BodyModel();
      cube.verts = new Float32Array([
      //front
       0,0,0,
       0,150,0,
       150,0,0,
       
       0,150,0,
       150,150,0,
       150,0,0,
       
       //right
       150,0,0,
       150,150,0,
       150,0,150,
       
       150,150,0,
       150,150,150,
       150,0,150,
       
       
       //left
       0,0,0,
       0,150,150,
       0,150,0,
       
       0,0,0,
       0,0,150,
       0,150,150,
       
       
       //Back
       150,0,150,
       150,150,150,
       0,150,150,
       
       0,150,150,
       0,0,150,
       150,0,150,
       
       //TOP
       
       0,150,0,
       0,150,150,
       150,150,0,
       
       0,150,150,
       150,150,150,
       150,150,0,
       
       //BOTTOM
       
       0,0,0,
       150,0,0,
       0,0,150,
       
       0,0,150,
       150,0,0,
       150,0,150
       
      ]);
      cube.colors = new Uint8Array([
        250,0,0,
        250,0,0,
        250,0,0,
        250,0,0,
        250,0,0,
        250,0,0,
        
        0,250,0,
        0,250,0,
        0,250,0,
        0,250,0,
        0,250,0,
        0,250,0,
        
        0,0,250,
        0,0,250,
        0,0,250,
        0,0,250,
        0,0,250,
        0,0,250,
        
        0,250,250,
        0,250,250,
        0,250,250,
        0,250,250,
        0,250,250,
        0,250,250,
        
        250,250,0,
        250,250,0,
        250,250,0,
        250,250,0,
        250,250,0,
        250,250,0,
        
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0
        
        
      ]);
      
      
      cube.vertsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertsBuffer);
      cube.verts = center(cube.verts);
      gl.bufferData(gl.ARRAY_BUFFER, cube.verts, gl.STATIC_DRAW);
     
      cube.colorsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cube.colorsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW);


      this.BodyModels.push(cube);
      
      var camera = new GameObject();
      camera.id = "camera";
      camera.name = "camera";
      camera.transform = new Transform();
      camera.transform.position.x = 0;
      camera.transform.position.y = 0;
      camera.transform.position.z = 0;
      camera.BodyModel = this.BodyModels[0];
      camera.ColorModel = this.BodyModels[0];
      this.camera = camera;
      
      
      var object1 = new GameObject();
      object1.id = "objekt";
      object1.name = "cube";
      object1.transform = new Transform();
      object1.transform.position.x = 0;
      object1.transform.position.y = 0;
      object1.transform.position.z = 300;
      object1.transform.scale.x = 0.001;
      object1.transform.scale.y = 0.001;
      object1.transform.scale.z = 0.001;
      object1.BodyModel = this.BodyModels[0];
      object1.ColorModel = this.BodyModels[0];
      this.GameObjects.push(object1);

      var object2 = new GameObject();
      object2.id = "objekt";
      object2.name = "cube";
      object2.transform = new Transform();
      object2.transform.position.x = 0;
      object2.transform.position.y = 0;
      object2.transform.position.z = -300;
      object2.transform.scale.x = 0.0001;
      object2.transform.scale.y = 0.0001;
      object2.transform.scale.z = 0.0001;
      object2.BodyModel = this.BodyModels[0];
      object2.ColorModel = this.BodyModels[0];
      this.GameObjects.push(object2);

      var object3 = new GameObject();
      object3.id = "objekt";
      object3.name = "cube";
      object3.transform = new Transform();
      object3.transform.position.x = 0;
      object3.transform.position.y = -300;
      object3.transform.position.z = 0;
      object3.transform.scale.x = 0.0001;
      object3.transform.scale.y = 0.0001;
      object3.transform.scale.z = 0.0001;
      object3.BodyModel = this.BodyModels[0];
      object3.ColorModel = this.BodyModels[0];
      this.GameObjects.push(object3);
      }
    

    webglSETUP(){
       
       gl = canvas.getContext("webgl");
      if (!gl) {
        return;
      }
    
      // setup GLSL program
       program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);
    
      // look up where the vertex data needs to go.
       positionLocation = gl.getAttribLocation(program, "a_position");
       colorLocation = gl.getAttribLocation(program, "a_color");
    
      // lookup uniforms
       matrixLocation = gl.getUniformLocation(program, "u_matrix");
    
    }

    render(){
      

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);




  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    

	for (var i = 0; i < this.GameObjects.length; i++){
	
	
  
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.GameObjects[i].BodyModel.vertsBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.GameObjects[i].ColorModel.colorsBuffer);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;                 // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
    var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;               // start at the beginning of the buffer
    gl.vertexAttribPointer(
        colorLocation, size, type, normalize, stride, offset);

    // Compute the matrices

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 0.001;
    var zFar = 2000;
    var projectionMatrix = m4.perspective((60 * 3.14 / 180), aspect, zNear, zFar);
    var cameraMatrix = m4.yRotation(0);
    cameraMatrix = m4.translate(cameraMatrix, this.camera.transform.position.x, 
    this.camera.transform.position.y, 
    this.camera.transform.position.z);
    cameraMatrix = m4.xRotate(cameraMatrix, degToRad(this.camera.transform.rotation.x));
    cameraMatrix = m4.yRotate(cameraMatrix, degToRad(this.camera.transform.rotation.y));
    cameraMatrix = m4.zRotate(cameraMatrix, degToRad(this.camera.transform.rotation.z));
    
    var viewMatrix = m4.inverse(cameraMatrix);
    
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var matrix = m4.translate(viewProjectionMatrix, this.GameObjects[i].transform.position.x, 
      this.GameObjects[i].transform.position.y, 
      this.GameObjects[i].transform.position.z);
    matrix = m4.xRotate(matrix,  this.GameObjects[i].transform.rotation.x);
    matrix = m4.yRotate(matrix, this.GameObjects[i].transform.rotation.y);
    matrix = m4.zRotate(matrix, this.GameObjects[i].transform.rotation.z);
    matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
      

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = this.GameObjects[i].BodyModel.verts.length / 3;
    gl.drawArrays(primitiveType, offset, count);
    }
  }
  
}

  function center(positions){
  
  var matrix = xRotation(Math.PI);
  matrix = translate(matrix, -75, -75, -75);
  
  for (var ii = 0; ii < positions.length; ii += 3) {
  var vector = vectorMultiply([positions[ii + 0], positions[ii + 1], positions[ii + 2], 1], matrix);
  positions[ii + 0] = vector[0];
  positions[ii + 1] = vector[1];
  positions[ii + 2] = vector[2];
  }
  return positions;
  }
 var m4 = {
 
 lookAt: function(cameraPosition, target, up) {
 var zAxis = normalize(
 subtractVectors(cameraPosition, target));
 var xAxis = normalize(cross(up, zAxis));
 var yAxis = normalize(cross(zAxis, xAxis));
 
 return [
 xAxis[0], xAxis[1], xAxis[2], 0,
 yAxis[0], yAxis[1], yAxis[2], 0,
 zAxis[0], zAxis[1], zAxis[2], 0,
 cameraPosition[0],
 cameraPosition[1],
 cameraPosition[2],
 1,
 ];
 },
 
 perspective: function(fieldOfViewInRadians, aspect, near, far) {
 var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
 var rangeInv = 1.0 / (near - far);
 
 return [
 f / aspect, 0, 0, 0,
 0, f, 0, 0,
 0, 0, (near + far) * rangeInv, -1,
 0, 0, near * far * rangeInv * 2, 0
 ];
 },
 
 projection: function(width, height, depth) {
 // Note: This matrix flips the Y axis so 0 is at the top.
 return [
 2 / width, 0, 0, 0,
 0, -2 / height, 0, 0,
 0, 0, 2 / depth, 0,
 -1, 1, 0, 1,
 ];
 },
 
 multiply: function(a, b) {
 var a00 = a[0 * 4 + 0];
 var a01 = a[0 * 4 + 1];
 var a02 = a[0 * 4 + 2];
 var a03 = a[0 * 4 + 3];
 var a10 = a[1 * 4 + 0];
 var a11 = a[1 * 4 + 1];
 var a12 = a[1 * 4 + 2];
 var a13 = a[1 * 4 + 3];
 var a20 = a[2 * 4 + 0];
 var a21 = a[2 * 4 + 1];
 var a22 = a[2 * 4 + 2];
 var a23 = a[2 * 4 + 3];
 var a30 = a[3 * 4 + 0];
 var a31 = a[3 * 4 + 1];
 var a32 = a[3 * 4 + 2];
 var a33 = a[3 * 4 + 3];
 var b00 = b[0 * 4 + 0];
 var b01 = b[0 * 4 + 1];
 var b02 = b[0 * 4 + 2];
 var b03 = b[0 * 4 + 3];
 var b10 = b[1 * 4 + 0];
 var b11 = b[1 * 4 + 1];
 var b12 = b[1 * 4 + 2];
 var b13 = b[1 * 4 + 3];
 var b20 = b[2 * 4 + 0];
 var b21 = b[2 * 4 + 1];
 var b22 = b[2 * 4 + 2];
 var b23 = b[2 * 4 + 3];
 var b30 = b[3 * 4 + 0];
 var b31 = b[3 * 4 + 1];
 var b32 = b[3 * 4 + 2];
 var b33 = b[3 * 4 + 3];
 return [
 b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
 b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
 b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
 b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
 b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
 b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
 b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
 b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
 b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
 b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
 b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
 b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
 b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
 b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
 b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
 b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
 ];
 },
 
 translation: function(tx, ty, tz) {
 return [
 1,  0,  0,  0,
 0,  1,  0,  0,
 0,  0,  1,  0,
 tx, ty, tz, 1,
 ];
 },
 
 xRotation: function(angleInRadians) {
 var c = Math.cos(angleInRadians);
 var s = Math.sin(angleInRadians);
 
 return [
 1, 0, 0, 0,
 0, c, s, 0,
 0, -s, c, 0,
 0, 0, 0, 1,
 ];
 },
 
 yRotation: function(angleInRadians) {
 var c = Math.cos(angleInRadians);
 var s = Math.sin(angleInRadians);
 
 return [
 c, 0, -s, 0,
 0, 1, 0, 0,
 s, 0, c, 0,
 0, 0, 0, 1,
 ];
 },
 
 zRotation: function(angleInRadians) {
 var c = Math.cos(angleInRadians);
 var s = Math.sin(angleInRadians);
 
 return [
 c, s, 0, 0,
 -s, c, 0, 0,
 0, 0, 1, 0,
 0, 0, 0, 1,
 ];
 },
 
 scaling: function(sx, sy, sz) {
 return [
 sx, 0,  0,  0,
 0, sy,  0,  0,
 0,  0, sz,  0,
 0,  0,  0,  1,
 ];
 },
 
 translate: function(m, tx, ty, tz) {
 return m4.multiply(m, m4.translation(tx, ty, tz));
 },
 
 xRotate: function(m, angleInRadians) {
 return m4.multiply(m, m4.xRotation(angleInRadians));
 },
 
 yRotate: function(m, angleInRadians) {
 return m4.multiply(m, m4.yRotation(angleInRadians));
 },
 
 zRotate: function(m, angleInRadians) {
 return m4.multiply(m, m4.zRotation(angleInRadians));
 },
 
 scale: function(m, sx, sy, sz) {
 return m4.multiply(m, m4.scaling(sx, sy, sz));
 },
 
 inverse: function(m) {
 var m00 = m[0 * 4 + 0];
 var m01 = m[0 * 4 + 1];
 var m02 = m[0 * 4 + 2];
 var m03 = m[0 * 4 + 3];
 var m10 = m[1 * 4 + 0];
 var m11 = m[1 * 4 + 1];
 var m12 = m[1 * 4 + 2];
 var m13 = m[1 * 4 + 3];
 var m20 = m[2 * 4 + 0];
 var m21 = m[2 * 4 + 1];
 var m22 = m[2 * 4 + 2];
 var m23 = m[2 * 4 + 3];
 var m30 = m[3 * 4 + 0];
 var m31 = m[3 * 4 + 1];
 var m32 = m[3 * 4 + 2];
 var m33 = m[3 * 4 + 3];
 var tmp_0  = m22 * m33;
 var tmp_1  = m32 * m23;
 var tmp_2  = m12 * m33;
 var tmp_3  = m32 * m13;
 var tmp_4  = m12 * m23;
 var tmp_5  = m22 * m13;
 var tmp_6  = m02 * m33;
 var tmp_7  = m32 * m03;
 var tmp_8  = m02 * m23;
 var tmp_9  = m22 * m03;
 var tmp_10 = m02 * m13;
 var tmp_11 = m12 * m03;
 var tmp_12 = m20 * m31;
 var tmp_13 = m30 * m21;
 var tmp_14 = m10 * m31;
 var tmp_15 = m30 * m11;
 var tmp_16 = m10 * m21;
 var tmp_17 = m20 * m11;
 var tmp_18 = m00 * m31;
 var tmp_19 = m30 * m01;
 var tmp_20 = m00 * m21;
 var tmp_21 = m20 * m01;
 var tmp_22 = m00 * m11;
 var tmp_23 = m10 * m01;
 
 var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
 (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
 var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
 (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
 var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
 (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
 var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
 (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
 
 var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
 
 return [
 d * t0,
 d * t1,
 d * t2,
 d * t3,
 d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
 (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
 d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
 (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
 d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
 (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
 d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
 (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
 d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
 (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
 d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
 (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
 d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
 (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
 d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
 (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
 d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
 (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
 d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
 (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
 d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
 (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
 d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
 (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
 ];
 },
 
 vectorMultiply: function(v, m) {
 var dst = [];
 for (var i = 0; i < 4; ++i) {
 dst[i] = 0.0;
 for (var j = 0; j < 4; ++j) {
 dst[i] += v[j] * m[j * 4 + i];
 }
 }
 return dst;
 },
 
 };