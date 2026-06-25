import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BehaviorSubject, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {provideRouter} from '@angular/router';

import {MonthlyAppkeepsCardComponent} from './monthly-appkeeps-card.component';
import {CardComponent} from '../card/card.component';
import {IconComponent} from '../icon/icon.component';
import {StoreService} from '../../redux/store.service';
import {AppActions} from '../app.actions';
import {AppKeep} from '../models/AppKeep';
import {Category} from '../models/Category';
import {AppKeepState} from '../models/AppKeepState';

@Component({selector: 'ak-card', template: '<ng-content></ng-content>'})
class CardStubComponent {
  @Input() title: string;
  @Input() total: number;
  @Input() indicator: boolean;
}

@Component({selector: 'ak-icon', template: ''})
class IconStubComponent {
  @Input() type: string;
}

describe('MonthlyAppkeepsCardComponent (shallow)', () => {
  let categoriesSubject: Subject<Category[]>;
  let monthlyAppKeepsSubject: Subject<AppKeep[]>;

  const mockStore = {
    get: vi.fn(),
    dispatch: vi.fn()
  } as unknown as StoreService<AppKeepState>;

  const mockActions = {
    loadMonthlyAppKeeps: () => ({type: AppActions.LOAD_MONTHLYAPPKEEPS})
  } as AppActions;

  beforeEach(async () => {
    categoriesSubject = new BehaviorSubject<Category[]>([]);
    monthlyAppKeepsSubject = new BehaviorSubject<AppKeep[]>([]);
    vi.clearAllMocks();

    vi.mocked(mockStore.get).mockImplementation((path: string[], mappingFn?: (v: any) => any) => {
      if (path[0] === 'categories') return categoriesSubject.asObservable();
      if (mappingFn) return monthlyAppKeepsSubject.pipe(map(mappingFn));
      return monthlyAppKeepsSubject.asObservable();
    });

    await TestBed.configureTestingModule({
      imports: [MonthlyAppkeepsCardComponent],
      providers: [
        {provide: StoreService, useValue: mockStore},
        {provide: AppActions, useValue: mockActions},
        provideRouter([])
      ]
    })
      .overrideComponent(MonthlyAppkeepsCardComponent, {
        remove: {imports: [CardComponent, IconComponent]},
        add: {imports: [CardStubComponent, IconStubComponent]}
      })
      .compileComponents();
  });

  const createFixture = (): ComponentFixture<MonthlyAppkeepsCardComponent> => {
    const fixture = TestBed.createComponent(MonthlyAppkeepsCardComponent);
    fixture.detectChanges();
    return fixture;
  };

  const appKeep = (overrides: Partial<AppKeep> = {}): AppKeep => ({
    _id: 'ak-1',
    title: 'Netflix',
    category: 'Entertainment',
    amount: 1299,
    income: false,
    user: 'user-1',
    ...overrides
  });

  const category = (name: string, hue = 5): Category =>
    ({category: name, hue, income: false} as Category);

  it('hides the card when categories have not yet emitted', () => {
    categoriesSubject = new Subject<Category[]>();
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('ak-card')).toBeNull();
  });

  it('renders the card when categories are available', () => {
    const fixture = createFixture();

    expect(fixture.debugElement.query(By.directive(CardStubComponent))).toBeTruthy();
  });

  it('passes "Monthly expenses" as the card title', () => {
    const fixture = createFixture();
    const card = fixture.debugElement.query(By.directive(CardStubComponent));

    expect(card.componentInstance.title).toBe('Monthly expenses');
  });

  it('passes the computed total to the card', () => {
    monthlyAppKeepsSubject.next([appKeep({amount: 500}), appKeep({amount: 300})]);
    const fixture = createFixture();
    const card = fixture.debugElement.query(By.directive(CardStubComponent));

    expect(card.componentInstance.total).toBe(800);
  });

  it('renders one list item per monthly appkeep', () => {
    monthlyAppKeepsSubject.next([appKeep({_id: '1'}), appKeep({_id: '2'}), appKeep({_id: '3'})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('li.ak-item').length).toBe(3);
  });

  it('renders no list items when there are no appkeeps', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('li.ak-item').length).toBe(0);
  });

  it('renders the appkeep title', () => {
    monthlyAppKeepsSubject.next([appKeep({title: 'Spotify'})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-item__title').textContent).toContain('Spotify');
  });

  it('renders the appkeep category in lowercase', () => {
    monthlyAppKeepsSubject.next([appKeep({category: 'FOOD'})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-badge span').textContent.trim()).toBe('food');
  });

  it('renders the appkeep amount formatted by AmountPipe', () => {
    monthlyAppKeepsSubject.next([appKeep({amount: 1099})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-item__amount').textContent).toContain('10.99 €');
  });

  it('links each appkeep to its monthly detail route', () => {
    monthlyAppKeepsSubject.next([appKeep({_id: 'abc123'})]);
    const fixture = createFixture();

    const link = fixture.nativeElement.querySelector('.ak-item__what');
    expect(link.getAttribute('href')).toBe('/monthly/abc123');
  });

  it('adds ak-item--updating class when appkeep is updating', () => {
    monthlyAppKeepsSubject.next([appKeep({_updating: true})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-item').classList).toContain('ak-item--updating');
  });

  it('does not add ak-item--updating class when appkeep is not updating', () => {
    monthlyAppKeepsSubject.next([appKeep({_updating: false})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-item').classList).not.toContain('ak-item--updating');
  });

  it('shows the updating message when appkeep is being updated', () => {
    monthlyAppKeepsSubject.next([appKeep({_updating: true})]);
    const fixture = createFixture();

    const editingEl = fixture.nativeElement.querySelector('.ak-item__editing');
    expect(editingEl).toBeTruthy();
    expect(editingEl.textContent).toContain('updating...');
  });

  it('hides the updating message when appkeep is not being updated', () => {
    monthlyAppKeepsSubject.next([appKeep({_updating: false})]);
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('.ak-item__editing')).toBeNull();
  });

  it('applies the category hue to the badge CSS class via akCategoryHue pipe', () => {
    categoriesSubject.next([category('Food', 120)]);
    monthlyAppKeepsSubject.next([appKeep({category: 'Food'})]);
    const fixture = createFixture();

    const badge = fixture.nativeElement.querySelector('.ak-item__what .ak-badge');
    expect(badge.className).toContain('ak-badge--120');
  });

  it('applies hue 0 to badge when category is not found', () => {
    categoriesSubject.next([category('Food', 120)]);
    monthlyAppKeepsSubject.next([appKeep({category: 'Unknown'})]);
    const fixture = createFixture();

    const badge = fixture.nativeElement.querySelector('.ak-item__what .ak-badge');
    expect(badge.className).toContain('ak-badge--0');
  });
});
