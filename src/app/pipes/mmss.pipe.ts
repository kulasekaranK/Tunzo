import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mmss' })
export class TimePipe implements PipeTransform {
  transform(value?: number): string {
    if (value === undefined || value === null || isNaN(+value)) return '0:00';
    const total = Math.floor(Number(value));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
