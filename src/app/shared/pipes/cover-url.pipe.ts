import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coverUrl',
  standalone: true,
})
export class CoverUrlPipe implements PipeTransform {
  transform(url: string | undefined | null): string {
    if (!url) return '';
    return url.startsWith('//') ? `https:${url}` : url;
  }
}