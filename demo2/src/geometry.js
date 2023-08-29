class Mesh {
  constructor(
    { name, vertices, normals, indices, textureCoords, tangents, bitangents },
    material
  ) {
    this.name = name;
    this.vertices = vertices;
    this.normals = normals;
    this.indices = indices;
    this.textureCoords = textureCoords;
    this.tangents = tangents;
    this.bitangents = bitangents;
    this.material = material;
    this.buffers = {};
  }

  bindBuffersToShaderProgramAttributes(gl) {
    WebGLUtils.bindBufferToAttribute({
      gl,
      buffer: this.buffers.position,
      num: 3,
      attribute: this.material.shaderProgram.attributes.vertexPosition,
    });

    if (
      this.buffers.textureCoords &&
      this.material.shaderProgram.attributes.textureCoord !== undefined
    ) {
      WebGLUtils.bindBufferToAttribute({
        gl,
        buffer: this.buffers.textureCoords,
        num: 2,
        attribute: this.material.shaderProgram.attributes.textureCoord,
      });
    }
    if (
      this.buffers.normals &&
      this.material.shaderProgram.attributes.vertexNormal !== undefined
    ) {
      WebGLUtils.bindBufferToAttribute({
        gl,
        buffer: this.buffers.normals,
        num: 3,
        attribute: this.material.shaderProgram.attributes.vertexNormal,
      });
    }
    if (
      this.buffers.tangents &&
      this.material.shaderProgram.attributes.vertexTangent !== undefined
    ) {
      WebGLUtils.bindBufferToAttribute({
        gl,
        buffer: this.buffers.tangents,
        num: 3,
        attribute: this.material.shaderProgram.attributes.vertexTangent,
      });
    }
    if (
      this.buffers.bitangents &&
      this.material.shaderProgram.attributes.vertexBitangent !== undefined
    ) {
      WebGLUtils.bindBufferToAttribute({
        gl,
        buffer: this.buffers.bitangents,
        num: 3,
        attribute: this.material.shaderProgram.attributes.vertexBitangent,
      });
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
  }

  createBuffers(gl) {
    this.buffers = {
      position:
        this.vertices !== undefined
          ? WebGLUtils.createBuffer(gl, this.vertices)
          : undefined,
      normals:
        this.normals !== undefined
          ? WebGLUtils.createBuffer(gl, this.normals)
          : undefined,
      indices:
        this.indices !== undefined
          ? WebGLUtils.createIndexBuffer(gl, this.indices)
          : undefined,
      textureCoords:
        this.textureCoords !== undefined
          ? WebGLUtils.createBuffer(gl, this.textureCoords)
          : undefined,
      tangents:
        this.tangents !== undefined
          ? WebGLUtils.createBuffer(gl, this.tangents)
          : undefined,
      bitangents:
        this.bitangents !== undefined
          ? WebGLUtils.createBuffer(gl, this.bitangents)
          : undefined,
    };
  }

  draw(gl) {
    gl.drawElements(
      gl.TRIANGLES,
      this.indices.length,
      gl.UNSIGNED_SHORT, // max 65535 indices
      0
    );
  }
}

class Geometry {
  constructor(meshes, materials) {
    this.meshes = meshes.map(
      (mesh) => new Mesh(mesh.toBuffers(), materials[mesh.material])
    );
  }

  createBuffers(gl) {
    this.meshes.forEach((mesh) => {
      mesh.createBuffers(gl);
    });
  }
}
