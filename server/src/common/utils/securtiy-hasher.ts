import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

const keyLength = 32;

export const secureHasher = {
  async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');
      scrypt(password, salt, keyLength, (err, hashKey) => {
        if (err) return reject(err);
        resolve(`${salt}.${hashKey.toString('hex')}`);
      });
    });
  },

  async verify(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hashKey] = hash.split('.');
      const hashKeyBuff = Buffer.from(hashKey, 'hex');
      scrypt(password, salt, keyLength, (err, passHash) => {
        if (err) return reject(err);
        resolve(timingSafeEqual(hashKeyBuff, passHash));
      });
    });
  },
};
