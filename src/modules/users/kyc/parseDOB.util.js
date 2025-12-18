const parseDOB = (dob) => {
  if (!dob) return undefined;

  if (typeof dob === "string" && dob.includes("/")) {
    const [day, month, year] = dob.split("/");
    return new Date(year, month - 1, day, 12).toISOString().split("T")[0];
  }

  return dob;
};

module.exports = { parseDOB };