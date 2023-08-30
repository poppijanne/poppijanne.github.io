// TODO
// - array of switchable lights
// - array of switchable cameras

const BLURS = [
  [0, 0, 0],
  [1, 0, -1],
  [-1, 0, 0],
  [0, 1, -1],
  [0, -1, 0],
  [-1, -1, -1],
  [1, 1, 0],
  [-1, 1, -1],
  [1, -1, 0],
  [0.9, 0, -0.9],
  [-0.9, 0, 0],
  [0, 0.9, 0.9],
  [0, -0.9, 0],
  [-0.9, -0.9, -0.9],
  [0.9, 0.9, 0],
  [-0.9, 0.9, 0.9],
  [0.9, -0.9, 0],
  /*
  [0.8, 0, -0.8],
  [-0.8, 0, 0],
  [0, 0.8, 0.8],
  [0, -0.8, 0],
  [-0.8, -0.8, -0.8],
  [0.8, 0.8, 0],
  [-0.8, 0.8, 0.8],
  [0.8, -0.8, 0],
  [0.7, 0, -0.7],
  [-0.7, 0, 0],
  [0, 0.7, 0.7],
  [0, -0.7, 0],
  [-0.7, -0.7, -0.7],
  [0.7, 0.7, 0],
  [-0.7, 0.7, 0.7],
  [0.7, -0.7, 0],
  */
];

class FloppyEffect {
  constructor({ id, resolution }) {
    this.id = id;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.resolution = resolution;
    this.gl = this.canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    const gl = this.gl;

    console.log(
      `max textures is ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}`
    );

    this.ambientLightColor = [0.5, 0.5, 0.5, 1];
    this.lightColor = [3.0, 3.0, 3.0];

    this.beat = false;
    this.beatId = undefined;
    this.beatStart = 0;
    this.beatLength = 400;
    this.beatCounter = 0;

    this.hit = false;
    this.hitId = undefined;

    this.shakeId = "";
    this.shakeCounter = 0;

    this.complexShaderProgram = new ProgramInfo({
      gl: this.gl,
      vertexShaderId: "complex-vertex-shader",
      fragmentShaderId: "complex-fragment-shader",
      attributes: [
        "vertexPosition",
        "textureCoord",
        "vertexNormal",
        "vertexTangent",
        "vertexBitangent",
      ],
      uniforms: [
        "worldViewProjectionMatrix",
        "projectionMatrix",
        "viewMatrix",
        "worldMatrix",
        "lightPosition",
        "eyePosition",
        "directionalLightColor",
        "ambientLightColor",
        "colorSampler",
        "normalSampler",
        "specularSampler",
        "metalSampler",
        "cubeSampler",
      ],
    });

    this.simpleNoLightsShaderProgram = new ProgramInfo({
      gl: this.gl,
      vertexShaderId: "simple-no-lights-vertex-shader",
      fragmentShaderId: "simple-no-lights-fragment-shader",
      attributes: ["vertexPosition", "textureCoord"],
      uniforms: [
        "worldViewProjectionMatrix",
        "ambientLightColor",
        "colorSampler",
      ],
    });

    const loader = new ResourceLoader();

    const cubeTexture = loader.loadCubeTexture(this.gl, "cube-2");

    const materials = {
      Floppy: new Material({
        name: "Floppy",
        shaderProgram: this.complexShaderProgram,
        textures: {
          color: loader.loadTexture(this.gl, "floppy", "FloppyColors.png"),
          normal: loader.loadTexture(this.gl, "floppy", "FloppyNormals.png"),
          specular: loader.loadTexture(this.gl, "floppy", "FloppySpecular.png"),
          metal: loader.loadTexture(this.gl, "floppy", "FloppyMetal.png"),
          cube: cubeTexture,
        },
      }),
      Room: new Material({
        name: "Room",
        shaderProgram: this.simpleNoLightsShaderProgram,
        textures: {
          color: loader.loadTexture(this.gl, "room", "RoomColors.png"),
          //color: loader.loadTexture(this.gl, "room", "SkyColors.png"),
          //color: loader.loadTexture(this.gl, "room", "RoomAO.png"),
        },
      }),
    };

    this.geometry = {};

    this.geometry.floppy = new Geometry(this.createFloppyGeometry(), materials);
    this.geometry.floppy.createBuffers(this.gl);

    this.geometry.room = new Geometry(this.createRoomGeometry(), materials);
    this.geometry.room.createBuffers(this.gl);

    this.screenMaterial = new Material({
      shaderProgram: new ProgramInfo({
        gl: this.gl,
        vertexShaderId: "flat-vertex-shader",
        fragmentShaderId: "alpha-fragment-shader",
        attributes: ["vertexPosition", "textureCoord"],
        uniforms: ["colorSampler", "color"],
      }),
      textures: {
        color: WebGLUtils.createTexture(
          this.gl,
          this.canvas.width,
          this.canvas.height
        ),
      },
    });
    this.screenMesh = this.createPlaneMesh(this.screenMaterial);
    this.screenMesh.createBuffers(this.gl);

    this.objects = [
      {
        model: "floppy",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0.0007, y: 0.0006, z: 0.0005 },
      },
      {
        model: "floppy",
        position: { x: 2, y: 0, z: 2 },
        rotation: { x: 0.0005, y: 0.0006, z: 0.0007 },
      },
      {
        model: "floppy",
        position: { x: -2, y: 0, z: 2 },
        rotation: { x: 0.0002, y: 0.0003, z: 0.0004 },
      },
      {
        model: "floppy",
        position: { x: 0, y: -2, z: 2 },
        rotation: { x: 0.0002, y: 0.0003, z: 0.0004 },
      },
    ];
    /*
    for (let i = 0; i < 10; i++) {
      const object = {
        model: "floppy",
        position: {
          x: (Math.random() * 2 - Math.random() * 2) * 3,
          y: (Math.random() * 2 - Math.random() * 2) * 3,
          z: (Math.random() * 2 - Math.random() * 2) * 3,
        },
        rotation: {
          x: Math.random() / 1000,
          y: Math.random() / 1000,
          z: Math.random() / 1000,
        },
      };
      if (object.position.x > 0 && object.position.x < 2) {
        object.position.x += 2;
      }
      this.objects.push(object);
    }
    */

