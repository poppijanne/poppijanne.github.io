class ResourceLoader {
  loadTexture(gl, library, file) {
    return loadTexture(gl, `./img/${library}/${file}`);
  }
  loadCubeTexture(gl, library) {
    return loadCubeTexture(gl, [
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
    ]);
  }
}
