/* converter */
function converter(config_data, direction){
  let source_types=['out', 'err', 'code', 'noti']
	if (direction == 'toForm'){ // convert FROM native object format to form schema array format
		//console.log("there are "+config_data.buttons.length+" buttons")
		// config format is an object, need an extendable array
		config_data.buttons.forEach(button =>{
			// for each key (morning, afternoon, eventing, date..., weather )
			// push an object onto the 'array '
			let nc = []
			// the object must match the custom schema definition
			//console.log("there are "+button.conditions.length+" conditions")
			if(button.conditions){
				button.conditions.forEach(source_c =>{
				  let new_c = {}
				  new_c.source = source_c.source
				  switch(source_c.source){
				  	case 'code':
				  		new_c.typecode=source_c.type
				  		new_c.valuecode=source_c.value
				  		break;
				  	case 'out':
				  	case 'err':
					  	new_c.typestring=source_c.type
					  	new_c.valuestring=source_c.value
				  		break;
				  	case 'noti':
				  	  new_c.notistring = source_c.notification
					  	new_c.typestring=source_c.type
					  	new_c.valuestring=source_c.value
				  	  break;
				  	default:
				  	  new_c.notistring = source_c.source
					  	new_c.typestring=source_c.type
					  	new_c.valuestring=source_c.value
					  	new_c.source='noti'
				  	  break
				  }
				  new_c.icon = source_c.icon || ""
				  new_c.imgIcon = source_c.imgIcon || ""
				  new_c.classes =  source_c.classes || ""

					// save the new field structure in the array
				  nc.push(new_c)
				})
			}
			if(nc.length>0){
				//console.log("there are "+nc.length+" new conditions")
				button.conditions = JSON.parse(JSON.stringify(nc))
			}
		})

		return config_data
	}
	else if (direction == 'toConfig'){  // convert TO native object from form array

		// config format is a modified in array, need fix object array
		config_data.buttons.forEach(button =>{
			// for each key (morning, afternoon, eventing, date..., weather )
			// push an object onto the 'array '
			let nc = []
			// the object must match the custom schema definition
			button.conditions.forEach(source_c =>{
				let new_c = {}
				new_c.source = source_c.source
				switch(source_c.source){
					case 'noti':
						new_c.notification = source_c.notistring
						new_c.type = source_c.typestring
						new_c.value = source_c.valuestring
						break;
					case 'out':
					case 'err':
						new_c.value = source_c.valuestring
						new_c.type = source_c.typestring
						break;
					case 'code':
						new_c.value = source_c.valuecode
						new_c.type = source_c.typecode
					  break;
				}
				new_c.icon = source_c.icon || null
				if(source_c.icon && source_c.icon.includes('/'))
					new_c.imgIcon = source_c.icon
				nc.push(new_c)
			})
			if(nc.length){
				button.conditions=JSON.parse(JSON.stringify(nc))
			}
		})
		return config_data
	}

}
exports.converter=converter