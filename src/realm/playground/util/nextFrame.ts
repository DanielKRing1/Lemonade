export const nextFrame = () => {
  return new Promise((resolve, reject) => {
    requestAnimationFrame(() => resolve());
  });
};
