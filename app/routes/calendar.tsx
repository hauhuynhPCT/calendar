import {
  addDays,
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  isToday,
  isBefore,
  isAfter,
} from "date-fns";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { CalendarIcon, X } from "lucide-react";

const mockData = [
  // Simple events
  {
    name: "Simple #1",
    type: 1,
    from: "2025-04-09T08:00:00",
    to: "2025-04-09T09:00:00",
    createdAt: "2025-03-21T09:00:00",
  },

  // Full overlap
  {
    name: "Overlap #1",
    type: 2,
    from: "2025-04-09T10:00:00",
    to: "2025-04-09T11:30:00",
    createdAt: "2025-03-22T09:00:00",
  },
  {
    name: "Overlap #2",
    type: 3,
    from: "2025-04-09T10:00:00",
    to: "2025-04-09T11:30:00",
    createdAt: "2025-03-23T09:00:00",
  },

  // Partial overlap
  {
    name: "Partial A",
    type: 1,
    from: "2025-04-09T11:00:00",
    to: "2025-04-09T12:00:00",
    createdAt: "2025-03-24T09:00:00",
  },
  {
    name: "Partial B",
    type: 2,
    from: "2025-04-09T11:30:00",
    to: "2025-04-09T12:30:00",
    createdAt: "2025-03-24T09:10:00",
  },

  // Nesting
  {
    name: "Parent",
    type: 3,
    from: "2025-04-09T13:00:00",
    to: "2025-04-09T15:00:00",
    createdAt: "2025-03-25T09:00:00",
  },
  {
    name: "Child A",
    type: 1,
    from: "2025-04-09T13:30:00",
    to: "2025-04-09T14:00:00",
    createdAt: "2025-03-25T09:10:00",
  },
  {
    name: "Child B",
    type: 2,
    from: "2025-04-09T14:00:00",
    to: "2025-04-09T14:30:00",
    createdAt: "2025-03-25T09:20:00",
  },

  // Back-to-back
  {
    name: "Back-to-back A",
    type: 1,
    from: "2025-04-09T15:00:00",
    to: "2025-04-09T15:30:00",
    createdAt: "2025-03-26T09:00:00",
  },
  {
    name: "Back-to-back B",
    type: 1,
    from: "2025-04-09T15:30:00",
    to: "2025-04-09T16:00:00",
    createdAt: "2025-03-26T09:01:00",
  },

  // Very short event
  {
    name: "Quick 5m",
    type: 2,
    from: "2025-04-09T17:00:00",
    to: "2025-04-09T17:05:00",
    createdAt: "2025-03-26T10:00:00",
  },

  // Multi-hour
  {
    name: "Long Meeting",
    type: 3,
    from: "2025-04-09T18:00:00",
    to: "2025-04-09T21:00:00",
    createdAt: "2025-03-26T11:00:00",
  },

  // Same start time, diff durations
  {
    name: "Same Start A",
    type: 1,
    from: "2025-04-09T22:00:00",
    to: "2025-04-09T22:30:00",
    createdAt: "2025-03-26T12:00:00",
  },
  {
    name: "Same Start B",
    type: 2,
    from: "2025-04-09T22:00:00",
    to: "2025-04-09T23:30:00",
    createdAt: "2025-03-26T12:01:00",
  },

  // Near midnight
  {
    name: "Late Night",
    type: 3,
    from: "2025-04-09T23:45:00",
    to: "2025-04-10T00:15:00",
    createdAt: "2025-03-26T13:00:00",
  },
];

const getOverlappingClusters = (events) => {
  const sorted = [...events].sort((a, b) => {
    const aStart = new Date(a.from);
    const bStart = new Date(b.from);
    return aStart - bStart || new Date(b.createdAt) - new Date(a.createdAt);
  });

  const clusters = [];

  sorted.forEach((event) => {
    let added = false;
    for (let cluster of clusters) {
      if (
        cluster.some(
          (e) =>
            new Date(e.from) < new Date(event.to) &&
            new Date(event.from) < new Date(e.to)
        )
      ) {
        cluster.push(event);
        added = true;
        break;
      }
    }
    if (!added) clusters.push([event]);
  });

  return clusters;
};

const assignLayout = (cluster) => {
  const positioned = [];
  cluster.forEach((event) => {
    const overlapping = positioned.filter(
      (e) =>
        new Date(e.from) < new Date(event.to) &&
        new Date(event.from) < new Date(e.to)
    );
    const left = overlapping.length * 25;
    const width = 75 - overlapping.length * 5;
    const zIndex = overlapping.length + 1;
    positioned.push({ ...event, left, width, zIndex });
  });
  return positioned;
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
  const handleEventClick = (event) => setSelectedEvent(event);

  const colorMap = {
    1: "#4B99D2",
    2: "#F55E57",
    3: "#489160",
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Navigation */}
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
          />
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

      {/* Header */}
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

      {/* Calendar grid */}
      <div className="grid grid-cols-[56px_repeat(7,1fr)] divide-x overflow-auto">
        {/* Time Labels */}
        <div className="flex flex-col border-r text-xs text-muted-foreground">
          {hours.map((hour) => (
            <div key={hour} className="h-12 px-2 pt-1">
              {hour}
            </div>
          ))}
        </div>

        {/* Events per day */}
        {days.map((day) => {
          const dayStart = day;
          const dayEnd = addDays(day, 1);
          const dayEvents = mockData.filter((e) => {
            const start = new Date(e.from);
            const end = new Date(e.to);
            return start < dayEnd && end > dayStart;
          });

          const clusters = getOverlappingClusters(dayEvents);

          return (
            <div
              key={day.toISOString()}
              className="relative h-full w-full border-l"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 border-t border-muted hover:bg-muted/50 transition"
                />
              ))}

              {clusters.map((cluster) => {
                const positioned = assignLayout(cluster);
                return positioned.map((event) => {
                  const start = new Date(event.from);
                  const end = new Date(event.to);

                  const displayStart = isBefore(start, dayStart)
                    ? dayStart
                    : start;
                  const displayEnd = isAfter(end, dayEnd) ? dayEnd : end;

                  const top =
                    (displayStart.getHours() * 60 + displayStart.getMinutes()) *
                    (48 / 60);
                  const height =
                    ((displayEnd - displayStart) / 60000) * (48 / 60);

                  return (
                    <div
                      key={event.name + event.createdAt}
                      className="absolute"
                      style={{
                        top,
                        height,
                        left: `${event.left}px`,
                        width: `${event.width}%`,
                        zIndex: event.zIndex,
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
                });
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
