class Material {
  constructor({ name, shaderProgram, textures }) {
    this.name = name;
    this.shaderProgram = shaderProgram;
    this.textures = textures;
  }
  use(gl) {
    gl.useProgram(this.shaderProgram.program);

    if (
      this.textures.color &&
      this.shaderProgram.uniforms.colorSampler !== -1
    ) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.color);
      gl.uniform1i(this.shaderProgram.uniforms.colorSampler, 0);
    }

    if (
      this.textures.normal &&
      this.shaderProgram.uniforms.normalSampler !== -1
    ) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.normal);
      gl.uniform1i(this.shaderProgram.uniforms.normalSampler, 1);
    }

    if (
      this.textures.specular &&
      this.shaderProgram.uniforms.specularSampler !== -1
    ) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.specular);
      gl.uniform1i(this.shaderProgram.uniforms.specularSampler, 2);
    }

    if (this.textures.cube && this.shaderProgram.uniforms.cubeSampler !== -1) {
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures.cube);
      gl.uniform1i(this.shaderProgram.uniforms.cubeSampler, 3);
    }

    if (
      this.textures.metal &&
      this.shaderProgram.uniforms.metalSampler !== -1
    ) {
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, this.textures.metal);
      gl.uniform1i(this.shaderProgram.uniforms.metalSampler, 4);
    }
  }
}

const MATERIALS = {
  GRAY: {
    Ns: 250.0,
    Ka: { r: 1.0, g: 1.0, b: 1.0 },
    Kd: { r: 0.5, g: 0.5, b: 0.5 },
    Ks: { r: 0.5, g: 0.5, b: 0.5 },
    Ke: { r: 0.0, g: 0.0, b: 0.0 },
    Ni: 1.45,
    d: 1.0,
    illum: 2,
  },
  BLUE: {
    Ns: 250.0,
    Ka: { r: 1.0, g: 1.0, b: 1.0 },
    Kd: { r: 0.1, g: 0.1, b: 1.0 },
    Ks: { r: 0.5, g: 0.5, b: 0.5 },
    Ke: { r: 0.0, g: 0.0, b: 0.0 },
    Ni: 1.45,
    d: 1.0,
    illum: 2,
  },
  RED: {
    Ns: 250.0,
    Ka: { r: 1.0, g: 1.0, b: 1.0 },
    Kd: { r: 1.0, g: 0.1, b: 0.1 },
    Ks: { r: 0.5, g: 0.5, b: 0.5 },
    Ke: { r: 0.0, g: 0.0, b: 0.0 },
    Ni: 1.45,
    d: 1.0,
    illum: 2,
  },
};
