import { format, parseISO, isToday, isThisWeek, isThisYear } from "date-fns";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export function toDateTime(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return formattedDate;
}

export function formatDateString(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  return format(date, "MMM d yyyy hh:mm a");
}

export function convertDateFormat(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const formattedDate = format(date, "MM/dd/yyyy");
  return formattedDate;
}

export function formatDateReport(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  return format(date, "MMMM d yyyy hh:mm a");
}

export function formatDateToRelativeTime(isoDate) {
  const date = parseISO(isoDate);
  return formatDistanceToNow(date, { addSuffix: true });
}

export const formatTimestamp = (timestamp) => {
  if (
    !timestamp ||
    typeof timestamp.seconds !== "number" ||
    typeof timestamp.nanoseconds !== "number"
  ) {
    return "Invalid timestamp";
  }

  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTimeChat = (timestamp) => {
  try {
    const messageDate =
      timestamp instanceof Date ? timestamp : timestamp.toDate();

    if (isToday(messageDate)) {
      return `Today at ${format(messageDate, "h:mm a")}`;
    }

    if (isThisWeek(messageDate)) {
      return `${format(messageDate, "eee")} at ${format(
        messageDate,
        "h:mm a"
      )}`;
    }

    if (isThisYear(messageDate)) {
      return `${format(messageDate, "MMM d")} at ${format(
        messageDate,
        "h:mm a"
      )}`;
    }

    return `${format(messageDate, "MMM d, yyyy")} at ${format(
      messageDate,
      "h:mm a"
    )}`;
  } catch (error) {
    console.log("error", timestamp);
    console.log(error);
  }
};
