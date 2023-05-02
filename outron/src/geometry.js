const STAGE_DEPTH = -20.0;
const STAGE_NEAR = 0.0;
let STAGE_WIDTH = 2.0;

const geometry = {
  stage: {
    vertices: [
      // Left wall
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_NEAR,
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_NEAR,
      // Right wall
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_NEAR,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_NEAR,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      // Floor
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_NEAR,
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_NEAR,
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      // Ceiling
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_NEAR,
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_NEAR,
      // back
      /*
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      */
    ],
    indices: [
      0,
      1,
      2,
      0,
      2,
      3, // left
      4,
      5,
      6,
      4,
      6,
      7, // right
      8,
      9,
      10,
      8,
      10,
      11, // floor
      12,
      13,
      14,
      12,
      14,
      15, // ceiling
      /*
      16,
      17,
      18,
      16,
      18,
      19, // back
      */
    ],
    textureCoord: [
      // Left wall
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      //0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
      // Right wall
      1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Floor
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
      // Ceiling
      1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
      // back
      //0.99, 0.5, 1.0, 0.5, 1.0, 0.51, 0.99, 0.51,
    ],
  },
  display: {
    vertices: [
      -STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      -1.0,
      STAGE_DEPTH,
      STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
      -STAGE_WIDTH / 2,
      1.0,
      STAGE_DEPTH,
    ],
    indices: [0, 1, 2, 0, 2, 3],
    textureCoord: [
      // Left wall
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right wall
      1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
      // Floor
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
      // Ceiling
      1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
      // back
      0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
    ],
  },
};
