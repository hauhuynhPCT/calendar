import {
  addDays,
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { CalendarIcon, X } from "lucide-react";

const mockData = [
  {
    name: "pitch #1",
    type: 2,
    from: "2025-04-09T10:00:00",
    to: "2025-04-09T11:30:00",
    createdAt: "2025-03-21T09:23:44",
  },
  {
    name: "pitch #2",
    type: 2,
    from: "2025-04-09T10:00:00",
    to: "2025-04-09T11:30:00",
    createdAt: "2025-03-26T14:55:17",
  },
  {
    name: "pitch #4",
    type: 1,
    from: "2025-04-09T09:00:00",
    to: "2025-04-09T10:00:00",
    createdAt: "2025-03-18T11:41:33",
  },
  {
    name: "pitch #5",
    type: 1,
    from: "2025-04-09T09:00:00",
    to: "2025-04-09T10:00:00",
    createdAt: "2025-03-27T08:11:09",
  },
  {
    name: "pitch #6",
    type: 1,
    from: "2025-04-09T09:00:00",
    to: "2025-04-09T10:00:00",
    createdAt: "2025-03-30T16:37:01",
  },
  {
    name: "pitch #7",
    type: 1,
    from: "2025-04-09T10:00:00",
    to: "2025-04-09T11:30:00",
    createdAt: "2025-03-25T12:03:29",
  },
  {
    name: "pitch #8",
    type: 3,
    from: "2025-04-09T15:00:00",
    to: "2025-04-09T16:30:00",
    createdAt: "2025-03-20T17:29:12",
  },
  {
    name: "pitch #9",
    type: 2,
    from: "2025-04-09T13:00:00",
    to: "2025-04-09T15:00:00",
    createdAt: "2025-03-24T10:12:00",
  },
  {
    name: "pitch #10",
    type: 3,
    from: "2025-04-09T13:00:00",
    to: "2025-04-09T13:30:00",
    createdAt: "2025-03-20T15:44:20",
  },
  {
    name: "pitch #11",
    type: 2,
    from: "2025-04-09T13:15:00",
    to: "2025-04-09T14:00:00",
    createdAt: "2025-03-22T09:30:11",
  },
  {
    name: "pitch #12",
    type: 1,
    from: "2025-04-09T14:00:00",
    to: "2025-04-09T15:00:00",
    createdAt: "2025-03-28T12:20:35",
  },
  {
    name: "pitch #13",
    type: 3,
    from: "2025-04-09T15:00:00",
    to: "2025-04-09T17:30:00",
    createdAt: "2025-03-29T18:45:00",
  },
];

const buildEventStack = (events, date) => {
  const dateStr = date.toISOString().slice(0, 10);

  const sameDayEvents = events.filter((e) => e.from.startsWith(dateStr));

  const stacks = new Map();

  sameDayEvents.forEach((event) => {
    const key = event.from;
    if (!stacks.has(key)) {
      stacks.set(key, []);
    }
    stacks.get(key).push(event);
  });

  stacks.forEach((stack) => {
    stack.sort((a, b) => {
      const endA = new Date(a.to).getTime();
      const endB = new Date(b.to).getTime();
      if (endA !== endB) return endB - endA; // reversed order for correct z-index
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  });

  const result = [];
  stacks.forEach((stack) => {
    result.push(...stack);
  });

  return result;
};

export default function Calendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const days = Array.from({ length: 7 }).map((_, index) =>
    addDays(currentWeekStart, index)
  );

  const handleNextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const handlePrevWeek = () => setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const closeModal = () => setSelectedEvent(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const colorMap = {
    1: "#4B99D2",
    2: "#F55E57",
    3: "#489160",
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center px-4 py-2 mb-2">
        <button
          onClick={handlePrevWeek}
          className="text-sm px-3 py-1 rounded bg-muted hover:bg-muted/50 transition"
        >
          ⬅️ Previous
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentWeekStart, "MMM d")} –{" "}
          {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
        </h2>
        <button
          onClick={handleNextWeek}
          className="text-sm px-3 py-1 rounded bg-muted hover:bg-muted/50 transition"
        >
          Next ➡️
        </button>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="absolute inset-0 bg-black opacity-0"
            aria-hidden="true"
          ></div>
          <div
            className="relative bg-white text-black w-80 p-4 rounded-xl shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold mb-2">{selectedEvent.name}</h3>
            <p className="text-sm mb-1">
              <strong>From:</strong>{" "}
              {format(new Date(selectedEvent.from), "PPpp")}
            </p>
            <p className="text-sm mb-1">
              <strong>To:</strong> {format(new Date(selectedEvent.to), "PPpp")}
            </p>
            <p className="text-sm">
              <strong>Created At:</strong>{" "}
              {format(new Date(selectedEvent.createdAt), "PPpp")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b text-sm font-medium">
        <div className="bg-background px-2 py-2 text-muted-foreground text-xs">
          &nbsp;
        </div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="text-center py-2 border-l bg-background"
          >
            <div className="uppercase text-[11px] text-[#c4c7c5] font-medium leading-[32px]">
              {format(day, "EEE")}
            </div>
            <div className="text-[26px] leading-[46px] text-[#e3e3e3]">
              {format(day, "dd")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[56px_repeat(7,1fr)] divide-x overflow-auto">
        <div className="flex flex-col border-r text-xs text-muted-foreground">
          {hours.map((hour) => (
            <div key={hour} className="h-12 px-2 pt-1">
              {hour}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const eventStack = buildEventStack(mockData, day);
          return (
            <div
              key={day.toISOString()}
              className="relative h-full w-full border-l"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-12 border-t border-muted hover:bg-muted/50 transition"
                  )}
                ></div>
              ))}

              {eventStack.map((event, _, arr) => {
                const start = new Date(event.from);
                const end = new Date(event.to);
                const top = (start.getHours() + start.getMinutes() / 60) * 48;
                const height =
                  ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 48;

                const sameStartEvents = arr.filter(
                  (e) => e.from === event.from
                );
                const colIndex = sameStartEvents.findIndex(
                  (e) => e.name === event.name
                );
                const overlapOffset = 24;

                return (
                  <div
                    key={event.name + event.createdAt}
                    className="absolute"
                    style={{
                      top,
                      height,
                      left: `${colIndex * overlapOffset}px`,
                      right: 0,
                      zIndex: colIndex + 1,
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className="text-xs text-white p-1 rounded-md shadow-md h-full overflow-hidden flex items-start gap-1 border border-white/20 shadow-lg"
                      style={{ backgroundColor: colorMap[event.type] }}
                    >
                      <CalendarIcon className="w-3 h-3 mt-[2px] shrink-0" />
                      <span className="truncate font-medium leading-tight">
                        {event.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
