var gl;
var program;
var positionLocation;
var colorLocation;
var matrixLocation;
var positionBuffer;
var colorBuffer;
var matrix;
class Vector3{
    x;
    y;
    z;
}
class Transform{
    position;
    rotation;
    scale;
}
class GameObject {
    id;
    name;
    Transform;
    m4;
    BodyModel;
    ColorModel;
}

class BodyModel{
    id;
    name;
    indicies;
    indiciesBuffer;
    verts;
    vertsBuffer;
}
class Game{
    BodyModels = [];
    GameObjects;
    camera;
    constructor(){
      this.webglSETUP();
      var cube = new BodyModel();
      cube.verts = [
        -1.0, 1.0 -1.0,
        1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,

        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
      ];
      cube.vertsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.vertsBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Float32Array(cube.verts), gl.STATIC_DRAW);
      cube.indicies = [
        0, 2, 3, 0, 3, 1,
        2, 6, 7, 2, 7, 3,
        6, 4, 5, 6, 5, 7,
        4, 0, 1, 4, 1, 5,
        0, 4, 6, 0, 6, 2,
        1, 5, 7, 1, 7, 3,
        
      ];
      cube.indiciesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indiciesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint8Array(cube.indicies), gl.STATIC_DRAW);


      this.BodyModels.push();
    }

    webglSETUP(){
        var GObjects = this.GameObjects;
        var canvas = document.querySelector("#canvas");
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
      
        // Create a buffer to put positions in
        positionBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Put geometry data into buffer
        setGeometry(gl);
      
        // Create a buffer to put colors in
        colorBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // Put geometry data into buffer
        setColors(gl);
      
      
      // Turn on culling. By default backfacing triangles
          // will be culled.
          gl.enable(gl.CULL_FACE);
      
          // Enable the depth buffer
          gl.enable(gl.DEPTH_TEST);
      
      
          gl.enableVertexAttribArray(positionLocation);

    }

    render(){
      webglUtils.resizeCanvasToDisplaySize(gl.canvas);

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      // Clear the canvas.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);
  
      // Turn on the position attribute
      var transform = new Transform();
      transform.position = [0,0,0]
      transform.rotation = [0,0,0]
      transform.scale = [1,1,1];
      // Compute the matrices
      var m4 = new Camera();
      var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
      matrix = m4.translate(matrix, transform.position[0], transform.position[1], transform.position[2]);
      matrix = m4.xRotate(matrix, transform.rotation[0]);
      matrix = m4.yRotate(matrix, transform.rotation[1]);
      matrix = m4.zRotate(matrix, transform.rotation[2]);
      matrix = m4.scale(matrix, transform.scale[0], transform.scale[1], transform.scale[2]);
  
      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.)

      gl.drawElements(gl.TRIANGLES,8,gl.UNSIGNED_SHORT, 0);
  
    }
}
class Camera{

    perspective (fieldOfViewInRadians, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);
    
        return [
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (near + far) * rangeInv, -1,
          0, 0, near * far * rangeInv * 2, 0
        ];
      }

   projection (w, h, d) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / w, 0, 0, 0,
       0, -2 / h, 0, 0,
       0, 0, 2 / d, 0,
      -1, 1, 0, 1,
    ];
  }

  multiply(a, b) {
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
  }

  translation(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  }

  xRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  }

  yRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  }

  zRotation(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  }

  scaling(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  }

  translate(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  }

  xRotate(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  }

  yRotate(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  }

  zRotate(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  }

  scale(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  }



}

function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

