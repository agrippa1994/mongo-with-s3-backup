import { dir } from 'tmp';

export function withTemporaryDir(callback) {
  dir({ keep: false, unsafeCleanup: true }, async (err, name, clean) => {
    try {
      if (err) throw err;
      await Promise.resolve(callback(name));
    } catch (e) {
      throw e;
    } finally {
      clean();
    }
  });
}
