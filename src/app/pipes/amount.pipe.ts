import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'akAmount'
})
export class AmountPipe implements PipeTransform {

  transform(value: number): string {
    return (value / 100).toFixed(2) + ' €';
  }

}
