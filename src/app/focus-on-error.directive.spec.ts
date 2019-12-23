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
    spyOn(anElement, 'focus');
    spyOn(anotherElement, 'focus');
  });

  it('focus the first element when there is one', () => {
    spyOn(nativeElement, 'querySelectorAll').and.returnValue([anElement] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
    expect(anElement.focus).toHaveBeenCalled();
  });

  it('focus the first element when there is none', () => {
    spyOn(nativeElement, 'querySelectorAll').and.returnValue([] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
  });

  it('focus the first element when there are two', () => {
    spyOn(nativeElement, 'querySelectorAll').and.returnValue([anElement, anotherElement] as any);

    directive.onFormSubmit();

    expect(nativeElement.querySelectorAll).toHaveBeenCalledWith('.ng-invalid');
    expect(anElement.focus).toHaveBeenCalled();
    expect(anotherElement.focus).not.toHaveBeenCalled();
  });
});
