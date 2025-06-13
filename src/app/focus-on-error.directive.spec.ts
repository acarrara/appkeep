import { FocusOnErrorDirective } from './focus-on-error.directive';
import { ElementRef } from '@angular/core';

describe('FocusOnErrorDirective', () => {

  const nativeElement: HTMLElement = {
    querySelectorAll: params => {
    }
  } as HTMLElement;
  const directive = new FocusOnErrorDirective({nativeElement} as ElementRef);
  const anElement = {
    focus: () => {
    }
  };
  const anotherElement = {
    focus: () => {
    }
  };

  beforeEach(() => {
    vi.spyOn(anElement, 'focus');
    vi.spyOn(anotherElement, 'focus');
  });

  it('focus the first element when there is one', () => {
    vi.spyOn(nativeElement, 'querySelectorAll').mockReturnValue([anElement] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
    expect(anElement.focus).toHaveBeenCalled();
  });

  it('focus the first element when there is none', () => {
    vi.spyOn(nativeElement, 'querySelectorAll').mockReturnValue([] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
  });

  it('focus the first element when there are two', () => {
    vi.spyOn(nativeElement, 'querySelectorAll').mockReturnValue([anElement, anotherElement] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
    expect(anElement.focus).toHaveBeenCalled();
    expect(anotherElement.focus).not.toHaveBeenCalled();
  });
});
