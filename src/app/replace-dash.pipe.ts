import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceDash'
})
export class ReplaceDashPipe implements PipeTransform {

  transform(value: any, replacer?: any): any {
    let dash_reg = new RegExp('_+');

    return (replacer) ? value.replace(dash_reg, replacer) : value.replace(dash_reg,'');
  }

}
