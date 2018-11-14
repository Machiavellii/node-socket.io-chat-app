const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let string = isRealString(98);
    expect(string).toBe(false);
  });
  it('should reject string with only spaces', () => {
    let string = isRealString('         ');
    expect(string).toBe(false);
  });
  it('should allow string with non-spaces characters', () => {
    let string = isRealString(' Jen ');
    expect(string).toBe(true);
  });
});
