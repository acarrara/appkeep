import { AppKeep } from './models/AppKeep';
import { sumAppKeeps } from './sumAppKeeps';

describe('sumAppKeeps', () => {

  it('should subtract appkeeps amounts', () => {
    const appKeeps: AppKeep[] = [
      {income: false, amount: 100} as AppKeep,
      {income: false, amount: 400} as AppKeep,
      {income: false, amount: 200} as AppKeep,
    ];

    expect(sumAppKeeps(appKeeps)).toEqual(-700);
  });

  it('should add income amounts', () => {
    const appKeeps: AppKeep[] = [
      {income: true, amount: 100} as AppKeep,
      {income: true, amount: 400} as AppKeep,
      {income: true, amount: 200} as AppKeep,
    ];

    expect(sumAppKeeps(appKeeps)).toEqual(700);
  });

  it('should compute mixed amounts', () => {
    const appKeeps: AppKeep[] = [
      {income: true, amount: 100} as AppKeep,
      {income: false, amount: 400} as AppKeep,
      {income: true, amount: 200} as AppKeep,
    ];

    expect(sumAppKeeps(appKeeps)).toEqual(-100);
  });
});