    this.objects.push({
      model: "room",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0.0004, y: 0.0005, z: 0.0006 },
      //rotation: { y: 0.0, x: 0.0, z: 0.0 },
    });

    this.currentMaterial;
    this.currentMesh;

    // Flip image pixels into the bottom-to-top order that WebGL expects.
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

    //this.texture = WebGLUtils.createTexture(gl, this.width, this.height);
    this.framebuffer = gl.createFramebuffer();
    this.depthbuffer = gl.createRenderbuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.screenMaterial.textures.color,
      0
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthbuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      this.canvas.width,
      this.canvas.height
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      this.depthbuffer
    );
  }

  processEvents(events = [], now = 0, delta = 1) {
    this.hit = false;
    this.hitId = undefined;
    this.beat = false;
    this.beatId = undefined;
    this.beatStart = 0;

    events.forEach((event) => {
      switch (event.type) {
        case EVENT_TYPES.HIT:
          if (now - event.start < 100) {
            this.hit = true;
            this.hitId = event.id;
          }
          break;
        case EVENT_TYPES.BEAT:
          if (now - event.start < this.beatLength) {
            this.beat = true;
            this.beatId = event.id;
            this.beatStart = event.start;
            if (this.shakeId !== event.id) {
              this.shakeId = event.id;
              this.shakeCounter = 1.0;
            }
          }
          break;
        case EVENT_TYPES.BG_LIGHT_COLOR:
          {
            const targetColor = lightPalette[event.params.index];
            this.ambientLightColor[0] =
              (this.ambientLightColor[0] * 99 + targetColor[0]) / 100;
            this.ambientLightColor[1] =
              (this.ambientLightColor[1] * 99 + targetColor[1]) / 100;
            this.ambientLightColor[2] =
              (this.ambientLightColor[2] * 99 + targetColor[2]) / 100;
          }
          break;
        case EVENT_TYPES.LIGHT_COLOR: {
          const targetColor = lightPalette[event.params.index];
          this.lightColor[0] = (this.lightColor[0] * 99 + targetColor[0]) / 100;
          this.lightColor[1] = (this.lightColor[1] * 99 + targetColor[1]) / 100;
          this.lightColor[2] = (this.lightColor[2] * 99 + targetColor[2]) / 100;
          break;
        }
        default:
          break;
      }
    });
  }

  render({ canvas, now = 0, delta = 1 /*, x = 0, y = 0, z = 0*/ }) {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    if (
      canvas.width !== this.canvas.width ||
      canvas.height !== this.canvas.height
    ) {
      console.log("FloppyEffect.render resize canvas");
      this.canvas.width = canvas.width;
      this.canvas.height = canvas.height;
      gl.deleteTexture(this.screenMaterial.textures.color);
      this.screenMaterial.textures.color = WebGLUtils.createTexture(
        gl,
        this.canvas.width,
        this.canvas.height
      );
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        this.screenMaterial.textures.color,
        0
      );
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        this.canvas.width,
        this.canvas.height
      );
    }

    let f = 1.0 - (now - this.beatStart) / this.beatLength;

    if (this.shakeCounter > 0) {
      y = Math.sin(this.shakeCounter * 20.0) * 0.02 /* * f*/;
      this.shakeCounter -= 0.1;
    }

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.enable(gl.CULL_FACE); // draw only front facing faces
    //gl.useProgram(this.shaderProgram.program);

    gl.clearColor(
      this.ambientLightColor[0],
      this.ambientLightColor[1],
      this.ambientLightColor[2],
      1.0
    ); // Clear to BG color, fully opaque

    //gl.clearColor(0, 0, 0, 1.0); // Clear to BG color, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, enum src_alpha, enum dst_alpha);

    const frames = BLURS.length - 1;
    const range = 60;
    let j = 0;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear render-to-texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.screenMesh.material.use(gl);
    this.screenMesh.bindBuffersToShaderProgramAttributes(this.gl);

    this.screenMesh.material.shaderProgram.setRGBAUniform(
      "color",
      [0.0, 0.0, 0.0, 1.0]
    );

    this.screenMesh.draw(gl);
    gl.disable(gl.BLEND);

    //gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    for (let i = -range / 2; i <= range / 2; i += range / frames) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      //gl.clear(gl.DEPTH_BUFFER_BIT);
      //const fieldOfView = ((60 + Math.sin(now * 0.0001) * 20.0) * Math.PI) / 180; // in radians
      const fieldOfView = (60 * Math.PI) / 180; // in radians
      const aspect = gl.canvas.width / gl.canvas.height;
      const zNear = 0.1;
      const zFar = 200.0;
      const projectionMatrix = mat4.create();
      // note: glmatrix.js always has the first argument
      // as the destination to receive the result.
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      // Compute the camera's matrix
      //const camera = [0, 0, -3];
      let x = BLURS[j][0] * 0.02;
      let y = BLURS[j][1] * 0.02;
      let z = BLURS[j][2] * 0.02;
      //let x = 0;
      //let y = 0;
      z += 3.0 + Math.sin((now + i) * 0.0003);
      //z += 3.0;
      //y += 3.0;
      //z += 3.0 + Math.sin(now * 0.0003);
      x +=
        Math.cos((now + i) * 0.005) * 1.0 + Math.sin((now + i) * 0.001) * 0.2;
      y +=
        Math.sin((now + i) * 0.003) * 0.1 + Math.sin((now + i) * 0.002) * 0.2;
      //x += Math.cos(now * 0.0005) * 3.0;
      //z += Math.sin(now * 0.0005) * 3.0;

      j = (j + 1) % BLURS.length;

      const tz = Math.cos((now + i) * 0.0003);
      const tx = Math.sin((now + i) * 0.0005) * 0.1;
      const ty = Math.cos((now + i) * 0.0002) * 0.1;

      const camera = [x, y, -z];
      //const camera = [0, 0, 0];
      const target = [tx, ty, tz];
      //const target = [0, 0, 0];
      const up = [0, 1, 0];

      const cameraMatrix = mat4.create();
      mat4.targetTo(cameraMatrix, camera, target, up);

      const viewMatrix = mat4.create();
      mat4.inverse(viewMatrix, cameraMatrix);

      const viewProjectionMatrix = mat4.create();
      mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

      this.currentMaterial = undefined;
      this.currentMesh = undefined;

      this.objects.forEach((object) => {
        this.geometry[object.model].meshes.forEach((mesh) => {
          if (this.currentMaterial !== mesh.material) {
            mesh.material.use(gl);
            this.currentMaterial = mesh.material;
          }

          //mesh.material.shaderProgram.setMatrixUniform("viewMatrix", viewMatrix);

          mesh.material.shaderProgram.setVertex3Uniform(
            "lightPosition",
            [0.5, 2.0, 0.0]
          );

          mesh.material.shaderProgram.setVertex3Uniform("eyePosition", camera);

          mesh.material.shaderProgram.setRGBAUniform("directionalLightColor", [
            this.lightColor[0],
            this.lightColor[1],
            this.lightColor[2],
            1.0,
          ]);

          mesh.material.shaderProgram.setRGBAUniform("ambientLightColor", [
            this.ambientLightColor[0] * 0.8,
            this.ambientLightColor[1] * 0.8,
            this.ambientLightColor[2] * 0.8,
            1.0,
          ]);

          // Compute a view projection matrix

          const worldMatrix = mat4.create();

          mat4.translate(
            worldMatrix, // destination matrix
            worldMatrix, // matrix to rotate
            [object.position.x, object.position.y, object.position.z]
          );

          //if (object.model === "floppy") {
          mat4.rotate(
            worldMatrix, // destination matrix
            worldMatrix, // matrix to rotate
            (now + i) * object.rotation.x, // amount to rotate in radians
            //[0.3, 0.3, 0.3]
            [0.0, 1.0, 0.0]
          );

          mat4.rotate(
            worldMatrix, // destination matrix
            worldMatrix, // matrix to rotate
            (now + i) * object.rotation.y, // amount to rotate in radians
            //[0.3, 0.3, 0.3]
            [1.0, 0.0, 0.0]
          );

          mat4.rotate(
            worldMatrix, // destination matrix
            worldMatrix, // matrix to rotate
            (now + i) * object.rotation.z, // amount to rotate in radians
            //[0.3, 0.3, 0.3]
            [0.0, 0.0, 1.0]
          );
          //}

          const worldViewProjectionMatrix = mat4.create();
          mat4.multiply(
            worldViewProjectionMatrix,
            viewProjectionMatrix,
            worldMatrix
          );

          mesh.material.shaderProgram.setMatrixUniform(
            "worldViewProjectionMatrix",
            worldViewProjectionMatrix
          );

          mesh.material.shaderProgram.setMatrixUniform(
            "worldMatrix",
            worldMatrix
          );

          if (this.currentMesh !== mesh) {
            mesh.bindBuffersToShaderProgramAttributes(gl);
            this.currentMesh = mesh;
          }
          mesh.draw(gl);
        });
      });

      // render texture to screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST); // Enable depth testing
      gl.disable(gl.CULL_FACE); // draw only front facing faces
      //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

      this.screenMesh.material.use(gl);
      this.screenMesh.bindBuffersToShaderProgramAttributes(this.gl);

      this.screenMesh.material.shaderProgram.setRGBAUniform(
        "color",
        //j == 1 ? [0.8, 0.8, 0.8, 1.0] : [1.0, 1.0, 1.0, 1.0 / frames]
        [1.0, 1.0, 1.0, 1.0 / (frames / 2)]
      );

      this.screenMesh.draw(gl);
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.enable(gl.CULL_FACE); // draw only front facing faces
    }

    /*
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    this.screenMesh.material.use(gl);
    this.screenMesh.bindBuffersToShaderProgramAttributes(this.gl);

    this.screenMesh.material.shaderProgram.setFloatUniform(
      "flicker",
      (Math.sin(now * 300.0) + Math.cos(now * 200.0)) * 0.01
    );

    this.screenMesh.draw(gl);
    */

    //console.log(gl.FRAMEBUFFER_COMPLETE);
    //console.log(gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT);
    //console.log(gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS);
    //console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER));

    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    //WebGLUtils.copyCanvasToTexture(gl, this.canvas, texture);

    return this.canvas;
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

  createRoomGeometry() {
    const size = 5;
    const meshes = parseOBJ(`
    o Room
    v -${size} -${size} ${size}
    v -${size} ${size} ${size}
    v -${size} -${size} -${size}
    v -${size} ${size} -${size}
    v ${size} -${size} ${size}
    v ${size} ${size} ${size}
    v ${size} -${size} -${size}
    v ${size} ${size} -${size}
    vn 1.0 -0.0 -0.0
    vn -0.0 -0.0 1.0
    vn -1.0 -0.0 -0.0
    vn -0.0 -0.0 -1.0
    vn -0.0 1.0 -0.0
    vn -0.0 -1.0 -0.0
    vt 0.5 1.0
    vt 0.0 0.5
    vt 0.0 1.0
    vt 0.5 1.0
    vt 0.0 0.5
    vt 0.0 1.0
    vt 0.5 1.0
    vt 0.0 0.5
    vt 0.0 1.0
    vt 0.5 1.0
    vt 0.0 0.5
    vt 0.0 1.0
    vt 0.5 0.5
    vt 1.0 0.0
    vt 0.5 0.0
    vt 0.5 1.0
    vt 1.0 0.5
    vt 0.5 0.5
    vt 0.5 0.5
    vt 0.5 0.5
    vt 0.5 0.5
    vt 0.5 0.5
    vt 1.0 0.5
    vt 1.0 1.0
    s 0
    usemtl Room
    f 3/1/1 2/2/1 1/3/1
    f 7/4/2 4/5/2 3/6/2
    f 5/7/3 8/8/3 7/9/3
    f 1/10/4 6/11/4 5/12/4
    f 1/13/5 7/14/5 3/15/5
    f 6/16/6 4/17/6 8/18/6
    f 3/1/1 4/19/1 2/2/1
    f 7/4/2 8/20/2 4/5/2
    f 5/7/3 6/21/3 8/8/3
    f 1/10/4 2/22/4 6/11/4
    f 1/13/5 5/23/5 7/14/5
    f 6/16/6 2/24/6 4/17/6 
    `);
    return meshes;
  }

  createFloppyGeometry() {
    const meshes = parseOBJ(`
    o Floppy
    v 0.996603 -0.832859 -0.037270
    v 0.903339 -0.583037 -0.031835
    v -0.893827 -0.580522 -0.034351
    v -0.993732 -0.832859 -0.037270
    v 0.895352 -0.583824 -0.031835
    v -0.984134 -0.831914 -0.037270
    v -0.902306 -0.581357 -0.034351
    v 0.887671 -0.586154 -0.031835
    v -0.974905 -0.829115 -0.037270
    v -0.966400 -0.824568 -0.037270
    v 0.880592 -0.589938 -0.031835
    v -0.910459 -0.583830 -0.034351
    v 0.874388 -0.595029 -0.031835
    v -0.958944 -0.818450 -0.037270
    v -0.952826 -0.810995 -0.037270
    v -0.917972 -0.587846 -0.034351
    v 0.869296 -0.601234 -0.031835
    v -0.924558 -0.593251 -0.034351
    v 0.865512 -0.608313 -0.031835
    v -0.948280 -0.802489 -0.037270
    v 0.863182 -0.615993 -0.031835
    v -0.929963 -0.599836 -0.034351
    v 0.862395 -0.623981 -0.031835
    v -0.945480 -0.793260 -0.037270
    v 0.863182 -0.631969 -0.031835
    v -0.933979 -0.607350 -0.034351
    v -0.841706 0.772436 0.046805
    v 0.865512 -0.639650 -0.031835
    v -0.944535 -0.783662 -0.037270
    v 0.869296 -0.646729 -0.031835
    v -0.936452 -0.615503 -0.034351
    v -0.841706 0.850204 0.046805
    v 0.874388 -0.652933 -0.031835
    v -0.939403 0.850204 0.046805
    v -0.937287 -0.623981 -0.034351
    v 0.880592 -0.658025 -0.031835
    v -0.945480 -0.774064 -0.037270
    v -0.939403 0.772411 0.046805
    v 0.887671 -0.661809 -0.031835
    v -0.936452 -0.632460 -0.034351
    v -0.841706 0.772436 -0.053287
    v 0.895352 -0.664139 -0.031835
    v -0.841706 0.850204 -0.053287
    v -0.933979 -0.640613 -0.034351
    v 0.903339 -0.664925 -0.031835
    v -0.948280 -0.764835 -0.037270
    v -0.929963 -0.648126 -0.034351
    v 0.911327 -0.664139 -0.031835
    v -0.939403 0.850204 -0.053287
    v 0.996603 -0.734465 -0.037270
    v -0.924558 -0.654712 -0.034351
    v 0.919008 -0.661809 -0.031835
    v -0.939403 0.772411 -0.053287
    v -0.952826 -0.756330 -0.037270
    v 0.926087 -0.658025 -0.031835
    v -0.917972 -0.660117 -0.034351
    v 0.987005 -0.735411 -0.037270
    v 0.932291 -0.652933 -0.031835
    v -0.910459 -0.664133 -0.034351
    v 0.937383 -0.646729 -0.031835
    v 0.977776 -0.738210 -0.037270
    v 0.941167 -0.639650 -0.031835
    v -0.958944 -0.748875 -0.037270
    v -0.902306 -0.666606 -0.034351
    v 0.943497 -0.631969 -0.031835
    v 0.969271 -0.742756 -0.037270
    v 0.944283 -0.623981 -0.031835
    v -0.893827 -0.667441 -0.034351
    v 0.943497 -0.615993 -0.031835
    v -0.966400 -0.742756 -0.037270
    v 0.941167 -0.608313 -0.031835
    v -0.885349 -0.666606 -0.034351
    v 0.961816 -0.748875 -0.037270
    v 0.937383 -0.601234 -0.031835
    v -0.877196 -0.664133 -0.034351
    v 0.932291 -0.595029 -0.031835
    v 0.955697 -0.756330 -0.037270
    v -0.869683 -0.660117 -0.034351
    v -0.974905 -0.738210 -0.037270
    v 0.926087 -0.589938 -0.031835
    v -0.863097 -0.654712 -0.034351
    v 0.919008 -0.586154 -0.031835
    v 0.951151 -0.764835 -0.037270
    v 0.911327 -0.583824 -0.031835
    v -0.984134 -0.735411 -0.037270
    v -0.857692 -0.648126 -0.034351
    v 0.948351 -0.774064 -0.037270
    v -0.853676 -0.640613 -0.034351
    v -0.851203 -0.632460 -0.034351
    v -0.993732 -0.734465 -0.037270
    v 0.947406 -0.783662 -0.037270
    v -0.850368 -0.623981 -0.034351
    v 0.948351 -0.793260 -0.037270
    v -0.851203 -0.615503 -0.034351
    v -0.853676 -0.607350 -0.034351
    v 0.951151 -0.802489 -0.037270
    v -0.857692 -0.599836 -0.034351
    v 0.955697 -0.810995 -0.037270
    v -0.863097 -0.593251 -0.034351
    v -0.869683 -0.587846 -0.034351
    v 0.961816 -0.818450 -0.037270
    v -0.877196 -0.583830 -0.034351
    v -0.885349 -0.581357 -0.034351
    v 0.969271 -0.824568 -0.037270
    v 0.977776 -0.829115 -0.037270
    v 0.987005 -0.831914 -0.037270
    v -0.995567 0.946345 -0.053287
    v 0.985601 0.959213 0.046805
    v 0.985601 0.959213 -0.053287
    v 0.878157 -0.997195 0.046805
    v 0.879319 -1.000000 0.044000
    v 0.997195 -0.878157 0.046805
    v 1.000000 -0.879319 0.044000
    v 0.996601 -0.878752 -0.053287
    v 1.000000 -0.879319 -0.050482
    v 0.878157 -0.997195 -0.053287
    v 0.879319 -1.000000 -0.050482
    v 0.780248 -1.000000 -0.050482
    v 0.783053 -0.997195 -0.053287
    v 0.545871 -0.997195 -0.053287
    v 0.548676 -0.994484 -0.044966
    v 0.577517 -0.940964 -0.050482
    v 0.578608 -0.938159 -0.053287
    v 0.545871 -0.938159 -0.053287
    v 0.548676 -0.940376 -0.044966
    v 0.780248 -0.980525 -0.050482
    v 0.783053 -0.977720 -0.053287
    v 0.621099 -0.977720 -0.053287
    v 0.621099 -0.980525 -0.050482
    v 0.621783 -0.977720 -0.053287
    v 0.620692 -0.980525 -0.050482
    v 0.545871 -0.997195 0.046805
    v 0.548676 -0.994484 0.038484
    v 0.577517 -0.940964 0.044000
    v 0.578608 -0.938159 0.046805
    v 0.545871 -0.938159 0.046805
    v 0.548676 -0.940376 0.038484
    v 0.783053 -0.977720 0.046805
    v 0.780248 -0.980525 0.044000
    v 0.783053 -0.997195 0.046805
    v 0.780248 -1.000000 0.044000
    v 0.621099 -0.977720 0.046805
    v 0.621099 -0.980525 0.044000
    v 0.621783 -0.977720 0.046805
    v 0.620692 -0.980525 0.044000
    v -0.824493 -0.997195 -0.053287
    v -0.821688 -1.000000 -0.050482
    v -0.510822 -0.996090 -0.044127
    v -0.508017 -0.997195 -0.053287
    v -0.824493 -0.974473 -0.053287
    v -0.821688 -0.977278 -0.050482
    v -0.510822 -0.977777 -0.044127
    v -0.508017 -0.974473 -0.053287
    v -0.691107 -0.974473 -0.053287
    v -0.691107 -0.977278 -0.050482
    v -0.824493 -0.974473 0.046805
    v -0.821688 -0.977278 0.044000
    v -0.824493 -0.997195 0.046805
    v -0.821688 -1.000000 0.044000
    v -0.508017 -0.974473 0.046805
    v -0.510822 -0.977777 0.037645
    v -0.508017 -0.997195 0.046805
    v -0.510822 -0.996090 0.037645
    v -0.691107 -0.974473 0.046805
    v -0.691107 -0.977278 0.044000
    v -1.000000 -0.835047 0.044000
    v -0.997195 -0.835337 0.046805
    v -0.997204 -0.832518 0.044000
    v -1.000000 -0.732278 0.044000
    v -0.997204 -0.734807 0.044000
    v -0.997195 -0.731988 0.046805
    v -1.000000 -0.835047 -0.040075
    v -0.997204 -0.832518 -0.037270
    v -1.000000 -0.732278 -0.040075
    v -0.997204 -0.734807 -0.037270
    v -0.993732 -0.731647 0.046805
    v -0.993732 -0.734465 0.044000
    v -0.993732 -0.835678 0.046805
    v -0.993732 -0.832859 0.044000
    v -0.984134 -0.735411 0.044000
    v -0.983584 -0.732646 0.046805
    v -0.983584 -0.834679 0.046805
    v -0.984134 -0.831914 0.044000
    v -0.973826 -0.831719 0.046805
    v -0.974905 -0.829115 0.044000
    v -0.964834 -0.826912 0.046805
    v -0.966400 -0.824568 0.044000
    v -0.966400 -0.742756 0.044000
    v -0.964972 -0.740321 0.046805
    v -0.973750 -0.735629 0.046805
    v -0.974905 -0.738210 0.044000
    v -0.950482 -0.812561 0.046805
    v -0.952826 -0.810995 0.044000
    v -0.950482 -0.754764 0.046805
    v -0.952826 -0.756330 0.044000
    v -0.941716 -0.783662 0.046805
    v -0.944535 -0.783662 0.044000
    v -0.945480 -0.793260 0.044000
    v -0.942716 -0.793810 0.046805
    v -0.942716 -0.773515 0.046805
    v -0.945480 -0.774064 0.044000
    v -0.945676 -0.803568 0.046805
    v -0.948280 -0.802489 0.044000
    v -0.945676 -0.763757 0.046805
    v -0.948280 -0.764835 0.044000
    v -0.956951 -0.820443 0.046805
    v -0.958944 -0.818450 0.044000
    v -0.956900 -0.746944 0.046805
    v -0.958944 -0.748875 0.044000
    v 1.000000 -0.835330 -0.040075
    v 0.997204 -0.832800 -0.037270
    v 1.000000 -0.835330 0.044000
    v 0.997204 -0.832800 0.044000
    v 0.997195 -0.835620 0.046805
    v 0.996601 -0.731646 0.046805
    v 0.997204 -0.734524 0.044000
    v 1.000000 -0.731995 0.044000
    v 1.000000 -0.731995 -0.040075
    v 0.997204 -0.734524 -0.037270
    v 0.944854 -0.786367 0.046805
    v 0.947406 -0.783662 0.044000
    v 0.951151 -0.802489 0.044000
    v 0.948547 -0.803568 0.046805
    v 0.945587 -0.793810 0.046805
    v 0.948351 -0.793260 0.044000
    v 0.946603 -0.768825 0.046805
    v 0.948351 -0.774064 0.044000
    v 0.959822 -0.820443 0.046805
    v 0.961816 -0.818450 0.044000
    v 0.953354 -0.812561 0.046805
    v 0.955697 -0.810995 0.044000
    v 0.953354 -0.754764 0.046805
    v 0.955697 -0.756330 0.044000
    v 0.947643 -0.765448 0.046805
    v 0.951151 -0.764835 0.044000
    v 0.967705 -0.740413 0.046805
    v 0.969271 -0.742756 0.044000
    v 0.976698 -0.831719 0.046805
    v 0.977776 -0.829115 0.044000
    v 0.976698 -0.735606 0.046805
    v 0.977776 -0.738210 0.044000
    v 0.996603 -0.832859 0.044000
    v 0.996603 -0.835678 0.046805
    v 0.996603 -0.731647 0.046805
    v 0.996603 -0.734465 0.044000
    v 0.986455 -0.732646 0.046805
    v 0.987005 -0.735411 0.044000
    v 0.967705 -0.826912 0.046805
    v 0.969271 -0.824568 0.044000
    v 0.986455 -0.834679 0.046805
    v 0.987005 -0.831914 0.044000
    v 0.959822 -0.746882 0.046805
    v 0.961816 -0.748875 0.044000
    v -0.997195 -0.945090 0.046805
    v -1.000000 -0.945648 0.044000
    v -0.989800 -0.970272 0.044000
    v -0.987422 -0.968683 0.046805
    v -0.970272 -0.989800 0.044000
    v -0.968683 -0.987422 0.046805
    v -0.945090 -0.997195 0.046805
    v -0.945648 -1.000000 0.044000
    v -0.945090 0.997195 0.046805
    v -0.945648 1.000000 0.044000
    v -0.970272 0.989800 0.044000
    v -0.968683 0.987422 0.046805
    v -0.989800 0.970272 0.044000
    v -1.000928 0.936077 0.046805
    v -0.988607 0.967499 0.046805
    v -1.000000 0.945648 0.044000
    v -0.997195 0.942717 0.046805
    v -0.995494 0.949197 0.046805
    v -0.997855 0.948825 0.046805
    v -0.994525 0.943117 0.046805
    v -0.945648 -1.000000 -0.050482
    v -0.945090 -0.997195 -0.053287
    v -0.968683 -0.987422 -0.053287
    v -0.970272 -0.989800 -0.050482
    v -0.987422 -0.968683 -0.053287
    v -0.989800 -0.970272 -0.050482
    v -0.998451 -0.942058 -0.053287
    v -1.000000 -0.945648 -0.050482
    v -1.000000 0.945648 -0.050482
    v -0.998501 0.945884 -0.053287
    v -0.989800 0.970272 -0.050482
    v -0.991481 0.963299 -0.053287
    v -0.966508 0.988323 -0.053287
    v -0.970272 0.989800 -0.050482
    v -0.945090 0.997195 -0.053287
    v -0.945648 1.000000 -0.050482
    v 1.000000 0.945648 0.044000
    v 0.996577 0.948873 0.046805
    v 0.989800 0.970272 0.044000
    v 0.988775 0.967574 0.046805
    v 0.969083 0.987256 0.046805
    v 0.970272 0.989800 0.044000
    v 0.945090 0.997195 0.046805
    v 0.945648 1.000000 0.044000
    v 0.945090 0.997195 -0.053287
    v 0.945648 1.000000 -0.050482
    v 0.969083 0.987256 -0.053287
    v 0.970272 0.989800 -0.050482
    v 0.989800 0.970272 -0.050482
    v 0.988775 0.967574 -0.053287
    v 1.000000 0.945648 -0.050482
    v 0.996577 0.948873 -0.053287
    v -0.937287 -0.623981 0.044000
    v -0.940106 -0.623981 0.046805
    v -0.939216 -0.633010 0.046805
    v -0.936452 -0.632460 0.044000
    v -0.939216 -0.614953 0.046805
    v -0.936452 -0.615503 0.044000
    v -0.932306 -0.649692 0.046805
    v -0.929963 -0.648126 0.044000
    v -0.936583 -0.606271 0.046805
    v -0.933979 -0.607350 0.044000
    v -0.936583 -0.641691 0.046805
    v -0.933979 -0.640613 0.044000
    v -0.932306 -0.598271 0.046805
    v -0.929963 -0.599836 0.044000
    v -0.917972 -0.660117 0.044000
    v -0.919400 -0.662553 0.046805
    v -0.926551 -0.591258 0.046805
    v -0.924558 -0.593251 0.044000
    v -0.902812 -0.578579 0.046805
    v -0.902306 -0.581357 0.044000
    v -0.902856 -0.669370 0.046805
    v -0.902306 -0.666606 0.044000
    v -0.911537 -0.581226 0.046805
    v -0.910459 -0.583830 0.044000
    v -0.911614 -0.666714 0.046805
    v -0.910459 -0.664133 0.044000
    v -0.919538 -0.585502 0.046805
    v -0.917972 -0.587846 0.044000
    v -0.926602 -0.656642 0.046805
    v -0.924558 -0.654712 0.044000
    v -0.884799 -0.669370 0.046805
    v -0.885349 -0.666606 0.044000
    v -0.884755 -0.578606 0.046805
    v -0.885349 -0.581357 0.044000
    v -0.868117 -0.662460 0.046805
    v -0.869683 -0.660117 0.044000
    v -0.869683 -0.587846 0.044000
    v -0.868117 -0.585502 0.046805
    v -0.876118 -0.666737 0.046805
    v -0.877196 -0.664133 0.044000
    v -0.877196 -0.583830 0.044000
    v -0.876118 -0.581226 0.046805
    v -0.857692 -0.648126 0.044000
    v -0.855348 -0.649692 0.046805
    v -0.855348 -0.598271 0.046805
    v -0.857692 -0.599836 0.044000
    v -0.847549 -0.623981 0.046805
    v -0.850368 -0.623981 0.044000
    v -0.848438 -0.614953 0.046805
    v -0.851203 -0.615503 0.044000
    v -0.848438 -0.633010 0.046805
    v -0.851203 -0.632460 0.044000
    v -0.851072 -0.606271 0.046805
    v -0.853676 -0.607350 0.044000
    v -0.851072 -0.641691 0.046805
    v -0.853676 -0.640613 0.044000
    v -0.863097 -0.654712 0.044000
    v -0.861104 -0.656705 0.046805
    v -0.861104 -0.591258 0.046805
    v -0.863097 -0.593251 0.044000
    v -0.893827 -0.670259 0.046805
    v -0.893827 -0.667441 0.044000
    v -0.893827 -0.580522 0.044000
    v -0.893922 -0.577703 0.046805
    v 0.842894 -0.623981 0.044058
    v 0.839370 -0.623981 0.046805
    v 0.840210 -0.632519 0.046805
    v 0.843681 -0.631969 0.044057
    v 0.840210 -0.615444 0.046805
    v 0.843681 -0.615993 0.044057
    v 0.846745 -0.648295 0.046805
    v 0.849797 -0.646729 0.044049
    v 0.846745 -0.599668 0.046805
    v 0.849797 -0.601234 0.044049
    v 0.842701 -0.640729 0.046805
    v 0.846012 -0.639650 0.044054
    v 0.842701 -0.607234 0.046805
    v 0.846012 -0.608313 0.044054
    v 0.858819 -0.660369 0.046805
    v 0.861096 -0.658025 0.044036
    v 0.861096 -0.589938 0.044036
    v 0.858819 -0.587594 0.046805
    v 0.874595 -0.666903 0.046805
    v 0.875859 -0.664139 0.044026
    v 0.874595 -0.581059 0.046805
    v 0.875859 -0.583824 0.044026
    v 0.866385 -0.664413 0.046805
    v 0.868177 -0.661809 0.044031
    v 0.868177 -0.586154 0.044031
    v 0.866385 -0.583550 0.046805
    v 0.852187 -0.654926 0.046805
    v 0.854890 -0.652933 0.044043
    v 0.852187 -0.593036 0.046805
    v 0.854890 -0.595029 0.044043
    v 0.911780 -0.666932 0.046805
    v 0.911327 -0.664139 0.044000
    v 0.911013 -0.583778 0.044022
    v 0.911146 -0.580989 0.046805
    v 0.883449 -0.664910 0.044000
    v 0.883625 -0.667695 0.046805
    v 0.883043 -0.580227 0.046805
    v 0.883847 -0.583037 0.044023
    v 0.911632 -0.664046 0.044000
    v 0.912520 -0.666708 0.046805
    v 0.911884 -0.581062 0.046805
    v 0.911327 -0.583824 0.044000
    v 0.927653 -0.660369 0.046805
    v 0.926087 -0.658025 0.044000
    v 0.927653 -0.587594 0.046805
    v 0.926087 -0.589938 0.044000
    v 0.919008 -0.661809 0.044000
    v 0.920087 -0.664413 0.046805
    v 0.920087 -0.583550 0.046805
    v 0.919008 -0.586154 0.044000
    v 0.937383 -0.646729 0.044000
    v 0.939727 -0.648295 0.046805
    v 0.939727 -0.599668 0.046805
    v 0.937383 -0.601234 0.044000
    v 0.947102 -0.623981 0.046805
    v 0.944283 -0.623981 0.044000
    v 0.946261 -0.632519 0.046805
    v 0.943497 -0.631969 0.044000
    v 0.946261 -0.615444 0.046805
    v 0.943497 -0.615993 0.044000
    v 0.943771 -0.640729 0.046805
    v 0.941167 -0.639650 0.044000
    v 0.943771 -0.607234 0.046805
    v 0.941167 -0.608313 0.044000
    v 0.932291 -0.652933 0.044000
    v 0.934284 -0.654926 0.046805
    v 0.932291 -0.595029 0.044000
    v 0.934284 -0.593036 0.046805
    v 0.883132 -0.667744 0.046805
    v 0.883847 -0.664925 0.044023
    v 0.548676 -0.940964 -0.050482
    v 0.548676 -1.000000 -0.050482
    v 0.548676 -1.000000 0.044000
    v 0.548676 -0.940964 0.044000
    v 0.461052 -0.940376 -0.044966
    v 0.461052 -0.994484 -0.044966
    v 0.461052 -0.994484 0.038484
    v 0.461052 -0.940376 0.038484
    v -0.510822 -0.977278 0.044000
    v -0.510822 -1.000000 0.044000
    v -0.510822 -1.000000 -0.050482
    v -0.510822 -0.977278 -0.050482
    v -0.476256 -0.977777 0.037645
    v -0.476256 -0.996090 0.037645
    v -0.476256 -0.996090 -0.044127
    v -0.476256 -0.977777 -0.044127
    vn 0.9239 0.3827 -0.0000
    vn -1.0000 -0.0000 -0.0000
    vn -0.0000 1.0000 -0.0000
    vn 0.0980 -0.9952 -0.0000
    vn -0.7071 0.7071 -0.0000
    vn -0.3827 -0.9239 -0.0000
    vn -0.0000 -1.0000 -0.0000
    vn 1.0000 -0.0000 -0.0000
    vn -0.6756 -0.7373 -0.0000
    vn -0.9239 0.3827 -0.0000
    vn 0.3827 0.9239 -0.0000
    vn -0.0003 1.0000 -0.0000
    vn 0.0980 0.9952 -0.0000
    vn -0.2903 -0.9569 -0.0000
    vn -0.4714 0.8819 -0.0000
    vn -0.6344 0.7730 -0.0000
    vn -0.4714 -0.8819 -0.0000
    vn -0.7730 -0.6344 -0.0000
    vn -0.7730 0.6344 -0.0000
    vn -0.9569 -0.2903 -0.0000
    vn -0.9569 0.2903 -0.0000
    vn -0.9952 0.0980 -0.0000
    vn -0.0000 -0.0000 1.0000
    vn -0.9952 -0.0980 -0.0000
    vn -0.8819 -0.4714 -0.0000
    vn -0.8819 0.4714 -0.0000
    vn -0.6344 -0.7730 -0.0000
    vn -0.2903 0.9569 -0.0000
    vn -0.0980 0.9952 -0.0000
    vn -0.0980 -0.9952 -0.0000
    vn 0.9952 0.0980 -0.0000
    vn -0.9239 -0.3827 -0.0000
    vn 0.6344 -0.7730 -0.0000
    vn 0.4714 0.8819 -0.0000
    vn 0.4714 -0.8819 -0.0000
    vn 0.7730 -0.6344 -0.0000
    vn 0.6344 0.7730 -0.0000
    vn 0.8819 0.4714 -0.0000
    vn 0.9952 -0.0980 -0.0000
    vn 0.9569 -0.2903 -0.0000
    vn 0.9569 0.2903 -0.0000
    vn 0.8819 -0.4714 -0.0000
    vn 0.7730 0.6344 -0.0000
    vn 0.2903 0.9569 -0.0000
    vn -0.0978 0.9952 -0.0000
    vn 0.2903 -0.9569 -0.0000
    vn -0.0000 -0.0000 -1.0000
    vn 0.7071 0.7071 -0.0000
    vn -0.7071 -0.7071 -0.0000
    vn -0.3827 0.9239 -0.0000
    vn 0.7071 -0.7071 -0.0000
    vn -0.0981 -0.9952 -0.0000
    vn 0.9642 0.0950 0.2477
    vn -0.2901 0.9570 -0.0000
    vn 0.0980 -0.9949 0.0252
    vn 0.0980 0.9949 0.0252
    vn 0.4680 -0.8755 0.1202
    vn 0.4680 0.8755 0.1203
    vn 0.7582 -0.6222 0.1948
    vn 0.7582 0.6222 0.1948
    vn 0.9293 0.2819 0.2388
    vn 0.9642 -0.0950 0.2477
    vn 0.9293 -0.2819 0.2388
    vn 0.8601 -0.4597 0.2210
    vn 0.8601 0.4597 0.2210
    vn 0.6261 -0.7629 0.1609
    vn 0.6261 0.7629 0.1609
    vn 0.2895 -0.9543 0.0744
    vn 0.2895 0.9543 0.0744
    vn -0.0286 -0.9996 -0.0000
    vn -0.0357 -0.9991 -0.0234
    vn -0.5374 0.5939 0.5987
    vn -0.5374 -0.5939 0.5987
    vn 0.5374 0.5939 0.5987
    vn 0.4974 -0.5498 0.6711
    vn -0.7423 0.2911 0.6036
    vn -0.6094 0.1600 0.7765
    vn -0.3333 0.6236 0.7071
    vn -0.6236 0.3333 0.7071
    vn -0.6767 -0.2053 0.7071
    vn -0.5466 0.4486 0.7071
    vn -0.0696 0.7058 0.7050
    vn 0.6236 0.3333 0.7071
    vn -0.4486 0.5466 0.7071
    vn 0.0692 -0.7026 0.7082
    vn -0.0000 -0.7071 0.7071
    vn -0.4777 -0.5213 0.7071
    vn -0.5466 -0.4486 0.7071
    vn 0.7071 -0.0000 -0.7071
    vn -0.0000 -0.7071 -0.7071
    vn -0.7083 -0.0000 0.7060
    vn 0.4113 -0.5004 0.7619
    vn -0.3324 -0.6218 0.7092
    vn -0.7037 0.0693 0.7071
    vn -0.7037 -0.0693 0.7071
    vn -0.4499 -0.5482 0.7050
    vn 0.7071 -0.0000 0.7071
    vn -0.6767 0.2053 0.7071
    vn 0.6767 0.2053 0.7071
    vn -0.7071 -0.0000 0.7071
    vn -0.0692 0.7037 0.7072
    vn 0.3333 0.6236 0.7071
    vn 0.2053 0.6767 0.7071
    vn -0.6533 -0.2706 0.7071
    vn -0.2706 0.6533 0.7071
    vn -0.8754 -0.0000 -0.4835
    vn -0.2706 0.6533 -0.7071
    vn -0.0000 0.7071 0.7071
    vn 0.5150 0.5150 -0.6853
    vn 0.7037 0.0693 0.7071
    vn 0.7037 -0.0693 0.7071
    vn 0.6236 -0.3333 0.7071
    vn 0.4486 -0.5466 0.7071
    vn -0.2053 -0.6766 0.7071
    vn -0.0694 -0.7048 0.7060
    vn 0.6135 0.0604 0.7873
    vn 0.6135 -0.0604 0.7873
    vn 0.5526 -0.2949 0.7795
    vn 0.3117 -0.5832 0.7501
    vn 0.4909 -0.4029 0.7725
    vn -0.0192 -0.7057 0.7083
    vn -0.0692 -0.7029 0.7079
    vn -0.2053 -0.6767 0.7071
    vn 0.5000 -0.5000 0.7071
    vn -0.4777 -0.5213 -0.7071
    vn -0.0692 -0.7038 0.7070
    vn -0.0000 0.7072 0.7071
    vn -0.2053 0.6767 0.7071
    vn 0.6709 -0.7415 -0.0000
    vn 0.2053 -0.6767 0.7071
    vn 0.5466 -0.4486 0.7071
    vn -0.5000 -0.5000 0.7071
    vn -0.5000 0.5000 0.7071
    vn -0.2706 -0.6533 -0.7071
    vn -0.8413 0.3391 -0.4210
    vn 0.5466 0.4486 0.7071
    vn 0.6365 -0.0000 0.7713
    vn 0.2706 0.6533 0.7071
    vn -0.0000 0.7071 -0.7071
    vn 0.7534 0.3143 -0.5776
    vn 0.3333 -0.6236 0.7071
    vn 0.5929 0.1799 0.7849
    vn 0.1972 0.6487 0.7351
    vn -0.7071 -0.0000 -0.7071
    vn -0.6709 0.7415 -0.0000
    vn 0.0693 0.7037 0.7071
    vn -0.0693 -0.7037 0.7071
    vn 0.6315 -0.1916 0.7514
    vn -0.2706 -0.6533 0.7071
    vn 0.6533 -0.2706 -0.7071
    vn -0.5000 -0.5000 -0.7071
    vn -0.4250 0.4241 -0.7997
    vn 0.7613 0.3154 0.5665
    vn 0.6767 -0.2053 0.7071
    vn -0.3333 -0.6236 0.7071
    vn -0.6236 -0.3333 0.7071
    vn -0.4486 -0.5466 0.7071
    vn 0.5929 -0.1799 0.7849
    vn 0.1972 -0.6487 0.7351
    vn 0.0681 -0.6916 0.7191
    vn 0.5000 -0.5000 -0.7071
    vn 0.4909 0.4029 0.7725
    vn -0.6709 -0.7415 -0.0000
    vn 0.0693 -0.7037 0.7071
    vn -0.0693 0.7037 0.7071
    vn 0.6709 0.7415 -0.0000
    vn 0.7082 -0.0000 0.7060
    vn 0.7730 -0.0761 0.6299
    vn 0.4486 0.5466 0.7071
    vn -0.6533 -0.2706 -0.7071
    vn 0.5154 0.5157 0.6844
    vn 0.2706 0.6533 -0.7071
    vn 0.6365 -0.0000 -0.7713
    vn 0.3324 0.6218 0.7091
    vn 0.4499 0.5482 0.7050
    vn 0.0681 0.6916 0.7191
    vn 0.5526 0.2949 0.7795
    vn 0.3117 0.5832 0.7501
    vn 0.4113 0.5004 0.7619
    vn -0.0192 0.7068 0.7071
    vn -0.2053 0.6766 0.7071
    vn -0.0000 -0.0012 1.0000
    vn -0.0981 0.9952 -0.0000
    vn -0.0979 -0.9952 -0.0000
    vn 0.4680 -0.8755 0.1203
    vn -0.0141 -0.5167 0.8560
    vn -0.0980 -0.9949 -0.0252
    vn -0.0277 0.9996 -0.0000
    vn -0.0980 0.9949 -0.0252
    vn 0.0159 -0.7044 -0.7096
    vn 0.0692 -0.7025 0.7083
    vn -0.7082 -0.0000 0.7060
    vn 0.4104 -0.5001 0.7625
    vn -0.3324 -0.6219 0.7091
    vn -0.4499 -0.5482 0.7051
    vn -0.6766 0.2053 0.7071
    vn -0.0695 0.7038 0.7070
    vn -0.8819 -0.0000 -0.4713
    vn 0.5154 0.5157 -0.6844
    vn -0.0694 -0.7049 0.7059
    vn 0.6137 0.0604 0.7872
    vn 0.6137 -0.0604 0.7872
    vn 0.5519 -0.2950 0.7800
    vn 0.3125 -0.5836 0.7495
    vn 0.4917 -0.4029 0.7719
    vn -0.0191 -0.7061 0.7078
    vn -0.0525 -0.7063 0.7060
    vn 0.0475 0.6996 -0.7129
    vn 0.6709 -0.7416 -0.0000
    vn -0.8585 0.3556 -0.3696
    vn 0.6338 -0.0000 0.7735
    vn 0.7613 0.3154 -0.5665
    vn 0.5934 0.1797 0.7846
    vn 0.1966 0.6483 0.7356
    vn -0.6709 0.7416 -0.0000
    vn -0.6766 -0.2053 0.7071
    vn 0.6331 -0.1950 0.7491
    vn -0.6533 0.2706 0.7071
    vn -0.4267 0.4267 -0.7974
    vn 0.7534 0.3143 0.5776
    vn 0.5934 -0.1797 0.7846
    vn 0.1967 -0.6483 0.7355
    vn 0.0684 -0.6919 0.7187
    vn 0.4917 0.4029 0.7719
    vn -0.6709 -0.7416 -0.0000
    vn 0.7749 -0.0773 0.6274
    vn -0.0000 0.7072 -0.7071
    vn 0.5150 0.5150 0.6853
    vn 0.6339 -0.0000 -0.7734
    vn 0.3324 0.6219 0.7091
    vn 0.4498 0.5481 0.7051
    vn 0.0684 0.6919 0.7187
    vn 0.5519 0.2950 0.7800
    vn 0.3125 0.5836 0.7495
    vn 0.4104 0.5001 0.7625
    vn -0.0196 0.7089 0.7051
    vn -0.2052 0.6766 0.7072
    vt 0.499719 0.925127
    vt 0.502239 0.950402
    vt 0.499719 0.950405
    vt 0.560697 0.998873
    vt 0.553017 0.971986
    vt 0.553017 0.998873
    vt 0.373434 0.480171
    vt 0.363552 0.480240
    vt 0.464687 0.067953
    vt 0.486638 0.067504
    vt 0.486638 0.067953
    vt 0.986679 0.925236
    vt 0.991382 0.949819
    vt 0.986557 0.949824
    vt 0.094536 0.507767
    vt 0.094365 0.507768
    vt 0.054199 0.507793
    vt 0.988419 0.999033
    vt 0.982296 0.971745
    vt 0.988420 0.971742
    vt 0.528331 0.998998
    vt 0.553064 0.971921
    vt 0.552975 0.999000
    vt 0.445227 0.045213
    vt 0.448223 0.034268
    vt 0.445227 0.070924
    vt 0.590135 0.972085
    vt 0.600602 0.998598
    vt 0.600602 0.972088
    vt 0.982575 0.925235
    vt 0.511733 0.950389
    vt 0.511737 0.925130
    vt 0.634312 0.910790
    vt 0.606388 0.893631
    vt 0.634193 0.893679
    vt 0.991505 0.925237
    vt 0.993902 0.949816
    vt 0.594954 0.911104
    vt 0.577232 0.893427
    vt 0.594907 0.893775
    vt 0.507066 0.925129
    vt 0.513149 0.950389
    vt 0.507065 0.950396
    vt 0.537919 0.893450
    vt 0.566196 0.911421
    vt 0.537933 0.911420
    vt 0.509056 0.911438
    vt 0.527033 0.893344
    vt 0.527407 0.911447
    vt 0.948749 0.998794
    vt 0.959747 0.971925
    vt 0.960403 0.998794
    vt 0.106727 0.522604
    vt 0.094904 0.522587
    vt 0.812172 0.565629
    vt 0.812651 0.676747
    vt 0.812651 0.565629
    vt 0.560697 0.971986
    vt 0.590343 0.998873
    vt 0.590343 0.971986
    vt 0.609870 0.998600
    vt 0.609870 0.972090
    vt 0.610656 0.971897
    vt 0.874130 0.999024
    vt 0.610578 0.999004
    vt 0.918242 0.998794
    vt 0.974090 0.971925
    vt 0.974746 0.998794
    vt 0.000000 1.000000
    vt 0.011305 0.587022
    vt 0.000000 0.587021
    vt 0.982293 0.999032
    vt 0.951467 0.971757
    vt 0.874658 0.998794
    vt 0.917585 0.971925
    vt 0.464687 0.065022
    vt 0.486638 0.066263
    vt 0.464687 0.066263
    vt 0.464687 0.051369
    vt 0.486638 0.050128
    vt 0.486638 0.051369
    vt 0.464687 0.052611
    vt 0.486638 0.051369
    vt 0.486638 0.052611
    vt 0.486638 0.063781
    vt 0.486638 0.065022
    vt 0.464687 0.062540
    vt 0.486638 0.061299
    vt 0.486638 0.062540
    vt 0.464687 0.053852
    vt 0.486638 0.052611
    vt 0.486638 0.053852
    vt 0.464687 0.060058
    vt 0.486638 0.058816
    vt 0.486638 0.060058
    vt 0.464687 0.056334
    vt 0.486638 0.055093
    vt 0.486638 0.056334
    vt 0.464687 0.057575
    vt 0.486638 0.057575
    vt 0.995214 0.069358
    vt 0.982056 0.057840
    vt 0.985910 0.049695
    vt 0.464687 0.058816
    vt 0.486638 0.057575
    vt 0.486638 0.058816
    vt 0.464687 0.061299
    vt 0.486638 0.061299
    vt 0.464687 0.055093
    vt 0.486638 0.055093
    vt 0.464687 0.063781
    vt 0.486638 0.063781
    vt 0.464687 0.050128
    vt 0.486638 0.048887
    vt 0.486638 0.050128
    vt 0.464687 0.048887
    vt 0.486638 0.047646
    vt 0.486638 0.048887
    vt 0.498974 0.487640
    vt 0.504771 0.069781
    vt 0.513369 0.099827
    vt 0.486638 0.067504
    vt 0.464687 0.067504
    vt 0.460085 0.017518
    vt 0.463087 0.070629
    vt 0.462140 0.488154
    vt 0.994984 0.489296
    vt 0.979725 0.105272
    vt 0.981080 0.103620
    vt 0.443547 0.059658
    vt 0.421767 0.058198
    vt 0.421767 0.059658
    vt 0.487276 0.014061
    vt 0.487276 0.017651
    vt 0.443547 0.069881
    vt 0.421767 0.068421
    vt 0.421767 0.069881
    vt 0.443547 0.052356
    vt 0.421767 0.050896
    vt 0.421767 0.052356
    vt 0.443547 0.066960
    vt 0.421767 0.065500
    vt 0.421767 0.066960
    vt 0.443547 0.050896
    vt 0.421767 0.049435
    vt 0.421767 0.050896
    vt 0.443547 0.053816
    vt 0.421767 0.052356
    vt 0.421767 0.053816
    vt 0.443547 0.065500
    vt 0.421767 0.064039
    vt 0.421767 0.065500
    vt 0.443547 0.062579
    vt 0.421767 0.061118
    vt 0.421767 0.062579
    vt 0.443547 0.058198
    vt 0.421767 0.056737
    vt 0.421767 0.058198
    vt 0.443547 0.056737
    vt 0.421767 0.055277
    vt 0.421767 0.056737
    vt 0.443547 0.061118
    vt 0.421767 0.059658
    vt 0.421767 0.061118
    vt 0.443547 0.055277
    vt 0.421767 0.053816
    vt 0.421767 0.055277
    vt 0.443547 0.064039
    vt 0.421767 0.062579
    vt 0.443547 0.068421
    vt 0.421767 0.066960
    vt 0.421767 0.068421
    vt 0.998044 1.000000
    vt 1.000000 0.587021
    vt 0.998043 0.587022
    vt 0.443547 0.049435
    vt 0.421767 0.047975
    vt 0.421767 0.049435
    vt 0.443547 0.047975
    vt 0.421767 0.046514
    vt 0.421767 0.047975
    vt 0.994030 0.924508
    vt 0.992243 0.924508
    vt 0.482828 0.963094
    vt 0.496788 0.986531
    vt 0.489548 0.996986
    vt 0.502240 0.925128
    vt 0.395886 0.046834
    vt 0.397339 0.065464
    vt 0.395886 0.065464
    vt 0.988420 0.971742
    vt 0.993276 0.999033
    vt 0.988419 0.999033
    vt 0.488041 0.486978
    vt 0.488041 0.488891
    vt 0.488041 0.488798
    vt 0.992251 0.491871
    vt 0.988138 0.498854
    vt 0.501111 0.493810
    vt 0.980592 0.925235
    vt 0.980472 0.949832
    vt 0.449046 0.491871
    vt 0.449046 0.489136
    vt 0.449046 0.491709
    vt 0.500117 0.951155
    vt 0.502033 0.951152
    vt 0.501392 0.951153
    vt 0.498411 0.971943
    vt 0.528424 0.971931
    vt 0.443547 0.046423
    vt 0.421767 0.046514
    vt 0.443547 0.046514
    vt 0.506890 0.048152
    vt 0.510102 0.064300
    vt 0.502694 0.069250
    vt 0.406054 0.046834
    vt 0.407507 0.065464
    vt 0.406054 0.065464
    vt 0.385718 0.046834
    vt 0.387171 0.065464
    vt 0.385718 0.065464
    vt 0.382813 0.046834
    vt 0.384265 0.065464
    vt 0.382813 0.065464
    vt 0.407507 0.046834
    vt 0.408960 0.065464
    vt 0.407507 0.065464
    vt 0.388623 0.046834
    vt 0.390076 0.065464
    vt 0.388623 0.065464
    vt 0.401697 0.046834
    vt 0.403149 0.065464
    vt 0.401697 0.065464
    vt 0.391528 0.046834
    vt 0.392981 0.065464
    vt 0.391528 0.065464
    vt 0.394434 0.046834
    vt 0.395886 0.065464
    vt 0.394434 0.065464
    vt 0.397339 0.046834
    vt 0.398791 0.065464
    vt 0.398791 0.046834
    vt 0.400244 0.065464
    vt 0.398791 0.065464
    vt 0.400244 0.046834
    vt 0.400244 0.065464
    vt 0.392981 0.046834
    vt 0.392981 0.065464
    vt 0.403149 0.046834
    vt 0.404602 0.065464
    vt 0.403149 0.065464
    vt 0.390076 0.046834
    vt 0.404602 0.046834
    vt 0.387171 0.046834
    vt 0.388623 0.065464
    vt 0.387171 0.065464
    vt 0.363929 0.046834
    vt 0.365382 0.065464
    vt 0.363929 0.065464
    vt 0.384265 0.046834
    vt 0.385718 0.065464
    vt 0.384265 0.065464
    vt 0.379908 0.046834
    vt 0.381360 0.065464
    vt 0.379908 0.065464
    vt 0.365382 0.046834
    vt 0.366834 0.065464
    vt 0.365382 0.065464
    vt 0.368287 0.046834
    vt 0.369739 0.065464
    vt 0.368287 0.065464
    vt 0.378455 0.046834
    vt 0.379908 0.065464
    vt 0.378455 0.065464
    vt 0.397351 0.066231
    vt 0.398390 0.046130
    vt 0.398714 0.066231
    vt 0.371192 0.046834
    vt 0.372645 0.065464
    vt 0.371192 0.065464
    vt 0.374097 0.046834
    vt 0.375550 0.065464
    vt 0.374097 0.065464
    vt 0.375550 0.046834
    vt 0.377002 0.065464
    vt 0.372645 0.046834
    vt 0.374097 0.065464
    vt 0.372645 0.065464
    vt 0.369739 0.046834
    vt 0.369739 0.065464
    vt 0.377002 0.046834
    vt 0.377002 0.065464
    vt 0.366834 0.046834
    vt 0.362476 0.046834
    vt 0.363929 0.065464
    vt 0.362476 0.065464
    vt 0.381360 0.046834
    vt 0.515816 0.099650
    vt 0.522238 0.087636
    vt 0.534252 0.094058
    vt 0.384756 0.046130
    vt 0.386120 0.065936
    vt 0.386066 0.065936
    vt 0.407933 0.046130
    vt 0.406001 0.065945
    vt 0.404638 0.065946
    vt 0.390778 0.065945
    vt 0.388846 0.046130
    vt 0.392141 0.065946
    vt 0.405206 0.046130
    vt 0.403649 0.066009
    vt 0.402286 0.066010
    vt 0.393130 0.066009
    vt 0.391573 0.046130
    vt 0.394493 0.066010
    vt 0.402480 0.046130
    vt 0.401742 0.066118
    vt 0.400378 0.066120
    vt 0.395037 0.066118
    vt 0.394300 0.046130
    vt 0.396401 0.066120
    vt 0.396624 0.066210
    vt 0.397026 0.046130
    vt 0.397988 0.066211
    vt 0.399428 0.066231
    vt 0.398065 0.066231
    vt 0.399753 0.046130
    vt 0.400155 0.066210
    vt 0.398791 0.066211
    vt 0.401116 0.046130
    vt 0.400918 0.066170
    vt 0.399555 0.066172
    vt 0.395861 0.066170
    vt 0.395663 0.046130
    vt 0.397224 0.066172
    vt 0.403843 0.046130
    vt 0.402646 0.066061
    vt 0.401283 0.066063
    vt 0.394133 0.066062
    vt 0.392936 0.046130
    vt 0.395496 0.066063
    vt 0.406569 0.046130
    vt 0.404764 0.065968
    vt 0.403401 0.065969
    vt 0.392015 0.065968
    vt 0.390210 0.046130
    vt 0.393378 0.065969
    vt 0.362264 0.065943
    vt 0.367033 0.046130
    vt 0.367033 0.065936
    vt 0.386120 0.046130
    vt 0.390781 0.065972
    vt 0.390988 0.065974
    vt 0.382030 0.046130
    vt 0.383393 0.065936
    vt 0.382030 0.065936
    vt 0.368396 0.046130
    vt 0.369760 0.065936
    vt 0.368396 0.065936
    vt 0.371123 0.046130
    vt 0.372486 0.065936
    vt 0.371123 0.065936
    vt 0.380666 0.046130
    vt 0.382030 0.065936
    vt 0.380666 0.065936
    vt 0.373850 0.046130
    vt 0.375213 0.065936
    vt 0.373850 0.065936
    vt 0.377940 0.046130
    vt 0.379303 0.065936
    vt 0.377940 0.065936
    vt 0.376576 0.046130
    vt 0.377940 0.065936
    vt 0.376576 0.065936
    vt 0.375213 0.046130
    vt 0.372486 0.046130
    vt 0.372486 0.065936
    vt 0.379303 0.046130
    vt 0.369760 0.046130
    vt 0.383393 0.046130
    vt 0.384756 0.065936
    vt 0.367033 0.065936
    vt 0.978684 0.091093
    vt 0.977023 0.104023
    vt 0.960161 0.102749
    vt 0.487274 0.045175
    vt 0.488081 0.045107
    vt 0.487274 0.045804
    vt 0.486638 0.068280
    vt 0.487396 0.067917
    vt 0.421020 0.045213
    vt 0.421020 0.045843
    vt 0.420212 0.045141
    vt 0.995257 0.070750
    vt 0.995407 0.070033
    vt 0.996103 0.070663
    vt 0.993898 0.950545
    vt 0.991577 0.950548
    vt 0.487237 0.488316
    vt 0.488041 0.487592
    vt 0.488041 0.488321
    vt 0.975933 0.088143
    vt 0.978084 0.088502
    vt 0.977694 0.089086
    vt 0.981088 0.091509
    vt 0.981445 0.093662
    vt 0.980504 0.091899
    vt 0.982088 0.101736
    vt 0.982021 0.099554
    vt 0.982709 0.099691
    vt 0.979238 0.090354
    vt 0.967083 0.087375
    vt 0.967005 0.086665
    vt 0.967127 0.086677
    vt 0.984505 0.050598
    vt 0.983956 0.053106
    vt 0.983308 0.052837
    vt 0.522556 0.108191
    vt 0.524643 0.109101
    vt 0.522431 0.108883
    vt 0.891231 0.019324
    vt 0.883780 0.018627
    vt 0.890960 0.018626
    vt 0.901984 0.009472
    vt 0.532811 0.105726
    vt 0.533661 0.103590
    vt 0.534244 0.103980
    vt 0.454585 0.502695
    vt 0.453884 0.507653
    vt 0.453887 0.501997
    vt 0.421360 0.508372
    vt 0.454582 0.508351
    vt 0.463894 0.069935
    vt 0.463084 0.045055
    vt 0.463891 0.045757
    vt 0.960941 0.106627
    vt 0.959893 0.104862
    vt 0.961331 0.106043
    vt 0.487396 0.063781
    vt 0.534243 0.091178
    vt 0.534660 0.093438
    vt 0.533660 0.091568
    vt 0.487396 0.056334
    vt 0.487396 0.057575
    vt 0.487396 0.058816
    vt 0.487396 0.062540
    vt 0.420213 0.034557
    vt 0.421021 0.034268
    vt 0.487396 0.055093
    vt 0.983257 0.055405
    vt 0.620015 0.009607
    vt 0.620714 0.004648
    vt 0.620713 0.010306
    vt 0.995274 0.045542
    vt 0.995422 0.044855
    vt 0.995423 0.045557
    vt 0.113274 0.502909
    vt 0.112571 0.516903
    vt 0.112575 0.502212
    vt 0.990587 0.046475
    vt 0.988080 0.047023
    vt 0.990319 0.045826
    vt 0.992885 0.045778
    vt 0.488083 0.014140
    vt 0.488083 0.017580
    vt 0.952165 0.970947
    vt 0.980596 0.950562
    vt 0.484761 0.501978
    vt 0.497892 0.986357
    vt 0.497901 0.516395
    vt 0.498287 0.515501
    vt 0.986017 0.924506
    vt 0.986679 0.925236
    vt 0.512030 0.951138
    vt 0.982544 0.949832
    vt 0.982403 0.950562
    vt 0.506899 0.924379
    vt 0.513368 0.095331
    vt 0.513849 0.097579
    vt 0.513147 0.097579
    vt 0.514672 0.101720
    vt 0.515089 0.103980
    vt 0.514024 0.101988
    vt 0.518657 0.106576
    vt 0.516522 0.105726
    vt 0.517018 0.105230
    vt 0.528806 0.107576
    vt 0.526925 0.108876
    vt 0.526777 0.108191
    vt 0.535308 0.101988
    vt 0.535276 0.099690
    vt 0.535964 0.099827
    vt 0.524667 0.108399
    vt 0.956315 0.095438
    vt 0.956808 0.097547
    vt 0.956104 0.097564
    vt 0.956808 0.097582
    vt 0.956313 0.099691
    vt 0.957937 0.103620
    vt 0.957619 0.101540
    vt 0.958520 0.103230
    vt 0.961468 0.106117
    vt 0.962823 0.107634
    vt 0.958591 0.103316
    vt 0.959291 0.105271
    vt 0.973964 0.108272
    vt 0.967169 0.107757
    vt 0.973931 0.107574
    vt 0.974148 0.108254
    vt 0.973964 0.108272
    vt 0.975921 0.106986
    vt 0.974009 0.107566
    vt 0.982024 0.095575
    vt 0.982093 0.093394
    vt 0.982712 0.095438
    vt 0.498618 0.971140
    vt 0.528223 0.971127
    vt 0.105388 0.516908
    vt 0.105116 0.517606
    vt 0.995258 0.070048
    vt 0.094536 0.507069
    vt 0.552369 0.971117
    vt 0.528424 0.971931
    vt 0.528716 0.971127
    vt 0.376461 0.502046
    vt 0.487396 0.050128
    vt 0.487396 0.048887
    vt 0.444420 0.070226
    vt 0.421018 0.070926
    vt 0.421018 0.070228
    vt 0.984496 0.064992
    vt 0.983950 0.062484
    vt 0.985080 0.064602
    vt 0.992869 0.069812
    vt 0.990304 0.069764
    vt 0.990573 0.069115
    vt 0.986105 0.066955
    vt 0.993277 0.971740
    vt 0.988518 0.970932
    vt 0.993179 0.970930
    vt 0.986650 0.950554
    vt 0.490892 0.504514
    vt 0.484622 0.502676
    vt 0.994026 0.925238
    vt 0.516508 0.089447
    vt 0.515671 0.091567
    vt 0.515088 0.091178
    vt 0.420978 0.488362
    vt 0.420210 0.071012
    vt 0.513022 0.951139
    vt 0.507093 0.951146
    vt 0.982157 0.924505
    vt 0.982292 0.925235
    vt 0.500125 0.924377
    vt 0.502041 0.924378
    vt 0.514024 0.093170
    vt 0.514057 0.095468
    vt 0.520259 0.108224
    vt 0.528805 0.087582
    vt 0.531065 0.087999
    vt 0.530675 0.088582
    vt 0.988066 0.068567
    vt 0.988457 0.067983
    vt 0.535275 0.095468
    vt 0.535308 0.093170
    vt 0.535963 0.095331
    vt 0.532811 0.089432
    vt 0.956936 0.093394
    vt 0.957018 0.095526
    vt 0.963266 0.088094
    vt 0.964879 0.086875
    vt 0.965016 0.087563
    vt 0.974319 0.086923
    vt 0.974098 0.087586
    vt 0.982219 0.097565
    vt 0.982920 0.097565
    vt 0.030223 0.502263
    vt 0.054200 0.502946
    vt 0.030513 0.502961
    vt 0.054897 0.507094
    vt 0.054899 0.502248
    vt 0.901814 0.009472
    vt 0.941435 0.008770
    vt 0.942133 0.009468
    vt 0.376458 0.507701
    vt 0.375762 0.502745
    vt 0.375759 0.508400
    vt 0.575131 0.010310
    vt 0.487274 0.045873
    vt 0.498933 0.044957
    vt 0.499795 0.045574
    vt 0.498931 0.045659
    vt 0.487396 0.066263
    vt 0.487396 0.067504
    vt 0.532315 0.089928
    vt 0.487396 0.053852
    vt 0.487396 0.060058
    vt 0.982818 0.061490
    vt 0.983254 0.060185
    vt 0.992749 0.045089
    vt 0.995274 0.044840
    vt 0.488083 0.017794
    vt 0.982424 0.970935
    vt 0.988292 0.970932
    vt 0.993425 0.950546
    vt 0.499379 0.488543
    vt 0.499638 0.487740
    vt 0.495159 0.509768
    vt 0.490496 0.505106
    vt 0.991505 0.925237
    vt 0.986682 0.924506
    vt 0.991509 0.924507
    vt 0.514057 0.099690
    vt 0.515672 0.103590
    vt 0.520525 0.087582
    vt 0.522418 0.086278
    vt 0.522555 0.086967
    vt 0.531066 0.107159
    vt 0.530676 0.106576
    vt 0.534660 0.101720
    vt 0.532315 0.105230
    vt 0.524665 0.086759
    vt 0.957016 0.099603
    vt 0.956932 0.101735
    vt 0.964866 0.108254
    vt 0.963254 0.107035
    vt 0.965003 0.107566
    vt 0.965179 0.107583
    vt 0.966969 0.108462
    vt 0.978073 0.106627
    vt 0.977684 0.106043
    vt 0.981440 0.101467
    vt 0.980497 0.103230
    vt 0.979229 0.104775
    vt 0.001012 0.532449
    vt 0.000166 0.532308
    vt 0.486638 0.065022
    vt 0.985089 0.050988
    vt 0.986117 0.048635
    vt 0.986613 0.049131
    vt 0.959300 0.089857
    vt 0.958598 0.091813
    vt 0.957944 0.091509
    vt 0.883087 0.004624
    vt 0.883785 0.003925
    vt 0.942135 0.004618
    vt 0.541925 0.004655
    vt 0.542622 0.009614
    vt 0.541924 0.010313
    vt 0.873457 0.970981
    vt 0.611356 0.971092
    vt 0.487272 0.070750
    vt 0.487396 0.047646
    vt 0.487396 0.061299
    vt 0.487396 0.051369
    vt 0.444419 0.045911
    vt 0.982386 0.057121
    vt 0.983021 0.057795
    vt 0.901713 0.008773
    vt 0.901814 0.008773
    vt 0.992732 0.070501
    vt 0.995257 0.070750
    vt 0.986602 0.066459
    vt 0.488078 0.070826
    vt 0.498918 0.488471
    vt 0.495752 0.509372
    vt 0.502239 0.950402
    vt 0.506897 0.951146
    vt 0.502239 0.951152
    vt 0.513025 0.924381
    vt 0.513153 0.925131
    vt 0.000166 0.986370
    vt 0.514672 0.093438
    vt 0.518300 0.087976
    vt 0.518656 0.088582
    vt 0.518267 0.107159
    vt 0.520527 0.107576
    vt 0.529073 0.086934
    vt 0.526775 0.086967
    vt 0.526912 0.086278
    vt 0.535483 0.097579
    vt 0.536185 0.097579
    vt 0.965192 0.087546
    vt 0.957623 0.093589
    vt 0.958527 0.091899
    vt 0.962835 0.087495
    vt 0.961478 0.089012
    vt 0.960951 0.088502
    vt 0.959901 0.090267
    vt 0.961341 0.089086
    vt 0.974022 0.087563
    vt 0.974135 0.086867
    vt 0.974319 0.086923
    vt 0.458513 0.963097
    vt 0.013831 0.999196
    vt 0.002959 0.991826
    vt 0.114749 0.478264
    vt 0.114122 0.493803
    vt 0.114905 0.493974
    vt 0.126583 0.478266
    vt 0.127507 0.493822
    vt 0.127350 0.476662
    vt 0.113951 0.476662
    vt 0.114905 0.493975
    vt 0.126727 0.493992
    vt 0.114905 0.493975
    vt 0.127833 0.478266
    vt 0.127977 0.493992
    vt 0.113933 0.493974
    vt 0.113776 0.478264
    vt 0.373434 0.480170
    vt 0.374266 0.487215
    vt 0.373498 0.487031
    vt 0.363552 0.480240
    vt 0.362877 0.487215
    vt 0.362765 0.478796
    vt 0.374188 0.478701
    vt 0.373499 0.487029
    vt 0.363641 0.487030
    vt 0.373500 0.487025
    vt 0.363552 0.480239
    vt 0.373433 0.480172
    vt 0.374331 0.487031
    vt 0.374267 0.480170
    vt 0.378345 0.511038
    vt 0.388082 0.508933
    vt 0.388022 0.510675
    vt 0.362441 0.480240
    vt 0.362531 0.487028
    vt 0.560697 0.971986
    vt 0.113270 0.517601
    vt 0.497518 0.986416
    vt 0.482844 0.943231
    vt 0.458527 0.943241
    vt 0.003749 0.989749
    vt 0.001018 0.987173
    vt 0.445962 0.488335
    vt 0.590135 0.998594
    vt 0.982454 0.949832
    vt 0.606467 0.911216
    vt 0.577304 0.911466
    vt 0.565926 0.893378
    vt 0.508697 0.893316
    vt 0.948093 0.971925
    vt 0.812172 0.676747
    vt 0.600602 0.998598
    vt 0.874154 0.971789
    vt 0.917585 0.971925
    vt 0.011304 1.000000
    vt 0.951458 0.999030
    vt 0.874001 0.971925
    vt 0.987904 0.048262
    vt 0.990179 0.047198
    vt 0.992647 0.046542
    vt 0.995214 0.046321
    vt 0.995375 0.046335
    vt 0.995374 0.069344
    vt 0.992647 0.069137
    vt 0.990179 0.068481
    vt 0.987904 0.067417
    vt 0.985910 0.065984
    vt 0.984273 0.064239
    vt 0.983057 0.062247
    vt 0.982309 0.060087
    vt 0.982309 0.055592
    vt 0.983057 0.053432
    vt 0.984273 0.051440
    vt 0.464687 0.047646
    vt 0.513350 0.445241
    vt 0.499638 0.487740
    vt 0.498935 0.070688
    vt 0.499797 0.070773
    vt 0.502323 0.070524
    vt 0.506956 0.068614
    vt 0.486638 0.066263
    vt 0.487276 0.017651
    vt 0.976202 0.087495
    vt 0.983077 0.062331
    vt 0.979734 0.089858
    vt 0.976189 0.107634
    vt 0.460084 0.013928
    vt 1.000000 1.000000
    vt 0.484216 0.999194
    vt 0.495768 0.990752
    vt 0.513352 0.464609
    vt 0.537659 0.464614
    vt 0.511938 0.501207
    vt 0.506068 0.498772
    vt 0.982167 0.501328
    vt 0.993040 0.493954
    vt 0.498311 0.998996
    vt 0.421767 0.046423
    vt 0.500422 0.069474
    vt 0.499601 0.069393
    vt 0.499601 0.046271
    vt 0.500422 0.046190
    vt 0.502694 0.046414
    vt 0.504878 0.047077
    vt 0.508654 0.049600
    vt 0.510102 0.051364
    vt 0.511178 0.053377
    vt 0.511841 0.055561
    vt 0.512064 0.057832
    vt 0.511841 0.060103
    vt 0.511178 0.062287
    vt 0.508654 0.066064
    vt 0.506890 0.067512
    vt 0.504878 0.068588
    vt 0.408960 0.046834
    vt 0.534621 0.095910
    vt 0.534621 0.097798
    vt 0.534252 0.099650
    vt 0.533530 0.101395
    vt 0.532481 0.102965
    vt 0.531145 0.104300
    vt 0.529575 0.105350
    vt 0.527831 0.106072
    vt 0.525978 0.106441
    vt 0.524090 0.106441
    vt 0.522238 0.106072
    vt 0.520493 0.105350
    vt 0.518923 0.104300
    vt 0.517588 0.102965
    vt 0.516539 0.101395
    vt 0.515448 0.097798
    vt 0.515448 0.095910
    vt 0.515816 0.094058
    vt 0.516539 0.092313
    vt 0.517588 0.090743
    vt 0.518923 0.089408
    vt 0.520493 0.088359
    vt 0.524090 0.087268
    vt 0.525978 0.087268
    vt 0.527831 0.087636
    vt 0.529575 0.088359
    vt 0.531145 0.089408
    vt 0.532481 0.090743
    vt 0.533530 0.092313
    vt 0.409296 0.046130
    vt 0.387483 0.046130
    vt 0.366888 0.065941
    vt 0.362596 0.046130
    vt 0.386120 0.065936
    vt 0.958856 0.101252
    vt 0.957957 0.099588
    vt 0.957499 0.097822
    vt 0.957499 0.096021
    vt 0.957957 0.094255
    vt 0.958856 0.092591
    vt 0.960161 0.091093
    vt 0.961822 0.089820
    vt 0.963775 0.088820
    vt 0.965944 0.088130
    vt 0.968248 0.087779
    vt 0.970597 0.087779
    vt 0.972900 0.088130
    vt 0.975070 0.088820
    vt 0.977023 0.089820
    vt 0.979989 0.092591
    vt 0.980887 0.094255
    vt 0.981346 0.096021
    vt 0.981346 0.097822
    vt 0.980887 0.099588
    vt 0.979989 0.101252
    vt 0.978684 0.102749
    vt 0.975070 0.105023
    vt 0.972900 0.105712
    vt 0.970597 0.106064
    vt 0.968248 0.106064
    vt 0.965945 0.105712
    vt 0.963775 0.105023
    vt 0.961822 0.104023
    vt 0.883081 0.019325
    vt 0.421361 0.507673
    vt 0.487396 0.065022
    vt 0.982570 0.055268
    vt 0.620016 0.003950
    vt 0.988470 0.047607
    vt 0.982157 0.970935
    vt 0.986426 0.950554
    vt 0.980723 0.924505
    vt 0.511892 0.950389
    vt 0.502240 0.924378
    vt 0.529075 0.108224
    vt 0.524643 0.109101
    vt 0.957003 0.095575
    vt 0.957001 0.099554
    vt 0.963092 0.106985
    vt 0.959787 0.104775
    vt 0.094637 0.507069
    vt 0.991378 0.950548
    vt 0.517016 0.089928
    vt 0.420169 0.488363
    vt 0.511874 0.924381
    vt 0.957584 0.093662
    vt 0.575131 0.009611
    vt 0.499795 0.044872
    vt 0.487396 0.052611
    vt 0.499488 0.488997
    vt 0.520238 0.086940
    vt 0.524665 0.086057
    vt 0.957580 0.101467
    vt 0.966992 0.107762
    vt 0.959795 0.090354
    vt 0.941437 0.003920
    vt 0.542623 0.003957
    vt 0.421020 0.045911
    vt 0.982818 0.061490
    vt 0.507095 0.924379
    vt 0.967004 0.087367
    vt 0.963103 0.088143
    vt 0.508965 0.066964
    vt 0.510562 0.065018
    vt 0.511758 0.062779
    vt 0.512495 0.060349
    vt 0.512743 0.057823
    vt 0.512494 0.055296
    vt 0.511757 0.052867
    vt 0.510561 0.050628
    vt 0.498931 0.017632
    vt 0.501363 0.011758
    vt 0.506028 0.007092
    vt 0.511901 0.004658
    vt 0.502321 0.045121
    vt 0.504750 0.045858
    vt 0.506988 0.047055
    vt 0.508950 0.048665
    vt 0.537659 0.445252
    vt 0.995428 0.034260
    vt 0.965812 0.004616
    vt 0.003749 0.989749
    vt 0.007860 0.996723
    vt 0.126727 0.493992
    vt 0.126728 0.493991
    vt 0.363642 0.487028
    vt 0.363640 0.487034
    vt 0.378225 0.509115
    s 0
    usemtl Floppy
    f 304/1/1 292/2/1 290/3/1
    f 139/4/2 118/5/2 141/6/2
    f 163/7/3 454/8/3 148/8/3
    f 175/9/4 177/10/4 170/11/4
    f 287/12/5 266/13/5 264/14/5
    f 128/15/3 130/16/3 127/17/3
    f 277/18/6 261/19/6 258/20/6
    f 117/21/7 141/22/7 118/23/7
    f 210/24/8 115/25/8 218/26/8
    f 131/27/9 134/28/9 122/29/9
    f 289/30/3 297/31/3 299/32/3
    f 49/33/7 32/34/7 34/35/7
    f 284/36/10 269/37/10 266/13/10
    f 49/38/8 38/39/8 53/40/8
    f 301/41/11 297/42/11 295/43/11
    f 41/44/12 38/45/12 27/46/12
    f 43/47/2 27/48/2 32/49/2
    f 151/50/8 159/51/8 147/52/8
    f 137/53/7 444/54/7 125/54/7
    f 129/55/7 145/56/7 131/57/7
    f 126/58/7 143/59/7 129/60/7
    f 122/29/7 443/61/7 440/62/7
    f 442/63/7 450/64/7 441/65/7
    f 155/66/7 157/67/7 151/68/7
    f 4/69/13 168/70/13 179/71/13
    f 274/72/7 159/73/7 261/19/7
    f 451/74/7 165/75/7 155/66/7
    f 79/76/14 180/77/14 85/78/14
    f 10/79/15 185/80/15 187/81/15
    f 14/82/16 187/83/16 207/84/16
    f 79/76/17 188/85/17 191/86/17
    f 63/87/18 195/88/18 209/89/18
    f 15/90/19 207/91/19 193/92/19
    f 46/93/20 201/94/20 205/95/20
    f 24/96/21 203/97/21 198/98/21
    f 29/99/22 198/98/22 197/100/22
    f 50/101/23 91/102/23 101/103/23
    f 37/104/24 197/105/24 201/106/24
    f 54/107/25 205/95/25 195/108/25
    f 20/109/26 193/92/26 203/110/26
    f 70/111/27 209/89/27 188/112/27
    f 9/113/28 183/114/28 185/115/28
    f 6/116/29 179/117/29 183/118/29
    f 270/119/23 190/120/23 310/121/23
    f 85/78/30 177/122/30 90/123/30
    f 281/124/2 174/125/2 282/126/2
    f 291/127/23 437/128/23 422/129/23
    f 93/130/31 221/131/31 225/132/31
    f 281/124/32 256/133/32 255/134/32
    f 1/135/13 251/136/13 242/137/13
    f 73/138/33 237/139/33 253/140/33
    f 105/141/34 249/142/34 239/143/34
    f 66/144/35 241/145/35 237/146/35
    f 77/147/36 253/148/36 233/149/36
    f 104/150/37 229/151/37 249/152/37
    f 98/153/38 222/154/38 231/155/38
    f 91/156/39 227/157/39 221/158/39
    f 87/159/40 235/160/40 227/161/40
    f 96/162/41 225/163/41 222/164/41
    f 83/165/42 233/166/42 235/167/42
    f 101/168/43 231/169/43 229/151/43
    f 106/170/44 239/171/44 251/172/44
    f 211/173/45 242/174/45 213/175/45
    f 61/176/46 247/177/46 241/178/46
    f 57/179/4 245/180/4 247/181/4
    f 283/182/47 285/183/47 107/182/47
    f 49/184/47 107/185/47 286/186/47
    f 295/43/48 302/187/48 301/41/48
    f 40/188/31 306/189/31 309/190/31
    f 258/191/49 279/192/49 277/193/49
    f 267/194/23 271/195/23 272/196/23
    f 108/197/23 294/198/23 268/199/23
    f 289/200/50 264/14/50 263/201/50
    f 303/202/47 305/203/47 109/204/47
    f 291/205/23 293/206/23 108/207/23
    f 117/21/51 113/208/51 111/209/51
    f 219/210/52 245/211/52 50/212/52
    f 10/213/23 54/214/23 85/215/23
    f 12/216/46 325/217/46 329/218/46
    f 68/219/13 327/220/13 367/221/13
    f 75/222/28 337/223/28 345/224/28
    f 7/225/4 368/226/4 325/227/4
    f 59/228/34 320/229/34 331/230/34
    f 22/231/36 323/232/36 319/233/36
    f 51/234/43 313/235/43 335/236/43
    f 44/237/41 309/238/41 317/239/41
    f 35/240/39 311/241/39 306/189/39
    f 31/242/40 315/243/40 311/244/40
    f 26/245/42 319/233/42 315/246/42
    f 47/247/38 317/239/38 313/248/38
    f 18/249/33 333/250/33 323/251/33
    f 56/252/37 335/236/37 320/229/37
    f 16/253/35 329/218/35 333/250/35
    f 64/254/44 331/255/44 327/256/44
    f 103/257/14 346/258/14 339/259/14
    f 72/260/29 367/261/29 337/262/29
    f 81/263/16 341/264/16 362/265/16
    f 102/266/17 342/267/17 346/268/17
    f 99/269/18 351/270/18 365/271/18
    f 86/272/19 362/273/19 348/274/19
    f 373/275/53 23/276/53 370/277/53
    f 95/278/20 355/279/20 359/280/20
    f 92/281/22 357/282/22 353/283/22
    f 89/284/21 361/285/21 357/282/21
    f 94/286/24 353/287/24 355/288/24
    f 97/289/25 359/280/25 351/290/25
    f 88/291/26 348/274/26 361/292/26
    f 100/293/27 365/271/27 342/267/27
    f 3/294/30 339/295/30 368/296/30
    f 78/297/15 345/224/15 341/264/15
    f 59/298/23 88/299/23 102/300/23
    f 52/301/54 401/302/54 408/303/54
    f 5/304/55 407/305/55 391/306/55
    f 439/307/56 42/308/56 389/309/56
    f 11/310/57 394/311/57 386/312/57
    f 393/313/58 36/314/58 385/315/58
    f 17/316/59 399/317/59 379/318/59
    f 397/319/60 30/320/60 377/321/60
    f 381/322/61 25/323/61 373/324/61
    f 23/276/62 375/325/62 370/326/62
    f 21/327/63 383/328/63 375/329/63
    f 19/330/64 379/331/64 383/332/64
    f 377/333/65 28/334/65 381/335/65
    f 13/336/66 386/337/66 399/338/66
    f 385/339/67 33/340/67 397/341/67
    f 8/342/68 391/343/68 394/344/68
    f 389/345/69 39/346/69 393/347/69
    f 407/348/70 84/349/70 411/350/70
    f 48/351/71 439/352/71 404/353/71
    f 58/354/16 413/355/16 434/356/16
    f 82/357/17 415/358/17 419/359/17
    f 76/360/18 423/361/18 436/362/18
    f 60/363/19 434/364/19 420/365/19
    f 71/366/20 429/367/20 433/368/20
    f 65/369/21 431/370/21 427/371/21
    f 67/372/22 427/373/22 425/374/22
    f 69/375/24 425/374/24 429/367/24
    f 74/376/25 433/368/25 423/377/25
    f 62/378/26 420/365/26 431/370/26
    f 80/379/27 436/362/27 415/358/27
    f 55/380/15 416/381/15 413/355/15
    f 84/349/14 419/359/14 411/382/14
    f 42/383/23 65/384/23 84/385/23
    f 166/386/72 167/387/72 168/388/72
    f 169/389/73 170/11/73 171/390/73
    f 212/391/74 213/392/74 214/393/74
    f 215/394/75 216/395/75 217/396/75
    f 266/13/76 267/397/76 268/398/76
    f 269/399/77 270/400/77 271/401/77
    f 416/402/78 412/403/78 413/404/78
    f 421/405/79 431/406/79 420/407/79
    f 432/408/80 429/409/80 428/410/80
    f 434/411/81 421/405/81 420/407/81
    f 404/412/82 438/413/82 405/414/82
    f 230/415/83 222/416/83 223/417/83
    f 412/403/84 434/411/84 413/404/84
    f 325/418/85 369/419/85 324/420/85
    f 135/421/86 443/422/86 134/423/86
    f 134/423/87 144/424/87 135/421/87
    f 364/425/88 351/426/88 350/427/88
    f 146/428/89 151/429/89 147/430/89
    f 154/431/90 151/429/90 150/432/90
    f 175/433/91 172/434/91 173/435/91
    f 387/436/92 399/437/92 386/438/92
    f 189/439/93 191/86/93 188/85/93
    f 349/440/79 361/441/79 348/442/79
    f 197/100/94 199/443/94 196/444/94
    f 200/445/95 197/105/95 196/444/95
    f 188/112/96 208/446/96 189/439/96
    f 212/391/97 112/447/97 113/448/97
    f 198/98/98 202/449/98 199/443/98
    f 225/450/99 223/417/99 222/416/99
    f 448/451/100 162/452/100 160/453/100
    f 242/454/101 214/455/101 213/456/101
    f 120/457/89 440/458/89 441/459/89
    f 239/460/102 248/461/102 238/462/102
    f 238/462/103 251/463/103 239/460/103
    f 255/134/104 257/464/104 254/465/104
    f 158/466/86 261/19/86 159/73/86
    f 264/14/105 262/467/105 263/201/105
    f 274/468/90 146/428/90 147/430/90
    f 282/469/106 280/470/106 281/471/106
    f 289/200/107 286/472/107 287/473/107
    f 296/474/108 263/475/108 262/476/108
    f 302/187/109 300/477/109 301/41/109
    f 308/478/110 306/479/110 307/480/110
    f 306/479/111 310/121/111 307/480/111
    f 315/481/112 318/482/112 314/483/112
    f 333/484/113 322/485/113 323/486/113
    f 346/487/114 338/488/114 339/489/114
    f 358/490/80 355/491/80 354/492/80
    f 338/488/115 368/493/115 339/489/115
    f 372/494/116 370/495/116 371/496/116
    f 370/497/117 374/498/117 371/496/117
    f 378/499/118 383/500/118 379/501/118
    f 386/502/119 395/503/119 387/436/119
    f 379/504/120 398/505/120 378/499/120
    f 403/506/121 407/507/121 402/508/121
    f 402/508/122 410/509/122 403/510/122
    f 419/511/123 410/509/123 411/512/123
    f 427/513/98 430/514/98 426/515/98
    f 111/209/124 112/516/124 110/517/124
    f 130/16/125 122/518/125 123/519/125
    f 215/394/126 245/520/126 216/395/126
    f 440/458/90 123/519/90 122/518/90
    f 129/521/127 130/16/127 128/15/127
    f 140/522/86 111/523/86 110/524/86
    f 450/525/90 120/457/90 441/459/90
    f 184/526/128 183/114/128 182/527/128
    f 219/528/129 217/529/129 216/530/129
    f 232/531/112 235/532/112 233/533/112
    f 247/534/130 240/535/130 241/536/130
    f 233/533/131 252/537/131 232/531/131
    f 256/538/132 259/539/132 257/540/132
    f 266/13/133 265/541/133 264/14/133
    f 277/542/134 275/543/134 274/468/134
    f 282/544/135 285/183/135 283/182/135
    f 334/545/136 313/546/136 312/547/136
    f 290/548/137 215/549/137 217/529/137
    f 295/43/138 296/550/138 294/551/138
    f 299/32/139 288/552/139 289/553/139
    f 302/187/140 305/554/140 303/555/140
    f 316/556/99 309/557/99 308/478/99
    f 328/558/130 325/418/130 324/420/130
    f 345/559/78 340/560/78 341/561/78
    f 241/536/141 236/562/141 237/563/141
    f 357/564/98 360/565/98 356/566/98
    f 348/442/81 363/567/81 349/440/81
    f 380/568/142 373/569/142 372/494/142
    f 393/570/143 388/571/143 389/572/143
    f 409/573/128 416/402/128 408/574/128
    f 425/575/94 426/515/94 424/576/94
    f 428/410/95 425/575/95 424/576/95
    f 117/577/90 119/578/90 116/579/90
    f 126/580/144 119/578/144 118/581/144
    f 126/580/90 128/15/90 127/17/90
    f 142/582/86 139/583/86 138/584/86
    f 451/585/144 149/586/144 450/525/144
    f 451/585/90 154/431/90 153/587/90
    f 164/588/86 448/451/86 160/453/86
    f 173/435/145 166/386/145 168/589/145
    f 167/590/146 179/591/146 168/592/146
    f 177/122/147 181/593/147 176/594/147
    f 184/526/78 187/81/78 185/80/78
    f 340/560/84 362/595/84 341/561/84
    f 192/596/79 203/110/79 193/92/79
    f 204/597/80 201/94/80 200/445/80
    f 207/91/81 192/596/81 193/92/81
    f 235/532/148 226/598/148 227/599/148
    f 242/454/146 250/600/146 243/601/146
    f 166/386/100 254/602/100 167/387/100
    f 258/20/149 260/603/149 259/604/149
    f 266/13/150 271/605/150 267/397/150
    f 267/606/23 273/607/23 268/199/23
    f 277/542/151 278/608/151 276/609/151
    f 284/610/152 286/611/152 285/612/152
    f 292/2/153 291/205/153 290/3/153
    f 311/613/154 314/483/154 310/121/154
    f 323/486/131 318/482/131 319/614/131
    f 331/615/103 326/616/103 327/617/103
    f 343/618/155 346/487/155 342/619/155
    f 359/620/156 350/427/156 351/426/156
    f 365/621/157 343/618/157 342/619/157
    f 326/616/146 367/622/146 327/617/146
    f 375/623/158 382/624/158 374/498/158
    f 390/625/159 394/626/159 391/627/159
    f 391/628/160 406/629/160 390/625/160
    f 414/630/155 419/511/155 415/631/155
    f 433/632/156 422/129/156 423/633/156
    f 436/634/157 414/630/157 415/631/157
    f 117/577/161 114/635/161 115/636/161
    f 191/637/123 181/593/123 180/77/123
    f 231/638/136 228/639/136 229/640/136
    f 396/641/162 377/642/162 376/643/162
    f 443/422/97 132/644/97 442/645/97
    f 139/583/100 140/646/100 138/584/100
    f 422/129/88 436/634/88 423/633/88
    f 158/647/97 157/648/97 156/649/97
    f 162/650/86 442/63/86 132/651/86
    f 157/648/86 164/588/86 156/649/86
    f 169/652/163 175/9/163 170/11/163
    f 177/10/164 171/390/164 170/11/164
    f 182/527/165 179/117/165 178/653/165
    f 205/95/156 194/654/156 195/108/156
    f 186/655/84 207/84/84 187/83/84
    f 208/446/88 195/88/88 194/654/88
    f 211/656/166 212/391/166 210/24/166
    f 218/26/167 211/656/167 210/24/167
    f 220/657/110 225/450/110 221/658/110
    f 227/599/168 220/657/168 221/658/168
    f 142/582/86 145/659/86 143/660/86
    f 246/661/164 245/520/164 244/662/164
    f 248/461/169 229/640/169 228/639/169
    f 236/562/113 253/663/113 237/563/113
    f 270/400/100 169/652/100 171/664/100
    f 270/119/47 272/665/47 271/606/47
    f 281/471/170 278/608/170 279/666/170
    f 292/667/171 294/668/171 293/669/171
    f 301/41/172 298/670/172 299/671/172
    f 114/635/173 304/672/173 115/636/173
    f 317/673/83 312/547/83 313/546/83
    f 321/674/174 331/615/174 320/675/174
    f 332/676/141 329/677/141 328/558/141
    f 320/675/175 334/545/175 321/674/175
    f 344/678/128 337/679/128 336/680/128
    f 354/492/95 353/681/95 352/682/95
    f 353/681/94 356/566/94 352/682/94
    f 438/413/176 389/683/176 388/571/176
    f 367/622/165 336/680/165 337/679/165
    f 381/684/177 376/643/177 377/685/177
    f 392/686/178 385/687/178 384/688/178
    f 397/689/179 384/688/179 385/690/179
    f 401/691/180 405/414/180 400/692/180
    f 409/693/181 401/691/181 400/692/181
    f 144/424/3 142/582/3 138/584/3
    f 43/694/47 298/695/47 303/696/47
    f 121/697/8 440/698/8 125/699/8
    f 133/700/8 443/701/8 442/702/8
    f 133/700/8 441/703/8 121/697/8
    f 125/704/2 443/701/2 137/705/2
    f 444/706/8 446/700/8 445/697/8
    f 133/707/47 447/708/47 137/708/47
    f 121/697/3 446/700/3 133/700/3
    f 125/709/23 445/710/23 121/710/23
    f 163/711/2 448/712/2 161/713/2
    f 148/714/2 451/715/2 450/716/2
    f 148/8/2 449/717/2 163/7/2
    f 161/718/2 451/715/2 152/719/2
    f 452/720/2 454/721/2 453/722/2
    f 161/723/47 453/724/47 163/724/47
    f 152/725/7 452/726/7 161/727/7
    f 148/728/23 455/729/23 152/729/23
    f 304/1/1 302/187/1 292/2/1
    f 139/4/2 126/730/2 118/5/2
    f 163/7/3 453/7/3 454/8/3
    f 175/9/4 90/123/4 177/10/4
    f 287/12/5 284/610/5 266/13/5
    f 124/731/47 120/457/47 149/586/47
    f 124/731/47 149/586/47 153/587/47
    f 124/731/47 153/587/47 154/431/47
    f 150/432/47 146/428/47 275/543/47
    f 124/731/47 154/431/47 150/432/47
    f 150/432/47 275/543/47 276/609/47
    f 276/609/47 278/608/47 280/470/47
    f 280/470/47 283/732/47 107/185/47
    f 280/470/47 107/185/47 53/733/47
    f 150/432/47 276/609/47 280/470/47
    f 124/731/47 150/432/47 280/470/47
    f 280/470/47 53/733/47 41/734/47
    f 41/734/47 43/694/47 109/735/47
    f 109/735/47 305/736/47 114/635/47
    f 114/635/47 116/579/47 119/578/47
    f 114/635/47 119/578/47 127/17/47
    f 41/734/47 109/735/47 114/635/47
    f 124/731/47 280/470/47 41/734/47
    f 123/519/47 124/731/47 41/734/47
    f 41/734/47 114/635/47 127/17/47
    f 123/519/47 41/734/47 127/17/47
    f 130/16/47 123/519/47 127/17/47
    f 277/18/6 274/72/6 261/19/6
    f 117/21/7 111/523/7 141/22/7
    f 210/24/8 212/391/8 113/448/8
    f 115/25/8 304/737/8 290/548/8
    f 290/548/8 217/529/8 218/26/8
    f 210/24/8 113/448/8 115/25/8
    f 115/25/8 290/548/8 218/26/8
    f 131/27/9 145/738/9 134/28/9
    f 289/30/3 263/739/3 297/31/3
    f 49/33/7 43/740/7 32/34/7
    f 284/36/10 282/544/10 269/37/10
    f 49/38/8 34/741/8 38/39/8
    f 301/41/11 299/671/11 297/42/11
    f 41/44/12 53/742/12 38/45/12
    f 43/47/2 41/743/2 27/48/2
    f 151/50/8 157/744/8 159/51/8
    f 137/53/7 447/53/7 444/54/7
    f 129/55/7 143/745/7 145/56/7
    f 126/58/7 139/4/7 143/59/7
    f 122/29/7 134/746/7 443/61/7
    f 442/63/7 449/747/7 450/64/7
    f 155/66/7 165/748/7 157/67/7
    f 4/69/13 173/749/13 168/70/13
    f 274/72/7 147/750/7 159/73/7
    f 451/74/7 448/751/7 165/75/7
    f 79/76/14 191/637/14 180/77/14
    f 10/79/15 9/113/15 185/80/15
    f 14/82/16 10/79/16 187/83/16
    f 79/76/17 70/111/17 188/85/17
    f 63/87/18 54/107/18 195/88/18
    f 15/90/19 14/82/19 207/91/19
    f 46/93/20 37/104/20 201/94/20
    f 24/96/21 20/109/21 203/97/21
    f 29/99/22 24/96/22 198/98/22
    f 104/752/23 105/753/23 106/754/23
    f 106/754/23 1/755/23 211/756/23
    f 211/756/23 219/757/23 50/101/23
    f 50/101/23 57/758/23 61/759/23
    f 61/759/23 66/760/23 73/761/23
    f 73/761/23 77/762/23 83/763/23
    f 83/763/23 87/764/23 91/102/23
    f 91/102/23 93/765/23 96/766/23
    f 96/766/23 98/767/23 101/103/23
    f 101/103/23 104/752/23 106/754/23
    f 106/754/23 211/756/23 50/101/23
    f 50/101/23 61/759/23 73/761/23
    f 73/761/23 83/763/23 91/102/23
    f 91/102/23 96/766/23 101/103/23
    f 101/103/23 106/754/23 50/101/23
    f 50/101/23 73/761/23 91/102/23
    f 37/104/24 29/99/24 197/105/24
    f 54/107/25 46/93/25 205/95/25
    f 20/109/26 15/90/26 193/92/26
    f 70/111/27 63/87/27 209/89/27
    f 9/113/28 6/116/28 183/114/28
    f 6/116/29 4/768/29 179/117/29
    f 324/420/23 369/419/23 38/769/23
    f 38/769/23 273/770/23 270/119/23
    f 270/119/23 171/771/23 176/772/23
    f 270/119/23 176/772/23 181/773/23
    f 324/420/23 38/769/23 270/119/23
    f 328/558/23 324/420/23 270/119/23
    f 270/119/23 181/773/23 190/120/23
    f 190/120/23 189/774/23 321/674/23
    f 190/120/23 321/674/23 334/545/23
    f 332/676/23 328/558/23 270/119/23
    f 322/485/23 332/676/23 270/119/23
    f 190/120/23 334/545/23 312/547/23
    f 190/120/23 312/547/23 316/556/23
    f 318/482/23 322/485/23 270/119/23
    f 314/483/23 318/482/23 270/119/23
    f 190/120/23 316/556/23 308/478/23
    f 190/120/23 308/478/23 307/480/23
    f 310/121/23 314/483/23 270/119/23
    f 190/120/23 307/480/23 310/121/23
    f 85/78/30 180/775/30 177/122/30
    f 281/124/2 255/776/2 166/386/2
    f 281/124/2 166/386/2 172/434/2
    f 169/652/2 269/399/2 282/126/2
    f 281/124/2 172/434/2 174/125/2
    f 174/125/2 169/652/2 282/126/2
    f 417/777/23 409/573/23 226/598/23
    f 417/777/23 226/598/23 234/778/23
    f 412/403/23 417/777/23 234/778/23
    f 412/403/23 234/778/23 232/531/23
    f 435/779/23 412/403/23 232/531/23
    f 435/779/23 232/531/23 252/537/23
    f 421/405/23 435/779/23 252/537/23
    f 421/405/23 252/537/23 236/562/23
    f 430/514/23 421/405/23 236/562/23
    f 430/514/23 236/562/23 240/535/23
    f 426/515/23 430/514/23 240/535/23
    f 246/661/182 244/662/182 215/394/182
    f 426/515/23 240/535/23 246/661/23
    f 424/576/23 426/515/23 246/661/23
    f 246/661/23 215/394/23 291/127/23
    f 291/127/23 108/197/23 403/510/23
    f 291/127/23 403/510/23 410/509/23
    f 424/576/23 246/661/23 291/127/23
    f 428/410/23 424/576/23 291/127/23
    f 291/127/23 410/509/23 418/780/23
    f 291/127/23 418/780/23 414/630/23
    f 432/408/23 428/410/23 291/127/23
    f 422/129/23 432/408/23 291/127/23
    f 291/127/23 414/630/23 437/128/23
    f 93/130/31 91/156/31 221/131/31
    f 281/124/32 279/781/32 256/133/32
    f 1/135/13 106/170/13 251/136/13
    f 73/138/33 66/144/33 237/139/33
    f 105/141/34 104/150/34 249/142/34
    f 66/144/35 61/176/35 241/145/35
    f 77/147/36 73/138/36 253/148/36
    f 104/150/37 101/168/37 229/151/37
    f 98/153/38 96/162/38 222/154/38
    f 91/156/39 87/159/39 227/157/39
    f 87/159/40 83/165/40 235/160/40
    f 96/162/41 93/130/41 225/163/41
    f 83/165/42 77/147/42 233/166/42
    f 101/168/43 98/153/43 231/169/43
    f 106/170/44 105/141/44 239/171/44
    f 211/173/183 1/782/183 242/174/183
    f 61/176/46 57/179/46 247/177/46
    f 57/179/4 50/212/4 245/180/4
    f 288/783/47 43/694/47 49/184/47
    f 49/184/47 53/733/47 107/185/47
    f 107/185/47 285/784/47 286/186/47
    f 286/186/47 288/783/47 49/184/47
    f 295/43/48 292/667/48 302/187/48
    f 40/188/31 35/240/31 306/189/31
    f 258/191/49 256/538/49 279/192/49
    f 268/199/23 273/607/23 38/769/23
    f 34/785/23 32/786/23 108/197/23
    f 268/199/23 38/769/23 34/785/23
    f 262/787/23 265/788/23 268/199/23
    f 294/198/23 296/789/23 262/787/23
    f 108/197/23 293/790/23 294/198/23
    f 268/199/23 34/785/23 108/197/23
    f 294/198/23 262/787/23 268/199/23
    f 289/200/50 287/473/50 264/14/50
    f 117/21/51 115/791/51 113/208/51
    f 219/210/184 216/792/184 245/211/184
    f 90/793/23 175/794/23 173/795/23
    f 173/795/23 4/796/23 6/797/23
    f 6/797/23 9/798/23 10/213/23
    f 10/213/23 14/799/23 15/800/23
    f 15/800/23 20/801/23 24/802/23
    f 24/802/23 29/803/23 37/804/23
    f 37/804/23 46/805/23 54/214/23
    f 54/214/23 63/806/23 70/807/23
    f 70/807/23 79/808/23 85/215/23
    f 85/215/23 90/793/23 173/795/23
    f 173/795/23 6/797/23 10/213/23
    f 10/213/23 15/800/23 24/802/23
    f 24/802/23 37/804/23 54/214/23
    f 54/214/23 70/807/23 85/215/23
    f 85/215/23 173/795/23 10/213/23
    f 10/213/23 24/802/23 54/214/23
    f 12/216/46 7/225/46 325/217/46
    f 68/219/13 64/254/13 327/220/13
    f 75/222/28 72/260/28 337/223/28
    f 7/225/4 3/809/4 368/226/4
    f 59/228/34 56/252/34 320/229/34
    f 22/231/36 18/249/36 323/232/36
    f 51/234/43 47/247/43 313/235/43
    f 44/237/41 40/188/41 309/238/41
    f 35/240/39 31/242/39 311/241/39
    f 31/242/40 26/245/40 315/243/40
    f 26/245/42 22/231/42 319/233/42
    f 47/247/38 44/237/38 317/239/38
    f 18/249/33 16/253/33 333/250/33
    f 56/252/37 51/234/37 335/236/37
    f 16/253/35 12/216/35 329/218/35
    f 64/254/44 59/228/44 331/255/44
    f 103/257/14 102/266/14 346/258/14
    f 72/260/29 68/219/29 367/261/29
    f 81/263/16 78/297/16 341/264/16
    f 102/266/17 100/293/17 342/267/17
    f 99/269/18 97/289/18 351/270/18
    f 86/272/19 81/263/19 362/273/19
    f 373/275/53 25/323/53 23/276/53
    f 95/278/20 94/286/20 355/279/20
    f 92/281/22 89/284/22 357/282/22
    f 89/284/21 88/291/21 361/285/21
    f 94/286/24 92/281/24 353/287/24
    f 97/289/25 95/278/25 359/280/25
    f 88/291/26 86/272/26 348/274/26
    f 100/293/27 99/269/27 365/271/27
    f 3/294/30 103/257/30 339/295/30
    f 78/297/15 75/222/15 345/224/15
    f 102/300/23 103/810/23 3/811/23
    f 3/811/23 7/812/23 12/813/23
    f 12/813/23 16/814/23 18/815/23
    f 18/815/23 22/816/23 26/817/23
    f 26/817/23 31/818/23 35/819/23
    f 35/819/23 40/820/23 44/821/23
    f 44/821/23 47/822/23 51/823/23
    f 51/823/23 56/824/23 59/298/23
    f 59/298/23 64/825/23 68/826/23
    f 68/826/23 72/827/23 75/828/23
    f 75/828/23 78/829/23 81/830/23
    f 81/830/23 86/831/23 88/299/23
    f 88/299/23 89/832/23 92/833/23
    f 92/833/23 94/834/23 95/835/23
    f 95/835/23 97/836/23 99/837/23
    f 99/837/23 100/838/23 102/300/23
    f 102/300/23 3/811/23 12/813/23
    f 12/813/23 18/815/23 26/817/23
    f 26/817/23 35/819/23 44/821/23
    f 44/821/23 51/823/23 59/298/23
    f 59/298/23 68/826/23 75/828/23
    f 75/828/23 81/830/23 88/299/23
    f 88/299/23 92/833/23 95/835/23
    f 95/835/23 99/837/23 102/300/23
    f 102/300/23 12/813/23 26/817/23
    f 26/817/23 44/821/23 59/298/23
    f 59/298/23 75/828/23 88/299/23
    f 88/299/23 95/835/23 102/300/23
    f 102/300/23 26/817/23 59/298/23
    f 408/303/28 416/381/28 52/301/28
    f 52/301/28 48/351/28 401/302/28
    f 5/304/55 2/839/55 407/305/55
    f 439/307/56 45/840/56 42/308/56
    f 11/310/185 8/342/185 394/311/185
    f 393/313/58 39/346/58 36/314/58
    f 17/316/59 13/336/59 399/317/59
    f 397/319/60 33/340/60 30/320/60
    f 381/322/61 28/334/61 25/323/61
    f 23/276/62 21/327/62 375/325/62
    f 21/327/63 19/330/63 383/328/63
    f 19/330/64 17/316/64 379/331/64
    f 377/333/65 30/320/65 28/334/65
    f 13/336/66 11/310/66 386/337/66
    f 385/339/67 36/314/67 33/340/67
    f 8/342/68 5/304/68 391/343/68
    f 389/345/69 42/308/69 39/346/69
    f 411/350/186 402/841/186 407/348/186
    f 407/348/187 2/842/187 84/349/187
    f 404/353/188 401/843/188 48/351/188
    f 48/351/189 45/840/189 439/352/189
    f 58/354/16 55/380/16 413/355/16
    f 82/357/17 80/379/17 415/358/17
    f 76/360/18 74/376/18 423/361/18
    f 60/363/19 58/354/19 434/364/19
    f 71/366/20 69/375/20 429/367/20
    f 65/369/21 62/378/21 431/370/21
    f 67/372/22 65/369/22 427/373/22
    f 69/375/24 67/372/24 425/374/24
    f 74/376/25 71/366/25 433/368/25
    f 62/378/26 60/363/26 420/365/26
    f 80/379/27 76/360/27 436/362/27
    f 55/380/15 52/301/15 416/381/15
    f 84/349/14 82/357/14 419/359/14
    f 84/385/23 2/844/23 5/845/23
    f 5/845/23 8/846/23 11/847/23
    f 11/847/23 13/848/23 17/849/23
    f 17/849/23 19/850/23 21/851/23
    f 21/851/23 23/852/23 25/853/23
    f 25/853/23 28/854/23 30/855/23
    f 30/855/23 33/856/23 36/857/23
    f 36/857/23 39/858/23 42/383/23
    f 42/383/23 45/859/23 48/860/23
    f 48/860/23 52/861/23 55/862/23
    f 55/862/23 58/863/23 60/864/23
    f 60/864/23 62/865/23 65/384/23
    f 65/384/23 67/866/23 69/867/23
    f 69/867/23 71/868/23 74/869/23
    f 74/869/23 76/870/23 80/871/23
    f 80/871/23 82/872/23 84/385/23
    f 84/385/23 5/845/23 11/847/23
    f 11/847/23 17/849/23 21/851/23
    f 21/851/23 25/853/23 30/855/23
    f 30/855/23 36/857/23 42/383/23
    f 42/383/23 48/860/23 55/862/23
    f 55/862/23 60/864/23 65/384/23
    f 65/384/23 69/867/23 74/869/23
    f 74/869/23 80/871/23 84/385/23
    f 84/385/23 11/847/23 21/851/23
    f 21/851/23 30/855/23 42/383/23
    f 42/383/23 55/862/23 65/384/23
    f 65/384/23 74/869/23 84/385/23
    f 84/385/23 21/851/23 42/383/23
    f 416/402/78 417/777/78 412/403/78
    f 421/405/79 430/514/79 431/406/79
    f 432/408/80 433/632/80 429/409/80
    f 434/411/81 435/779/81 421/405/81
    f 404/412/190 439/412/190 438/413/190
    f 230/415/83 231/638/83 222/416/83
    f 412/403/84 435/779/84 434/411/84
    f 325/418/191 368/493/191 369/419/191
    f 135/421/86 136/873/86 443/422/86
    f 134/423/87 145/659/87 144/424/87
    f 364/425/88 365/621/88 351/426/88
    f 146/428/89 150/432/89 151/429/89
    f 154/431/90 155/874/90 151/429/90
    f 175/433/192 174/125/192 172/434/192
    f 387/436/193 398/505/193 399/437/193
    f 189/439/194 190/875/194 191/86/194
    f 349/440/79 360/565/79 361/441/79
    f 197/100/94 198/98/94 199/443/94
    f 200/445/95 201/106/95 197/105/95
    f 188/112/195 209/89/195 208/446/195
    f 212/391/97 214/393/97 112/447/97
    f 198/98/196 203/97/196 202/449/196
    f 225/450/99 224/876/99 223/417/99
    f 448/451/100 449/877/100 162/452/100
    f 242/454/197 243/601/197 214/455/197
    f 120/457/89 124/731/89 440/458/89
    f 239/460/102 249/878/102 248/461/102
    f 238/462/103 250/600/103 251/463/103
    f 255/134/104 256/133/104 257/464/104
    f 158/466/86 260/879/86 261/19/86
    f 264/14/105 265/880/105 262/467/105
    f 274/468/90 275/543/90 146/428/90
    f 282/469/198 283/732/198 280/470/198
    f 289/200/107 288/881/107 286/472/107
    f 296/474/108 297/882/108 263/475/108
    f 302/187/199 303/883/199 300/477/199
    f 308/478/110 309/557/110 306/479/110
    f 306/479/111 311/613/111 310/121/111
    f 315/481/112 319/614/112 318/482/112
    f 333/484/113 332/676/113 322/485/113
    f 346/487/123 347/884/123 338/488/123
    f 358/490/80 359/620/80 355/491/80
    f 338/488/200 369/885/200 368/493/200
    f 372/494/201 373/886/201 370/495/201
    f 370/497/202 375/887/202 374/498/202
    f 378/499/203 382/624/203 383/500/203
    f 386/502/204 394/888/204 395/503/204
    f 379/504/205 399/889/205 398/505/205
    f 403/506/206 406/629/206 407/507/206
    f 402/508/207 411/512/207 410/509/207
    f 419/511/123 418/780/123 410/509/123
    f 427/513/98 431/406/98 430/514/98
    f 111/209/124 113/208/124 112/516/124
    f 130/16/125 131/890/125 122/518/125
    f 215/394/208 244/662/208 245/520/208
    f 440/458/90 124/731/90 123/519/90
    f 129/521/90 131/890/90 130/16/90
    f 140/522/86 141/22/86 111/523/86
    f 450/525/90 149/586/90 120/457/90
    f 184/526/128 185/115/128 183/114/128
    f 219/528/209 218/26/209 217/529/209
    f 232/531/112 234/778/112 235/532/112
    f 247/534/130 246/661/130 240/535/130
    f 233/533/131 253/663/131 252/537/131
    f 256/538/132 258/191/132 259/539/132
    f 266/13/133 268/891/133 265/541/133
    f 277/542/134 276/609/134 275/543/134
    f 282/544/210 284/36/210 285/183/210
    f 334/545/136 335/892/136 313/546/136
    f 290/548/211 291/893/211 215/549/211
    f 295/43/138 297/42/138 296/550/138
    f 299/32/139 298/894/139 288/552/139
    f 302/187/212 304/1/212 305/554/212
    f 316/556/99 317/673/99 309/557/99
    f 328/558/130 329/677/130 325/418/130
    f 345/559/78 344/678/78 340/560/78
    f 241/536/141 240/535/141 236/562/141
    f 357/564/98 361/441/98 360/565/98
    f 348/442/81 362/595/81 363/567/81
    f 380/568/213 381/895/213 373/569/213
    f 393/570/214 392/686/214 388/571/214
    f 409/573/128 417/777/128 416/402/128
    f 425/575/94 427/513/94 426/515/94
    f 428/410/95 429/409/95 425/575/95
    f 117/577/90 118/581/90 119/578/90
    f 126/580/144 127/17/144 119/578/144
    f 126/580/90 129/521/90 128/15/90
    f 142/582/86 143/660/86 139/583/86
    f 451/585/144 153/587/144 149/586/144
    f 451/585/90 155/874/90 154/431/90
    f 164/588/86 165/896/86 448/451/86
    f 173/435/215 172/434/215 166/386/215
    f 167/590/146 178/897/146 179/591/146
    f 177/122/147 180/775/147 181/593/147
    f 184/526/78 186/655/78 187/81/78
    f 340/560/84 363/567/84 362/595/84
    f 192/596/79 202/449/79 203/110/79
    f 204/597/216 205/95/216 201/94/216
    f 207/91/81 206/898/81 192/596/81
    f 235/532/217 234/778/217 226/598/217
    f 242/454/146 251/463/146 250/600/146
    f 166/386/100 255/776/100 254/602/100
    f 258/20/149 261/19/149 260/603/149
    f 266/13/218 269/37/218 271/605/218
    f 267/606/47 272/899/47 273/607/47
    f 277/542/151 279/666/151 278/608/151
    f 284/610/219 287/12/219 286/611/219
    f 292/2/220 293/206/220 291/205/220
    f 311/613/154 315/481/154 314/483/154
    f 323/486/131 322/485/131 318/482/131
    f 331/615/103 330/900/103 326/616/103
    f 343/618/155 347/884/155 346/487/155
    f 359/620/156 358/490/156 350/427/156
    f 365/621/157 364/425/157 343/618/157
    f 326/616/146 366/901/146 367/622/146
    f 375/623/221 383/902/221 382/624/221
    f 390/625/222 395/503/222 394/626/222
    f 391/628/223 407/903/223 406/629/223
    f 414/630/155 418/780/155 419/511/155
    f 433/632/156 432/408/156 422/129/156
    f 436/634/157 437/128/157 414/630/157
    f 117/577/161 116/579/161 114/635/161
    f 191/637/123 190/875/123 181/593/123
    f 231/638/136 230/415/136 228/639/136
    f 396/641/224 397/904/224 377/642/224
    f 443/422/97 136/873/97 132/644/97
    f 139/583/100 141/905/100 140/646/100
    f 422/129/88 437/128/88 436/634/88
    f 158/647/97 159/906/97 157/648/97
    f 162/650/86 449/747/86 442/63/86
    f 157/648/86 165/896/86 164/588/86
    f 169/652/225 174/125/225 175/9/225
    f 177/10/164 176/594/164 171/390/164
    f 182/527/165 183/118/165 179/117/165
    f 205/95/156 204/597/156 194/654/156
    f 186/655/84 206/898/84 207/84/84
    f 208/446/88 209/89/88 195/88/88
    f 211/656/166 213/907/166 212/391/166
    f 218/26/167 219/528/167 211/656/167
    f 220/657/110 224/876/110 225/450/110
    f 227/599/226 226/908/226 220/657/226
    f 142/582/227 144/424/227 145/659/227
    f 246/661/164 247/534/164 245/520/164
    f 248/461/169 249/878/169 229/640/169
    f 236/562/113 252/537/113 253/663/113
    f 270/400/100 269/399/100 169/652/100
    f 270/119/23 273/770/23 272/665/23
    f 281/471/170 280/470/170 278/608/170
    f 292/667/228 295/43/228 294/668/228
    f 301/41/172 300/909/172 298/670/172
    f 114/635/229 305/736/229 304/672/229
    f 317/673/83 316/556/83 312/547/83
    f 321/674/230 330/900/230 331/615/230
    f 332/676/141 333/484/141 329/677/141
    f 320/675/231 335/892/231 334/545/231
    f 344/678/128 345/559/128 337/679/128
    f 354/492/95 355/491/95 353/681/95
    f 353/681/94 357/564/94 356/566/94
    f 438/413/232 439/910/232 389/683/232
    f 367/622/165 366/901/165 336/680/165
    f 381/684/233 380/568/233 376/643/233
    f 392/686/234 393/911/234 385/687/234
    f 397/689/235 396/641/235 384/688/235
    f 401/691/236 404/412/236 405/414/236
    f 409/693/237 408/574/237 401/691/237
    f 330/900/23 321/674/23 189/774/23
    f 330/900/23 189/774/23 208/912/23
    f 326/616/23 330/900/23 208/912/23
    f 326/616/23 208/912/23 194/913/23
    f 366/901/23 326/616/23 194/913/23
    f 366/901/23 194/913/23 204/914/23
    f 336/680/23 366/901/23 204/914/23
    f 336/680/23 204/914/23 200/915/23
    f 344/678/23 336/680/23 200/915/23
    f 344/678/23 200/915/23 196/916/23
    f 340/560/23 344/678/23 196/916/23
    f 340/560/23 196/916/23 199/917/23
    f 363/567/23 340/560/23 199/917/23
    f 363/567/23 199/917/23 202/918/23
    f 349/440/23 363/567/23 202/918/23
    f 349/440/23 202/918/23 192/919/23
    f 178/897/23 167/590/23 254/920/23
    f 254/920/23 257/921/23 259/922/23
    f 259/922/23 260/923/23 158/647/23
    f 259/922/23 158/647/23 156/649/23
    f 178/897/23 254/920/23 259/922/23
    f 182/924/23 178/897/23 259/922/23
    f 182/924/23 259/922/23 156/649/23
    f 184/925/23 182/924/23 156/649/23
    f 184/925/23 156/649/23 164/588/23
    f 186/926/23 184/925/23 164/588/23
    f 160/453/23 162/452/23 132/644/23
    f 186/926/23 164/588/23 160/453/23
    f 206/927/23 186/926/23 160/453/23
    f 160/453/23 132/644/23 136/873/23
    f 206/927/23 160/453/23 136/873/23
    f 192/919/23 206/927/23 136/873/23
    f 192/919/23 136/873/23 135/421/23
    f 349/440/23 192/919/23 135/421/23
    f 360/565/23 349/440/23 135/421/23
    f 356/566/23 360/565/23 135/421/23
    f 352/682/23 356/566/23 135/421/23
    f 354/492/23 352/682/23 135/421/23
    f 358/490/23 354/492/23 135/421/23
    f 350/427/23 358/490/23 135/421/23
    f 364/425/23 350/427/23 135/421/23
    f 343/618/23 364/425/23 135/421/23
    f 347/884/23 343/618/23 135/421/23
    f 38/769/23 369/885/23 338/488/23
    f 338/488/23 347/884/23 135/421/23
    f 38/769/23 338/488/23 135/421/23
    f 108/197/23 32/786/23 27/928/23
    f 27/928/23 38/769/23 135/421/23
    f 27/928/23 135/421/23 144/424/23
    f 403/506/23 108/197/23 27/928/23
    f 406/629/23 403/506/23 27/928/23
    f 390/625/23 406/629/23 27/928/23
    f 395/503/23 390/625/23 27/928/23
    f 387/436/23 395/503/23 27/928/23
    f 398/505/23 387/436/23 27/928/23
    f 378/499/23 398/505/23 27/928/23
    f 382/624/23 378/499/23 27/928/23
    f 382/624/23 27/928/23 144/424/23
    f 374/498/23 382/624/23 144/424/23
    f 371/496/23 374/498/23 144/424/23
    f 372/494/23 371/496/23 144/424/23
    f 380/568/23 372/494/23 144/424/23
    f 376/643/23 380/568/23 144/424/23
    f 396/641/23 376/643/23 144/424/23
    f 384/688/23 396/641/23 144/424/23
    f 392/686/23 384/688/23 144/424/23
    f 388/571/23 392/686/23 144/424/23
    f 438/413/23 388/571/23 144/424/23
    f 400/692/23 405/414/23 438/413/23
    f 226/908/23 409/693/23 400/692/23
    f 220/657/23 226/908/23 400/692/23
    f 400/692/23 438/413/23 144/424/23
    f 220/657/23 400/692/23 144/424/23
    f 224/876/23 220/657/23 144/424/23
    f 223/417/23 224/876/23 144/424/23
    f 230/415/23 223/417/23 144/424/23
    f 228/639/23 230/415/23 144/424/23
    f 248/461/23 228/639/23 144/424/23
    f 238/462/23 248/461/23 144/424/23
    f 250/600/23 238/462/23 144/424/23
    f 243/601/23 250/600/23 144/424/23
    f 112/929/23 214/455/23 243/601/23
    f 140/646/23 110/930/23 112/929/23
    f 138/584/23 140/646/23 112/929/23
    f 112/929/23 243/601/23 144/424/23
    f 138/584/23 112/929/23 144/424/23
    f 303/696/47 109/931/47 43/694/47
    f 43/694/47 288/783/47 298/695/47
    f 298/695/47 300/932/47 303/696/47
    f 121/697/8 441/703/8 440/698/8
    f 133/700/8 137/933/8 443/701/8
    f 133/700/8 442/702/8 441/703/8
    f 125/704/2 440/698/2 443/701/2
    f 444/706/8 447/934/8 446/700/8
    f 133/707/47 446/707/47 447/708/47
    f 121/697/3 445/697/3 446/700/3
    f 125/709/23 444/709/23 445/710/23
    f 163/711/2 449/717/2 448/712/2
    f 148/714/2 152/935/2 451/715/2
    f 148/8/2 450/716/2 449/717/2
    f 161/718/2 448/712/2 451/715/2
    f 452/720/2 455/936/2 454/721/2
    f 161/723/47 452/723/47 453/724/47
    f 152/725/7 455/937/7 452/726/7
    f 148/728/23 454/728/23 455/729/23
    `);
    return meshes;
  }
}
