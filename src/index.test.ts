import * as Charts from './index';

describe('@standhigher/charts package entry', () => {
  it('can be imported from the package entry', () => {
    expect(Charts.packageName).toBe('@standhigher/charts');
    expect(Charts.packageVersion).toBe('0.6.0');
  });
});
