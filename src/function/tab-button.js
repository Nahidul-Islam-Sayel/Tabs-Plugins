jQuery(document).ready(function ($) {
	$(".easy-tabs-tab").on("click", function () {
		$(".easy-tabs-tab").removeClass("active");

		$(this).addClass("active");

		$(".easy-tabs-pane").hide();

		var tabId = $(this).data("tab-id");
		$('.easy-tabs-pane[data-tab-id="' + tabId + '"]').show();
	});
});
