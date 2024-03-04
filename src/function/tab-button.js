jQuery(document).ready(function($) {
    // Function to handle tab click event
    $('.easy-tabs-tab').on('click', function() {
        // Remove active class from all tabs
        $('.easy-tabs-tab').removeClass('active');
        // Add active class to the clicked tab
        $(this).addClass('active');
        
        // Hide all tab content
        $('.easy-tabs-pane').hide();
        // Show the corresponding tab content based on data-tab-id attribute
        var tabId = $(this).data('tab-id');
        $('.easy-tabs-pane[data-tab-id="' + tabId + '"]').show();
    });
});
