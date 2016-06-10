module.exports = {

    getDateWithDiff: function (date, diff) {
        return new Date(date.getTime() + 24 * 60 * 60 * 1000 * diff);
    },

    getDateString: function (date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return mm + '/' + dd + '/' + yyyy;
    },

    getTimeString: function (date) {
        var hh = date.getHours();
        var mm = date.getMinutes();

        var amPmString = 'am';
        if (hh == 0) {
            hh = 12;
        } else if (hh > 11) {
            amPmString = 'pm';
            if (hh > 12) {
                hh = hh - 12;
            }
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return hh + ':' + mm + amPmString
    },

    getDateFromTimeString : function (timeString, diff) {
        var date = this.getDateWithDiff(new Date(), diff);

        var colIndex = timeString.indexOf(":");
        var hour = parseInt(timeString.substring(0, colIndex));
        var minute = parseInt(timeString.substring(colIndex + 1, colIndex + 3));
        var amPmString = timeString.substring(timeString.length - 2, timeString.length);

        if (amPmString == "am" && hour == 12) {
            hour = 0;
        } else if (amPmString == "pm" && hour != 12) {
            hour += 12;
        }

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0);
    }
};