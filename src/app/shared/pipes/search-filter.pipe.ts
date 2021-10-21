import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(items: any[], field: string, value: string): any[] {
    if (!value) {
      return items;
    }
    if (!items) {
      return [];
    }

    return items.filter((it) => {
      if (typeof it[field] !== 'boolean') {
        return (it[field] as string).toLowerCase().includes(value.toLowerCase());
      } else {
        return it[field] === (value === 'true');
      }
    });
  }
}
