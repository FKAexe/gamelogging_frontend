import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'releaseYear',
  standalone: true,
})
export class ReleaseYearPipe implements PipeTransform {
  transform(timestamp: number | undefined | null): number | null {
    return timestamp ? new Date(timestamp * 1000).getFullYear() : null;
  }
}
