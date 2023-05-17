function createTunnelLightCanvas1(gl, width = 32, height = 32) {
  console.log(`generating shadow texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  for (let x = 0; x < canvas.width; x++) {
    const alpha = easeInQuad(x / canvas.width);
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillRect(x, 0, 1, canvas.height);
  }
  /*
    for (let y = 0; y < canvas.height / 2; y++) {
      const alpha = easeOutCubic(y / canvas.height / 2);
      context.fillStyle = `rgba(255,255,255,${alpha / 4})`;
      context.fillRect(0, y, canvas.width, 1);
    }
  
    for (let y = canvas.height / 2; y < canvas.height; y++) {
      const alpha = easeOutCubic((canvas.height - y) / canvas.height / 2);
      context.fillStyle = `rgba(255,255,255,${alpha / 4})`;
      context.fillRect(0, y, canvas.width, 1);
    }*/

  return canvas;
}

function createTunnelLightCanvas2(gl, width = 32, height = 32) {
  console.log(`generating shadow texture`);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  for (let x = 0; x < canvas.width; x++) {
    const alpha = easeInQuad(x / canvas.width);
    context.fillStyle = `rgba(255,255,255,${alpha})`;
    context.fillRect(x, 0, 1, canvas.height);
  }

  for (let y = 0; y < canvas.height / 2; y++) {
    const alpha = easeOutCubic(y / canvas.height / 2);
    context.fillStyle = `rgba(255,255,255,${alpha / 2})`;
    context.fillRect(0, y, canvas.width, 1);
  }

  for (let y = canvas.height / 2; y < canvas.height; y++) {
    const alpha = easeOutCubic((canvas.height - y) / canvas.height / 2);
    context.fillStyle = `rgba(255,255,255,${alpha / 2})`;
    context.fillRect(0, y, canvas.width, 1);
  }

  return canvas;
}

function setTunnelLightCanvasColor(canvas, color) {
  const context = canvas.getContext("2d");
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = `rgb(${Math.floor(color[0] * 255)},${Math.floor(
    color[1] * 255
  )},${Math.floor(color[2] * 255)})`;
  context.fillRect(0, 0, canvas.width, canvas.height);
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

function generateStripesToCanvas(
  canvas,
  stripes,
  now,
  palette,
  hit,
  delta = 1
) {
  const context = canvas.getContext("2d");

  //context.globalAlpha = 1.0;
  //context.fillStyle = `rgb(0,0,0)`;
  //context.fillRect(0, 0, canvas.width, canvas.height);

  delta = Math.max(1, Math.round(delta));

  stripes.forEach((stripe) =>
    stripe.render(
      context,
      Math.min(1.0, Math.abs(Math.sin(now * 0.00005)) + 0.3),
      Math.abs(Math.cos(now * 0.00005)) * 0.1 * delta,
      palette,
      delta
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
let previousHorizontalLineTime = 0;
let gridPaletteIndex = 0;

function generateGridToCanvas(canvas, palette, now, hit, delta = 1, bgColor) {
  if (gridLightY === -1) {
    gridLightY = Math.floor(canvas.height / 2);
  }
  const step = Math.floor(canvas.height / 8);
  //delta = Math.max(1, delta);

  //gridCounter = Math.round(now * 0.1);

  const context = canvas.getContext("2d");

  context.globalAlpha = 0.97;
  for (let i = 0; i < delta; i++) {
    context.drawImage(
      canvas,
      0,
      -0.1
      //(Math.random() - Math.random()) * 0.1 * delta
      //0 /*(Math.random() * 0.5) / Math.min(1.0, delta)*/
    );
    context.drawImage(
      canvas,
      0,
      0.1
      //(Math.random() - Math.random()) * 0.1 * delta
      //0 /*(Math.random() * 0.5) / Math.min(1.0, delta)*/
    );
  }
  context.globalAlpha = 0.97;
  for (let i = 0; i < delta; i++) {
    context.drawImage(
      canvas,
      -1,
      0
      //(Math.random() - Math.random()) * 0.1 * delta
      //0 /*(Math.random() * 0.5) / Math.min(1.0, delta)*/
    );
  }
  /*
    for (let x = -delta; x < 0; x++) {
      context.drawImage(
        canvas,
        x,
        (Math.random() - Math.random()) * 0.1 * delta
      );
    }
    */
  //context.drawImage(canvas, -1, 0);

  //gridPaletteIndex = Math.floor((now * 0.1 + 8) / 16) % palette.length;

  context.globalAlpha = 1.0;
  const color = palette[gridPaletteIndex % palette.length];
  const lightColor = palette[0];
  //const color = palette[Math.floor(Math.random() * palette.length)];
  //const color = palette[0];
  const fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

  if (hit) {
    //context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillRect(canvas.width - delta, 0, delta, canvas.height);
  } else {
    context.fillStyle = palette.bg
      ? `rgba(${palette.bg[0]},${palette.bg[1]},${palette.bg[2]},${palette.bg[3]})`
      : "rgb(0,0,0)";
    context.fillRect(canvas.width - delta, 0, delta, canvas.height);
    /*
      for (let y = 0; y < canvas.height; y += 1) {
        context.fillStyle = `rgba(0,0,0,${
          1.0 - easeOutCirc((y * 2) / canvas.height) // * 0.3
        })`;
        context.fillRect(canvas.width - 1, y, 1, 1);
      }*/

    if (palette.noise) {
      context.fillStyle = `rgb(${palette.noise[0]},${palette.noise[1]},${palette.noise[2]})`;
      for (let x = canvas.width - delta; x < canvas.width; x++) {
        const y1 = Math.random() * canvas.height;
        const y2 = Math.random() * canvas.height;
        context.fillRect(x, Math.min(y1, y2), 1, Math.abs(y1 - y2));
      }
    }

    // grid lines
    context.fillStyle = fillStyle;
    for (let y = 0; y <= canvas.height; y += step) {
      context.fillRect(canvas.width - delta, y - 2, delta, 5);
    }

    //else if ((now - previousHorizontalLineTime) * 0.1 >= 16) {
    for (let i = 0; i < delta; i++) {
      if (gridCounter % 16 === 0) {
        context.fillStyle = fillStyle;
        context.fillRect(canvas.width - 2 - 1, 0, 2, canvas.height);

        if (palette.accent) {
          const oldGridLightY = gridLightY;
          if (Math.random() < 0.75) {
            gridLightY =
              step +
              Math.floor((Math.random() * (canvas.height - step * 2)) / step) *
                step;
          }
          context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
          context.fillRect(
            canvas.width - delta - 1,
            Math.min(oldGridLightY, gridLightY),
            delta + 1,
            Math.abs(gridLightY - oldGridLightY)
          );
        }
      }
      if ((gridCounter + 10) % 16 === 0) {
        gridPaletteIndex++;
      }
      gridCounter++;
    }

    if (palette.accent) {
      context.fillStyle = `rgba(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]},0.5)`;
      context.fillRect(canvas.width - delta, gridLightY - 4, delta, 9);
      //context.fillRect(canvas.width - delta, gridLightY - 3, delta, 7);
      context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
      context.fillRect(canvas.width - delta, gridLightY - 2, delta, 5);
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
  //gridCounter += delta;
}

function generateGridToCanvas2(canvas, palette, now, hit, delta = 1) {
  if (gridLightY === -1) {
    gridLightY = Math.floor(canvas.height / 2);
  }
  const step = Math.floor(canvas.height / 8);
  delta = Math.max(1, Math.round(delta));

  const context = canvas.getContext("2d");
  context.globalAlpha = 0.98;
  context.drawImage(
    canvas,
    -delta,
    (Math.random() - Math.random()) * 0.1 * delta
    //0 /*(Math.random() * 0.5) / Math.min(1.0, delta)*/
  );
  //context.drawImage(canvas, -1, 0);
  context.globalAlpha = 1.0;
  const color = palette[Math.floor((now * 0.1 * delta) / 16) % palette.length];
  //const lightColor = palette[0];
  //const color = palette[Math.floor(Math.random() * palette.length)];
  //const color = palette[0];
  const fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;

  if (hit) {
    //context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillStyle = `rgb(${palette.hit[0]},${palette.hit[1]},${palette.hit[2]})`;
    context.fillRect(canvas.width - delta, 0, delta, canvas.height);
    //} else if ((gridCounter * delta + 8) % 16 === 0) {
  } else if ((Math.floor(now * 0.1 * delta) + 8) % 16 === 0) {
    //} else if (gridCounter > 16) {
    gridCounter = 0;
    context.fillStyle = fillStyle;
    context.fillRect(canvas.width - delta, 0, delta, canvas.height);

    if (palette.accent) {
      const oldGridLightY = gridLightY;
      if (Math.random() < 0.75) {
        gridLightY = Math.floor((Math.random() * canvas.height) / step) * step;
      }
      context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
      context.fillRect(
        canvas.width - delta,
        Math.min(oldGridLightY, gridLightY),
        canvas.width - delta,
        Math.abs(gridLightY - oldGridLightY)
      );
    }
  } else {
    context.fillStyle = palette.bg
      ? `rgba(${palette.bg[0]},${palette.bg[1]},${palette.bg[2]},${palette.bg[3]})`
      : "rgb(0,0,0)";
    context.fillRect(canvas.width - delta, 0, delta, canvas.height);
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
        canvas.width - delta,
        Math.random() * canvas.height,
        delta,
        1 + Math.random() * (canvas.height - 1)
      );
    }

    context.fillStyle = fillStyle;
    for (let y = 0; y < canvas.height; y += step) {
      context.fillRect(canvas.width - delta, y - 1, delta, 3);
    }

    if (palette.accent) {
      context.fillStyle = `rgba(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]},0.3)`;
      context.fillRect(canvas.width - delta, gridLightY - 4, delta, 9);
      context.fillStyle = `rgb(${palette.accent[0]},${palette.accent[1]},${palette.accent[2]})`;
      context.fillRect(canvas.width - delta, gridLightY - 2, delta, 5);
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
  gridCounter += delta;
}
