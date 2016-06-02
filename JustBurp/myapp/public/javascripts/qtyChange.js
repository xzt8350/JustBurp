jQuery(document).ready(function () {
    // This button will increment the value
    $('.qtyplus').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the input field node and its value
        var node = $(this).parent().parent().find(':nth-child(2)').find('input');
        var currentVal = parseInt(node.val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            node.val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            node.val(0);
        }
    });
    // This button will decrement the value till 0
    $('.qtyminus').click(function (e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the input field node and its value
        var node = $(this).parent().parent().find(':nth-child(2)').find('input');
        var currentVal = parseInt(node.val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            node.val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            node.val(0);
        }
    });
});