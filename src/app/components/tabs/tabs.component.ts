import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgClass, NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  currentTab = signal<string>('Home');
  @Output() activeTabEvent = new EventEmitter<any>()
  tabNames: string[] = ['Home', 'About', 'Following']
  updateCurrentTab(tab: string) {
    this.currentTab.set(tab);
    this.activeTabEvent.emit(tab)
  }
}
