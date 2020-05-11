import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnInit, OnDestroy {
  categories = [];
  saleChecked = false;
  @Output() showOnlyOnSale = new EventEmitter<any>();
  @Output() filteredCategory = new EventEmitter<any>();
  @Output() maxiumPriceEmitter = new EventEmitter<any>();
  categorySub: Subscription;
  onSaleSub: Subscription;
  formatLabel(value: number) {
    return 'R' + value;
  }

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.initCategories();
    this.filterCategories();
    console.log(this.shopService.onSaleChecked);
    if (this.shopService.onSaleChecked) {
      this.saleChecked = true;
      this.onSale();
    } else {
      this.onSale();
    }
  }

  onSale() {
    this.showOnlyOnSale.emit(this.saleChecked);
    this.shopService.onSaleChecked = this.saleChecked;
  }

  filterCategories() {
    this.categorySub = this.shopService.filterCategories.subscribe((fCategory: string) => {
      if (fCategory === 'all') {
        this.updateCategories();
      } else {
        this.categories.map((category) => {
          category.checked = category.name === fCategory;
        });
        this.updateCategories();
      }
    });
  }
  initCategories() {
    this.categories = [
      { name: 'dress', checked: true, displayName: 'Dresses' },
      { name: 'top', checked: true, displayName: 'Shirts' },
      { name: 'skirt', checked: true, displayName: 'Skirts/Pants' },
      { name: 'purse', checked: true, displayName: 'Purse' },
      { name: 'bag', checked: true, displayName: 'Bags' },
      { name: 'jersey', checked: true, displayName: 'Jerseys' },
    ];
  }

  updateCategories() {
    const categories = this.categories.filter((category) => {
      return category.checked;
    });
    // console.log(categories);
    this.filteredCategory.emit(categories);
  }

  updatePrice(maxPrice) {
    this.maxiumPriceEmitter.emit(maxPrice.value);
  }
  ngOnDestroy() {
    this.categorySub.unsubscribe();
    // this.onSaleSub.unsubscribe();
  }
}
