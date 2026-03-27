import {MonthlyAppkeepsCardComponent} from './monthly-appkeeps-card.component';
import {StoreService} from '../../redux/store.service';
import {AppActions} from '../app.actions';
import {AppKeepState} from '../models/AppKeepState';
import {TestBed} from '@angular/core/testing';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppKeep} from '../models/AppKeep';
import {Category} from '../models/Category';

describe('MonthlyAppkeepsCardComponent', () => {
  const monthlyAppKeepsSubject = new BehaviorSubject<AppKeep[]>([]);
  const categoriesSubject = new BehaviorSubject<Category[]>([]);

  const mockStore = {
    get: vi.fn((path: string[], mappingFn?: (v: any) => any) => {
      if (path[0] === 'categories') { return categoriesSubject.asObservable(); }
      if (mappingFn) { return monthlyAppKeepsSubject.pipe(map(mappingFn)); }
      return monthlyAppKeepsSubject.asObservable();
    }),
    dispatch: vi.fn()
  } as unknown as StoreService<AppKeepState>;

  const mockActions = {
    loadMonthlyAppKeeps: () => ({type: AppActions.LOAD_MONTHLYAPPKEEPS})
  } as AppActions;

  const createComponent = (): MonthlyAppkeepsCardComponent => {
    let component: MonthlyAppkeepsCardComponent;
    TestBed.runInInjectionContext(() => {
      component = new MonthlyAppkeepsCardComponent();
    });
    return component;
  };

  beforeEach(() => {
    monthlyAppKeepsSubject.next([]);
    categoriesSubject.next([]);
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        {provide: StoreService, useValue: mockStore},
        {provide: AppActions, useValue: mockActions}
      ]
    });
  });

  const appKeep = (amount: number): AppKeep => ({amount} as AppKeep);
  const category = (name: string): Category => ({category: name} as Category);

  it('dispatches loadMonthlyAppKeeps on construction', () => {
    createComponent();

    expect(mockStore.dispatch).toHaveBeenCalledWith({type: AppActions.LOAD_MONTHLYAPPKEEPS});
  });

  it('dispatches loadMonthlyAppKeeps only once on construction', () => {
    createComponent();

    expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
  });

  describe('monthlyAppkeepsTotal$', () => {
    it('emits 0 when there are no monthly appkeeps', async () => {
      const component = createComponent();

      const total = await firstValueFrom(component.monthlyAppkeepsTotal$);

      expect(total).toBe(0);
    });

    it('emits the sum of all appkeep amounts', async () => {
      monthlyAppKeepsSubject.next([appKeep(100), appKeep(200), appKeep(50)]);
      const component = createComponent();

      const total = await firstValueFrom(component.monthlyAppkeepsTotal$);

      expect(total).toBe(350);
    });

    it('includes negative amounts in the sum', async () => {
      monthlyAppKeepsSubject.next([appKeep(500), appKeep(-120)]);
      const component = createComponent();

      const total = await firstValueFrom(component.monthlyAppkeepsTotal$);

      expect(total).toBe(380);
    });

    it('updates reactively when monthly appkeeps change', async () => {
      const component = createComponent();
      monthlyAppKeepsSubject.next([appKeep(300), appKeep(150)]);

      const total = await firstValueFrom(component.monthlyAppkeepsTotal$);

      expect(total).toBe(450);
    });
  });

  describe('monthlyAppKeeps$', () => {
    it('emits the raw list of monthly appkeeps from the store', async () => {
      const appKeeps = [appKeep(100), appKeep(200)];
      monthlyAppKeepsSubject.next(appKeeps);
      const component = createComponent();

      const result = await firstValueFrom(component.monthlyAppKeeps$);

      expect(result).toEqual(appKeeps);
    });

    it('emits an empty list initially', async () => {
      const component = createComponent();

      const result = await firstValueFrom(component.monthlyAppKeeps$);

      expect(result).toEqual([]);
    });
  });

  describe('categories$', () => {
    it('emits categories from the store', async () => {
      const categories = [category('food'), category('transport')];
      categoriesSubject.next(categories);
      const component = createComponent();

      const result = await firstValueFrom(component.categories$);

      expect(result).toEqual(categories);
    });

    it('emits an empty list initially', async () => {
      const component = createComponent();

      const result = await firstValueFrom(component.categories$);

      expect(result).toEqual([]);
    });
  });
});
