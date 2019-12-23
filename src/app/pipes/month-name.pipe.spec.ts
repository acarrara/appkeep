import { MonthNamePipePipe } from './month-name.pipe';

describe('MonthNamePipe', () => {

  const pipe = new MonthNamePipePipe();

  it('should return November when month is 11', () => {
    expect(pipe.transform(11)).toEqual('November');
  });

  it('should not return month name when out of bounds', () => {
    expect(pipe.transform(15)).toEqual('15');
  });

  it('should not return month name when out of bounds', () => {
    expect(pipe.transform(2019)).toEqual('2019');
  });

  it('should not return month name when not a number', () => {
    expect(pipe.transform('aUser')).toEqual('aUser');
  });

  it('should return empty string with an undefined value', () => {
    expect(pipe.transform(undefined)).toEqual('');
  });
});
