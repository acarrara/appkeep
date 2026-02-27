import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Details} from '../models/Details';
import {NavigationHeaderComponent} from '../navigation-header/navigation-header.component';
import {AmountPipe} from '../pipes/amount.pipe';
import {UserHuePipe} from '../pipes/user-hue.pipe';
import {MonthNamePipe} from '../pipes/month-name.pipe';
import {UserNamePipe} from '../pipes/user-name.pipe';
import {IncomeIndicatorComponent} from '../income-indicator/income-indicator.component';
import {RecapCardComponent} from '../recap-card/recap-card.component';
import {CategoriesCardComponent} from '../categories-card/categories-card.component';
import {IconComponent} from '../icon/icon.component';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'ak-details',
  templateUrl: 'details.component.html',
  imports: [
    NavigationHeaderComponent,
    AmountPipe,
    UserHuePipe,
    MonthNamePipe,
    UserNamePipe,
    IncomeIndicatorComponent,
    RecapCardComponent,
    CategoriesCardComponent,
    IconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  @ViewChild('page', {static: true}) private pageRef: ElementRef<HTMLElement>;

  public details: Details;

  public outTotal: number;
  public inTotal: number;
  public title: string;
  public rangesTitle: string;
  public month: string;
  public year: string;

  private highest: number;
  private document = inject(DOCUMENT);

  constructor() {
    const activatedRoute = inject(ActivatedRoute);
    const cdr = inject(ChangeDetectorRef);

    activatedRoute.data.subscribe(data => {
      this.details = data.details;
      this.rangesTitle = data.rangesTitle;
      if (data.title) {
        this.title = data.title;
      } else {
        activatedRoute.paramMap.subscribe(params => {
          this.year = params.get('year');
          this.month = params.get('month');
        });
      }
      this.computeStatistics();
      cdr.markForCheck();
    });
  }

  private computeStatistics() {
    this.outTotal = this.details.users.reduce((partial, current) => partial + current.outTotal, 0);
    this.inTotal = this.details.users.reduce((partial, current) => partial + current.inTotal, 0);
    this.highest = Math.max(
      Math.abs(this.inTotal),
      Math.abs(this.outTotal)
    );
  }

  percentage(partial: number): string {
    return partial ? Math.abs((partial / this.highest * 100)).toFixed(0) + '%' : '0%';
  }

  async download(): Promise<void> {
    const el = this.pageRef.nativeElement;
    this.document.body.classList.add('ak-exporting');
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    try {
      const scale = 2;
      const canvas = await html2canvas(el, {scale, useCORS: true, logging: false});
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      const pdfW = canvas.width / scale;
      const pdfH = canvas.height / scale;
      const pdf = new jsPDF({unit: 'px', format: [pdfW, pdfH]});
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      pdf.save(`${this.pdfName()}.pdf`);
    } finally {
      this.document.body.classList.remove('ak-exporting');
    }
  }

  private pdfName(): string {
    const prefix = 'appkeeps-';
    if (this.year && this.month) {
      return `${prefix}-${this.year}-${this.month.padStart(2, '0')}`;
    }
    if (this.year) {
      return `${prefix}-${this.year}`;
    }
    const now = new Date();
    if (this.title === 'This year') {
      return `${prefix}-${now.getFullYear()}`;
    }
    if (this.title === 'This month') {
      return `${prefix}-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return `${prefix}-overall`;
  }
}
