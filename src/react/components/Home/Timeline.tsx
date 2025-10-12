export type TimelineEvent = { date: string; title: string };

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => (
  <section
    id="timeline"
    className="my-16 flex scroll-mt-16 flex-col gap-12 px-8"
  >
    <h2 className="text-center text-3xl font-bold">Lini Masa Pemira</h2>
    <ul className="flex flex-col">
      {events.map((event, idx, array) => (
        <li
          key={event.date}
          className={`relative flex flex-1 gap-4 ${idx % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""}`}
        >
          <div className="hidden sm:block sm:flex-1"></div>
          <div className="flex flex-col items-center">
            <div
              className={`relative size-4 shrink-0 rounded-full border-4 ${
                new Date(event.date) < new Date()
                  ? "border-yellow-200 bg-yellow-400"
                  : "border-blue-200 bg-blue-600"
              }`}
            >
              <span
                className={`absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  new Date(event.date) < new Date()
                    ? "bg-yellow-400"
                    : "bg-blue-600"
                } ${
                  new Date(event.date) < new Date() &&
                  new Date(array[idx + 1]?.date) > new Date()
                    ? "animate-ping"
                    : "hidden"
                }`}
              ></span>
            </div>
            {idx < events.length - 1 && (
              <div
                className={`mx-auto h-full w-0.5 ${
                  new Date(array[idx + 1].date) < new Date()
                    ? "bg-yellow-200"
                    : "bg-blue-200"
                } `}
              ></div>
            )}
          </div>
          <div
            className={`${idx < events.length - 1 ? "mb-8" : ""} flex flex-1 flex-col`}
          >
            <span className="-mt-[0.5em] text-lg font-semibold">
              {new Date(event.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>{event.title}</span>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default Timeline;
