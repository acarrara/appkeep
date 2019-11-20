import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'akMonthName'
})
export class AkMonthNamePipe implements PipeTransform {
  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  transform(value: string): string {
    return this.monthNames[Number(value) - 1];
  }

}
