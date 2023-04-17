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

  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function createAmbientLightTexture(gl, width = 32, height = 32) {
  console.log(`generating shadow texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  //for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    /*
      const value = Math.min(
        1.0,
        Math.max(
          0,
          1 - (easeOutCirc((y * 2) / canvas.height) * x) / canvas.width
        )
      );*/
    const value = Math.min(
      1.0,
      Math.max(0, 1.75 - easeOutCirc((y * 2) / canvas.height))
    );
    context.fillStyle = `rgba(0,0,0,${value})`;
    context.fillRect(0, y, canvas.width, 1);
  }
  //}
  /*
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurContext = canvas.getContext("2d");
  blurContext.drawImage(canvas, 0, 0);

  for (let x = 0; x < canvas.width; x += 1) {
    context.drawImage(
      canvas,
      x,
      0,
      x + 1,
      canvas.height,
      x,
      0,
      x + 1,
      canvas.height
    );
  }*/

  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, gl.ALPHA, gl.UNSIGNED_BYTE, canvas);

  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

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
  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function generateNoiseToCanvas(canvas) {
  const context = canvas.getContext("2d");
  for (let y = 0; y < canvas.height; y += 2) {
    let x = 0;
    while (x < canvas.width) {
      const stripeWidth = Math.ceil((Math.random() * canvas.width) / 2);
      const color = colors[Math.floor(colors.length * Math.random())];
      context.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
      context.fillRect(x, y, stripeWidth, 2);
      x += stripeWidth;
    }
  }
}

function generateStripesToCanvas(canvas, stripes, now, palette, hit) {
  const context = canvas.getContext("2d");

  //context.globalAlpha = 1.0;
  //context.fillStyle = `rgb(0,0,0)`;
  //context.fillRect(0, 0, canvas.width, canvas.height);

  stripes.forEach((stripe) =>
    stripe.render(
      context,
      Math.min(1.0, Math.abs(Math.sin(now * 0.00005)) + 0.3),
      Math.abs(Math.cos(now * 0.00005)) * 0.1,
      palette
    )
  );

  if (hit) {
    const color = palette.hit;
    //const color = palette[Math.floor(Math.random() * palette.length)];
    //const color = palette[0];
    //context.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
    //context.fillRect(canvas.width - 2, 0, canvas.width - 2, canvas.height);
    stripes.forEach((stripe) => {
      stripe.color = color; //[255, 255, 255];
      //stripe.width = 1;
    });
  }
}

let gridCounter = 0;
let gridLightY = -1;

function generateGridToCanvas(canvas, palette, now, hit) {
  if (gridLightY === -1) {
    gridLightY = Math.floor(canvas.height / 2);
  }
  const step = Math.floor(canvas.height / 8);

  const context = canvas.getContext("2d");
  context.globalAlpha = 0.99;
  context.drawImage(canvas, -1, Math.random() * 0.05);
  //context.drawImage(canvas, -1, 0);
  context.globalAlpha = 1.0;
  const color = palette[Math.floor(gridCounter / 16) % palette.length];
  const lightColor = palette[0];
  //const color = palette[Math.floor(Math.random() * palette.length)];
  //const color = palette[0];
  const fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

  if (hit) {
    //context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillRect(canvas.width - 1, 0, 1, canvas.height);
  } else if ((gridCounter + 8) % 16 === 0) {
    context.fillStyle = fillStyle;
    context.fillRect(canvas.width - 1, 0, 1, canvas.height);

    if (palette.accent) {
      const oldGridLightY = gridLightY;
      gridLightY = Math.floor((Math.random() * canvas.height) / step) * step;
      context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
      context.fillRect(
        canvas.width - 1,
        Math.min(oldGridLightY, gridLightY),
        canvas.width - 1,
        Math.abs(gridLightY - oldGridLightY)
      );
    }
  } else {
    context.fillStyle = palette.bg
      ? `rgba(${palette.bg[0]},${palette.bg[1]},${palette.bg[2]},${palette.bg[3]})`
      : "rgb(0,0,0)";
    context.fillRect(canvas.width - 1, 0, canvas.width - 1, canvas.height);
    /*
    for (let y = 0; y < canvas.height; y += 1) {
      context.fillStyle = `rgba(0,0,0,${
        1.0 - easeOutCirc((y * 2) / canvas.height) // * 0.3
      })`;
      context.fillRect(canvas.width - 1, y, 1, 1);
    }*/

    if (palette.noise) {
      context.fillStyle = `rgb(${palette.noise[0]},${palette.noise[1]},${palette.noise[2]})`;
      context.fillRect(
        canvas.width - 1,
        Math.random() * canvas.height,
        1,
        1 + Math.random() * (canvas.height - 1)
      );
    }

    context.fillStyle = fillStyle;
    for (let y = 0; y < canvas.height; y += step) {
      context.fillRect(canvas.width - 1, y - 1, 1, 3);
    }

    if (palette.accent) {
      context.fillStyle = `rgba(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]},0.3)`;
      context.fillRect(canvas.width - 1, gridLightY - 4, 1, 9);
      context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
      context.fillRect(canvas.width - 1, gridLightY - 2, 1, 5);
    }
  }

  //context.fillStyle = "rgb(0,0,0)";
  //context.fillRect(canvas.width - 1, 0, 1, 2);
  //context.fillRect(canvas.width - 1, canvas.height - 2, 1, 2);

  //context.fillStyle = "rgb(0,0,0)";
  /*
  for (let y = 0; y < canvas.height; y++) {
    context.globalAlpha = Math.random() / 8;
    context.fillRect(canvas.width - 1, y, canvas.width - 1, 1);
  }
  context.globalAlpha = 1.0;
*/
  gridCounter++;
}

function copyCanvasToTexture(gl, canvas, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}
