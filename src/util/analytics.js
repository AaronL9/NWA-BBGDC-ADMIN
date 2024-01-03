function convertMongoDBDateToMonth(mongoDBDate) {
  const date = new Date(mongoDBDate);
  const monthIndex = date.getUTCMonth();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[monthIndex];
}

export function countOffensesByMonth(incidents, offenseType) {
  const monthlyCounts = Array(12).fill(0);

  const monthIndexMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  // Iterate through the incidents.
  incidents.forEach((incident) => {
    const { typeOfOffense, createdAt } = incident;

    // Check if the typeOfOffense matches the one we're interested in.
    if (typeOfOffense == offenseType) {
      // Convert the MongoDB date to a month name.
      const month = convertMongoDBDateToMonth(createdAt);

      // Increment the corresponding month's count.
      const monthIndex = monthIndexMap[month];
      if (monthIndex !== undefined) {
        monthlyCounts[monthIndex]++;
      }
    }
  });

  return monthlyCounts;
}
