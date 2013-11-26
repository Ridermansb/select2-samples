var groups, vmMultiple, vmSingle;

ko.bindingHandlers.select2 = {
	init: function(element, valueAccessor, allBindingsAccessor) {
		var $element, allBindings, fieldText, obj, select2Defaults;
		obj = valueAccessor();
		$element = $(element);
		allBindings = allBindingsAccessor();
		if ($element.is("input")) {
			fieldText = allBindings.optionsText ? allBindings.optionsText : "Nome";
			fieldId = allBindings.optionsText ? allBindings.optionsValue : "Id";
			select2Defaults = {
				id: function(obj) {
					return obj[fieldId];
				},
				initSelection: function (element, callback) {
					var data;
					if (obj.multiple)
					{
				        data = [];
				        $(element.val().split(",")).each(function () {
				        	var result = _.find(groups, function(obj) { 
				        			return obj[fieldId] == parseInt(this);
				        		}, this);
				        	if (result)
				        		data.push(result);
				        });
			    	} else {
			    		data = _.find(groups, function(obj) {  return obj[fieldId] == parseInt(element.val()); });
			    	}
			        callback(data);
			    }
			};
			select2Defaults.formatSelection = select2Defaults.formatResult = function(obj) {
				return obj[fieldText];
			};
			
			obj = $.extend(true, {}, select2Defaults, obj);
		}	
		$element.select2(obj);

		return ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
			return $element.select2('destroy');
		});
	},
	update: function(element) {
		return $(element).trigger('change');
	}
};

groups = [ { Id: 1, Nome: "Vivo"}, { Id: 2, Nome: "Tim" }, { Id: 3, Nome: "Telemig" }, { Id: 4, Nome: "Oi" }, { Id: 5, Nome: "Claro" } ];
View = function(){
	View.prototype.Grupos = groups;
	View.prototype.QueryGrupo = function(query) {
		var term = query.term.toUpperCase();
		var data = { 
			results: _.filter(groups, function(obj) { 
				return obj.Nome.toUpperCase().indexOf(term) >= 0 ;
			})
		};
		return query.callback(data);
	};
	function View(data){ ko.mapping.fromJS (data, {copy: "Nome"}, this); }
	return View;
}();

vmSingle  = new View({
	Nome: "Riderman Single",
	Selected: 3
});
vmMultiple  = new View({
	Nome: "Riderman Multiple",
	Selecteds: [4, 5, 1]
});

ko.applyBindings(vmSingle, document.getElementById("single"));
ko.applyBindings(vmMultiple, document.getElementById("multiple"));

$('ul.nav a:first').tab('show');