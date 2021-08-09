import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../_services/article.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { PaginationModel } from 'src/app/utils/_model/pagination';

interface Response {
  result?: DataItem,
  keys?: string[],
  group?: Grouping,
  suggestion?: string
}

interface Grouping {
  [key: string]: DataItem
}

interface DataItem {
  total?: number,
  length?: number,
  data?: any[],
  page?: number,
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  suggestion: string = '';
  keyword: string = '';
  pakar: DataItem = {
    total: 0,
    data: [],
    length: 0
  };
  keys: string[] = [];
  faq: DataItem = {
    total: 0,
    data: [],
    length: 0
  };
  page: BehaviorSubject<number> = new BehaviorSubject(1);
  paging: PaginationModel = PaginationModel.createEmpty();
  currentPage: number = 1;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.route.params.subscribe(params => {
      this.keyword = params.keyword
      if (!this.keyword) this.keyword = '';
      this.search();
      if (params.page) {
        this.page.next(parseInt(params.page));
      }
    });
  }

  public setPage(page: number) {
    this.currentPage = page;
    this.search();
    // this.page.next(page);
  }

  emptyDataItem(): DataItem {
    return {
      total: 0,
      data: [],
      length: 0
    }
  }

  formatterCategory(category: any[]): string {
    const result = [];
    const listCategory = category.map(d => d.title);
    listCategory.forEach(d => {
      result.push(`<a routerLink="" class="cursor-pointer">${d}</a>`);
    });
    return result.join(' > ');
  }

  parseResponse(resp: Response) {
    var dataLists: any[] = [];
    var rowPage: number = 3;

    this.suggestion = resp.suggestion || '';
    if (resp.result) {
      if (resp.result.length === 0) {
        this.keys = [];
        this.faq = this.emptyDataItem();
      }
      this.pakar = resp.result;      
      for (let i = 0; i < this.pakar.length; i += 10) {
        var temp = this.pakar.data.slice(i, i + 10);
        dataLists.push(temp);
      }
      this.pakar.data = dataLists[this.currentPage - 1];

      if (Math.ceil(resp.result.total/10) == 4) {
        rowPage = 4
      }
      this.paging = new PaginationModel(this.currentPage, resp.result.total, 10, rowPage);
      // this.paging.setShowMaxPage(true);
    }
    if (resp.keys) {
      this.keys = resp.keys;
    }
    if (resp.group?.faq) {
      this.faq = resp.group.faq as Grouping;
    }
    setTimeout(_ => { this.changeDetectorRef.detectChanges() }, 0);
  }

  private getQParams() {
    return {
      keyword: this.keyword,
      page: this.page.value
    }
  }

  search() {
    const searchSubscr = this.articleService.search(this.getQParams()).subscribe(resp => {
      if (resp) {
        console.log("** resp: ", resp);
        
        this.parseResponse(resp as Response);
        // console.log("** parseResponse: ", this.parseResponse(resp as Response));
      }
    });
    this.subscriptions.push(searchSubscr);
  }

  ngOnInit(): void {
    // const pageSubscr = this.page.subscribe(page => {
    //   if (page < 1) page = 1;
    //   this.search();
    // });
    // this.subscriptions.push(pageSubscr);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
