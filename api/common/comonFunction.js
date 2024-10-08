const isTimestampPastNDays = (timestamp, days) => {
    const now = new Date();
    const pastDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    return timestamp.toDate() >= pastDate;
};

module.exports =isTimestampPastNDays;

