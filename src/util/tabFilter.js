export const defaultTab = (path) => {
  switch (path) {
    case "/patrollers":
      return 0;
    case "/patrollers/send-all":
      return 1;
    case "/patrollers/all-location":
      return 2;
  }
};
