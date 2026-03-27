import {RecapCardComponent} from './recap-card.component';
import {Recap} from '../models/Recap';

describe('RecapCardComponent', () => {
  let component: RecapCardComponent;

  beforeEach(() => {
    component = new RecapCardComponent();
  });

  const recap = (inTotal: number, outTotal: number, label = 'jan', scope?: string): Recap =>
    ({inTotal, outTotal, label, scope});

  describe('ngOnChanges', () => {
    it('sets total and topTotal to 0 when recaps is empty', () => {
      component.recaps = [];
      component.ngOnChanges();

      expect(component.total).toBe(0);
      expect(component.topTotal).toBe(0);
    });

    it('computes total as sum of inTotal and outTotal across all recaps', () => {
      component.recaps = [recap(100, -50, 'jan'), recap(200, -80, 'feb')];
      component.ngOnChanges();

      expect(component.total).toBe(170); // 100 + (-50) + 200 + (-80)
    });

    it('computes topTotal as the maximum absolute value across inTotal and outTotal', () => {
      component.recaps = [recap(100, -50, 'jan'), recap(30, -200, 'feb')];
      component.ngOnChanges();

      expect(component.topTotal).toBe(200);
    });

    it('handles a single recap', () => {
      component.recaps = [recap(150, -60, 'mar')];
      component.ngOnChanges();

      expect(component.total).toBe(90);
      expect(component.topTotal).toBe(150);
    });
  });

  describe('getIncomePercentage', () => {
    beforeEach(() => {
      component.recaps = [recap(200, -100, 'jan'), recap(100, -50, 'feb')];
      component.ngOnChanges(); // topTotal = 200
    });

    it('returns the income percentage relative to topTotal', () => {
      expect(component.getIncomePercentage(recap(100, 0))).toBe('50%');
    });

    it('returns 100% when inTotal equals topTotal', () => {
      expect(component.getIncomePercentage(recap(200, 0))).toBe('100%');
    });

    it('returns 0% when inTotal is 0', () => {
      expect(component.getIncomePercentage(recap(0, -50))).toBe('0%');
    });
  });

  describe('getAppKeepPercentage', () => {
    beforeEach(() => {
      component.recaps = [recap(200, -100, 'jan'), recap(100, -50, 'feb')];
      component.ngOnChanges(); // topTotal = 200
    });

    it('returns the expense percentage relative to topTotal', () => {
      expect(component.getAppKeepPercentage(recap(0, -100))).toBe('50%');
    });

    it('returns 100% when abs(outTotal) equals topTotal', () => {
      expect(component.getAppKeepPercentage(recap(0, -200))).toBe('100%');
    });

    it('returns 0% when outTotal is 0', () => {
      expect(component.getAppKeepPercentage(recap(100, 0))).toBe('0%');
    });
  });

  describe('itemLink', () => {
    it('returns only /details when recap has no scope or label', () => {
      expect(component.itemLink(recap(0, 0, ''))).toEqual(['/details']);
    });

    it('includes label when recap has a label but no scope', () => {
      expect(component.itemLink(recap(0, 0, 'jan'))).toEqual(['/details', 'jan']);
    });

    it('includes scope when recap has a scope but no label', () => {
      expect(component.itemLink(recap(0, 0, '', 'categories'))).toEqual(['/details', 'categories']);
    });

    it('includes both scope and label when recap has both', () => {
      expect(component.itemLink(recap(0, 0, 'jan', 'categories'))).toEqual(['/details', 'categories', 'jan']);
    });
  });
});