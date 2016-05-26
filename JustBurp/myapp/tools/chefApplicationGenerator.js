/**
 * A tool to generate the a chef application from the req.
 */

module.exports = {

    getTitle: function(req) {
        return 'New Chef Application! ' + req.body.lastName + ', ' + req.body.firstName;
    },

    getContent: function(req) {
        var content = "A New Chef Application is HERE!\n";

        content += "FirstName: " + req.body.firstName + "\n";
        content += "LastName: " + req.body.lastName + "\n";
        content += "Email: " +  req.body.email + "\n";
        content += "Phone number: " + req.body.phone + "\n";
        content += "Zipcode: " +  req.body.zipcode + "\n\n";
        content += "Please review.";

        return content;
    }
};