function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createBuffer(gl, values = []) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
  return buffer;
}

function createIndexBuffer(gl, indices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  // Now send the element array to GL
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return buffer;
}

class ProgramInfo {
  constructor({
    gl,
    vertexShaderId,
    fragmentShaderId,
    attributes = [],
    uniforms = [],
  }) {
    this.gl = gl;
    const vertexShaderSource = document.querySelector(
      `#${vertexShaderId}`
    ).text;
    const fragmentShaderSource = document.querySelector(
      `#${fragmentShaderId}`
    ).text;

    console.log("compiling:" + vertexShaderId);
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    console.log("compiling:" + fragmentShaderId);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.attributes = {};
    this.uniforms = {};
    this.buffers = {};

    attributes.forEach((attribute) => {
      this.addAttribute(attribute);
    });
    uniforms.forEach((uniform) => {
      this.addUniform(uniform);
    });
  }

  addAttribute(name) {
    this.attributes[name] = this.gl.getAttribLocation(
      this.program,
      `a${name.charAt(0).toUpperCase()}${name.slice(1)}`
    );
  }

  addUniform(name) {
    this.uniforms[name] = this.gl.getUniformLocation(
      this.program,
      `u${name.charAt(0).toUpperCase()}${name.slice(1)}`
    );
  }

  addBuffersFromGeometry(name, geometry) {
    this.buffers[name] = {
      geometry,
      position:
        geometry.vertices !== undefined
          ? createBuffer(this.gl, geometry.vertices)
          : undefined,
      indices:
        geometry.indices !== undefined
          ? createIndexBuffer(this.gl, geometry.indices)
          : undefined,
      textureCoord:
        geometry.textureCoord !== undefined
          ? createBuffer(this.gl, geometry.textureCoord)
          : undefined,
    };
  }
}

function drawGeometry(gl, buffers, programInfo) {
  setPositionAttribute(gl, buffers.position, programInfo);
  if (buffers.textureCoord) {
    setTextureAttribute(gl, buffers.textureCoord, programInfo);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(
    gl.TRIANGLES,
    buffers.geometry.indices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, position, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  console.log(`loading texture ${url}`);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  const image = new Image();
  image.onload = () => {
    console.log(`loaded image ${url}`);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs. non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function createGridTexture(gl, width = 32, height = 32) {
  console.log(`generating grid texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const canvasContext = canvas.getContext("2d");
  canvasContext.fillStyle = "rgb(200,200,255)";
  canvasContext.fillRect(0, 0, width, height);
  canvasContext.fillStyle = "#222288";
  canvasContext.fillRect(1, 1, width - 2, height - 2);

  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function createTexture(gl, width = 32, height = 32) {
  console.log(`generating texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const canvasContext = canvas.getContext("2d");
  canvasContext.fillStyle = "rgb(200,200,255)";
  canvasContext.fillRect(0, 0, width, height);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function copyCanvasToTexture(gl, canvas, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );
  /*
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.NEAREST_MIPMAP_LINEAR
  );*/
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setColorAttribute(gl, color, programInfo) {
  const numComponents = 4; // pull out 4 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, color);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexColor);
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, textureCoord, programInfo) {
  const num = 2; // every coordinate composed of 2 values
  const type = gl.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoord);
  gl.vertexAttribPointer(
    programInfo.attributes.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.textureCoord);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, normal, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.vertexAttribPointer(
    programInfo.attributes.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attributes.vertexNormal);
}
