import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from "@angular/forms";

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface MonthYear {
  month: number;
  year: number;
}

@Component({
  selector: "app-date-time-picker",
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="datetime-picker-wrapper">
      <!-- Trigger Button -->
      <div
        class="picker-trigger"
        (click)="togglePicker()"
        [class.active]="isOpen"
      >
        <div class="trigger-icon">📅</div>
        <div class="trigger-value">
          <span class="date-text">{{ formattedDate }}</span>
          <span class="time-text" *ngIf="showTime">{{ formattedTime }}</span>
        </div>
        <div class="trigger-arrow" [class.open]="isOpen">▼</div>
      </div>

      <!-- Popup Calendar -->
      <div class="picker-popup" *ngIf="isOpen">
        <div class="picker-header">
          <button class="nav-btn" (click)="prevMonth()">‹</button>
          <span class="current-month"
            >{{ monthYearLabels[currentMonthYear.month] }}
            {{ currentMonthYear.year }}</span
          >
          <button class="nav-btn" (click)="nextMonth()">›</button>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <!-- Week days header -->
          <div class="weekdays">
            <span *ngFor="let day of weekDays">{{ day }}</span>
          </div>

          <!-- Days -->
          <div class="days">
            <button
              *ngFor="let day of calendarDays"
              class="day-cell"
              [class.other-month]="!day.isCurrentMonth"
              [class.today]="day.isToday"
              [class.selected]="day.isSelected"
              [class.disabled]="day.date < minDateObj"
              (click)="selectDate(day)"
              [disabled]="day.date < minDateObj"
            >
              {{ day.day }}
            </button>
          </div>
        </div>

        <!-- Time Selector -->
        <div class="time-section" *ngIf="showTime">
          <div class="time-label">Select Time</div>
          <div class="time-picker">
            <!-- Hours -->
            <div class="time-column">
              <button class="time-up" (click)="incrementHour()">▲</button>
              <input
                type="number"
                [(ngModel)]="selectedHour"
                (change)="onTimeChange()"
                min="0"
                max="23"
                class="time-input"
              />
              <button class="time-down" (click)="decrementHour()">▼</button>
            </div>

            <span class="time-separator">:</span>

            <!-- Minutes -->
            <div class="time-column">
              <button class="time-up" (click)="incrementMinute()">▲</button>
              <input
                type="number"
                [(ngModel)]="selectedMinute"
                (change)="onTimeChange()"
                min="0"
                max="59"
                class="time-input"
              />
              <button class="time-down" (click)="decrementMinute()">▼</button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions" *ngIf="showQuickActions">
          <button class="quick-btn" (click)="setToday()">Today</button>
          <button class="quick-btn" (click)="setTomorrow()">Tomorrow</button>
          <button class="quick-btn" (click)="setNextWeek()">Next Week</button>
        </div>

        <!-- Actions -->
        <div class="picker-actions">
          <button class="action-btn cancel" (click)="closePicker()">
            Cancel
          </button>
          <button class="action-btn confirm" (click)="confirmSelection()">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .datetime-picker-wrapper {
        position: relative;
        width: 100%;
      }

      /* Trigger Button */
      .picker-trigger {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .picker-trigger:hover {
        border-color: #cbd5e1;
      }

      .picker-trigger.active {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }

      .trigger-icon {
        font-size: 20px;
      }

      .trigger-value {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .date-text {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
      }

      .time-text {
        font-size: 12px;
        color: #64748b;
      }

      .trigger-arrow {
        font-size: 10px;
        color: #94a3b8;
        transition: transform 0.2s;
      }

      .trigger-arrow.open {
        transform: rotate(180deg);
      }

      /* Popup */
      .picker-popup {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 320px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow: hidden;
        animation: slideDown 0.2s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Header */
      .picker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
      }

      .nav-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        transition: background 0.2s;
      }

      .nav-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .current-month {
        font-size: 16px;
        font-weight: 600;
      }

      /* Calendar Grid */
      .calendar-grid {
        padding: 16px;
      }

      .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        margin-bottom: 8px;
      }

      .weekdays span {
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        padding: 4px;
      }

      .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }

      .day-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        color: #1e293b;
        transition: all 0.15s;
      }

      .day-cell:hover:not(:disabled) {
        background: #f1f5f9;
      }

      .day-cell.other-month {
        color: #cbd5e1;
      }

      .day-cell.today {
        background: #dbeafe;
        color: #1d4ed8;
        font-weight: 600;
      }

      .day-cell.selected {
        background: #3b82f6;
        color: white;
        font-weight: 600;
      }

      .day-cell:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      /* Time Section */
      .time-section {
        padding: 16px;
        border-top: 1px solid #e2e8f0;
      }

      .time-label {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .time-picker {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .time-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .time-input {
        width: 50px;
        padding: 8px;
        text-align: center;
        font-size: 18px;
        font-weight: 600;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
      }

      .time-input:focus {
        outline: none;
        border-color: #3b82f6;
      }

      .time-up,
      .time-down {
        background: #f1f5f9;
        border: none;
        width: 30px;
        height: 24px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 10px;
        color: #64748b;
        transition: all 0.15s;
      }

      .time-up:hover,
      .time-down:hover {
        background: #e2e8f0;
        color: #1e293b;
      }

      .time-separator {
        font-size: 24px;
        font-weight: 600;
        color: #64748b;
        margin-top: -20px;
      }

      /* Quick Actions */
      .quick-actions {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid #e2e8f0;
        flex-wrap: wrap;
      }

      .quick-btn {
        flex: 1;
        min-width: 80px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 500;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        color: #475569;
        cursor: pointer;
        transition: all 0.15s;
      }

      .quick-btn:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }

      /* Actions */
      .picker-actions {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .action-btn {
        flex: 1;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }

      .action-btn.cancel {
        background: white;
        border: 1px solid #e2e8f0;
        color: #64748b;
      }

      .action-btn.cancel:hover {
        background: #f1f5f9;
      }

      .action-btn.confirm {
        background: #3b82f6;
        border: none;
        color: white;
      }

      .action-btn.confirm:hover {
        background: #2563eb;
      }

      /* Dark Mode */
      :host-context(.dark) .picker-trigger {
        background: #1f2937;
        border-color: #374151;
      }

      :host-context(.dark) .date-text {
        color: #f3f4f6;
      }

      :host-context(.dark) .day-cell {
        color: #e5e7eb;
      }

      :host-context(.dark) .day-cell:hover:not(:disabled) {
        background: #374151;
      }

      :host-context(.dark) .picker-popup {
        background: #1f2937;
      }

      :host-context(.dark) .quick-btn,
      :host-context(.dark) .action-btn.cancel {
        background: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
      }
    `,
  ],
})
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() label: string = "Date";
  @Input() timeLabel: string = "Time";
  @Input() showLabel: boolean = true;
  @Input() showTimeLabel: boolean = true;
  @Input() showQuickActions: boolean = true;
  @Input() showTime: boolean = true;
  @Input() minDate: string = "";

  isOpen = false;
  currentMonthYear: MonthYear = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  calendarDays: CalendarDay[] = [];
  selectedDate: Date = new Date();
  selectedHour: number = new Date().getHours();
  selectedMinute: number = new Date().getMinutes();

  weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  monthYearLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  private onChange: (value: Date) => void = () => {};
  private onTouched: () => void = () => {};

  get minDateObj(): Date {
    return this.minDate ? new Date(this.minDate) : new Date(0);
  }

  get formattedDate(): string {
    return this.selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  get formattedTime(): string {
    return `${this.selectedHour.toString().padStart(2, "0")}:${this.selectedMinute.toString().padStart(2, "0")}`;
  }

  constructor() {
    this.generateCalendar();
  }

  writeValue(value: Date | string): void {
    if (value) {
      this.selectedDate = value instanceof Date ? value : new Date(value);
      this.selectedHour = this.selectedDate.getHours();
      this.selectedMinute = this.selectedDate.getMinutes();
      this.currentMonthYear = {
        month: this.selectedDate.getMonth(),
        year: this.selectedDate.getFullYear(),
      };
      this.generateCalendar();
    }
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  togglePicker(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.generateCalendar();
    }
  }

  closePicker(): void {
    this.isOpen = false;
  }

  confirmSelection(): void {
    this.selectedDate.setHours(this.selectedHour, this.selectedMinute);
    this.onChange(new Date(this.selectedDate));
    this.onTouched();
    this.closePicker();
  }

  selectDate(day: CalendarDay): void {
    if (day.date >= this.minDateObj) {
      this.selectedDate = new Date(day.date);
      this.selectedDate.setHours(this.selectedHour, this.selectedMinute);
      this.generateCalendar();
    }
  }

  prevMonth(): void {
    if (this.currentMonthYear.month === 0) {
      this.currentMonthYear.month = 11;
      this.currentMonthYear.year--;
    } else {
      this.currentMonthYear.month--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonthYear.month === 11) {
      this.currentMonthYear.month = 0;
      this.currentMonthYear.year++;
    } else {
      this.currentMonthYear.month++;
    }
    this.generateCalendar();
  }

  incrementHour(): void {
    this.selectedHour = (this.selectedHour + 1) % 24;
    this.onTimeChange();
  }

  decrementHour(): void {
    this.selectedHour = (this.selectedHour - 1 + 24) % 24;
    this.onTimeChange();
  }

  incrementMinute(): void {
    this.selectedMinute = (this.selectedMinute + 5) % 60;
    this.onTimeChange();
  }

  decrementMinute(): void {
    this.selectedMinute = (this.selectedMinute - 5 + 60) % 60;
    this.onTimeChange();
  }

  onTimeChange(): void {
    this.selectedDate.setHours(this.selectedHour, this.selectedMinute);
    this.onChange(new Date(this.selectedDate));
    this.onTouched();
  }

  setToday(): void {
    const today = new Date();
    this.selectedDate = today;
    this.selectedHour = today.getHours();
    this.selectedMinute = today.getMinutes();
    this.currentMonthYear = {
      month: today.getMonth(),
      year: today.getFullYear(),
    };
    this.generateCalendar();
  }

  setTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedDate = tomorrow;
    this.selectedHour = 9;
    this.selectedMinute = 0;
    this.currentMonthYear = {
      month: tomorrow.getMonth(),
      year: tomorrow.getFullYear(),
    };
    this.generateCalendar();
  }

  setNextWeek(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    this.selectedDate = nextWeek;
    this.selectedHour = 9;
    this.selectedMinute = 0;
    this.currentMonthYear = {
      month: nextWeek.getMonth(),
      year: nextWeek.getFullYear(),
    };
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const year = this.currentMonthYear.year;
    const month = this.currentMonthYear.month;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: this.isSameDay(date, this.selectedDate),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const isToday = date.getTime() === today.getTime();
      const isSelected = this.isSameDay(date, this.selectedDate);

      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday,
        isSelected,
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: this.isSameDay(date, this.selectedDate),
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}



