import { AmountPipe } from './amount.pipe';

describe('AmountPipe', () => {

  const pipe = new AmountPipe();

  it('should return the amount in euros', () => {
    expect(pipe.transform(3640)).toEqual('36.40 €');
  });
});
