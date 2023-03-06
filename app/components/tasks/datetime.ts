function setDatetimeLocal(date: Date) {
  const dtString = new Date(date);
  dtString.setMinutes(dtString.getMinutes() - dtString.getTimezoneOffset());
  return dtString.toISOString().slice(0, 16);
}

export default setDatetimeLocal;
