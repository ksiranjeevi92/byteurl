import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string;
  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  value: string = '';

  isDisabled: boolean = false;

  private propagetChange: any = () => {};

  private propagateTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagetChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onKeyUp(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.propagetChange(input.value);
    this.changed.emit(input.value);
  }

  onBlur(): void {
    this.propagateTouched();
  }
}
