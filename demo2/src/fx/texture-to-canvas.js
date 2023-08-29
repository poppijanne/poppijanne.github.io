class TextureToCanvas {
  constructor({ id, canvas }) {
    this.id = id;
    this.canvas = canvas;
    this.gl = this.canvas.getContext("webgl", { alpha: false });

    this.material = new Material({
      shaderProgram: new ProgramInfo({
        gl: this.gl,
        vertexShaderId: "flat-vertex-shader",
        fragmentShaderId: "flat-fragment-shader",
        attributes: ["vertexPosition", "textureCoord"],
        uniforms: ["colorSampler", "flicker", "now"],
      }),
      textures: {
        color: WebGLUtils.createTexture(this.gl, 16, 16),
      },
    });

    this.screenMesh = this.createPlaneMesh(this.material);
    this.screenMesh.createBuffers(this.gl);
    this.screenMesh.bindBuffersToShaderProgramAttributes(this.gl);

    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    //this.programInfo.addBuffersFromGeometry("display", geometry.screen);
  }

  processEvents(events = [], now = 0, delta = 1) {
    /*
    events.forEach((event) => {
      switch (event.type) {
        case EVENT_TYPES.HIT:
          if (now - event.start < 100) {
            this.hit = true;
            this.hitId = event.id;
          }
          break;
        case EVENT_TYPES.KICK:
          if (now - event.start < this.kickLength) {
            this.kick = true;
            this.kickId = event.id;
            this.kickStart = event.start;
            this.shake = true;
            this.shakeStart = event.start;
          }
          break;
        case EVENT_TYPES.LIGHT_COLOR:
          const targetColor = lightPalette[event.params.index];
          this.bgColor[0] = (this.bgColor[0] * 49 + targetColor[0]) / 50;
          this.bgColor[1] = (this.bgColor[1] * 49 + targetColor[1]) / 50;
          this.bgColor[2] = (this.bgColor[2] * 49 + targetColor[2]) / 50;
          break;
        default:
          break;
      }
    });
    */
  }

  render(now = 0, texture, canvas) {
    //const gl = canvas.getContext("webgl", { alpha: false });
    const gl = this.gl;

    const time = now * 0.0001;

    this.screenMesh.material.textures = {
      color: texture,
    };

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1.0); // Clear to BG color, fully opaque
    //gl.clearDepth(1.0); // Clear everything
    //gl.enable(gl.DEPTH_TEST); // Enable depth testing
    //gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    /*
    gl.useProgram(this.screenMesh.material.shaderProgram.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //
    gl.uniform1i(
      this.screenMesh.material.shaderProgram.uniforms.colorSampler,
      0
    );*/
    this.screenMesh.material.use(gl);

    this.screenMesh.material.shaderProgram.setFloatUniform(
      "flicker",
      (Math.sin(time * 300.0) + Math.cos(time * 200.0)) * 0.01
    );

    this.screenMesh.material.shaderProgram.setFloatUniform("now", time * 1.0);

    this.screenMesh.draw(gl);
    //mergeCanvas(canvas.getContext("2d"), this.canvas, "source-over", 1.0);
  }

  createPlaneMesh(material) {
    return new Mesh(
      {
        name: "screen",
        vertices: [
          -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
        ],
        indices: [0, 1, 2, 0, 2, 3],
      },
      material
    );
  }
}
