import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  checked = false;
  categories = [
    {name: 'dress', checked: true, displayName:"Dresses"},
    {name: 'top', checked: true, displayName: "Shirts"},
    {name: 'skirt', checked: true, displayName: "Skirts/Pants"},
    {name: 'purse', checked: true, displayName: "Purse"},
    {name: 'bag', checked: true, displayName: "Bags"},
  ];
  @Output() filteredCategory = new EventEmitter<any>();
  @Output() maxiumPriceEmitter = new EventEmitter<any>();

 formatLabel(value: number) {
      return 'R' + value;
  }

  constructor() { }

  ngOnInit() {
    this.updateCategories();
  }

  updateCategories(){
    console.log("filtering categories")
    const categories = this.categories.filter(category => {
      return category.checked;
    });

    this.filteredCategory.emit(categories);

  }
  updatePrice(maxPrice){
    console.log("sending max price");
    this.maxiumPriceEmitter.emit(maxPrice.value);
  }
}
