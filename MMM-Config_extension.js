/* extension */

$(document).on('form_loaded', function () {
	// find all the elements of our when selection list and get the selected option in each
	$('.m_MMM_TouchButton select[class$=".source"]  option:selected').each(
		// process each
		function(){
			// get its selected option text
			var selected_option_value=$(this).text(); //.text() contains the visible value from titlemap, .val() contains the enum value
																							 // if no title map .text() and .val() are the same
			// if its one of the special fields
			//if(selected_option_value.endsWith('string') || selected_option_value.endsWith('code')){
				let other = selected_option_value.endsWith('string')?"code":"string"
				// look above the select to the next element that encloses select and the custom fields (fieldset)
				// this is all one clause, just split over multiple lines for clarity
				$(this).closest('fieldset')
					// find below the fieldset to find the appropriate div with the right class,
					.find('div[class$="'+selected_option_value+'"]')
						// and set its display style property to block, previously set to display:none by MMM-Config.extension.css
						.css('display','block')

				if(selected_option_value!=='noti'){
					$(this).closest('fieldset')
					// find below the fieldset to find the appropriate div with the right class,
					.find('div[class*="noti"]')
						// and set its display style property to block, previously set to display:none by MMM-Config.extension.css
						.css('display','none')
				}

				$(this).closest('fieldset')
					// find below the fieldset to find the appropriate div with the right class,
					.find('div[class$="'+other+'"]')
						// and set its display style property to block, previously set to display:none by MMM-Config.extension.css
						.css('display','none')
			//}
		}
	)
})