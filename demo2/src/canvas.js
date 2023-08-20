function mergeCanvas(
  target,
  source,
  globalCompositeOperation = "source-over",
  alpha = 1.0
) {
  const targetContext = target.getContext("2d");
  targetContext.globalAlpha = alpha;
  targetContext.globalCompositeOperation = globalCompositeOperation;
  targetContext.drawImage(source, 0, 0);
  targetContext.globalAlpha = 1.0;
}
