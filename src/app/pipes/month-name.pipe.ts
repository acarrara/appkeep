import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'akMonthName'
})
export class MonthNamePipe implements PipeTransform {
  private monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  transform(value: any): string {
    if (value) {
      const monthName = this.monthNames[Number(value) - 1];
      return monthName ? monthName : value.toString();
    } else {
      return '';
    }
  }

}
