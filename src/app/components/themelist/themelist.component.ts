import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, OnChanges, OnDestroy } from '@angular/core';
import { AnimateService } from 'src/app/services/animate.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-themelist',
  templateUrl: './themelist.component.html',
  styleUrls: ['./themelist.component.scss']
})
export class ThemelistComponent implements OnInit, OnChanges, OnDestroy {

  @Input() show: boolean = false;
  @Output() showEvent = new EventEmitter<boolean>();
  @ViewChild('notificationList') notificationList!: ElementRef;

  constructor(
    private readonly _animateService: AnimateService,
    private readonly _themeService: ThemeService,
  ) { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if ( this.show && this.notificationList.nativeElement ) {
      this._animateService.toggleAnimation( this.notificationList.nativeElement, 'show', 'transform', 'scaleY(0)', 'scaleY(1)', 300 );
    }
    if ( !this.show && this.notificationList ) {
      this._animateService.toggleAnimation( this.notificationList.nativeElement, 'hide', 'transform', 'scaleY(0)', 'scaleY(1)', 300 );
      this.ngOnDestroy();
    }
  }

  ngOnDestroy(): void {
    this.show = false;
  }

  setTheme( theme: string ): void {
    this._themeService.setTheme( theme );
  }
}
