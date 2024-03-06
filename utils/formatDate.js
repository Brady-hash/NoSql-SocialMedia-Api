const { format } = require( "date-fns" );

const formatDate = (date, dateFormat = "MMM dd, yyyy 'at' h:mm aa") => {
    return format(date, dateFormat);
};

module.exports = formatDate;