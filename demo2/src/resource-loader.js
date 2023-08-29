class ResourceLoader {
  /*
  loadTexture(gl, library, file) {
    return loadTexture(gl, `/img/${library}/${file}`);
  }*/

  loadTexture(gl, library, file) {
    const url = `./img/${library}/${file}`;
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
    };
    image.src = url;

    return texture;
  }

  loadCubeTexture(gl, library) {
    console.log(`loading cube texture`);

    const faces = [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        url: `./img/${library}/pos-x.png`,
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        url: `./img/${library}/neg-x.png`,
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        url: `./img/${library}/pos-y.png`,
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        url: `./img/${library}/neg-y.png`,
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        url: `./img/${library}/pos-z.png`,
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        url: `./img/${library}/neg-z.png`,
      },
    ];

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    faces.forEach((face) => {
      const { target, url } = face;
      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
      gl.texImage2D(
        target,
        level,
        internalFormat,
        512,
        512,
        0,
        srcFormat,
        srcType,
        null
      );
      /*
      gl.texImage2D(
        target,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
      );*/

      const image = new Image();
      image.onerror = () => {
        console.log(`cub map image ${url} failed to load`);
      };
      image.onload = () => {
        console.log(`loaded cub map image ${url}`);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, level, internalFormat, srcFormat, srcType, image);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      };
      image.src = url;
    });

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );

    return texture;
  }
}
