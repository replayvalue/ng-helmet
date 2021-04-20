import {
  AfterContentChecked,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  OnDestroy,
  QueryList,
} from "@angular/core";
import { NgHelmetMetaComponent } from "./ng-helmet-meta/ng-helmet-meta.component";
import { NgHelmetTitleComponent } from "./ng-helmet-title/ng-helmet-title.component";
import { buildHelmet } from "./ng-helmet.model";
import { NgHelmetService } from "./ng-helmet.service";

let currentId = 0;

@Component({
  selector: "ng-helmet",
  template: "<ng-content></ng-content>",
})
export class NgHelmetComponent implements AfterContentChecked, OnDestroy {
  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly ngHelmetService: NgHelmetService
  ) {}

  private readonly id = currentId++;

  @HostBinding("id")
  readonly elId = `ng-helmet-${this.id}`;

  @ContentChildren(NgHelmetTitleComponent, {
    read: ElementRef,
    emitDistinctChangesOnly: true,
  })
  readonly titles!: QueryList<ElementRef<HTMLTitleElement>>;

  @ContentChildren(NgHelmetMetaComponent, {
    read: ElementRef,
    emitDistinctChangesOnly: true,
  })
  readonly metas!: QueryList<ElementRef<HTMLTitleElement>>;

  ngAfterContentChecked(): void {
    const titles = Array.from(this.el.nativeElement.querySelectorAll("title"));
    const metas = Array.from(this.el.nativeElement.querySelectorAll("meta"));
    this.ngHelmetService.pushHelmet(this.id, buildHelmet(titles[0], metas));
  }

  ngOnDestroy(): void {
    this.ngHelmetService.popHelmet();
  }
}
