const WebGLUtils = {
  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  },

  createProgram(gl, vertexShader, fragmentShader) {
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
  },

  createBuffer(gl, values = []) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
    return buffer;
  },

  createIndexBuffer(gl, indices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    // Now send the element array to GL
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    return buffer;
  },

  // Tell WebGL how to pull out the values from
  // the buffer into the attribute.
  bindBufferToAttribute({ gl, attribute, buffer, num = 3 }) {
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribute);
  },

  createTexture(gl, width = 32, height = 32) {
    console.log(`generating texture`);

    const checkerCanvas = document.createElement("canvas");
    checkerCanvas.width = width;
    checkerCanvas.height = height;
    const canvasContext = checkerCanvas.getContext("2d");
    canvasContext.fillStyle = "rgb(0,0,0)";
    canvasContext.fillRect(0, 0, width, height);
    //canvasContext.fillStyle = "rgb(255,255,255)";
    //canvasContext.fillRect(1, 1, 1, 1);
    const reso = 8;

    for (let x = 0; x < width; x += width / reso) {
      for (let y = 0; y < height; y += height / reso) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        canvasContext.fillStyle = `rgb(${r},${g},${b})`;
        canvasContext.fillRect(x, y, width / reso, height / reso);
      }
    }

    //document.getElementById("debug-canvas").appendChild(canvas);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      checkerCanvas
    );

    if (isPowerOf2(checkerCanvas.width) && isPowerOf2(checkerCanvas.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    return texture;
  },

  copyCanvasToTexture(gl, canvas, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    if (isPowerOf2(canvas.width) && isPowerOf2(canvas.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  },
};

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
    const vertexShader = WebGLUtils.createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    console.log("compiling:" + fragmentShaderId);
    const fragmentShader = WebGLUtils.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    this.program = WebGLUtils.createProgram(gl, vertexShader, fragmentShader);
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

  setMatrixUniform(uniformName, matrix) {
    if (this.uniforms[uniformName]) {
      this.gl.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
    }
  }

  setFloatUniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform1f(this.uniforms[uniformName], value);
    }
  }

  setVertex4Uniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform4fv(this.uniforms[uniformName], value);
    }
  }

  setVertex3Uniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform3fv(this.uniforms[uniformName], value);
    }
  }

  setVertex2Uniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform2fv(this.uniforms[uniformName], value);
    }
  }

  setRGBUniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform3fv(this.uniforms[uniformName], value);
    }
  }

  setRGBAUniform(uniformName, value) {
    if (this.uniforms[uniformName]) {
      this.gl.uniform4fv(this.uniforms[uniformName], value);
    }
  }
}

function drawGeometryLines(gl, buffers, programInfo) {
  setPositionAttribute(gl, buffers.position, programInfo);
  if (buffers.textureCoords) {
    setTextureAttribute(gl, buffers.textureCoords, programInfo);
  }
  if (buffers.normals) {
    setNormalAttribute(gl, buffers.normals, programInfo);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.drawElements(
    gl.LINE_STRIP,
    buffers.geometry.indices.length,
    gl.UNSIGNED_SHORT,
    0
  );
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function createTexture(gl, width = 32, height = 32) {
  console.log(`generating texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const canvasContext = canvas.getContext("2d");
  canvasContext.fillStyle = "rgb(0,0,0)";
  canvasContext.fillRect(0, 0, width, height);
  //canvasContext.fillStyle = "rgb(255,255,255)";
  //canvasContext.fillRect(1, 1, 1, 1);
  const reso = 8;

  for (let x = 0; x < width; x += width / reso) {
    for (let y = 0; y < height; y += height / reso) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      canvasContext.fillStyle = `rgb(${r},${g},${b})`;
      canvasContext.fillRect(x, y, width / reso, height / reso);
    }
  }

  //document.getElementById("debug-canvas").appendChild(canvas);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, canvas);

  if (isPowerOf2(canvas.width) && isPowerOf2(canvas.height)) {
    // Yes, it's a power of 2. Generate mips.
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  } else {
    // No, it's not a power of 2. Turn off mips and set
    // wrapping to clamp to edge
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  /*



  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
*/
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
