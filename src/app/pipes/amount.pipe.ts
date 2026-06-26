import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'akAmount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number | null): string {
    return ((value ?? 0) / 100).toFixed(2) + ' €';
  }

}
