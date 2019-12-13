import { MonthNamePipe } from './month-name.pipe';

describe('MonthNamePipe', () => {

  const pipe = new MonthNamePipe();

  it('should return November when month is 11', () => {
    expect(pipe.transform('11')).toEqual('November');
  });

  it('should not return month name when out of bounds', () => {
    expect(pipe.transform('15')).toEqual('15');
  });
});
