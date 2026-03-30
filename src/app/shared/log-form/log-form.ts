import { Component, DestroyRef, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LogsService } from '../../core/services/logs';
import { GameLog, CreateLogRequest } from '../../interfaces';

@Component({
  selector: 'app-log-form',
  imports: [FormsModule],
  templateUrl: './log-form.html',
  styleUrl: './log-form.css',
})
export class LogForm {
  private logsService = inject(LogsService);
  private destroyRef = inject(DestroyRef);

  @Input() gameId!: number;
  @Output() logCreated = new EventEmitter<GameLog>();

  comment = signal('');
  playDate = signal('');
  hours = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  submitLog() {
    if (!this.gameId) return;

    const logData: CreateLogRequest = { igdb_game_id: this.gameId };
    if (this.comment()) logData.comment = this.comment();
    if (this.playDate()) logData.play_date = this.playDate();
    if (this.hours()) logData.hours = this.hours()!;

    this.loading.set(true);
    this.error.set(null);

    this.logsService.create(logData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (newLog) => {
        this.logCreated.emit(newLog);
        this.resetForm();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to create log');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  resetForm() {
    this.comment.set('');
    this.playDate.set('');
    this.hours.set(null);
  }
}
