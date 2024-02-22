export function getAlgoliaTimestampFormat(year) {
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year) || year < 2022 || year > currentYear) {
    throw new Error(
      `Invalid year. Please provide a year between 2022 and ${currentYear}.`
    );
  }

  const startOfYearTimestamp = new Date(`${year}-01-01`).getTime();
  const endOfYearTimestamp = new Date(`${year}-12-31T23:59:59`).getTime();

  return `timestamp:${startOfYearTimestamp} TO ${endOfYearTimestamp}`;
}

export const yearOptions = ["All", "2024", "2023", "2022"];

export const statusOptions = ["All", "Report", "Ongoing", "Resolved"];

export const getFilterValueByLabel = (category, label) => {
  switch (category) {
    case "Year":
      switch (label) {
        case "All":
          return "";
        case "2024":
          return "timestamp:1704067200000 TO 1735689599000";
        case "2023":
          return "timestamp:1672531200000 TO 1704067199000";
        case "2022":
          return "timestamp:1640995200000 TO 1672531199000";
        default:
          // Handle unknown labels or provide a default value
          return "";
      }
    case "Status":
      switch (label) {
        case "All":
          return "status:report OR status:ongoing OR status:resolved";
        case "Report":
          return "status:report";
        case "Ongoing":
          return "status:ongoing";
        case "Resolved":
          return "status:resolved";
        default:
          // Handle unknown labels or provide a default value
          return "";
      }
    default:
      // Handle unknown categories or provide a default value
      return "";
  }
};
