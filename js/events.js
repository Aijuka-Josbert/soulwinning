/* ==========================================================
   EVENTS.JS
   Computes and displays the next real occurrence of the
   recurring events whose rule is simple and unambiguous
   ("last Sunday of the month", "last week of the month").
   Nothing here is a guessed or invented date — it's worked
   out live from today's date using the rule stated in the
   page content.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.event-item[data-recurrence]');
  if (!items.length) return;

  const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' });

  function lastSundayOf(year, month) {
    // month is 0-indexed; find the last day of month, walk back to Sunday
    const lastDay = new Date(year, month + 1, 0);
    const offset = lastDay.getDay(); // 0 = Sunday
    lastDay.setDate(lastDay.getDate() - offset);
    return lastDay;
  }

  function lastWeekStartOf(year, month) {
    // "last week of the month" — approximate as the 7 days ending on the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const start = new Date(lastDay);
    start.setDate(lastDay.getDate() - 6);
    return start;
  }

  function describeUpcoming(getDateForMonth) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let candidate = getDateForMonth(now.getFullYear(), now.getMonth());
    if (candidate < now) {
      candidate = getDateForMonth(now.getFullYear(), now.getMonth() + 1);
    }
    const days = Math.round((candidate - now) / (1000 * 60 * 60 * 24));
    const when = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
    return `Next: ${dateFmt.format(candidate)} — ${when}`;
  }

  items.forEach((item) => {
    const type = item.getAttribute('data-recurrence');
    const tag = item.querySelector('.event-next');
    if (!tag) return;

    if (type === 'last-sunday') {
      tag.textContent = describeUpcoming(lastSundayOf);
    } else if (type === 'last-week') {
      tag.textContent = describeUpcoming(lastWeekStartOf);
    }
  });
});
