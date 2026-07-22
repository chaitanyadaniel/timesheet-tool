import { useEffect, useMemo, useState } from 'react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function buildCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  for (let index = firstDayIndex - 1; index >= 0; index -= 1) {
    days.push({
      date: prevMonthLastDay - index,
      inCurrentMonth: false,
      monthOffset: -1,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      date: day,
      inCurrentMonth: true,
      monthOffset: 0,
    });
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - daysInMonth - firstDayIndex + 1;
    days.push({
      date: nextDay,
      inCurrentMonth: false,
      monthOffset: 1,
    });
  }

  return days;
}

function App() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState({});
  const [hoursInput, setHoursInput] = useState('');
  const [taskInput, setTaskInput] = useState('');

  const calendarDays = useMemo(() => buildCalendarDays(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const dateKey = selectedDate.toDateString();
  const currentEntry = entries[dateKey] || { hours: '', task: '' };

  useEffect(() => {
    setHoursInput(currentEntry.hours);
    setTaskInput(currentEntry.task);
  }, [dateKey, currentEntry.hours, currentEntry.task]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day, monthOffset) => {
    const nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + monthOffset, day);
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setSelectedDate(nextDate);
  };

  const handleSaveEntry = (event) => {
    event.preventDefault();
    setEntries((previousEntries) => ({
      ...previousEntries,
      [dateKey]: {
        hours: hoursInput,
        task: taskInput,
      },
    }));
  };

  const formattedSelected = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Internal timesheet</p>
          <h1>Plan your workweek with a simple calendar.</h1>
          <p>
            Choose a date to start logging hours, review schedules, or mark important deadlines.
          </p>
        </div>

        <div className="calendar-card">
          <div className="calendar-header">
            <button type="button" onClick={handlePrevMonth} aria-label="Previous month">
              ←
            </button>
            <h2>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
            <button type="button" onClick={handleNextMonth} aria-label="Next month">
              →
            </button>
          </div>

          <div className="weekday-row">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const isSelected =
                selectedDate.getDate() === day.date &&
                selectedDate.getMonth() === viewDate.getMonth() + day.monthOffset &&
                selectedDate.getFullYear() === viewDate.getFullYear();

              return (
                <button
                  key={`${day.date}-${index}`}
                  type="button"
                  className={`date-cell ${day.inCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectDate(day.date, day.monthOffset)}
                >
                  {day.date}
                </button>
              );
            })}
          </div>

          <div className="selection-summary">
            <p>Selected date</p>
            <strong>{formattedSelected}</strong>
          </div>

          <form className="detail-panel" onSubmit={handleSaveEntry}>
            <div className="detail-panel-header">
              <h3>Log hours & tasks</h3>
              <span>{formattedSelected}</span>
            </div>

            <label>
              Hours worked
              <input
                type="number"
                min="0"
                step="0.5"
                value={hoursInput}
                onChange={(event) => setHoursInput(event.target.value)}
                placeholder="8"
              />
            </label>

            <label>
              Task details
              <textarea
                rows="3"
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder="Describe the work completed today"
              />
            </label>

            <button type="submit">Save entry</button>

            <div className="saved-entry">
              <p>Saved for this day</p>
              <strong>
                {currentEntry.hours ? `${currentEntry.hours} hours` : 'No hours recorded yet'}
              </strong>
              <p>{currentEntry.task || 'Add a task summary to keep this date organized.'}</p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default App;
