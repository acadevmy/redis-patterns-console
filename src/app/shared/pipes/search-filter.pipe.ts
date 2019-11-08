import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if(!value) { return items; }
        if(!items) { return []; }

        return items.filter(it => {
            if (typeof(it[field]) !== 'boolean') {
                return it[field].toLowerCase().includes((<string>value).toLowerCase());
            } else {
                return (it[field]) === (value === 'true');
            }
        });
    }
}