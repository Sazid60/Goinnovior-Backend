export const convertExpiresInToMs = (
  expiresIn: string,
  defaultMs: number
): number => {
  try {
    const timeUnits: { [key: string]: number } = {
      s: 1000,
      m: 1000 * 60,
      h: 1000 * 60 * 60,
      d: 1000 * 60 * 60 * 24,
    };

    const regex = /(\d+)([smhd])/g;
    let totalMs = 0;
    let match;

    while ((match = regex.exec(expiresIn)) !== null) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      totalMs += value * (timeUnits[unit] || 0);
    }

    return totalMs > 0 ? totalMs : defaultMs;
  } catch (error) {
    return defaultMs;
  }
};
