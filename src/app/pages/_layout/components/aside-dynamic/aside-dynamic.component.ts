import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { config, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LayoutService, DynamicAsideMenuService } from '../../../../_metronic/core';
import { ThemeService } from 'src/app/modules/_services/theme.service';
import { environment } from 'src/environments/environment';
import { ArticleService, SearchArticleParam } from 'src/app/modules/_services/article.service';

@Component({
  selector: 'app-aside-dynamic',
  templateUrl: './aside-dynamic.component.html',
  styleUrls: ['./aside-dynamic.component.scss']
})
export class AsideDynamicComponent implements OnInit, OnDestroy {

  @ViewChild('kt_aside_toggle') kt_aside_toggle: ElementRef;
  menuConfig: any;
  subscriptions: Subscription[] = [];

  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  // showAside = false;
  imgUrl = `${environment.backend_img}`;
  currentUrl: string;
  headerBackground: string;

  constructor(
    private layout: LayoutService,
    private router: Router,
    private menu: DynamicAsideMenuService,
    private cdr: ChangeDetectorRef,
    private theme: ThemeService,
    private article: ArticleService) { }

  ngOnInit(): void {
    // load view settings
    this.disableAsideSelfDisplay = this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    // this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;

    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(menuSubscr);

    this.setTheme();
  }

  private setTheme() {
    this.headerBackground = this.theme.getConfig().header.background;
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      // return './assets/media/logos/logo-dark.png';
      return './assets/media/svg/bca/pakar_logo_white.svg';
    } else {
      // return './assets/media/logos/logo-light.png';
      return './assets/media/svg/bca/pakar_logo_white.svg';
    }
  }

  isMenuItemActive(path) {
    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }

    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;
  }

  updateMenu(params) {
    this.menu.updateMenu(params);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  showAside(): boolean {
    if (this.kt_aside_toggle) {
      const hasActiveClass = this.kt_aside_toggle.nativeElement.classList.contains('active');
      return hasActiveClass;
    }
    return false;
    // const hasActiveClass = document.getElementById('kt_aside_toggle').classList.contains('active');
  }

  externalLink(uri): boolean {
    if (uri.includes("http")) {
      return true;
    } else {
      return false;
    }
  }

  checkArticle(e, item: any) {
    const params: SearchArticleParam = {
      keyword: '', page: 1, limit: 10, sorting: { column: 'approved_date', sort: 'asc' },
      type: 'article', state: 'PUBLISHED', structureId: item.id, isLatest: false
    };
    this.subscriptions.push(this.article.search(params).subscribe(resp => {
      if (resp && resp.list && resp.list.length) {
        if (!item.submenu) item.submenu = [];
        resp.list.forEach(d => {
          const _item = {
            id: d.id,
            title: d.title,
            level: 100,
          };
          item.submenu.push(_item);
        });
        this.cdr.detectChanges();
      }
    }));
  }

}
