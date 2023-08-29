class OBJMesh {
  constructor({
    name = "",
    material = "GRAY",
    vertices = [],
    normals = [],
    textureCoords = [],
    faces = [],
  }) {
    this.name = name;
    this.material = material;
    this.vertices = [...vertices];
    this.normals = [...normals];
    this.textureCoords = [...textureCoords];
    this.faces = [...faces];
  }

  toBuffers() {
    console.log(`mesh.toBuffers: ${this.name}`);
    const buffers = {
      vertices: [],
      normals: [],
      textureCoords: [],
      indices: [],
      tangents: [],
      bitangents: [],
    };
    let index = 0;

    this.faces.forEach((face, i) => {
      const p1 = this.vertices[face[0][0]];
      const p2 = this.vertices[face[1][0]];
      const p3 = this.vertices[face[2][0]];
      const uv1 = this.textureCoords[face[0][1]];
      const uv2 = this.textureCoords[face[1][1]];
      const uv3 = this.textureCoords[face[2][1]];
      const edge1 = { x: p2[0] - p1[0], y: p2[1] - p1[1], z: p2[2] - p1[2] };
      const edge2 = { x: p3[0] - p1[0], y: p3[1] - p1[1], z: p3[2] - p1[2] };
      const deltaUV1 = { x: uv2[0] - uv1[0], y: uv2[1] - uv1[1] };
      const deltaUV2 = { x: uv3[0] - uv1[0], y: uv3[1] - uv1[1] };

      let f = deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y;
      if (f !== 0) {
        f = 1.0 / f;
      } else {
        f = 0.0;
      }

      const tangent = {
        x: f * (deltaUV2.y * edge1.x - deltaUV1.y * edge2.x),
        y: f * (deltaUV2.y * edge1.y - deltaUV1.y * edge2.y),
        z: f * (deltaUV2.y * edge1.z - deltaUV1.y * edge2.z),
      };

      const bitangent = {
        x: f * (-deltaUV2.x * edge1.x + deltaUV1.x * edge2.x),
        y: f * (-deltaUV2.x * edge1.y + deltaUV1.x * edge2.y),
        z: f * (-deltaUV2.x * edge1.z + deltaUV1.x * edge2.z),
      };

      face.forEach((vertex, j) => {
        //buffers.indices.push(vertex[0]);
        // TODO: optimize: look for similar faces that are already added
        buffers.tangents.push(tangent.x, tangent.y, tangent.z);
        buffers.bitangents.push(bitangent.x, bitangent.y, bitangent.z);

        buffers.indices.push(index);
        index++;
        this.vertices[vertex[0]].forEach((v) => buffers.vertices.push(v));
        if (vertex[1] !== null) {
          this.textureCoords[vertex[1]].forEach((v) =>
            buffers.textureCoords.push(v)
          );
        }
        if (vertex[2] !== null) {
          this.normals[vertex[2]].forEach((v) => buffers.normals.push(v));
        }
      });
    });

    console.log(`${buffers.indices.length} indices`);
    console.log(`${this.faces.length} faces`);

    return buffers;
  }
}

function parseOBJ(str) {
  console.log(`parsing OBJ`);
  const lines = str.split("\n");
  console.log("lines=" + lines.length);

  const meshes = [];
  let mesh;

  lines.forEach((line, li) => {
    try {
      //console.log(line);
      const tokens = line.trim().split(" ");

      const cmd = tokens[0];
      const values = tokens.slice(1);

      switch (cmd) {
        case "#":
          break;
        case "o":
          mesh = new OBJMesh({ name: values.join(" ") });
          meshes.push(mesh);
          break;
        case "usemtl":
          mesh.material = values.join(" ");
          break;
        case "v":
          mesh.vertices.push([
            parseFloat(values[0]),
            parseFloat(values[1]),
            parseFloat(values[2]),
          ]);
          break;
        case "vn":
          mesh.normals.push([
            parseFloat(values[0]),
            parseFloat(values[1]),
            parseFloat(values[2]),
          ]);
          break;
        case "vt":
          mesh.textureCoords.push([
            parseFloat(values[0]),
            parseFloat(values[1]),
          ]);
          break;
        case "f":
          mesh.faces.push(
            values.map((value) =>
              value.split("/").map((v) => (v === "" ? null : parseFloat(v) - 1))
            )
          );
          break;
        default:
          console.log(`skipped: ${cmd}`);
          break;
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  console.log(`${meshes.length} meshes`);
  return meshes;
}
