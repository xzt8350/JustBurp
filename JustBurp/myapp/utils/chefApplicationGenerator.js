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
        content += "Phone number: " + req.body.phone + "\n\n";
        content += "Address 1: " + req.body.address1 + "\n";
        content += req.body.address2 + "\n";
        content += "City: " + req.body.city + "\n";
        content += "Zip code: " +  req.body.zipCode + "\n\n";
        content += "Vehicle: " + req.body.vehicle + "\n";
        content += "Dish summary: " + req.body.dishSummary + "\n\n";
        content += "Please review.";

        return content;
    }
};